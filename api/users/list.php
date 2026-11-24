<?php
require_once __DIR__ . '/../config/database.php';
try {
    $db = getDB();
    $users = $db->query("SELECT id, rut, nombre, email, rol, activo, created_at FROM usuarios ORDER BY id ASC")->fetchAll();
    jsonResponse([
        'success' => true, 
        'users' => $users,
        'data' => $users
    ]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
