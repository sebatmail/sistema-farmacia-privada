# 🏥 FarmaRed Chile - Sistema Web de Gestión y Simulación de Farmacia Privada Comercial

[![PHP Version](https://img.shields.io/badge/PHP-8.1%2B-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x%20%2F%20InnoDB-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B%20Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo%20Cloud-Online-success?style=for-the-badge&logo=google-cloud)](https://proyecto-farmacia.momentumspace.cl/)

> **Proyecto Integrado INACAP (AP-N4-C1)**  
> Desarrollado por: **Sebastián Torres** ([Momentum Space](https://momentumspace.cl/)) & **Vicente Flores**  
> Docente Evaluador: **Juan José Mir Castillo**

---

## 📌 Visión General del Proyecto

**FarmaRed Chile** es una plataforma de software diseñada para la gestión integral y simulación de una farmacia privada comercial en Chile. El sistema armoniza la alta velocidad transaccional de un punto de venta (POS) minorista con el estricto cumplimiento del marco legal y regulatorio sanitario chileno (**ISP, MINSAL, CENABAST y SII**).

A diferencia de los sistemas de venta convencionales, este software implementa reglas de negocio avanzadas para el cálculo de copagos con aseguradoras de salud, control de precios máximos por ley social, algoritmos logísticos de rotación de fármacos por fecha de caducidad y trazabilidad inmutable para sustancias fiscalizadas.

---

## 🌐 Enlaces Oficiales de la Plataforma Cloud (Demo en Vivo)

El sistema se encuentra desplegado y plenamente operativo en producción en la infraestructura cloud de **Momentum Space**:

* 🏪 **Terminal de Caja y Punto de Venta (POS):**  
  👉 **[https://proyecto-farmacia.momentumspace.cl/](https://proyecto-farmacia.momentumspace.cl/)**  
  *Dispensación táctil, lectura óptica EAN-13, validación de RUT (Módulo 11), liquidación automática de Isapres (60%), topes de la Ley CENABAST, emisión de Boleta Electrónica DTE con Timbre TED del SII y Libro ISP.*

* 🔐 **Suite de Administración y Gobernanza (/admin):**  
  👉 **[https://proyecto-farmacia.momentumspace.cl/admin](https://proyecto-farmacia.momentumspace.cl/admin)**  
  *Consola gerencial protegida con barrera de autenticación obligatoria. CRUD de catálogo de medicamentos, mantenedor de precios, recepción de lotes de laboratorio bajo FEFO, auditoría de ventas en tiempo real y gestión de usuarios RBAC.*  
  * **Usuario Administrador:** dmin@farmacia.cl  
  * **Contraseña de Acceso:** inacap2026 *(Incluye botón rápido de auto-completar para demostración docente)*

---

## ⚙️ Módulos y Arquitectura del Sistema

### 1. Terminal de Punto de Venta Ergonómico (POS)
* **Búsqueda Instantánea reactiva [F2]:** Filtro en vivo por nombre de fantasía, principio activo, laboratorio o escaneo de código de barras EAN-13 / Datamatrix.
* **Motor de Coberturas y Previsión de Salud:** Liquidación instantánea de copagos y bonificaciones según convenio (Isapre Banmédica 60%, Consalud 50%, Fonasa 40%, Particular).
* **Control de Precios Ley CENABAST N° 21.198:** Verificación automática de fármacos suscritos a precios máximos fijados por decreto supremo, con bloqueo algorítmico contra sobreprecios especulativos.
* **Emisión Tributaria DTE (SII):** Generación y previsualización de Boleta Electrónica con Timbre Electrónico del SII (TED), representación gráfica en código bidimensional PDF417 y cálculo automatizado de IVA y arqueo ciego por turno de caja.

### 2. Inventario Dual y Metodología Logística FEFO (*First Expired, First Out*)
* **Segregación Física y Lógica de Existencias:** Separación atómica entre el stock exhibido en **Vitrina (sala de ventas)** y el stock de reserva en **Bodega Central**.
* **Priorización Algorítmica por Caducidad:** El sistema descuenta siempre el lote con fecha de expiración más próxima disponible en sala.
* **Semáforos de Alerta Visual:** Clasificación por criticidad temporal: Crítico (<30 días), Alerta (30-90 días) y Óptimo (>90 días).
* **Transferencias Internas:** Mecanismo de reposición controlado por operador de bodega para mitigar quiebres de inventario en mostrador.

### 3. Trazabilidad Sanitaria y Libro Oficial Digital ISP (Decretos N° 404 y N° 405)
* **Digitalización Inmutable de Estupefacientes y Psicotrópicos:** Reemplazo legal del libro foliado en papel conforme a la regulación del Instituto de Salud Pública (ISP).
* **Validación de Prescripciones Retenidas:** Registro de médico prescriptor acreditado ante la Superintendencia de Salud (código RNPI) y control de retiros por terceros autorizados.
* **Protocolo Criptográfico Append-Only:** Sellado de registros mediante funciones hash encadenadas **SHA-256**, impidiendo matemáticamente la manipulación o eliminación de asientos contables.

### 4. Suite Administrativa y Mitigación de Broken Access Control (OWASP Top 10 A01)
* **Segregación de Dominios de Seguridad:** Aislamiento del módulo de administración en la ruta /admin, evitando la exposición de selectores de privilegios desprotegidos en terminales de mostrador.
* **Candado en Caja:** Cualquier intento de cambio de rol hacia perfil administrativo en el terminal POS despliega un modal bloqueante que exige contraseña maestra.
* **Gobernanza Centralizada:** Catálogo maestro CRUD, recepción de partidas de laboratorio, kardex cronológico de ventas y control de acceso basado en roles (RBAC) con contraseñas encriptadas mediante crypt.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Rol en la Solución |
| :--- | :--- | :--- |
| **Frontend de Sala** | HTML5 semántico + Tailwind CSS + JS ES Modules | Arquitectura SPA reactiva con ergonomía táctil y modo de contingencia offline. |
| **Backend de Servicios** | PHP 8.x nativo modular | Endpoints RESTful desacoplados, PDO parametrizado contra inyecciones SQL y transacciones atómicas ACID. |
| **Persistencia** | MySQL 8.x / MariaDB (InnoDB) | Esquema relacional normalizado (3FN) con integridad referencial estricta y aislamiento de transacciones. |
| **Ciberseguridad** | SHA-256 + Bcrypt + RBAC | Mitigación de vulnerabilidades OWASP A01 y A03, y encadenamiento criptográfico forense. |

---

## 👥 Cuentas de Acceso del Entorno Demostrativo

| Rol / Perfil | Correo Electrónico | Contraseña | Alcance Operacional |
| :--- | :--- | :--- | :--- |
| **Administrador General** | dmin@farmacia.cl | inacap2026 | Acceso a Suite /admin, mantenedor CRUD, precios CENABAST y personal |
| **Químico Farmacéutico (DT)** | qf@farmacia.cl | inacap2026 | Dirección técnica sanitaria, visado de recetas retenidas y Libro ISP |
| **Cajero / Vendedor** | cajero@farmacia.cl | inacap2026 | Terminal de ventas (POS), cálculo de coberturas y emisión de boletas DTE |
| **Operador de Bodega** | odega@farmacia.cl | inacap2026 | Control logístico central, monitoreo de alertas FEFO y reposición |

---

## 📄 Licencia

Este proyecto está distribuido bajo la Licencia MIT. Consulta el archivo LICENSE para más información.

Desarrollado con orgullo en Chile 🇨🇱 por **Sebastián Torres** ([Momentum Space](https://momentumspace.cl/)) y **Vicente Flores** para la asignatura de Proyecto Integrado del Área de Tecnologías de la Información y Ciberseguridad de **INACAP**.
