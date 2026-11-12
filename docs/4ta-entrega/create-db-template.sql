-- =====================================================================
-- PP1 2026 · Bloque 4 · TP Reservas de Alojamiento
-- Script de la base de datos: crea la base pp1_reservas, sus 8 tablas
-- y una carga de datos de prueba que cuenta UNA sola historia.
--
-- Fuente: tp-integradores/tp-reservas/solucion-base/modelo-de-datos.md
-- Los nombres de tablas y columnas son EXACTAMENTE los del modelo.
--
-- CÓMO CORRERLO (MySQL Workbench)
--   1. Abrí tu conexión local (la del checklist del entorno).
--   2. File → Open SQL Script… → elegí este archivo.
--   3. Ejecutá TODO el script: ícono del rayo (Execute) o Ctrl+Shift+Enter.
--      (No el rayo con el cursor, que ejecuta solo la sentencia actual.)
--   4. Refrescá el panel SCHEMAS: aparece pp1_reservas.
--
-- OJO: el script BORRA la base pp1_reservas y la vuelve a crear.
--   Se puede correr las veces que quieras: siempre deja la base igual,
--   con los mismos datos. Si algo salió mal, correlo de nuevo entero.
--
-- POR QUÉ BIGINT Y VARCHAR (y no INT y ENUM, como dice el diagrama)
--   El backend va a usar spring.jpa.hibernate.ddl-auto=validate:
--   el script crea las tablas y Spring solo CONTROLA que las entidades
--   coincidan. Para que ese control pase sin sorpresas:
--   · Toda PK y toda FK es BIGINT, porque en Java el id es Long.
--   · rol y estado son VARCHAR(20) + CHECK, porque en Java son String.
--     Un ENUM de MySQL contra un String (o un enum de Java) es la causa
--     más común de "Schema-validation: wrong column type". Con VARCHAR,
--     el CHECK sigue impidiendo valores que no existen.
--   · DECIMAL → BigDecimal · DATE → LocalDate · DATETIME → LocalDateTime
--     · BOOLEAN → Boolean · INT → Integer.
--   El resto (nombres, largos, NOT NULL, UNIQUE) es el modelo tal cual.
--
-- Contraseñas: van en texto plano ('cambiar123') A PROPÓSITO. En esta
-- etapa no hay login real ni hashing; no uses estas cuentas en nada real.
-- =====================================================================

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS pp1_reservas;
CREATE DATABASE pp1_reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pp1_reservas;

-- ---------------------------------------------------------------------
-- TABLAS (en orden: primero las que no dependen de nadie)
-- ---------------------------------------------------------------------

-- Usuario: Huéspedes y Anfitriones.
CREATE TABLE usuario (
  id_usuario  BIGINT       NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(60)  NOT NULL,
  apellido    VARCHAR(60)  NOT NULL,
  correo      VARCHAR(120) NOT NULL,
  contrasena  VARCHAR(255) NOT NULL,
  telefono    VARCHAR(30),
  rol         VARCHAR(20)  NOT NULL,
  activo      BOOLEAN      NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT uk_usuario_correo UNIQUE (correo),
  CONSTRAINT ck_usuario_rol CHECK (rol IN ('HUESPED', 'ANFITRION'))
) ENGINE = InnoDB;

-- Ciudad: catálogo controlado para el filtro por ubicación del catálogo.
CREATE TABLE ciudad (
  id_ciudad  BIGINT      NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(80) NOT NULL,
  provincia  VARCHAR(80) NOT NULL,
  PRIMARY KEY (id_ciudad)
) ENGINE = InnoDB;

-- Servicio: wifi, cochera, pileta… "Acepta mascotas" también es un servicio.
CREATE TABLE servicio (
  id_servicio  BIGINT      NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(80) NOT NULL,
  PRIMARY KEY (id_servicio)
) ENGINE = InnoDB;

