<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    $sql = "SELECT l.*, p.nombre AS producto_nombre, p.codigo_isp, p.principio_activo, p.laboratorio,
                   DATEDIFF(l.fecha_vencimiento, CURDATE()) AS dias_para_vencer,
                   CASE 
                     WHEN DATEDIFF(l.fecha_vencimiento, CURDATE()) <= 30 THEN 'CRITICO_FEFO'
                     WHEN DATEDIFF(l.fecha_vencimiento, CURDATE()) <= 60 THEN 'ALERTA_60'
                     ELSE 'OPTIMO'
                   END AS estado_fefo
            FROM lotes l
            JOIN productos p ON l.producto_id = p.id
            ORDER BY l.fecha_vencimiento ASC";
    
    $stmt = $db->query($sql);
    $lotes = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $lotes]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
