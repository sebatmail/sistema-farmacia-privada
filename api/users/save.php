<?php
require_once __DIR__ . '/../config/database.php';
$data = getJsonInput();

$id = intval($data['id'] ?? 0);
$rut = trim($data['rut'] ?? '');
$nombre = trim($data['nombre'] ?? '');
$email = trim($data['email'] ?? '');
$rol = trim($data['rol'] ?? 'VENDEDOR');
$password = trim($data['password'] ?? '');
$activo = isset($data['activo']) ? intval($data['activo']) : 1;

if (empty($rut) || empty($nombre) || empty($email)) {
    jsonResponse(['success' => false, 'error' => 'RUT, Nombre y Correo son obligatorios.'], 400);
}

try {
    $db = getDB();
    if ($id > 0) {
        if (!empty($password)) {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $db->prepare("UPDATE usuarios SET rut = ?, nombre = ?, email = ?, rol = ?, activo = ?, password = ? WHERE id = ?");
            $stmt->execute([$rut, $nombre, $email, $rol, $activo, $hash, $id]);
        } else {
            $stmt = $db->prepare("UPDATE usuarios SET rut = ?, nombre = ?, email = ?, rol = ?, activo = ? WHERE id = ?");
            $stmt->execute([$rut, $nombre, $email, $rol, $activo, $id]);
        }
        
        try {
            $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmtAudit->execute([1, 'Administrador General', 'ADMIN', 'MODIFICACION_USUARIO', 'GESTION_USUARIOS', "Modificación de datos para usuario ID #{$id} ({$nombre} - {$rol})", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);
        } catch (Exception $ea) {}
        
        jsonResponse(['success' => true, 'message' => 'Usuario actualizado exitosamente.']);
    } else {
        $rawPass = !empty($password) ? $password : 'inacap2026';
        $hash = password_hash($rawPass, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO usuarios (rut, nombre, email, rol, activo, password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$rut, $nombre, $email, $rol, $activo, $hash]);
        $newId = $db->lastInsertId();
        
        try {
            $stmtAudit = $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles, ip_origen) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmtAudit->execute([1, 'Administrador General', 'ADMIN', 'CREACION_USUARIO', 'GESTION_USUARIOS', "Creación de nuevo usuario {$nombre} ({$email} - Rol: {$rol})", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);
        } catch (Exception $ea) {}

        jsonResponse(['success' => true, 'id' => $newId, 'message' => 'Nuevo trabajador registrado exitosamente.']);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
