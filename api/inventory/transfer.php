<?php
/**
 * API ENDPOINT: TRANSFERENCIA ATÓMICA DE STOCK (BODEGA CENTRAL -> VITRINA SALA DE VENTAS)
 * FarmaRed Chile - Metodología FEFO (Norma Técnica N° 147 BPA)
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$loteId = intval($data['lote_id'] ?? 0);
$productoId = intval($data['producto_id'] ?? 0);
$cantidad = intval($data['cantidad'] ?? 0);
$usuarioId = intval($data['usuario_id'] ?? 1);

if ($cantidad <= 0) {
    jsonResponse(['success' => false, 'message' => 'La cantidad a transferir debe ser mayor a 0.'], 400);
}

try {
    $db = getDB();
    $db->beginTransaction();

    // Si no se envió lote_id pero sí producto_id, buscar el lote FEFO prioritario con stock en bodega
    if ($loteId <= 0 && $productoId > 0) {
        $stmtFind = $db->prepare("SELECT id FROM lotes WHERE producto_id = ? AND stock_bodega > 0 ORDER BY fecha_vencimiento ASC LIMIT 1 FOR UPDATE");
        $stmtFind->execute([$productoId]);
        $found = $stmtFind->fetch();
        if ($found) {
            $loteId = intval($found['id']);
        } else {
            // Si ninguno tiene stock en bodega, tomar el primer lote
            $stmtFallback = $db->prepare("SELECT id FROM lotes WHERE producto_id = ? ORDER BY fecha_vencimiento ASC LIMIT 1 FOR UPDATE");
            $stmtFallback->execute([$productoId]);
            $foundFallback = $stmtFallback->fetch();
            if ($foundFallback) {
                $loteId = intval($foundFallback['id']);
            }
        }
    }

    if ($loteId <= 0) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Lote no especificado o medicamento no cuenta con lotes registrados.'], 404);
    }

    $stmt = $db->prepare("SELECT id, producto_id, numero_lote, stock_bodega, stock_vitrina FROM lotes WHERE id = ? FOR UPDATE");
    $stmt->execute([$loteId]);
    $lote = $stmt->fetch();

    if (!$lote) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => "Lote ID {$loteId} no encontrado."], 404);
    }

    if ($lote['stock_bodega'] < $cantidad) {
        $db->rollBack();
        jsonResponse([
            'success' => false, 
            'message' => "Stock insuficiente en Bodega Central (disponible: {$lote['stock_bodega']} un., solicitado: {$cantidad} un.)."
        ], 400);
    }

    // 1. Traspaso atómico en tabla lotes
    $stmtUpdate = $db->prepare("UPDATE lotes SET stock_bodega = stock_bodega - ?, stock_vitrina = stock_vitrina + ? WHERE id = ?");
    $stmtUpdate->execute([$cantidad, $cantidad, $loteId]);

    // 2. Registro en bitácora de transferencias internas
    $stmtLog = $db->prepare("INSERT INTO transferencias_internas (producto_id, lote_id, cantidad, usuario_id, observacion) VALUES (?, ?, ?, ?, ?)");
    $stmtLog->execute([$lote['producto_id'], $loteId, $cantidad, $usuarioId, "Traspaso de {$cantidad} un. del lote {$lote['numero_lote']} a Vitrina"]);

    $db->commit();
    jsonResponse([
        'success' => true, 
        'message' => "Se transfirieron {$cantidad} unidades del Lote {$lote['numero_lote']} exitosamente a Vitrina (Mostrador).",
        'lote_id' => $loteId,
        'nuevo_stock_vitrina' => $lote['stock_vitrina'] + $cantidad,
        'nuevo_stock_bodega' => $lote['stock_bodega'] - $cantidad
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
