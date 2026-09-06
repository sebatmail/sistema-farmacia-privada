<?php
require_once __DIR__ . '/../config/database.php';
$data = getJsonInput();

$id = intval($data['id'] ?? 0);
$nombre = trim($data['nombre'] ?? '');
$principio = trim($data['principio_activo'] ?? '');
$lab = trim($data['laboratorio'] ?? '');
$codigoIsp = trim($data['codigo_isp'] ?? '');
$codigoBarra = trim($data['codigo_barra'] ?? '');
$precio = intval($data['precio_venta'] ?? 0);
$esCenabast = !empty($data['es_cenabast']) ? 1 : 0;
$cenabastMax = $esCenabast && !empty($data['precio_cenabast_max']) ? intval($data['precio_cenabast_max']) : null;
$condicion = $data['condicion'] ?? 'VENTA_DIRECTA';
$esControlado = ($condicion === 'RECETA_RETENIDA') ? 1 : 0;
$categoriaId = intval($data['categoria_id'] ?? 1);

if (empty($nombre) || empty($codigoIsp) || $precio <= 0) {
    jsonResponse(['success' => false, 'error' => 'Nombre, Código ISP y Precio son obligatorios.'], 400);
}

try {
    $db = getDB();
    if ($id > 0) {
        $stmt = $db->prepare("UPDATE productos SET nombre = ?, principio_activo = ?, laboratorio = ?, codigo_isp = ?, codigo_barra = ?, precio_venta = ?, es_cenabast = ?, precio_cenabast_max = ?, es_controlado = ? WHERE id = ?");
        $stmt->execute([$nombre, $principio, $lab, $codigoIsp, $codigoBarra, $precio, $esCenabast, $cenabastMax, $esControlado, $id]);
        jsonResponse(['success' => true, 'message' => 'Medicamento actualizado con éxito.', 'id' => $id]);
    } else {
        $stmt = $db->prepare("INSERT INTO productos (codigo_isp, codigo_barra, nombre, principio_activo, laboratorio, categoria_id, precio_venta, precio_cenabast_max, es_cenabast, es_controlado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$codigoIsp, $codigoBarra, $nombre, $principio, $lab, $categoriaId, $precio, $cenabastMax, $esCenabast, $esControlado]);
        $newId = $db->lastInsertId();

        // Crear lote inicial por defecto si se especificó stock
        $stockVitrina = intval($data['stock_vitrina'] ?? 10);
        $stockBodega = intval($data['stock_bodega'] ?? 30);
        $loteNum = trim($data['numero_lote'] ?? ('LT-' . strtoupper(substr($nombre, 0, 3)) . '-' . date('Y')));
        $vence = $data['fecha_vencimiento'] ?? date('Y-m-d', strtotime('+1 year'));

        $stmtLote = $db->prepare("INSERT INTO lotes (producto_id, numero_lote, fecha_vencimiento, stock_vitrina, stock_bodega) VALUES (?, ?, ?, ?, ?)");
        $stmtLote->execute([$newId, $loteNum, $vence, $stockVitrina, $stockBodega]);

        jsonResponse(['success' => true, 'message' => 'Medicamento creado y lote inicial registrado.', 'id' => $newId]);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
