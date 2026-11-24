<?php
/**
 * API ENDPOINT: REGISTRAR/MARCAR ASISTENCIA O PROGRAMAR TURNO
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$data = getJsonInput();
$action = trim($data['action'] ?? 'clock_in'); // 'clock_in', 'clock_out', 'create'
$usuarioId = intval($data['usuario_id'] ?? 1);

try {
    $db = getDB();

    if ($action === 'clock_in') {
        // Marcación de entrada
        $stmtUser = $db->prepare("SELECT nombre, rol FROM usuarios WHERE id = ?");
        $stmtUser->execute([$usuarioId]);
        $user = $stmtUser->fetch();
        $nombre = $user ? $user['nombre'] : 'Trabajador';

        // Buscar turno de hoy
        $stmtFind = $db->prepare("SELECT id FROM turnos_horarios WHERE usuario_id = ? AND DATE(fecha_inicio) = CURDATE() ORDER BY id DESC LIMIT 1");
        $stmtFind->execute([$usuarioId]);
        $turno = $stmtFind->fetch();

        $horaActual = date('Y-m-d H:i:s');
        if ($turno) {
            $stmtUp = $db->prepare("UPDATE turnos_horarios SET estado_asistencia = 'PRESENTE', hora_marcacion_entrada = ? WHERE id = ?");
            $stmtUp->execute([$horaActual, $turno['id']]);
        } else {
            // Crear turno dinámico
            $stmtIns = $db->prepare("INSERT INTO turnos_horarios (usuario_id, titulo, tipo_turno, fecha_inicio, fecha_fin, estado_asistencia, hora_marcacion_entrada) VALUES (?, ?, 'MANANA', ?, DATE_ADD(?, INTERVAL 8 HOUR), 'PRESENTE', ?)");
            $stmtIns->execute([$usuarioId, "Turno Hoy - {$nombre}", $horaActual, $horaActual, $horaActual]);
        }

        // Registrar en auditoría
        $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles) VALUES (?, ?, ?, 'MARCACION_ENTRADA', 'RELOJ_CONTROL', ?)")
           ->execute([$usuarioId, $nombre, $user['rol'] ?? 'TRABAJADOR', "Marcación de entrada registrada a las " . date('H:i') . " hrs"]);

        jsonResponse([
            'success' => true,
            'message' => "¡Marcación de Entrada registrada exitosamente para {$nombre} a las " . date('H:i') . " hrs!",
            'hora' => date('H:i:s')
        ]);
    } else if ($action === 'clock_out') {
        $stmtUser = $db->prepare("SELECT nombre, rol FROM usuarios WHERE id = ?");
        $stmtUser->execute([$usuarioId]);
        $user = $stmtUser->fetch();
        $nombre = $user ? $user['nombre'] : 'Trabajador';

        $horaActual = date('Y-m-d H:i:s');
        $stmtUp = $db->prepare("UPDATE turnos_horarios SET estado_asistencia = 'SALIDA_REGISTRADA', hora_marcacion_salida = ? WHERE usuario_id = ? AND DATE(fecha_inicio) = CURDATE()");
        $stmtUp->execute([$horaActual, $usuarioId]);

        // Registrar en auditoría
        $db->prepare("INSERT INTO auditoria_usuarios (usuario_id, nombre_usuario, rol, accion, modulo, detalles) VALUES (?, ?, ?, 'MARCACION_SALIDA', 'RELOJ_CONTROL', ?)")
           ->execute([$usuarioId, $nombre, $user['rol'] ?? 'TRABAJADOR', "Marcación de salida de turno registrada a las " . date('H:i') . " hrs"]);

        jsonResponse([
            'success' => true,
            'message' => "¡Marcación de Salida registrada exitosamente para {$nombre} a las " . date('H:i') . " hrs!",
            'hora' => date('H:i:s')
        ]);
    } else if ($action === 'create') {
        $titulo = trim($data['titulo'] ?? 'Turno Asignado');
        $tipoTurno = trim($data['tipo_turno'] ?? 'MANANA');
        $fechaInicio = trim($data['fecha_inicio'] ?? date('Y-m-d 08:30:00'));
        $fechaFin = trim($data['fecha_fin'] ?? date('Y-m-d 16:30:00'));
        $ubicacion = trim($data['ubicacion'] ?? 'FarmaRed Santiago Centro - Alameda #1020');

        $stmt = $db->prepare("INSERT INTO turnos_horarios (usuario_id, titulo, tipo_turno, fecha_inicio, fecha_fin, ubicacion) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$usuarioId, $titulo, $tipoTurno, $fechaInicio, $fechaFin, $ubicacion]);

        jsonResponse([
            'success' => true,
            'message' => "Turno '{$titulo}' programado exitosamente en el calendario del trabajador."
        ]);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
