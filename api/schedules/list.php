<?php
/**
 * API ENDPOINT: LISTADO DE TURNOS Y HORARIOS DE TRABAJADORES
 * FarmaRed Chile - Unidad 3
 */

require_once __DIR__ . '/../config/database.php';

$usuarioId = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

try {
    $db = getDB();

    $whereSql = ($usuarioId > 0) ? "WHERE t.usuario_id = {$usuarioId}" : "";

    $sql = "SELECT 
                t.id, 
                t.usuario_id, 
                u.nombre as trabajador_nombre, 
                u.rol as trabajador_rol, 
                t.titulo, 
                t.tipo_turno, 
                t.fecha_inicio, 
                t.fecha_fin, 
                t.ubicacion, 
                t.descripcion, 
                t.estado_asistencia, 
                t.hora_marcacion_entrada, 
                t.hora_marcacion_salida
            FROM turnos_horarios t
            JOIN usuarios u ON t.usuario_id = u.id
            {$whereSql}
            ORDER BY t.fecha_inicio ASC";

    $stmt = $db->query($sql);
    $turnos = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'total' => count($turnos),
        'data' => $turnos
    ]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
