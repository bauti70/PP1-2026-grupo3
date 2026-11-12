# Cuarta entrega — Sistema de Reservas

**Grupo**: [Grupo 3]
**Proyecto**: [Sistema de reservas de alojamientos]
**Fecha de entrega**: 12/11/2026

## 1. Descripción

Sistema web de reservas de alojamientos desarrollado con HTML, CSS y JavaScript en el frontend, Spring Boot en el backend y MariaDB como base de datos.

## 2. Módulos implementados

| Módulo | Funcionalidad | Estado |
|---|---|---|
| M1 | Registro de usuarios e inicio de sesión con validación de credenciales en la base de datos | Probado mediante Postman |
| M2 | Listado de alojamientos publicados y filtros por ciudad, precio y capacidad | Probado |
| M3 | Visualización del detalle de un alojamiento seleccionado, incluyendo sus servicios | Probado |

La base de datos contiene 7 alojamientos publicados y 8 ciudades.

Las pruebas principales se realizaron desde el frontend y mediante peticiones HTTP en Postman. El registro y el inicio de sesión fueron comprobados mediante sus endpoints.

## 3. Tecnologías utilizadas

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** Java 17, Spring Boot y Maven.
- **Persistencia:** Spring Data JPA / Hibernate y consultas mediante JDBC.
- **Base de datos:** MariaDB.
- **Pruebas de API:** Postman.

## 4. Estructura del proyecto

- `backend/`: aplicación Spring Boot, archivo `pom.xml` y código Java.
- `frontend/`: páginas HTML, estilos, scripts e imágenes.
- `docs/4ta-entrega/`: documentación, respaldo SQL y colección de Postman.
- `docs/2da-entrega/imagenes_referencia/`: imágenes utilizadas por los alojamientos.

## 5. Cómo ejecutar el proyecto

### Base de datos

1. Iniciar MariaDB.
2. Crear una base de datos llamada `pp1_reservas`.
3. Importar el archivo `docs/4ta-entrega/pp1_reservas.sql`, que contiene la estructura y los datos de prueba.
4. Verificar la configuración de conexión en `backend/src/main/resources/application.properties`.
5. Configurar las credenciales de base de datos necesarias en el entorno local.

El respaldo SQL incluye las ocho tablas del sistema, los alojamientos, las ciudades, los servicios, sus relaciones y los registros de prueba.

**Importante:** la importación debe realizarse sobre una base de datos de prueba, ya que el respaldo puede reemplazar tablas existentes.

La aplicación utiliza validación del esquema de base de datos mediante Hibernate, por lo que las tablas deben existir antes de iniciar el backend.

### Backend

1. Abrir la carpeta `backend/` en IntelliJ IDEA.
2. Cargar el proyecto Maven.
3. Verificar que esté configurado Java 17.
4. Ejecutar la clase `ReservasApplication.java`.
5. Comprobar que el servidor se inicie en `http://localhost:8080`.

### Frontend

1. Abrir la carpeta del proyecto en VS Code.
2. Iniciar el backend y la base de datos.
3. Abrir las páginas HTML del directorio `frontend/` mediante Live Server.
4. Utilizar las pantallas de registro e inicio de sesión.
5. Navegar al catálogo para buscar alojamientos y acceder a sus detalles.

## 6. Endpoints utilizados

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/registro` | Registra un nuevo usuario huésped. |
| POST | `/api/login` | Valida las credenciales de acceso. |
| GET | `/api/alojamientos` | Devuelve los alojamientos publicados. |
| GET | `/api/alojamientos/{id}` | Devuelve el detalle de un alojamiento y sus servicios. |

### Adaptación de datos entre backend y frontend

El frontend adapta algunos campos recibidos desde la API:

- `precioPorNoche` se utiliza como `precioNoche` en las páginas.
- `idCiudad` se transforma en un nombre de ciudad mediante una correspondencia definida en JavaScript.
- Las rutas de imágenes se adaptan cuando es necesario para utilizar los archivos disponibles en el proyecto.
- Los servicios de cada alojamiento se obtienen desde la API y se muestran en las páginas correspondientes.

### Registro de usuarios

El endpoint `/api/registro` recibe nombre, apellido, correo electrónico, contraseña y teléfono opcional.

Los usuarios registrados mediante este endpoint se guardan con el rol `HUESPED`. Las contraseñas de las cuentas nuevas se almacenan utilizando PBKDF2.

La opción de registro como anfitrión todavía no está implementada en el backend.

## 7. Pruebas con Postman

La colección se encuentra en:

`docs/4ta-entrega/PP1-Grupo3-Entrega4.postman_collection.json`

Incluye las siguientes pruebas:

- **M1 - Crear cuenta:** respuesta `201 Created` cuando se registra un correo nuevo. Si el correo ya existe, devuelve `409 Conflict`.
- **M1 - Login incorrecto:** respuesta `401 Unauthorized`.
- **M1 - Login correcto:** respuesta `200 OK`.
- **M2 - Listar alojamientos:** respuesta `200 OK` con 7 alojamientos publicados.
- **M3 - Detalle alojamiento:** respuesta `200 OK` con los datos del alojamiento solicitado.

Las peticiones que requieren contraseña de prueba utilizan la variable de Postman `{{clavePrueba}}`. Su valor debe configurarse localmente y no está incluido en la colección exportada.

Para repetir la prueba de registro exitoso es necesario utilizar un correo electrónico nuevo.

## 8. Uso de inteligencia artificial

Se utilizó ChatGPT como herramienta de apoyo durante el desarrollo para comprender errores, orientar la implementación de endpoints en Spring Boot, integrar el frontend con la API, organizar archivos y preparar pruebas con Postman.

El código y los resultados fueron revisados y probados durante el trabajo práctico. La herramienta se utilizó como asistencia y no como reemplazo de las verificaciones del proyecto.