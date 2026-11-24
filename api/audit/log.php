<?php
/**
 * API ENDPOINT: REGISTRAR EVENTO DE AUDITORÍA DE USUARIO
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$usuarioId = intval($data['usuario_id'] ?? 1);
$nombreUsuario = trim($data['nombre_usuario'] ?? 'Usuario Sistema');
$rol = trim($data['rol'] ?? 'VENDEDOR');
$accion = trim($data['accion'] ?? 'ACCION_GENERAL');
$modulo = trim($data['modulo'] ?? 'SISTEMA');
$detalles = trim($data['detalles'] ?? '');
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Navegador Web';

try {
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$usuarioId, $nombreUsuario, $rol, $accion, $modulo, $detalles, $ip, substr($userAgent, 0, 250)]);

    jsonResponse([
        'success' => true,
        'message' => 'Evento de auditoría registrado correctamente.',
        'log_id' => $db->lastInsertId()
    ]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
