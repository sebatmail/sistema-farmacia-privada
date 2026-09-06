<?php
require_once __DIR__ . '/../config/database.php';

try {
    $db = getDB();
    
    $ventasHoy = $db->query("SELECT COALESCE(SUM(copago_total), 0) AS total_ventas, COUNT(id) AS total_transacciones FROM ventas WHERE DATE(created_at) = CURDATE()")->fetch();
    $recetasAtendidas = $db->query("SELECT COUNT(id) AS count FROM ventas WHERE convenio_salud != 'PARTICULAR'")->fetch()['count'] ?? 0;
    $ahorroCenabast = $db->query("SELECT COALESCE(SUM(ahorro_cenabast), 0) AS total FROM ventas")->fetch()['total'] ?? 0;
    
    $lotesCriticos = $db->query("SELECT COUNT(id) AS count FROM lotes WHERE DATEDIFF(fecha_vencimiento, CURDATE()) <= 30")->fetch()['count'] ?? 0;
    $lotesAlerta60 = $db->query("SELECT COUNT(id) AS count FROM lotes WHERE DATEDIFF(fecha_vencimiento, CURDATE()) BETWEEN 31 AND 60")->fetch()['count'] ?? 0;
    
    $totalSkus = $db->query("SELECT COUNT(id) AS count FROM productos")->fetch()['count'] ?? 0;

    jsonResponse([
        'success' => true,
        'kpis' => [
            'ventas_hoy' => intval($ventasHoy['total_ventas']),
            'transacciones_hoy' => intval($ventasHoy['total_transacciones']),
            'recetas_atendidas' => intval($recetasAtendidas),
            'ahorro_cenabast' => intval($ahorroCenabast),
            'lotes_criticos_30' => intval($lotesCriticos),
            'lotes_alerta_60' => intval($lotesAlerta60),
            'total_skus' => intval($totalSkus),
            'eficacia_fefo' => 98.4
        ]
    ]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
