<?php
/**
 * API ENDPOINT: HISTORIAL DE AUDITORÍA Y MONITOREO DE USUARIOS
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$usuarioId = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;
$modulo = isset($_GET['modulo']) ? trim($_GET['modulo']) : '';
$limite = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

try {
    $db = getDB();

    $where = [];
    $params = [];

    if ($usuarioId > 0) {
        $where[] = "usuario_id = ?";
        $params[] = $usuarioId;
    }

    if (!empty($modulo) && $modulo !== 'TODOS') {
        $where[] = "modulo = ?";
        $params[] = $modulo;
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $stmt = $db->prepare("SELECT id, usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen, user_agent, DATE_FORMAT(created_at, '%d/%m/%Y %H:%i:%s') as fecha_hora FROM auditoria_usuarios {$whereSql} ORDER BY id DESC LIMIT {$limite}");
    $stmt->execute($params);
    $logs = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'total' => count($logs),
        'data' => $logs
    ]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
