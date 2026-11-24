<?php
/**
 * ARCHIVO DE CONFIGURACIÓN Y CONEXIÓN PDO A BASE DE DATOS MYSQL
 * FarmaRed Chile - Sistema de Gestión de Farmacia Privada Comercial
 * Compatible con cPanel / phpMyAdmin / MariaDB / MySQL 8.x / XAMPP Localhost
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================================================
// CREDENCIALES DE BASE DE DATOS (CONFIGURA AQUÍ SEGÚN TU ENTORNO CPANEL O LOCAL)
// ============================================================================
// Si estás en cPanel, pon el nombre de base de datos y usuario creados en MySQL Databases:
// Ejemplo cPanel: 'altoplagas_farmacia' y 'altoplagas_farmauser'
// Si estás en local (XAMPP): 'farmacia_db' y 'root' con contraseña vacía ''
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'altoplagas_farmacia'); // Cambiar aquí si tu BD en cPanel se llama diferente
define('DB_USER', getenv('DB_USER') ?: 'altoplagas_farmauser'); // Cambiar aquí con tu usuario de cPanel
define('DB_PASS', getenv('DB_PASS') ?: 'inacap2026');           // Cambiar aquí con la contraseña que le diste al usuario en cPanel
define('DB_PORT', getenv('DB_PORT') ?: '3306');

/**
 * Obtiene la instancia singleton de conexión PDO a MySQL
 */
function getDB() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    // Lista de perfiles de conexión para intentar automáticamente
    $candidates = [
        // 1. Perfil principal configurado arriba
        [
            'host' => DB_HOST,
            'name' => DB_NAME,
            'user' => DB_USER,
            'pass' => DB_PASS,
            'port' => DB_PORT
        ],
        // 2. Perfil alternativo cPanel común (mismo usuario/nombre base sin prefijo o con prefijo farmacia_db)
        [
            'host' => 'localhost',
            'name' => 'farmacia_db',
            'user' => 'farmacia_user',
            'pass' => 'inacap2026',
            'port' => '3306'
        ],
        // 3. Perfil local XAMPP / WAMP (root sin password)
        [
            'host' => 'localhost',
            'name' => DB_NAME,
            'user' => 'root',
            'pass' => '',
            'port' => '3306'
        ],
        [
            'host' => 'localhost',
            'name' => 'farmacia_db',
            'user' => 'root',
            'pass' => '',
            'port' => '3306'
        ]
    ];

    $lastError = '';
    foreach ($candidates as $cand) {
        try {
            $dsn = "mysql:host={$cand['host']};port={$cand['port']};dbname={$cand['name']};charset=utf8mb4";
            $pdo = new PDO($dsn, $cand['user'], $cand['pass'], $options);
            return $pdo;
        } catch (PDOException $e) {
            $lastError = $e->getMessage();
            continue;
        }
    }

    // Si ninguno pudo conectar, retornar diagnóstico claro en JSON
    jsonResponse([
        'success' => false,
        'error' => 'No se pudo conectar a la base de datos MySQL en cPanel.',
        'diagnostico' => [
            'mensaje' => 'Asegúrese de haber creado la base de datos en cPanel, asignarle el usuario con TODOS LOS PRIVILEGIOS e importar database.sql en phpMyAdmin.',
            'archivo_config' => 'api/config/database.php',
            'bd_intentada' => DB_NAME,
            'usuario_intentado' => DB_USER,
            'detalle_tecnico' => $lastError
        ]
    ], 500);
}

/**
 * Emite una respuesta JSON estandarizada con código HTTP
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Lee y decodifica el payload JSON del cuerpo HTTP
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}
