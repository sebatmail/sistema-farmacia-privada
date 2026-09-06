<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    $sql = "SELECT p.*, c.nombre AS categoria_nombre, 
                   COALESCE(SUM(l.stock_vitrina), 0) AS total_vitrina,
                   COALESCE(SUM(l.stock_bodega), 0) AS total_bodega,
                   (SELECT l2.numero_lote FROM lotes l2 
                    WHERE l2.producto_id = p.id AND l2.stock_vitrina > 0 
                    ORDER BY l2.fecha_vencimiento ASC LIMIT 1) AS lote_fefo_asignado,
                   (SELECT l2.fecha_vencimiento FROM lotes l2 
                    WHERE l2.producto_id = p.id AND l2.stock_vitrina > 0 
                    ORDER BY l2.fecha_vencimiento ASC LIMIT 1) AS lote_fefo_vencimiento
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN lotes l ON p.id = l.producto_id
            GROUP BY p.id
            ORDER BY p.nombre ASC";
    
    $stmt = $db->query($sql);
    $products = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $products]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
