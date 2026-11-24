<?php
/**
 * API ENDPOINT: GENERADOR DINÁMICO DE CALENDARIO RFC 5545 (iCal / Apple Calendar / Outlook)
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$usuarioId = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;
$turnoId = isset($_GET['turno_id']) ? intval($_GET['turno_id']) : 0;

try {
    $db = getDB();

    $where = [];
    if ($turnoId > 0) {
        $where[] = "t.id = {$turnoId}";
    } else if ($usuarioId > 0) {
        $where[] = "t.usuario_id = {$usuarioId}";
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $stmt = $db->query("SELECT t.*, u.nombre as trabajador_nombre, u.email as trabajador_email FROM turnos_horarios t JOIN usuarios u ON t.usuario_id = u.id {$whereSql} ORDER BY t.fecha_inicio ASC");
    $events = $stmt->fetchAll();

    header('Content-Type: text/calendar; charset=utf-8');
    header('Content-Disposition: attachment; filename="farmared_turnos.ics"');

    echo "BEGIN:VCALENDAR\r\n";
    echo "VERSION:2.0\r\n";
    echo "PRODID:-//FarmaRed Chile//Gestion de Turnos Farmaceuticos 2026//ES\r\n";
    echo "CALSCALE:GREGORIAN\r\n";
    echo "METHOD:PUBLISH\r\n";
    echo "X-WR-CALNAME:FarmaRed - Turnos de Farmacia\r\n";
    echo "X-WR-TIMEZONE:America/Santiago\r\n";

    foreach ($events as $ev) {
        $dtStart = date('Ymd\THis', strtotime($ev['fecha_inicio']));
        $dtEnd = date('Ymd\THis', strtotime($ev['fecha_fin']));
        $uid = "turno-{$ev['id']}-farmared@sitiohost.host";
        $summary = $ev['titulo'];
        $desc = "Trabajador: {$ev['trabajador_nombre']}\nRol: {$ev['tipo_turno']}\nEstado: {$ev['estado_asistencia']}\n{$ev['descripcion']}";
        $loc = $ev['ubicacion'];

        echo "BEGIN:VEVENT\r\n";
        echo "UID:{$uid}\r\n";
        echo "DTSTAMP:" . gmdate('Ymd\THis\Z') . "\r\n";
        echo "DTSTART;TZID=America/Santiago:{$dtStart}\r\n";
        echo "DTEND;TZID=America/Santiago:{$dtEnd}\r\n";
        echo "SUMMARY:{$summary}\r\n";
        echo "DESCRIPTION:" . str_replace(["\r", "\n"], ["", "\n"], $desc) . "\r\n";
        echo "LOCATION:{$loc}\r\n";
        echo "STATUS:CONFIRMED\r\n";
        echo "END:VEVENT\r\n";
    }

    echo "END:VCALENDAR\r\n";
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo "Error generando archivo de calendario: " . $e->getMessage();
}
