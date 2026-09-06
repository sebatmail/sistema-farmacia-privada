<?php
require_once __DIR__ . '/../config/database.php';
$data = getJsonInput();
$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    jsonResponse(['success' => false, 'error' => 'ID de producto inválido.'], 400);
}

try {
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Medicamento eliminado correctamente de la base de datos.']);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
