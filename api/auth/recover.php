<?php
/**
 * API ENDPOINT: RECUPERACIÓN SEGURA DE CUENTA VÍA ENLACE DE CORREO
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$action = trim($data['action'] ?? 'request_link'); 
$email = trim($data['email'] ?? '');

if (empty($email)) {
    jsonResponse(['success' => false, 'message' => 'El correo electrónico es obligatorio.'], 400);
}

try {
    $db = getDB();

    // 1. Buscar usuario por email
    $stmtUser = $db->prepare("SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND activo = 1");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch();

    if (!$user) {
        jsonResponse([
            'success' => false, 
            'message' => 'No se encontró ninguna cuenta activa con ese correo institucional.'
        ], 404);
    }

    if ($action === 'request_link' || $action === 'request') {
        // Generar token seguro hexadecimal de 32 caracteres
        $tokenHex = bin2hex(random_bytes(16));
        $expiraAt = date('Y-m-d H:i:s', strtotime('+60 minutes'));

        // Invalidar tokens previos
        $stmtInvalidate = $db->prepare("UPDATE recuperaciones_password SET usado = 1 WHERE usuario_id = ?");
        $stmtInvalidate->execute([$user['id']]);

        // Guardar nuevo token de recuperación
        $stmtInsert = $db->prepare("INSERT INTO recuperaciones_password (usuario_id, email, token_codigo, expira_at) VALUES (?, ?, ?, ?)");
        $stmtInsert->execute([$user['id'], $email, $tokenHex, $expiraAt]);

        // Registrar en auditoría
        try {
            $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmtAudit->execute([
                $user['id'], 
                $user['nombre'], 
                $user['rol'], 
                'SOLICITUD_ENLACE_RECUPERACION', 
                'AUTENTICACION', 
                "Solicitud de enlace de recuperación enviado al correo {$email}", 
                $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
        } catch (Exception $eAudit) {}

        // Enlace de restablecimiento generado
        $resetUrl = "index.html?action=reset&token={$tokenHex}&email=" . urlencode($email);

        jsonResponse([
            'success' => true,
            'message' => "Enlace de recuperación generado exitosamente para {$user['nombre']}.",
            'email' => $email,
            'nombre' => $user['nombre'],
            'token' => $tokenHex,
            'reset_link' => $resetUrl,
            'expira_en_minutos' => 60
        ]);

    } else if ($action === 'reset_with_token' || $action === 'reset') {
        $token = trim($data['token'] ?? ($data['codigo'] ?? ''));
        $nuevaPassword = trim($data['nueva_password'] ?? '');

        if (empty($token) || strlen($nuevaPassword) < 6) {
            jsonResponse(['success' => false, 'message' => 'El enlace/token y una nueva contraseña de al menos 6 caracteres son obligatorios.'], 400);
        }

        // Verificar token en base de datos
        $stmtCheck = $db->prepare("SELECT id FROM recuperaciones_password WHERE usuario_id = ? AND token_codigo = ? AND usado = 0 AND expira_at > NOW() ORDER BY id DESC LIMIT 1");
        $stmtCheck->execute([$user['id'], $token]);
        $rec = $stmtCheck->fetch();

        if (!$rec) {
            jsonResponse(['success' => false, 'message' => 'El enlace de recuperación es inválido, ya fue utilizado o ha expirado.'], 400);
        }

        // Hashear nueva contraseña con bcrypt
        $hashPass = password_hash($nuevaPassword, PASSWORD_BCRYPT);
        $stmtUpdatePass = $db->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
        $stmtUpdatePass->execute([$hashPass, $user['id']]);

        // Marcar token como usado
        $stmtMark = $db->prepare("UPDATE recuperaciones_password SET usado = 1 WHERE id = ?");
        $stmtMark->execute([$rec['id']]);

        // Registrar en auditoría
        try {
            $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmtAudit->execute([
                $user['id'], 
                $user['nombre'], 
                $user['rol'], 
                'PASSWORD_RESTABLECIDA_EXITO', 
                'AUTENTICACION', 
                "Contraseña restablecida exitosamente mediante enlace de correo institucional", 
                $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
        } catch (Exception $eAudit) {}

        jsonResponse([
            'success' => true,
            'message' => 'Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
        ]);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
