-- ====================================================================
-- SISTEMA DE GESTIÓN Y SIMULACIÓN DE FARMACIA PRIVADA COMERCIAL (CHILE)
-- Compatible con cPanel / phpMyAdmin / MySQL 5.7+ / MySQL 8.x / MariaDB
-- Motor Transaccional: InnoDB (ACID Compliant)
-- Codificación: utf8mb4_unicode_ci
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `recuperaciones_password`;
DROP TABLE IF EXISTS `turnos_horarios`;
DROP TABLE IF EXISTS `auditoria_usuarios`;
DROP TABLE IF EXISTS `caja_turnos`;
DROP TABLE IF EXISTS `libro_controlados_isp`;
DROP TABLE IF EXISTS `venta_detalles`;
DROP TABLE IF EXISTS `ventas`;
DROP TABLE IF EXISTS `recetas`;
DROP TABLE IF EXISTS `transferencias_internas`;
DROP TABLE IF EXISTS `lotes`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `categorias`;
DROP TABLE IF EXISTS `usuarios`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABLA: usuarios
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `rut` VARCHAR(12) NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('ADMIN', 'QUIMICO_FARMACEUTICO', 'VENDEDOR', 'BODEGUERO') NOT NULL DEFAULT 'VENDEDOR',
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA: categorias
CREATE TABLE `categorias` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: productos
CREATE TABLE `productos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `codigo_isp` VARCHAR(20) NOT NULL UNIQUE,
  `codigo_barra` VARCHAR(30) NOT NULL UNIQUE,
  `nombre` VARCHAR(120) NOT NULL,
  `principio_activo` VARCHAR(100) NOT NULL,
  `laboratorio` VARCHAR(60) NOT NULL,
  `categoria_id` INT UNSIGNED NOT NULL,
  `precio_venta` INT UNSIGNED NOT NULL,
  `precio_cenabast_max` INT UNSIGNED DEFAULT NULL,
  `es_cenabast` TINYINT(1) NOT NULL DEFAULT 0,
  `es_controlado` TINYINT(1) NOT NULL DEFAULT 0,
  `tipo_controlado` ENUM('NINGUNO', 'PSICOTROPICO', 'ESTUPEFACIENTE') DEFAULT 'NINGUNO',
  `requiere_receta` TINYINT(1) NOT NULL DEFAULT 1,
  `stock_minimo` INT UNSIGNED NOT NULL DEFAULT 5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: lotes (FEFO)
CREATE TABLE `lotes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT UNSIGNED NOT NULL,
  `numero_lote` VARCHAR(30) NOT NULL,
  `fecha_vencimiento` DATE NOT NULL,
  `stock_vitrina` INT UNSIGNED NOT NULL DEFAULT 0,
  `stock_bodega` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_producto_lote` (`producto_id`, `numero_lote`),
  INDEX `idx_fefo` (`fecha_vencimiento` ASC),
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: recetas
CREATE TABLE `recetas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `folio` VARCHAR(30) NOT NULL UNIQUE,
  `rut_paciente` VARCHAR(12) NOT NULL,
  `nombre_paciente` VARCHAR(100) NOT NULL,
  `rut_medico` VARCHAR(12) NOT NULL,
  `nombre_medico` VARCHAR(100) NOT NULL,
  `rnpi_medico` VARCHAR(20) NOT NULL,
  `fecha_emision` DATE NOT NULL,
  `vigencia_dias` INT UNSIGNED NOT NULL DEFAULT 30,
  `dosis_autorizada` INT UNSIGNED NOT NULL,
  `dosis_restante` INT UNSIGNED NOT NULL,
  `tipo_receta` ENUM('SIMPLE', 'RETENIDA', 'CHEQUE') NOT NULL DEFAULT 'SIMPLE',
  `estado` ENUM('ACTIVA', 'DISPENSADA_PARCIAL', 'CERRADA_SIN_SALDO', 'CADUCADA') NOT NULL DEFAULT 'ACTIVA',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA: ventas
