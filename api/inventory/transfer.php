<?php
require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$loteId = intval($data['lote_id'] ?? 0);
$cantidad = intval($data['cantidad'] ?? 0);
$usuarioId = intval($data['usuario_id'] ?? 1);

if ($loteId <= 0 || $cantidad <= 0) {
    jsonResponse(['success' => false, 'message' => 'Lote y cantidad válida son requeridos.'], 400);
}

try {
    $db = getDB();
    $db->beginTransaction();

    $stmt = $db->prepare("SELECT id, producto_id, stock_bodega, stock_vitrina FROM lotes WHERE id = ? FOR UPDATE");
    $stmt->execute([$loteId]);
    $lote = $stmt->fetch();

    if (!$lote) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Lote no encontrado.'], 404);
    }

    if ($lote['stock_bodega'] < $cantidad) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Stock insuficiente en bodega.'], 400);
    }

    $stmtUpdate = $db->prepare("UPDATE lotes SET stock_bodega = stock_bodega - ?, stock_vitrina = stock_vitrina + ? WHERE id = ?");
    $stmtUpdate->execute([$cantidad, $cantidad, $loteId]);

    $stmtLog = $db->prepare("INSERT INTO transferencias_internas (producto_id, lote_id, cantidad, usuario_id) VALUES (?, ?, ?, ?)");
    $stmtLog->execute([$lote['producto_id'], $loteId, $cantidad, $usuarioId]);

    $db->commit();
    jsonResponse(['success' => true, 'message' => "Se transfirieron {$cantidad} unidades exitosamente a Vitrina (Mostrador)."]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
