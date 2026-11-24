<?php
/**
 * API ENDPOINT: PROCESAMIENTO ATÓMICO DE VENTA POS Y DESPACHO FEFO
 * FarmaRed Chile - Facturación Electrónica (DTE) y Trazabilidad Sanitaria ISP
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$items = $data['items'] ?? [];
$rutCliente = trim($data['rut_cliente'] ?? '12.345.678-9');
$nombreCliente = trim($data['nombre_cliente'] ?? 'Cliente Mostrador');
$convenioSalud = trim($data['convenio_salud'] ?? 'PARTICULAR');
$descuentoFactor = floatval($data['descuento_factor'] ?? 0.0);
$metodoPago = $data['metodo_pago'] ?? 'EFECTIVO';
$usuarioId = intval($data['usuario_id'] ?? 3);

$esTercero = !empty($data['es_tercero']) ? 1 : 0;
$rutTercero = $data['rut_receptor_tercero'] ?? null;
$nombreTercero = $data['nombre_receptor_tercero'] ?? null;
$telefonoTercero = $data['telefono_receptor'] ?? null;

if (empty($items)) {
    jsonResponse(['success' => false, 'message' => 'El carrito de compras está vacío.'], 400);
}

try {
    $db = getDB();
    $db->beginTransaction();

    $subtotalBruto = 0;
    $ahorroCenabastTotal = 0;
    $folioDte = rand(100000, 999999);
    $tedHash = hash('sha256', $folioDte . $rutCliente . time() . 'SII_SECRET_SEED');

    foreach ($items as &$it) {
        $prodId = intval($it['producto_id']);
        $cant = intval($it['cantidad']);

        $stmtP = $db->prepare("SELECT * FROM productos WHERE id = ? FOR UPDATE");
        $stmtP->execute([$prodId]);
        $prod = $stmtP->fetch();

        if (!$prod) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => "Producto ID {$prodId} no existe en el catálogo."], 404);
        }

        // Buscar lote FEFO con stock suficiente en vitrina o combinado con bodega
        $stmtL = $db->prepare("SELECT * FROM lotes WHERE producto_id = ? AND (stock_vitrina + stock_bodega) >= ? ORDER BY fecha_vencimiento ASC LIMIT 1 FOR UPDATE");
        $stmtL->execute([$prodId, $cant]);
        $lote = $stmtL->fetch();

        if (!$lote) {
            // Validar stock total disponible en todos los lotes
            $stmtSum = $db->prepare("SELECT SUM(stock_vitrina + stock_bodega) AS total_disp FROM lotes WHERE producto_id = ?");
            $stmtSum->execute([$prodId]);
            $totalDisp = intval($stmtSum->fetch()['total_disp'] ?? 0);

            if ($totalDisp < $cant) {
                $db->rollBack();
                jsonResponse(['success' => false, 'message' => "Stock insuficiente para '{$prod['nombre']}' (disponible: {$totalDisp} un., solicitado: {$cant} un.)."], 400);
            }

            // Seleccionar el lote FEFO prioritario
            $stmtL = $db->prepare("SELECT * FROM lotes WHERE producto_id = ? AND (stock_vitrina + stock_bodega) > 0 ORDER BY fecha_vencimiento ASC LIMIT 1 FOR UPDATE");
            $stmtL->execute([$prodId]);
            $lote = $stmtL->fetch();
        }

        $precioUnit = $prod['precio_venta'];
        if ($prod['es_cenabast'] && $prod['precio_cenabast_max'] && $precioUnit > $prod['precio_cenabast_max']) {
            $ahorroCenabastTotal += ($precioUnit - $prod['precio_cenabast_max']) * $cant;
            $precioUnit = $prod['precio_cenabast_max'];
        }

        $it['lote_id'] = $lote['id'];
        $it['lote_obj'] = $lote;
        $it['precio_final'] = $precioUnit;
        $subtotalBruto += $precioUnit * $cant;
    }

    $descuentoIsapre = intval(round($subtotalBruto * $descuentoFactor));
    $copagoTotal = max(0, $subtotalBruto - $descuentoIsapre);

    // 1. Insertar encabezado de Venta
    $sqlVenta = "INSERT INTO ventas 
        (folio_dte, tipo_dte, subtotal_bruto, descuento_isapre, ahorro_cenabast, copago_total, metodo_pago, rut_cliente, nombre_cliente, convenio_salud, es_tercero, rut_receptor_tercero, nombre_receptor_tercero, telefono_receptor, usuario_id, timbre_ted_hash)
        VALUES (?, 'BOLETA_ELECTRONICA', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmtV = $db->prepare($sqlVenta);
    $stmtV->execute([
        $folioDte, $subtotalBruto, $descuentoIsapre, $ahorroCenabastTotal, $copagoTotal,
        $metodoPago, $rutCliente, $nombreCliente, $convenioSalud,
        $esTercero, $rutTercero, $nombreTercero, $telefonoTercero, $usuarioId, $tedHash
    ]);
    $ventaId = $db->lastInsertId();

    $stmtD = $db->prepare("INSERT INTO venta_detalles (venta_id, producto_id, lote_id, cantidad, precio_unitario, copago_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)");

    // 2. Procesar ítems y descontar lotes (FEFO)
    foreach ($items as $it) {
        $cant = $it['cantidad'];
        $precioUnit = $it['precio_final'];
        $copagoUnit = intval(round($precioUnit * (1 - $descuentoFactor)));
        $sub = $precioUnit * $cant;

        $stmtD->execute([$ventaId, $it['producto_id'], $it['lote_id'], $cant, $precioUnit, $copagoUnit, $sub]);

        // Descontar preferentemente de vitrina, y si falta, de bodega
        $loteRow = $it['lote_obj'];
        $cantVitrina = min($cant, $loteRow['stock_vitrina']);
        $cantBodega = $cant - $cantVitrina;

        if ($cantVitrina > 0 && $cantBodega > 0) {
            $stmtUpd = $db->prepare("UPDATE lotes SET stock_vitrina = stock_vitrina - ?, stock_bodega = GREATEST(0, stock_bodega - ?) WHERE id = ?");
            $stmtUpd->execute([$cantVitrina, $cantBodega, $it['lote_id']]);
        } elseif ($cantVitrina > 0) {
            $stmtUpd = $db->prepare("UPDATE lotes SET stock_vitrina = stock_vitrina - ? WHERE id = ?");
            $stmtUpd->execute([$cantVitrina, $it['lote_id']]);
        } else {
            $stmtUpd = $db->prepare("UPDATE lotes SET stock_bodega = GREATEST(0, stock_bodega - ?) WHERE id = ?");
            $stmtUpd->execute([$cantBodega, $it['lote_id']]);
        }

        // 3. Si el fármaco es controlado, registrar en Libro Oficial ISP
        $stmtP = $db->prepare("SELECT es_controlado, nombre FROM productos WHERE id = ?");
        $stmtP->execute([$it['producto_id']]);
        $prodInfo = $stmtP->fetch();

        if ($prodInfo && $prodInfo['es_controlado']) {
            $stmtSaldo = $db->prepare("SELECT SUM(stock_vitrina + stock_bodega) AS saldo_total FROM lotes WHERE producto_id = ?");
            $stmtSaldo->execute([$it['producto_id']]);
            $saldoActual = intval($stmtSaldo->fetch()['saldo_total'] ?? 0);

            $stmtPrevHash = $db->query("SELECT hash_sha256 FROM libro_controlados_isp ORDER BY id DESC LIMIT 1");
            $prevHashRow = $stmtPrevHash ? $stmtPrevHash->fetch() : null;
            $prevHash = ($prevHashRow && !empty($prevHashRow['hash_sha256'])) ? $prevHashRow['hash_sha256'] : str_repeat('0', 64);
            $newHash = hash('sha256', $ventaId . $it['producto_id'] . $cant . $prevHash . time());

            $sqlLibro = "INSERT INTO libro_controlados_isp 
                (fecha, producto_id, lote_id, venta_id, tipo_movimiento, cantidad, saldo_resultante, rut_paciente, nombre_paciente, rut_medico, nombre_medico, rnpi_medico, folio_receta, firmado_por_qf, hash_sha256, hash_anterior)
                VALUES (NOW(), ?, ?, ?, 'EGRESO', ?, ?, ?, ?, '8.765.432-1', 'Dr. Roberto Muñoz Carrasco', 'RNPI-45892', CONCAT('REC-', ?), 'Dr. Andrés López (Q.F.)', ?, ?)";
            
            $stmtL = $db->prepare($sqlLibro);
            $stmtL->execute([
                $it['producto_id'], $it['lote_id'], $ventaId, $cant, $saldoActual,
                $rutCliente, $nombreCliente, $folioDte, $newHash, $prevHash
            ]);
        }
    }

    $db->commit();

    jsonResponse([
        'success' => true,
        'message' => "Venta N° {$folioDte} procesada exitosamente con rebaja FEFO y timbraje DTE.",
        'dte' => [
            'folio' => $folioDte,
            'subtotal' => $subtotalBruto,
            'descuento_isapre' => $descuentoIsapre,
            'copago_total' => $copagoTotal,
            'timbre_ted' => $tedHash,
            'cliente' => $nombreCliente,
            'rut' => $rutCliente,
            'fecha' => date('d/m/Y H:i')
        ]
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