CREATE TABLE `ventas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `folio_dte` INT UNSIGNED NOT NULL UNIQUE,
  `tipo_dte` VARCHAR(20) NOT NULL DEFAULT 'BOLETA_ELECTRONICA',
  `subtotal_bruto` INT UNSIGNED NOT NULL,
  `descuento_isapre` INT UNSIGNED NOT NULL DEFAULT 0,
  `ahorro_cenabast` INT UNSIGNED NOT NULL DEFAULT 0,
  `copago_total` INT UNSIGNED NOT NULL,
  `metodo_pago` ENUM('EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA') NOT NULL,
  `rut_cliente` VARCHAR(12) NOT NULL,
  `nombre_cliente` VARCHAR(100) NOT NULL,
  `convenio_salud` VARCHAR(50) DEFAULT 'PARTICULAR',
  `es_tercero` TINYINT(1) NOT NULL DEFAULT 0,
  `rut_receptor_tercero` VARCHAR(12) DEFAULT NULL,
  `nombre_receptor_tercero` VARCHAR(100) DEFAULT NULL,
  `telefono_receptor` VARCHAR(20) DEFAULT NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `timbre_ted_hash` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA: venta_detalles
CREATE TABLE `venta_detalles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `venta_id` INT UNSIGNED NOT NULL,
  `producto_id` INT UNSIGNED NOT NULL,
  `lote_id` INT UNSIGNED NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `precio_unitario` INT UNSIGNED NOT NULL,
  `copago_unitario` INT UNSIGNED NOT NULL,
  `subtotal` INT UNSIGNED NOT NULL,
  FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABLA: libro_controlados_isp (Append-Only)
CREATE TABLE `libro_controlados_isp` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `fecha` DATETIME NOT NULL,
  `producto_id` INT UNSIGNED NOT NULL,
  `lote_id` INT UNSIGNED NOT NULL,
  `receta_id` INT UNSIGNED DEFAULT NULL,
  `venta_id` INT UNSIGNED DEFAULT NULL,
  `tipo_movimiento` ENUM('INGRESO', 'EGRESO') NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `saldo_resultante` INT UNSIGNED NOT NULL,
  `rut_paciente` VARCHAR(12) NOT NULL,
  `nombre_paciente` VARCHAR(100) NOT NULL,
  `rut_medico` VARCHAR(12) NOT NULL,
  `nombre_medico` VARCHAR(100) NOT NULL,
  `rnpi_medico` VARCHAR(20) NOT NULL,
  `folio_receta` VARCHAR(30) NOT NULL,
  `firmado_por_qf` VARCHAR(100) NOT NULL,
  `hash_sha256` VARCHAR(64) NOT NULL,
  `hash_anterior` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABLA: caja_turnos
