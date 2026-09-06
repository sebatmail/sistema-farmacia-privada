<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    $sql = "SELECT c.*, p.nombre AS producto_nombre, p.codigo_isp, l.numero_lote, l.fecha_vencimiento
            FROM libro_controlados_isp c
            JOIN productos p ON c.producto_id = p.id
            JOIN lotes l ON c.lote_id = l.id
            ORDER BY c.fecha DESC, c.id DESC";
    
    $stmt = $db->query($sql);
    $movimientos = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $movimientos]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
