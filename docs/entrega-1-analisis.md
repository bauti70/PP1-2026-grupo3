# Entrega 1 — Análisis del Sistema

**Grupo**: [Grupo 3]  
**Proyecto**: [Sistema de reserva de alojamiento]  
**Fecha de entrega**: 30/04/2026

---

## 1. Identificación de Actores

| Actor | Rol / Función en el sistema | Tipo (usuario final, sistema externo, etc.) |
|-------|-----------------------------|---------------------------------------------|
|Anfitrion       | Publica propiedades, gestiona disponibilidad, acepta o rechaza reservas, obtiene ingresos | Usuario final|
|Huesped         | Busca alojamientos, filtra por criterios y realiza reservas | Usuario final |  
|Administrador del sistema | Gestiona los usuarios y configura servicios del sistema  | Usuario interno |
    
## 2. Requisitos Funcionales

| ID    | Descripción | Actor | HU relacionada |
|-------|-------------|-------|----------------|
| RF-01 |             |       |                |
| RF-02 |             |       |                |

> Cada requisito debe describir una acción concreta: "El sistema debe permitir que [actor] [acción]..."

## 3. Requisitos No Funcionales

| ID     | Categoría (rendimiento, seguridad, usabilidad, etc.) | Descripción |
|--------|------------------------------------------------------|-------------|
| RNF-01 | Usabilidad  | El sistema debe ser claro e intuitivo, permitiendo que un usuario nuevo pueda completar una reserva en un maximo de 3 pasos|
| RNF-02 | Usabilidad | El sistema debe ser accesible desde los principales navegadores web en el 100% de los casos | 
| RNF-03 | Usabilidad | El sistema debe permitir a los huespedes realizar o modificar una reserva en un tiempo maximo de 2 minutos | 
| RNF-04 | Rendimiento | El sistema debe mostrar la disponibilidad y  confirmacion de alojamientos en un maximo de 2 segundos|
| RNF-05 | Rendimiento | El sistema debe evitar la sobreventa de alojamientos, garantizando un 0% de reservas duplicadas para una misma propiedad en el mismo periodo |
| RNF-06 | Rendimiento  | El sistema debe procesar las reservas en una tasa menor al 1% de errores o inconsistencias | 
| RNF-07 | Seguridad | El sistema debe requerir un metodo de autenticacion en el 100% de los accesos a funcionalidades privadas |
| RNF-08 | Seguridad | El sistema debe garantizar una consistencia de los datos en el 100% de las operaciones de reserva | 
| RNF-09 | Seguridad | El sistema debe restringir el acceso a funcionalidades segun el rol del usuario en el 100% de los casos | 

## 4. Historias de Usuario

| ID    | Como...       | Quiero...                  | Para...                            |
|-------|---------------|----------------------------|------------------------------------|
| HU-01 | Huesped | Gestionar mi perfil personal   | Mantener mis datos actualizados dentro de la plataforma   |
| HU-02 | Huesped | Explorar propiedades disponibles                        | Encontrar alojamientos que se ajusten a mis necesidades |
| HU-03 | Huesped | Filtrar propiedades por ubicacion, fechas y precio | Acotar los resultados y tomar una decision mas rapida |
| HU-04 | Huesped | Realizar una reserva | Asegurar mi estadia en las fechas que necesito|
| HU-05 | Huesped | Modificar una reserva | Adaptar mi estadia si mis planes cambian |
| HU-06 | Huesped | Cancelar una reserva | Liberarme del compromiso si ya no puedo viajar |
| HU-07 | Huesped | Ver el historial de mis reservas | Consultar mis estadias anteriores y actuales |
| HU-08 | Huesped | Recibir notificaciones sobre cambios en mis reservas | Mantenerme informado sin revisar constantemente el sistema |
| HU-09 | Anfitrion | Gestionar mi perfil personal | Mantener mis datos actualizados dentro de la plataforma |
| HU-10 | Anfitrion | Publicar una nueva propiedad | Ofrecer alojamiento a potenciales huespedes |
| HU-11 | Anfitrion | Editar la informacion de mis propiedades | Mantener los datos actualizados y correctos |
| HU-12 | Anfitrion | Eliminar una propiedad | retirarla del sistema cuando ya no este disponible | 
| HU-13 | Anfitrion | Gestionar la disponibilidad de mis propiedades | Controlar las fechas disponibles y evitar conflictos de reserva
| HU-14 | Anfitrion | Aprobar o rechazar solicitudes de reserva | Decidir quien puede hospedarse en mi propiedad |
| HU-15 | Anfitrion | Recibir notificaciones de nuevas reservas o cambios de estado | Responder rapidamente |
| HU-16 | Administrador | Gestionar usuarios y roles | Mantener el orden y la seguridad del sistema |
| HU-17 | Administrador | Gestionar el catalogo de servicios disponibles | Definir las comodidades que pueden ofrecer los anfitriones |
| HU-18 | Administrador | Monitorear errores del sistema | Detectar fallas y mantener la plataforma funcionando correctamente |
| HU-19 | Administrador | Configurar parametros globales del sistema | Adaptar reglas y restricciones de la plataforma |

## 5. Diagrama de Casos de Uso

> Insertar imagen del diagrama exportado desde Draw.io, Lucidchart, StarUML o similar.  
> Guardar la imagen en esta misma carpeta (`docs/`) y referenciarla abajo.

![Diagrama de Casos de Uso](./diagrama-casos-de-uso.png)

## 6. Especificación de Casos de Uso

### CU-01 — [Nombre del caso de uso]

| Campo | Detalle |
|---|---|
| **Actor principal** | |
| **Descripción** | |
| **Precondiciones** | |
| **Postcondiciones (criterios de aceptación)** | |

| Secuencia Normal (Camino feliz) | Excepciones / Alternativas |
|---|---|
| 1.  |  |
| 2.  |  |
| 3.  |  |

---

> Repetir la ficha completa para cada caso de uso del diagrama.
> Las excepciones se numeran ligadas al paso del que se desvían (ej: 4.1 en la misma fila que el paso 4).