CREATE TABLE `caja_turnos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NOT NULL,
  `fondo_inicial` INT UNSIGNED NOT NULL,
  `total_esperado` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_declarado_ciego` INT UNSIGNED DEFAULT NULL,
  `diferencia` INT DEFAULT NULL,
  `estado` ENUM('ABIERTA', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
  `fecha_apertura` DATETIME NOT NULL,
  `fecha_cierre` DATETIME DEFAULT NULL,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TABLA: transferencias_internas
CREATE TABLE `transferencias_internas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT UNSIGNED NOT NULL,
  `lote_id` INT UNSIGNED NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `observacion` VARCHAR(255) DEFAULT 'Reposición por stock crítico',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. TABLA: auditoria_usuarios (Historial y Monitoreo de Acciones de Usuario)
CREATE TABLE `auditoria_usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NOT NULL,
  `nombre_usuario` VARCHAR(100) NOT NULL,
  `rol` VARCHAR(50) NOT NULL,
  `accion` VARCHAR(100) NOT NULL,
  `modulo` VARCHAR(50) NOT NULL,
  `detalles` TEXT NOT NULL,
  `ip_origen` VARCHAR(45) DEFAULT '127.0.0.1',
  `user_agent` VARCHAR(255) DEFAULT 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. TABLA: turnos_horarios (Planificación y Sincronización Google/Apple Calendar)
CREATE TABLE `turnos_horarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(100) NOT NULL,
  `tipo_turno` ENUM('MANANA', 'TARDE', 'NOCHE_GUARDIA', 'QUIMICO_REGENTE') NOT NULL DEFAULT 'MANANA',
  `fecha_inicio` DATETIME NOT NULL,
  `fecha_fin` DATETIME NOT NULL,
  `ubicacion` VARCHAR(150) DEFAULT 'FarmaRed Sucursal Santiago Centro - Alameda #1020',
  `descripcion` VARCHAR(255) DEFAULT 'Turno presencial farmacia con atencion de mostrador y reposicion',
  `estado_asistencia` ENUM('PROGRAMADO', 'PRESENTE', 'SALIDA_REGISTRADA', 'AUSENTE') DEFAULT 'PROGRAMADO',
  `hora_marcacion_entrada` DATETIME NULL,
  `hora_marcacion_salida` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. TABLA: recuperaciones_password (Recuperación Segura de Cuentas)
CREATE TABLE `recuperaciones_password` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `token_codigo` VARCHAR(10) NOT NULL,
  `usado` TINYINT(1) DEFAULT 0,
  `expira_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEEDERS (DATOS DE PRUEBA REALES)
INSERT INTO `usuarios` (`id`, `rut`, `nombre`, `email`, `password`, `rol`, `activo`) VALUES
(1, '11.111.111-1', 'Administrador General', 'admin@farmacia.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 1),
(2, '12.222.222-2', 'Dr. Andrés López (Q.F.)', 'qf@farmacia.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'QUIMICO_FARMACEUTICO', 1),
(3, '13.333.333-3', 'Vicente Flores (Cajero)', 'cajero@farmacia.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'VENDEDOR', 1),
(4, '14.444.444-4', 'Sebastián Torres (Bodeguero)', 'bodega@farmacia.cl', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BODEGUERO', 1);

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Analgésicos y Antipiréticos', 'Alivio de dolor y control de temperatura'),
(2, 'Antibióticos', 'Tratamiento de infecciones bacterianas'),
(3, 'Cardiovascular e Hipertensión', 'Medicamentos para control de presión arterial'),
(4, 'Salud Mental y Psicotrópicos', 'Sustancias psicotrópicas sujetas a control legal ISP'),
(5, 'Estupefacientes y Narcóticos', 'Fármacos Lista I sujetos a control por receta cheque'),
(6, 'Respiratorios y Antiasmáticos', 'Aerosoles e inhaladores broncodilatadores'),
(7, 'Gastrointestinales', 'Protectores gástricos y antiácidos');

INSERT INTO `productos` (`id`, `codigo_isp`, `codigo_barra`, `nombre`, `principio_activo`, `laboratorio`, `categoria_id`, `precio_venta`, `precio_cenabast_max`, `es_cenabast`, `es_controlado`, `tipo_controlado`, `requiere_receta`, `stock_minimo`) VALUES
(1, 'F-14022', '780000001001', 'Paracetamol 500mg (16 Comprimidos)', 'Paracetamol', 'Laboratorio Chile', 1, 1800, 1800, 1, 0, 'NINGUNO', 0, 10),
(2, 'F-18234', '780000001002', 'Amoxicilina 850mg (20 Comprimidos)', 'Amoxicilina Trihidrato', 'Laboratorio Andrómaco', 2, 14500, NULL, 0, 0, 'NINGUNO', 1, 8),
(3, 'F-19045', '780000001003', 'Losartán Potásico 50mg (30 Comprimidos)', 'Losartán Potásico', 'Laboratorio Mintlab', 3, 8990, 8990, 1, 0, 'NINGUNO', 1, 15),
(4, 'F-11200', '780000001004', 'Clonazepam 2mg (30 Comprimidos)', 'Clonazepam', 'Laboratorio Roche', 4, 18900, NULL, 0, 1, 'PSICOTROPICO', 1, 5),
(5, 'F-09812', '780000001005', 'Morfina Sulfato 10mg/mL (1 Ampolla)', 'Morfina Sulfato', 'Laboratorio Sanderson', 5, 25000, NULL, 0, 1, 'ESTUPEFACIENTE', 1, 3),
(6, 'F-15230', '780000001006', 'Salbutamol 100mcg Aerosol (200 Dosis)', 'Salbutamol Sulfato', 'Laboratorio Chile', 6, 4200, 2100, 1, 0, 'NINGUNO', 1, 6),
(7, 'F-17890', '780000001007', 'Atorvastatina 20mg (30 Comprimidos)', 'Atorvastatina Cálcica', 'Laboratorio Genfar', 3, 7990, 4500, 1, 0, 'NINGUNO', 1, 10),
(8, 'F-16400', '780000001008', 'Omeprazol 20mg (28 Cápsulas)', 'Omeprazol', 'Laboratorio Medley', 7, 5490, NULL, 0, 0, 'NINGUNO', 0, 8);

INSERT INTO `lotes` (`id`, `producto_id`, `numero_lote`, `fecha_vencimiento`, `stock_vitrina`, `stock_bodega`) VALUES
(1, 1, 'LT-PAR-2026-A', '2026-10-15', 25, 80),
(2, 1, 'LT-PAR-2027-B', '2027-08-20', 40, 150),
(3, 2, 'LT-AMX-2026-CRIT', '2026-10-05', 10, 40),
(4, 2, 'LT-AMX-2027-OK', '2027-05-18', 35, 90),
(5, 3, 'LT-LOS-2026-60D', '2026-11-18', 15, 65),
(6, 3, 'LT-LOS-2028-VIG', '2028-01-30', 50, 120),
(7, 4, 'LT-CLO-2027-ISP', '2027-06-30', 12, 35),
(8, 5, 'LT-MOR-2026-ESP', '2026-12-31', 4, 10),
(9, 6, 'LT-SAL-2027-CEN', '2027-03-15', 18, 55),
(10, 7, 'LT-ATO-2027-GEN', '2027-09-10', 20, 70),
(11, 8, 'LT-OME-2027-MED', '2027-11-25', 30, 85);

INSERT INTO `recetas` (`id`, `folio`, `rut_paciente`, `nombre_paciente`, `rut_medico`, `nombre_medico`, `rnpi_medico`, `fecha_emision`, `vigencia_dias`, `dosis_autorizada`, `dosis_restante`, `tipo_receta`, `estado`) VALUES
(1, 'REC-2026-001', '12.345.678-9', 'Juan Alberto Pérez Soto', '8.765.432-1', 'Dr. Roberto Muñoz Carrasco', 'RNPI-45892', '2026-08-25', 30, 2, 2, 'SIMPLE', 'ACTIVA'),
(2, 'RET-2026-088', '12.345.678-9', 'Juan Alberto Pérez Soto', '8.765.432-1', 'Dr. Roberto Muñoz Carrasco', 'RNPI-45892', '2026-09-01', 30, 1, 1, 'RETENIDA', 'ACTIVA'),
(3, 'CHE-2026-009', '19.876.543-2', 'María Elena Gómez Díaz', '11.234.567-8', 'Dra. Patricia Silva Venegas', 'RNPI-21045', '2026-09-02', 30, 2, 2, 'CHEQUE', 'ACTIVA');

INSERT INTO `caja_turnos` (`id`, `usuario_id`, `fondo_inicial`, `total_esperado`, `estado`, `fecha_apertura`) VALUES
(1, 3, 50000, 50000, 'ABIERTA', NOW());

INSERT INTO `libro_controlados_isp` (`id`, `fecha`, `producto_id`, `lote_id`, `receta_id`, `tipo_movimiento`, `cantidad`, `saldo_resultante`, `rut_paciente`, `nombre_paciente`, `rut_medico`, `nombre_medico`, `rnpi_medico`, `folio_receta`, `firmado_por_qf`, `hash_sha256`, `hash_anterior`) VALUES
(1, NOW() - INTERVAL 1 DAY, 4, 7, 2, 'EGRESO', 1, 47, '12.345.678-9', 'Juan Alberto Pérez Soto', '8.765.432-1', 'Dr. Roberto Muñoz Carrasco', 'RNPI-45892', 'RET-2026-088', 'Dr. Andrés López (Q.F.)', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '0000000000000000000000000000000000000000000000000000000000000000');

-- SEEDERS AUDITORÍA DE USUARIOS
INSERT INTO `auditoria_usuarios` (`id`, `usuario_id`, `nombre_usuario`, `rol`, `accion`, `modulo`, `detalles`, `ip_origen`, `created_at`) VALUES
(1, 1, 'Administrador General', 'ADMIN', 'INICIO_SESION', 'AUTENTICACION', 'Inicio de sesión exitoso desde consola de administración cPanel', '192.168.1.45', NOW() - INTERVAL 3 HOUR),
(2, 3, 'Vicente Flores', 'VENDEDOR', 'VENTA_DTE', 'POS_VENTAS', 'Emisión de Boleta Electrónica Folio #4829 por $6.940 (Convenio Isapre Banmédica)', '192.168.1.102', NOW() - INTERVAL 2 HOUR),
(3, 2, 'Sebastián Torres', 'QUIMICO_FARMACEUTICO', 'FIRMA_RECETA_ISP', 'CONTROLADOS', 'Validación y retención de Receta Médica Folio #REC-2026-9041 (Clonazepam 2 mg)', '192.168.1.103', NOW() - INTERVAL 90 MINUTE),
(4, 4, 'Operador de Bodega', 'BODEGUERO', 'TRASLADO_VITRINA', 'INVENTARIO', 'Traspaso de 10 unidades de Amoxicilina 850 mg (Lote LT-AMX-2026-CRIT) a Mostrador', '192.168.1.104', NOW() - INTERVAL 45 MINUTE),
(5, 1, 'Administrador General', 'ADMIN', 'RECEPCION_LOTE', 'BODEGA_FEFO', 'Ingreso de nuevo lote LT-AND-2027-B de Paracetamol 500 mg con 50 unidades', '192.168.1.45', NOW() - INTERVAL 20 MINUTE),
(6, 3, 'Vicente Flores', 'VENDEDOR', 'MARCACION_ENTRADA', 'RELOJ_CONTROL', 'Marcación de horario de entrada Turno Mañana (08:28 hrs) verificada', '192.168.1.102', NOW() - INTERVAL 4 HOUR);

-- SEEDERS TURNOS Y HORARIOS (SINCRONIZACIÓN GOOGLE Y APPLE CALENDAR)
INSERT INTO `turnos_horarios` (`id`, `usuario_id`, `titulo`, `tipo_turno`, `fecha_inicio`, `fecha_fin`, `ubicacion`, `descripcion`, `estado_asistencia`, `hora_marcacion_entrada`) VALUES
(1, 3, 'Turno Mañana - Vicente Flores', 'MANANA', DATE_ADD(CURDATE(), INTERVAL 8 HOUR + INTERVAL 30 MINUTE), DATE_ADD(CURDATE(), INTERVAL 16 HOUR + INTERVAL 30 MINUTE), 'FarmaRed Santiago Centro - Caja 2', 'Atención en mesón y ventas POS', 'PRESENTE', DATE_ADD(CURDATE(), INTERVAL 8 HOUR + INTERVAL 28 MINUTE)),
(2, 2, 'Regencia Químico Farmacéutica - Sebastián Torres', 'QUIMICO_REGENTE', DATE_ADD(CURDATE(), INTERVAL 9 HOUR), DATE_ADD(CURDATE(), INTERVAL 18 HOUR), 'FarmaRed Santiago Centro - Despacho Controlados', 'Supervisión de libro ISP y dispensación ética', 'PRESENTE', DATE_ADD(CURDATE(), INTERVAL 8 HOUR + INTERVAL 55 MINUTE)),
(3, 4, 'Recepción y Control FEFO - Bodega Central', 'MANANA', DATE_ADD(CURDATE(), INTERVAL 8 HOUR), DATE_ADD(CURDATE(), INTERVAL 16 HOUR), 'FarmaRed Santiago Centro - Bodega Nivel 1', 'Recepción de camiones de laboratorios y reposición', 'PRESENTE', DATE_ADD(CURDATE(), INTERVAL 7 HOUR + INTERVAL 58 MINUTE)),
(4, 3, 'Turno Mañana - Vicente Flores', 'MANANA', DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 8 HOUR + INTERVAL 30 MINUTE), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 16 HOUR + INTERVAL 30 MINUTE), 'FarmaRed Santiago Centro - Caja 2', 'Atención en mesón y ventas POS', 'PROGRAMADO', NULL),
(5, 2, 'Regencia Químico Farmacéutica - Sebastián Torres', 'QUIMICO_REGENTE', DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 9 HOUR), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 18 HOUR), 'FarmaRed Santiago Centro - Despacho Controlados', 'Supervisión de libro ISP y dispensación ética', 'PROGRAMADO', NULL),
(6, 1, 'Auditoría y Cierre de Mes - Admin', 'TARDE', DATE_ADD(CURDATE(), INTERVAL 14 HOUR), DATE_ADD(CURDATE(), INTERVAL 22 HOUR), 'FarmaRed Santiago Centro - Oficina Admin', 'Cierre contable DTE, arqueo de caja y revisión ISP', 'PROGRAMADO', NULL);
