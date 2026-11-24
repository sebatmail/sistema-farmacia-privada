<?php
/**
 * API ENDPOINT: REGISTRAR O ACTUALIZAR LOTE DE MEDICAMENTO (FEFO)
 * FarmaRed Chile - Suite Administrativa / Bodega
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();

$productoId = intval($data['producto_id'] ?? 0);
$numeroLote = trim($data['numero_lote'] ?? '');
$fechaVencimiento = trim($data['fecha_vencimiento'] ?? '');
$stockBodega = intval($data['stock_bodega'] ?? 0);
$stockVitrina = intval($data['stock_vitrina'] ?? 0);

if ($productoId <= 0 || empty($numeroLote) || empty($fechaVencimiento)) {
    jsonResponse([
        'success' => false,
        'message' => 'El medicamento, número de lote y fecha de vencimiento son obligatorios.'
    ], 400);
}

try {
    $db = getDB();

    // 1. Verificar existencia del producto
    $stmtP = $db->prepare("SELECT id, nombre FROM productos WHERE id = ?");
    $stmtP->execute([$productoId]);
    $prod = $stmtP->fetch();

    if (!$prod) {
        jsonResponse([
            'success' => false,
            'message' => "El medicamento con ID {$productoId} no existe en el catálogo."
        ], 404);
    }

    // 2. Insertar o actualizar si ya existe el lote para este producto
    $sql = "INSERT INTO lotes (producto_id, numero_lote, fecha_vencimiento, stock_bodega, stock_vitrina) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                stock_bodega = stock_bodega + VALUES(stock_bodega),
                fecha_vencimiento = VALUES(fecha_vencimiento)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$productoId, $numeroLote, $fechaVencimiento, $stockBodega, $stockVitrina]);
    $loteId = $db->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => "Lote {$numeroLote} para '{$prod['nombre']}' registrado exitosamente en Bodega Central con {$stockBodega} unidades.",
        'lote_id' => $loteId
    ]);
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}
