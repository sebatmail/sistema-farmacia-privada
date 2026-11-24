<?php
/**
 * API ENDPOINT: CAMBIO DE CONTRASEÑA DE USUARIO POR ADMINISTRADOR
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$userId = intval($data['user_id'] ?? 0);
$newPassword = trim($data['new_password'] ?? '');
$adminId = intval($data['admin_id'] ?? 1);

if ($userId <= 0 || strlen($newPassword) < 6) {
    jsonResponse([
        'success' => false, 
        'error' => 'ID de usuario inválido o la contraseña debe tener al menos 6 caracteres.'
    ], 400);
}

try {
    $db = getDB();

    // 1. Verificar existencia del usuario
    $stmtUser = $db->prepare("SELECT id, nombre, email, rol FROM usuarios WHERE id = ?");
    $stmtUser->execute([$userId]);
    $user = $stmtUser->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'error' => 'Usuario no encontrado en la base de datos.'], 404);
    }

    // 2. Hashear con bcrypt costo 10
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);

    // 3. Actualizar contraseña
    $stmtUpdate = $db->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
    $stmtUpdate->execute([$hash, $userId]);

    // 4. Registrar en auditoría inmutable
    try {
        $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtAudit->execute([
            $adminId,
            'Administrador General',
            'ADMIN',
            'CAMBIO_PASSWORD_ADMIN',
            'GESTION_USUARIOS',
            "Contraseña actualizada para el usuario {$user['nombre']} ({$user['email']} - Rol: {$user['rol']})",
            $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
        ]);
    } catch (Exception $eAudit) {
        // Ignorar si auditoría falla
    }

    jsonResponse([
        'success' => true,
        'message' => "Contraseña actualizada exitosamente para {$user['nombre']}."
    ]);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
