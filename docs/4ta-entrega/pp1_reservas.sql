-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: pp1_reservas
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alojamiento`
--

DROP TABLE IF EXISTS `alojamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alojamiento` (
  `id_alojamiento` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio_por_noche` decimal(10,2) NOT NULL,
  `capacidad` int(11) NOT NULL,
  `tipo` varchar(60) NOT NULL,
  `publicado` tinyint(1) NOT NULL,
  `id_ciudad` bigint(20) NOT NULL,
  `id_usuario_anfitrion` bigint(20) NOT NULL,
  PRIMARY KEY (`id_alojamiento`),
  KEY `fk_alojamiento_ciudad` (`id_ciudad`),
  KEY `fk_alojamiento_usuario` (`id_usuario_anfitrion`),
  CONSTRAINT `fk_alojamiento_ciudad` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`),
  CONSTRAINT `fk_alojamiento_usuario` FOREIGN KEY (`id_usuario_anfitrion`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alojamiento`
--

LOCK TABLES `alojamiento` WRITE;
/*!40000 ALTER TABLE `alojamiento` DISABLE KEYS */;
INSERT INTO `alojamiento` VALUES (1,'Cabaña del Lago','A 200 m de la costa del lago','assets/img/cabania-lago.jpg',45000.00,4,'cabaña',0,3,1),(2,'Depto Centro','Monoambiente luminoso a dos cuadras de la peatonal','assets/img/depto-centro.jpg',30000.00,2,'departamento',0,1,1),(3,'Casa de las Sierras','Casa con parque y pileta, a 5 km del lago','assets/img/casa-sierras.jpg',60000.00,6,'casa',0,2,2),(4,'Loft Rambla','Frente al mar, con balcón','assets/img/loft-rambla.jpg',52000.00,3,'departamento',0,1,2),(5,'Cabaña Los Coihues','En refacción: vuelve en diciembre','assets/img/coihues.jpg',40000.00,5,'cabaña',0,3,1),(6,'Depto Bodegas','Cerca de los caminos del vino','assets/img/depto-bodegas.jpg',38000.00,4,'departamento',0,4,2),(7,'Apartamento vista al rio','Apartamento con vista al río en Palermo, ideal para una estadía en Buenos Aires.','../docs/2da-entrega/imagenes_referencia/Apartamento vista al río.webp',225000.00,2,'Apartamento',1,5,1),(8,'Casa en la montaña','Casa para descansar en Bariloche y disfrutar de una escapada a la montaña.','../docs/2da-entrega/imagenes_referencia/Casa en la montaña.jpg',15000.00,4,'Casa',1,3,1),(9,'Departamento Centrico','Departamento céntrico para conocer Mendoza durante una escapada en pareja.','../docs/2da-entrega/imagenes_referencia/Departamento Céntrico.jpg',8000.00,2,'Apartamento',1,4,1),(10,'Cabaña en el lago','Cabaña para una estadía tranquila en El Durazno, Córdoba.','../docs/2da-entrega/imagenes_referencia/Cabaña en el lago.jpg',12500.00,3,'Cabaña',1,6,2),(11,'Cabaña en el bosque','Cabaña en Bariloche con capacidad para seis personas, pensada para compartir en familia o con amigos.','../docs/2da-entrega/imagenes_referencia/Cabaña en Bariloche.jpg',24000.00,6,'Cabaña',1,3,2),(12,'Selina Salta','Alojamiento en Salta Capital para recorrer la ciudad y disfrutar de una escapada al norte.','../docs/2da-entrega/imagenes_referencia/selina-salta.webp',10000.00,2,'Alojamiento',1,7,2),(14,'Cabaña Rancho Pampa','Cabaña rodeada de naturaleza, ideal para descansar y disfrutar de una escapada en La Pampa.','../docs/2da-entrega/imagenes_referencia/cabaña-pampa.webp',30000.00,4,'Cabaña',1,8,1);
/*!40000 ALTER TABLE `alojamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alojamiento_servicio`
--

DROP TABLE IF EXISTS `alojamiento_servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alojamiento_servicio` (
  `id_alojamiento_servicio` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_alojamiento` bigint(20) NOT NULL,
  `id_servicio` bigint(20) NOT NULL,
  PRIMARY KEY (`id_alojamiento_servicio`),
  KEY `fk_alojamiento_servicio_alojamiento` (`id_alojamiento`),
  KEY `fk_alojamiento_servicio_servicio` (`id_servicio`),
  CONSTRAINT `fk_alojamiento_servicio_alojamiento` FOREIGN KEY (`id_alojamiento`) REFERENCES `alojamiento` (`id_alojamiento`),
  CONSTRAINT `fk_alojamiento_servicio_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alojamiento_servicio`
--

LOCK TABLES `alojamiento_servicio` WRITE;
/*!40000 ALTER TABLE `alojamiento_servicio` DISABLE KEYS */;
INSERT INTO `alojamiento_servicio` VALUES (1,1,1),(2,1,2),(3,1,5),(4,2,1),(5,2,4),(6,3,1),(7,3,2),(8,3,3),(9,3,5),(10,4,1),(11,4,4),(12,5,2),(13,6,1),(14,6,2),(15,14,1),(16,14,2),(18,8,1),(19,8,2),(20,8,6),(21,11,1),(22,11,2),(23,11,3),(24,11,6),(25,9,1),(26,7,1),(27,7,2),(28,7,3),(29,10,2),(30,10,3),(31,10,6),(32,12,1),(33,12,6);
/*!40000 ALTER TABLE `alojamiento_servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloqueo_disponibilidad`
--

DROP TABLE IF EXISTS `bloqueo_disponibilidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloqueo_disponibilidad` (
  `id_bloqueo` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_alojamiento` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id_bloqueo`),
  UNIQUE KEY `uk_bloqueo_disponibilidad_alojamiento_fecha` (`id_alojamiento`,`fecha`),
  CONSTRAINT `fk_bloqueo_disponibilidad_alojamiento` FOREIGN KEY (`id_alojamiento`) REFERENCES `alojamiento` (`id_alojamiento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloqueo_disponibilidad`
--

LOCK TABLES `bloqueo_disponibilidad` WRITE;
/*!40000 ALTER TABLE `bloqueo_disponibilidad` DISABLE KEYS */;
INSERT INTO `bloqueo_disponibilidad` VALUES (1,1,'2026-11-12','Mantenimiento de la caldera'),(2,1,'2026-11-13','Mantenimiento de la caldera'),(3,3,'2026-11-27','Uso propio'),(4,3,'2026-11-28','Uso propio'),(5,2,'2026-12-24','Nochebuena: no se alquila');
/*!40000 ALTER TABLE `bloqueo_disponibilidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciudad` (
  `id_ciudad` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `provincia` varchar(80) NOT NULL,
  PRIMARY KEY (`id_ciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (1,'Mar del Plata','Buenos Aires'),(2,'Villa Carlos Paz','Córdoba'),(3,'San Carlos de Bariloche','Río Negro'),(4,'Mendoza','Mendoza'),(5,'Buenos Aires','Ciudad Autónoma de Buenos Aires'),(6,'El Durazno','Córdoba'),(7,'Salta Capital','Salta'),(8,'Santa Rosa','La Pampa');
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificacion` (
  `id_notificacion` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint(20) NOT NULL,
  `fecha_envio` datetime NOT NULL,
  `asunto` varchar(150) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificacion_usuario` (`id_usuario`),
  CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,3,'2026-10-20 18:40:00','Reserva confirmada','Tu reserva en Cabaña del Lago del 06/11 al 09/11 quedó confirmada.');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva`
--

DROP TABLE IF EXISTS `reserva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reserva` (
  `id_reserva` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_alojamiento` bigint(20) NOT NULL,
  `id_usuario` bigint(20) NOT NULL,
  `fecha_check_in` date NOT NULL,
  `fecha_check_out` date NOT NULL,
  `cantidad_huespedes` int(11) NOT NULL,
  `importe_total` decimal(10,2) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `solicitud_especial` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `fk_reserva_alojamiento` (`id_alojamiento`),
  KEY `fk_reserva_usuario` (`id_usuario`),
  CONSTRAINT `fk_reserva_alojamiento` FOREIGN KEY (`id_alojamiento`) REFERENCES `alojamiento` (`id_alojamiento`),
  CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `ck_reserva_estado` CHECK (`estado` in ('CONFIRMADA','CANCELADA'))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva`
--

LOCK TABLES `reserva` WRITE;
/*!40000 ALTER TABLE `reserva` DISABLE KEYS */;
INSERT INTO `reserva` VALUES (1,1,3,'2026-11-06','2026-11-09',3,135000.00,'CONFIRMADA','Llegamos tarde, cerca de las 23'),(2,3,4,'2026-12-26','2027-01-02',5,420000.00,'CONFIRMADA',NULL),(3,2,5,'2026-11-13','2026-11-15',2,60000.00,'CANCELADA',NULL),(4,4,3,'2026-12-04','2026-12-08',2,208000.00,'CONFIRMADA','Necesitamos una cuna para bebé'),(5,1,4,'2026-11-20','2026-11-22',4,90000.00,'CONFIRMADA',NULL),(6,1,3,'2026-12-10','2026-12-12',2,90000.00,'CONFIRMADA',NULL);
/*!40000 ALTER TABLE `reserva` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicio` (
  `id_servicio` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (1,'Wifi'),(2,'Cochera'),(3,'Pileta'),(4,'Aire acondicionado'),(5,'Acepta mascotas'),(6,'Desayuno');
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(60) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `rol` varchar(20) NOT NULL,
  `activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuario_correo` (`correo`),
  CONSTRAINT `ck_usuario_rol` CHECK (`rol` in ('HUESPED','ANFITRION'))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Gabriela','Paz','gabriela.paz@correo.com.ar','cambiar123','294 452-3311','ANFITRION',1),(2,'Ricardo','Ibáñez','ricardo.ibanez@correo.com.ar','cambiar123','351 678-2200','ANFITRION',1),(3,'Sofía','Herrera','sofia.herrera@correo.com.ar','cambiar123','11 4789-1020','HUESPED',1),(4,'Tomás','Acuña','tomas.acuna@correo.com.ar','cambiar123',NULL,'HUESPED',1),(5,'Valentina','Ríos','valentina.rios@correo.com.ar','cambiar123','221 455-7788','HUESPED',1),(6,'Usuario','Prueba','usuario.prueba.2026@example.com','pbkdf2$120000$nsmk9DH8ImXpE6VbdSEIHg==$vpLV13IV2VyoH3pHVz+qTGqCaJie7IDVlaVtxpLtIoI=','123456789','HUESPED',1),(7,'mauro','gonzales','mauro@gmail.com','pbkdf2$120000$xFE6GkPcyevmkdJqbqQtKQ==$2NCpnxAsCF44yn64Fhf3tdg7oXwWidAdwTJHN2mE0OQ=',NULL,'HUESPED',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-12  3:44:16


DESCRIBE bloqueo_disponibilidad;
DESCRIBE pp1_reservas.bloqueo_disponibilidad;

INSERT INTO pp1_reservas.bloqueo_disponibilidad
(id_alojamiento, fecha, motivo)
VALUES
(7, '2026-11-21', 'PRUEBA_FILTRO_FECHAS');

DELETE FROM pp1_reservas.bloqueo_disponibilidad
WHERE id_alojamiento = 7
  AND fecha = '2026-11-21'
  AND motivo = 'PRUEBA_FILTRO_FECHAS';