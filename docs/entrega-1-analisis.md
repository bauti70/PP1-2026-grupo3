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
| RF-01 |    Debe poder publicar su propiedad y horarios        | Anfitrion     | HU-01               |
| RF-02 |   Debe poder filtrar y hacer reservas de las propiedades publicadas        |  Huesped     |  HU-02              |
| RF-03 |    cargar cada dato y reserva tanto de Huesped como de Anfitrion         | Administrador de sistema      |         HU-03       |

> Cada requisito debe describir una acción concreta: "El sistema debe permitir que [actor] [acción]..."

## 3. Requisitos No Funcionales

| ID     | Categoría (rendimiento, seguridad, usabilidad, etc.) | Descripción |
|--------|------------------------------------------------------|-------------|
| RNF-01 | Usabilidad  | El sistema debe ser claro, intuitivo y seguro para el usuario |
| RNF-02 | Usabilidad | El sistema debe ser accesible desde navegadores web | 
| RNF-03 | Usabilidad | El sistema debe facilitar a los huespedes la reserva y modificacion de estadias segun su disponibilidad | 
| RNF-04 | Rendimiento | El sistema debe mostrar la disponibilidad y y confirmacion de alojamientos en pocos segundos |
| RNF-05 | Rendimiento | El sistema debe evitar la sobreventa de alojamientos |
| RNF-06 | Rendimiento  | El sistema debe procesar las reservas sin errores ni inconsistencias | 
| RNF-07 | Seguridad | El sistema debe contar con un metodo de autenticacion para proteger la informacion de los usuarios |
| RNF-08 | Seguridad | El sistema debe garantizar una consistencia inmediata de los datos | 
| RNF-09 | Seguridad | El sistema debe permitir que cada usuario acceda solo a la funcionalidad que le corresponde | 

## 4. Historias de Usuario

| ID    | Como...       | Quiero...                  | Para...                            |
|-------|---------------|----------------------------|------------------------------------|
| HU-01 | Anfitrion   | Publicar propiedades que tengan disponibilidad.    | Obtener ingresos economicos.   |
| HU-02 | Huesped              | Buscar alojamiento.                           | Realizar la reserva. |
| HU-03 | Administrador del sistema | Gestionar y configurar el sistema de reservas. | Mantener estable el sistema sin errores. 

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