-- Alojamiento: la propiedad. Tiene dueño (anfitrión) y ciudad.
-- publicado = FALSE → retirado del catálogo sin borrarlo.
CREATE TABLE alojamiento (
  id_alojamiento        BIGINT        NOT NULL AUTO_INCREMENT,
  nombre                VARCHAR(120)  NOT NULL,
  descripcion           VARCHAR(500),
  imagen                VARCHAR(255),
  precio_por_noche      DECIMAL(10,2) NOT NULL,
  capacidad             INT           NOT NULL,
  tipo                  VARCHAR(60)   NOT NULL,
  publicado             BOOLEAN       NOT NULL,
  id_ciudad             BIGINT        NOT NULL,
  id_usuario_anfitrion  BIGINT        NOT NULL,
  PRIMARY KEY (id_alojamiento),
  CONSTRAINT fk_alojamiento_ciudad FOREIGN KEY (id_ciudad)
    REFERENCES ciudad (id_ciudad),
  CONSTRAINT fk_alojamiento_usuario FOREIGN KEY (id_usuario_anfitrion)
    REFERENCES usuario (id_usuario)
) ENGINE = InnoDB;

-- AlojamientoServicio: tabla puente SIN atributos propios.
-- Solo dice "este alojamiento ofrece este servicio".
CREATE TABLE alojamiento_servicio (
  id_alojamiento_servicio  BIGINT NOT NULL AUTO_INCREMENT,
  id_alojamiento           BIGINT NOT NULL,
  id_servicio              BIGINT NOT NULL,
  PRIMARY KEY (id_alojamiento_servicio),
  CONSTRAINT fk_alojamiento_servicio_alojamiento FOREIGN KEY (id_alojamiento)
    REFERENCES alojamiento (id_alojamiento),
  CONSTRAINT fk_alojamiento_servicio_servicio FOREIGN KEY (id_servicio)
    REFERENCES servicio (id_servicio)
) ENGINE = InnoDB;

