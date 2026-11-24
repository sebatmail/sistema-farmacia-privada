<?php
/**
 * API ENDPOINT: RECUPERACIÓN SEGURA DE CONTRASEÑA
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$action = trim($data['action'] ?? 'request'); // 'request' o 'reset'
$email = trim($data['email'] ?? '');

if (empty($email)) {
    jsonResponse(['success' => false, 'message' => 'El correo electrónico es obligatorio.'], 400);
}

try {
    $db = getDB();

    // 1. Buscar usuario por email
    $stmtUser = $db->prepare("SELECT id, nombre, email FROM usuarios WHERE email = ? AND activo = 1");
    $stmtUser->execute([$email]);
    $user = $stmtUser->fetch();

    if (!$user) {
        jsonResponse([
            'success' => false, 
            'message' => 'No se encontró ninguna cuenta activa con ese correo institucional.'
        ], 404);
    }

    if ($action === 'request') {
        // Generar PIN de 6 dígitos aleatorio
        $codigoPin = strval(rand(100000, 999999));
        $expiraAt = date('Y-m-d H:i:s', strtotime('+30 minutes'));

        // Invalidar códigos previos
        $stmtInvalidate = $db->prepare("UPDATE recuperaciones_password SET usado = 1 WHERE usuario_id = ?");
        $stmtInvalidate->execute([$user['id']]);

        // Guardar nuevo token de recuperación
        $stmtInsert = $db->prepare("INSERT INTO recuperaciones_password (usuario_id, email, token_codigo, expira_at) VALUES (?, ?, ?, ?)");
        $stmtInsert->execute([$user['id'], $email, $codigoPin, $expiraAt]);

        // Registrar en auditoría
        $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtAudit->execute([$user['id'], $user['nombre'], 'USUARIO', 'SOLICITUD_RECUPERACION', 'AUTENTICACION', "Solicitud de PIN de recuperación para {$email}", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

        jsonResponse([
            'success' => true,
            'message' => "Código de verificación generado para {$user['nombre']}.",
            'codigo_simulado' => $codigoPin, // Para facilitar la demostración académica en vivo
            'expira_en_minutos' => 30
        ]);
    } else if ($action === 'reset') {
        $codigo = trim($data['codigo'] ?? '');
        $nuevaPassword = trim($data['nueva_password'] ?? '');

        if (empty($codigo) || strlen($nuevaPassword) < 6) {
            jsonResponse(['success' => false, 'message' => 'El código y una nueva contraseña de al menos 6 caracteres son obligatorios.'], 400);
        }

        // Verificar código
        $stmtCheck = $db->prepare("SELECT id FROM recuperaciones_password WHERE usuario_id = ? AND token_codigo = ? AND usado = 0 AND expira_at > NOW() ORDER BY id DESC LIMIT 1");
        $stmtCheck->execute([$user['id'], $codigo]);
        $rec = $stmtCheck->fetch();

        if (!$rec) {
            jsonResponse(['success' => false, 'message' => 'El código de verificación es inválido o ha expirado.'], 400);
        }

        // Hashear nueva contraseña
        $hashPass = password_hash($nuevaPassword, PASSWORD_BCRYPT);
        $stmtUpdatePass = $db->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
        $stmtUpdatePass->execute([$hashPass, $user['id']]);

        // Marcar token como usado
        $stmtMark = $db->prepare("UPDATE recuperaciones_password SET usado = 1 WHERE id = ?");
        $stmtMark->execute([$rec['id']]);

        // Registrar en auditoría
        $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmtAudit->execute([$user['id'], $user['nombre'], 'USUARIO', 'RESTABLECIMIENTO_EXITOSO', 'AUTENTICACION', "Contraseña restablecida exitosamente mediante PIN de verificación", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

        jsonResponse([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente. Ahora puede iniciar sesión con su nueva clave.'
        ]);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
