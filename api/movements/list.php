<?php
require_once __DIR__ . '/../config/database.php';
try {
    $db = getDB();
    $stmt = $db->query("SELECT v.id, v.folio_dte, v.tipo_dte, v.subtotal_bruto, v.descuento_isapre, v.ahorro_cenabast, v.copago_total, v.metodo_pago, v.rut_cliente, v.nombre_cliente, v.convenio_salud, v.timbre_ted_hash, v.created_at, u.nombre AS cajero_nombre FROM ventas v LEFT JOIN usuarios u ON v.usuario_id = u.id ORDER BY v.id DESC LIMIT 50");
    $ventas = $stmt->fetchAll();
    jsonResponse(['success' => true, 'movements' => $ventas]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
