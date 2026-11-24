<?php
require_once __DIR__ . '/../config/database.php';
$data = getJsonInput();
$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    jsonResponse(['success' => false, 'error' => 'ID de producto inválido.'], 400);
}

try {
    $db = getDB();
    
    // Verificar si tiene ventas o libro de controlados asociados
    $stmtCheck = $db->prepare("SELECT COUNT(*) FROM venta_detalles WHERE producto_id = ?");
    $stmtCheck->execute([$id]);
    $ventasCount = $stmtCheck->fetchColumn();

    $stmtCheckISP = $db->prepare("SELECT COUNT(*) FROM libro_controlados_isp WHERE producto_id = ?");
    $stmtCheckISP->execute([$id]);
    $ispCount = $stmtCheckISP->fetchColumn();

    if ($ventasCount > 0 || $ispCount > 0) {
        // En cumplimiento normativo del ISP y trazabilidad contable, no se destruyen registros con ventas históricas
        // Ponemos el stock de sus lotes en 0 para deshabilitarlo comercialmente
        $stmtZero = $db->prepare("UPDATE lotes SET stock_vitrina = 0, stock_bodega = 0 WHERE producto_id = ?");
        $stmtZero->execute([$id]);
        jsonResponse([
            'success' => true, 
            'warning' => true,
            'message' => 'El medicamento tiene ventas o registros de auditoría ISP históricos. Por trazabilidad legal no puede borrarse de la BD, pero su stock ha sido rebajado a 0 unidades.'
        ]);
    }

    // Si no tiene historial de ventas, borrar primero transferencias y lotes si existieran
    $db->prepare("DELETE FROM transferencias_internas WHERE producto_id = ?")->execute([$id]);
    $db->prepare("DELETE FROM lotes WHERE producto_id = ?")->execute([$id]);

    $stmt = $db->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Medicamento eliminado correctamente de la base de datos MySQL.']);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => 'Error al eliminar: ' . $e->getMessage()], 500);
}
