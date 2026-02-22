<?php
/**
 * Docker Database Configuration
 * 
 * This file provides database configuration for Docker environment.
 * Include this file BEFORE any database connections in your application.
 * 
 * Usage:
 * require_once(__DIR__ . '/docker_db_config.php');
 */

// Check if running in Docker environment
if (getenv('DB_HOST') !== false) {
    // Docker environment detected
    define('DOCKER_DB_HOST', getenv('DB_HOST') ?: 'mysql');
    define('DOCKER_DB_USER', getenv('DB_USER') ?: 'queuing_daemon');
    define('DOCKER_DB_PASSWORD', getenv('DB_PASSWORD') ?: '1970');
    define('DOCKER_DB_NAME', getenv('DB_NAME') ?: 'smsgateaway');
    define('IS_DOCKER', true);
} else {
    // Not in Docker, use localhost
    define('DOCKER_DB_HOST', 'localhost');
    define('DOCKER_DB_USER', 'queuing_daemon');
    define('DOCKER_DB_PASSWORD', '1970');
    define('DOCKER_DB_NAME', 'smsgateaway');
    define('IS_DOCKER', false);
}

/**
 * Helper function to get database connection with Docker support
 * 
 * @param string $database Optional database name override
 * @return mysqli
 */
function get_docker_mysqli($database = null) {
    $host = DOCKER_DB_HOST;
    $user = DOCKER_DB_USER;
    $pass = DOCKER_DB_PASSWORD;
    $db = $database ?: DOCKER_DB_NAME;
    
    $mysqli = new mysqli($host, $user, $pass, $db);
    
    if ($mysqli->connect_errno) {
        die('Database Connection Error: ' . $mysqli->connect_errno . ' - ' . $mysqli->connect_error);
    }
    
    mysqli_set_charset($mysqli, 'utf8mb4');
    
    return $mysqli;
}