-- BloqueoDisponibilidad: días que el anfitrión cierra a mano.
-- Es una entidad propia, no un boolean del alojamiento (la "trampa
-- DISPONIBILIDAD"). UNIQUE: un mismo día no se bloquea dos veces.
CREATE TABLE bloqueo_disponibilidad (
  id_bloqueo      BIGINT       NOT NULL AUTO_INCREMENT,
  id_alojamiento  BIGINT       NOT NULL,
  fecha           DATE         NOT NULL,
  motivo          VARCHAR(120),
  PRIMARY KEY (id_bloqueo),
  CONSTRAINT uk_bloqueo_disponibilidad_alojamiento_fecha UNIQUE (id_alojamiento, fecha),
  CONSTRAINT fk_bloqueo_disponibilidad_alojamiento FOREIGN KEY (id_alojamiento)
    REFERENCES alojamiento (id_alojamiento)
) ENGINE = InnoDB;

-- Reserva: nace CONFIRMADA (no hay borrador en este TP).
-- importe_total SE GUARDA: es el precio pactado al reservar (dato histórico).
-- Las noches NO se guardan: salen de fecha_check_out − fecha_check_in.
CREATE TABLE reserva (
  id_reserva          BIGINT        NOT NULL AUTO_INCREMENT,
  id_alojamiento      BIGINT        NOT NULL,
  id_usuario          BIGINT        NOT NULL,
  fecha_check_in      DATE          NOT NULL,
  fecha_check_out     DATE          NOT NULL,
  cantidad_huespedes  INT           NOT NULL,
  importe_total       DECIMAL(10,2) NOT NULL,
  estado              VARCHAR(20)   NOT NULL,
  solicitud_especial  VARCHAR(300),
  PRIMARY KEY (id_reserva),
  CONSTRAINT ck_reserva_estado CHECK (estado IN ('CONFIRMADA', 'CANCELADA')),
  CONSTRAINT fk_reserva_alojamiento FOREIGN KEY (id_alojamiento)
    REFERENCES alojamiento (id_alojamiento),
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
) ENGINE = InnoDB;

-- Notificacion: FUERA DEL ALCANCE MÍNIMO (no tiene pantalla).
-- La tabla está para que la base sea el modelo completo. Si algún día la
-- mapean como entidad, mensaje es TEXT: en Java va con
-- @Column(columnDefinition = "TEXT") para que validate no proteste.
CREATE TABLE notificacion (
  id_notificacion  BIGINT       NOT NULL AUTO_INCREMENT,
  id_usuario       BIGINT       NOT NULL,
  fecha_envio      DATETIME     NOT NULL,
  asunto           VARCHAR(150),
  mensaje          TEXT,
  PRIMARY KEY (id_notificacion),
  CONSTRAINT fk_notificacion_usuario FOREIGN KEY (id_usuario)
    REFERENCES usuario (id_usuario)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- DATOS DE PRUEBA — la historia
--   Dos anfitriones: Gabriela (Bariloche y Mar del Plata) y Ricardo
--   (Carlos Paz, Mar del Plata y Mendoza). Cuatro alojamientos están
--   publicados; dos están retirados del catálogo (publicado = FALSE).
--   Tres huéspedes hicieron cinco reservas entre noviembre y enero;
--   una fue cancelada. Hay bloqueos manuales por mantenimiento y uso propio.
--   importe_total = noches × precio_por_noche del momento de reservar.
-- Los id se escriben a mano para que la historia se pueda seguir.
-- ---------------------------------------------------------------------

INSERT INTO usuario (id_usuario, nombre, apellido, correo, contrasena, telefono, rol, activo) VALUES
  (1, 'Gabriela',  'Paz',     'gabriela.paz@correo.com.ar',    'cambiar123', '294 452-3311', 'ANFITRION', TRUE),
  (2, 'Ricardo',   'Ibáñez',  'ricardo.ibanez@correo.com.ar',  'cambiar123', '351 678-2200', 'ANFITRION', TRUE),
  (3, 'Sofía',     'Herrera', 'sofia.herrera@correo.com.ar',   'cambiar123', '11 4789-1020', 'HUESPED',   TRUE),
  (4, 'Tomás',     'Acuña',   'tomas.acuna@correo.com.ar',     'cambiar123', NULL,           'HUESPED',   TRUE),
  (5, 'Valentina', 'Ríos',    'valentina.rios@correo.com.ar',  'cambiar123', '221 455-7788', 'HUESPED',   TRUE);

INSERT INTO ciudad (id_ciudad, nombre, provincia) VALUES
  (1, 'Mar del Plata',           'Buenos Aires'),
  (2, 'Villa Carlos Paz',        'Córdoba'),
  (3, 'San Carlos de Bariloche', 'Río Negro'),
  (4, 'Mendoza',                 'Mendoza');

INSERT INTO servicio (id_servicio, nombre) VALUES
  (1, 'Wifi'),
  (2, 'Cochera'),
  (3, 'Pileta'),
  (4, 'Aire acondicionado'),
  (5, 'Acepta mascotas');

-- Dos alojamientos comparten ciudad (Mar del Plata), para el filtro por ubicación.
INSERT INTO alojamiento (id_alojamiento, nombre, descripcion, imagen, precio_por_noche, capacidad, tipo, publicado, id_ciudad, id_usuario_anfitrion) VALUES
  (1, 'Cabaña del Lago',     'A 200 m de la costa del lago',                     'assets/img/cabania-lago.jpg', 45000.00, 4, 'cabaña',       TRUE,  3, 1),
  (2, 'Depto Centro',        'Monoambiente luminoso a dos cuadras de la peatonal', 'assets/img/depto-centro.jpg', 30000.00, 2, 'departamento', TRUE,  1, 1),
  (3, 'Casa de las Sierras', 'Casa con parque y pileta, a 5 km del lago',         'assets/img/casa-sierras.jpg', 60000.00, 6, 'casa',         TRUE,  2, 2),
  (4, 'Loft Rambla',         'Frente al mar, con balcón',                        'assets/img/loft-rambla.jpg',  52000.00, 3, 'departamento', TRUE,  1, 2),
  (5, 'Cabaña Los Coihues',  'En refacción: vuelve en diciembre',                'assets/img/coihues.jpg',      40000.00, 5, 'cabaña',       FALSE, 3, 1),
  (6, 'Depto Bodegas',       'Cerca de los caminos del vino',                    'assets/img/depto-bodegas.jpg', 38000.00, 4, 'departamento', FALSE, 4, 2);

INSERT INTO alojamiento_servicio (id_alojamiento_servicio, id_alojamiento, id_servicio) VALUES
  ( 1, 1, 1), ( 2, 1, 2), ( 3, 1, 5),             -- Cabaña del Lago: Wifi, Cochera, Acepta mascotas
  ( 4, 2, 1), ( 5, 2, 4),                         -- Depto Centro: Wifi, Aire acondicionado
  ( 6, 3, 1), ( 7, 3, 2), ( 8, 3, 3), ( 9, 3, 5), -- Casa de las Sierras: Wifi, Cochera, Pileta, Acepta mascotas
  (10, 4, 1), (11, 4, 4),                         -- Loft Rambla: Wifi, Aire acondicionado
  (12, 5, 2),                                     -- Cabaña Los Coihues: Cochera
  (13, 6, 1), (14, 6, 2);                         -- Depto Bodegas: Wifi, Cochera

INSERT INTO bloqueo_disponibilidad (id_bloqueo, id_alojamiento, fecha, motivo) VALUES
  (1, 1, '2026-11-12', 'Mantenimiento de la caldera'),
  (2, 1, '2026-11-13', 'Mantenimiento de la caldera'),
  (3, 3, '2026-11-27', 'Uso propio'),
  (4, 3, '2026-11-28', 'Uso propio'),
  (5, 2, '2026-12-24', 'Nochebuena: no se alquila');

-- importe_total = noches × precio_por_noche:
--   1: 06/11 → 09/11 = 3 noches × 45000 = 135000
--   2: 26/12 → 02/01 = 7 noches × 60000 = 420000
--   3: 13/11 → 15/11 = 2 noches × 30000 =  60000 (CANCELADA: el importe queda como historial)
--   4: 04/12 → 08/12 = 4 noches × 52000 = 208000
--   5: 20/11 → 22/11 = 2 noches × 45000 =  90000
INSERT INTO reserva (id_reserva, id_alojamiento, id_usuario, fecha_check_in, fecha_check_out, cantidad_huespedes, importe_total, estado, solicitud_especial) VALUES
  (1, 1, 3, '2026-11-06', '2026-11-09', 3, 135000.00, 'CONFIRMADA', 'Llegamos tarde, cerca de las 23'),
  (2, 3, 4, '2026-12-26', '2027-01-02', 5, 420000.00, 'CONFIRMADA', NULL),
  (3, 2, 5, '2026-11-13', '2026-11-15', 2,  60000.00, 'CANCELADA',  NULL),
  (4, 4, 3, '2026-12-04', '2026-12-08', 2, 208000.00, 'CONFIRMADA', 'Necesitamos una cuna para bebé'),
  (5, 1, 4, '2026-11-20', '2026-11-22', 4,  90000.00, 'CONFIRMADA', NULL);

-- Fuera del alcance mínimo: una sola fila, para que la tabla no esté vacía.
INSERT INTO notificacion (id_notificacion, id_usuario, fecha_envio, asunto, mensaje) VALUES
  (1, 3, '2026-10-20 18:40:00', 'Reserva confirmada', 'Tu reserva en Cabaña del Lago del 06/11 al 09/11 quedó confirmada.');

-- =====================================================================
-- Verificación — seleccioná este bloque y ejecutalo (rayo).
-- Lo esperado está al lado de cada línea.
-- =====================================================================
-- SELECT COUNT(*) FROM usuario;                 -- 5
-- SELECT COUNT(*) FROM ciudad;                  -- 4
-- SELECT COUNT(*) FROM servicio;                -- 5
-- SELECT COUNT(*) FROM alojamiento;             -- 6
-- SELECT COUNT(*) FROM alojamiento_servicio;    -- 14
-- SELECT COUNT(*) FROM bloqueo_disponibilidad;  -- 5
-- SELECT COUNT(*) FROM reserva;                 -- 5
-- SELECT COUNT(*) FROM notificacion;            -- 1

-- =====================================================================
-- Cruces de ejemplo — los mismos de modelo-explicado-reservas.md.
-- Sacales el "-- " de adelante (o copialos a una pestaña nueva) y correlos.
-- =====================================================================

-- Cruce 1 · El catálogo publicado, con su ciudad → pantalla 02 Catálogo
-- Esperado (4 filas): Depto Centro 30000 · Cabaña del Lago 45000 · Loft Rambla 52000 · Casa de las Sierras 60000.
-- SELECT a.id_alojamiento, a.nombre, a.tipo, a.capacidad, a.precio_por_noche,
--        c.nombre AS ciudad, c.provincia
-- FROM alojamiento a
-- JOIN ciudad c ON c.id_ciudad = a.id_ciudad
-- WHERE a.publicado = TRUE
-- ORDER BY a.precio_por_noche;

-- Cruce 2 · Reservas recibidas por un anfitrión (Gabriela, id_usuario = 1) → pantalla 08 Reservas recibidas
-- Esperado (3 filas): 1 Cabaña del Lago · Sofía Herrera · 3 noches · CONFIRMADA
--                     3 Depto Centro · Valentina Ríos · 2 noches · CANCELADA
--                     5 Cabaña del Lago · Tomás Acuña · 2 noches · CONFIRMADA
-- SELECT r.id_reserva, a.nombre AS alojamiento,
--        CONCAT(u.nombre, ' ', u.apellido) AS huesped,
--        r.fecha_check_in, r.fecha_check_out,
--        DATEDIFF(r.fecha_check_out, r.fecha_check_in) AS noches,
--        r.cantidad_huespedes, r.importe_total, r.estado, r.solicitud_especial
-- FROM reserva r
-- JOIN alojamiento a ON a.id_alojamiento = r.id_alojamiento
-- JOIN usuario u     ON u.id_usuario     = r.id_usuario
-- WHERE a.id_usuario_anfitrion = 1
-- ORDER BY r.fecha_check_in;

-- Cruce 3 · ¿Está libre? Alojamiento 1, check-in 08/11, check-out 14/11 → pantallas 03 Detalle y 07 Calendario
-- Esperado (3 filas = NO está libre): la reserva del 06/11 al 09/11 y los bloqueos del 12/11 y 13/11.
-- Con check-in '2026-11-15' y check-out '2026-11-18' devuelve 0 filas: está libre.
-- SELECT 'reserva' AS motivo, r.fecha_check_in AS desde, r.fecha_check_out AS hasta
-- FROM reserva r
-- WHERE r.id_alojamiento = 1
--   AND r.estado = 'CONFIRMADA'
--   AND r.fecha_check_in  < '2026-11-14'
--   AND r.fecha_check_out > '2026-11-08'
-- UNION ALL
-- SELECT CONCAT('bloqueo: ', b.motivo), b.fecha, b.fecha
-- FROM bloqueo_disponibilidad b
-- WHERE b.id_alojamiento = 1
--   AND b.fecha >= '2026-11-08'
--   AND b.fecha <  '2026-11-14';

-- Cruce 4 · Los servicios de un alojamiento (Casa de las Sierras, id 3) → pantallas 03 Detalle y 06 Mis propiedades
-- Esperado: Acepta mascotas, Cochera, Pileta, Wifi.
-- SELECT s.id_servicio, s.nombre
-- FROM alojamiento_servicio aserv
-- JOIN servicio s ON s.id_servicio = aserv.id_servicio
-- WHERE aserv.id_alojamiento = 3
-- ORDER BY s.nombre;

SELECT
    id_alojamiento,
    nombre,
    id_ciudad,
    id_usuario_anfitrion
FROM pp1_reservas.alojamiento
ORDER BY id_alojamiento;

SELECT
    id_alojamiento,
    nombre,
    precio_por_noche,
    capacidad,
    publicado
FROM pp1_reservas.alojamiento
WHERE publicado = TRUE
ORDER BY id_alojamiento;