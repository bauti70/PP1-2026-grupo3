# Entrega 2 — Diseño de Interfaces 
**Grupo**: [Grupo 3] 
**Proyecto**: [Sistema de reservas de alojamiento] 
**Fecha de entrega**: 25/06/2026 --- 


```markdown
```markdown
## 1. Inventario de pantallas troncales
| N° | Nombre | Actor principal | CU(s) cubierto(s) | Función (1 frase) |
|----|--------|-----------------|-------------------|-------------------|
| 01 | Login | Huésped / Anfitrión / Administrador del sistema| - | Permite al usuario autenticarse para acceder al sistema |
| 02 | Catálogo con filtros | Huésped | CU-03, CU-04 | Permite al huésped explorar y filtrar propiedades disponibles |
| 03 | Detalle de propiedad | Huésped | CU-05 (+ hallazgo: CU-08 no aplica a este actor) | Permite al huésped consultar el detalle de una propiedad y confirmar una reserva |
| 04 | Mis reservas | Huésped | - (hallazgo: sin CU de ver/modificar/cancelar reserva en E1) | Permite al huésped ver el listado de sus reservas y contactar al anfitrión |
| 05 | Publicar propiedad | Anfitrión | CU-01 | Permite al anfitrión cargar una nueva propiedad disponible al sistema |

```


```markdown
## 2. Trazabilidad pantalla ↔ E1

| Pantalla | CU(s) | HU(s) | Actor |
|----------|-------|-------|-------|
| 01 — Login | - | HU-01, HU-09, HU-16 | Huésped, Anfitrión, Administrador del sistema |
| 02 — Catálogo con filtros | CU-03, CU-04 | HU-02, HU-03 | Huésped |
| 03 — Detalle de propiedad | CU-05 (hallazgo: sin CU de "consultar disponibilidad" para el Huésped) | HU-04 | Huésped |
| 04 — Mis reservas | - (hallazgo: modificar/cancelar reservas no posee CU específico en E1) | HU-05 | Huésped |
| 05 — Publicar propiedad | CU-01 | HU-10 | Anfitrión |

```


## 3. Decisiones técnicas y observaciones 
2026-05-14
> Documentar acá las decisiones de diseño y desarrollo del grupo, organizadas por 
>   Pantalla de login
Se implementó una pantalla de inicio de sesion basica con campos de email y contraseña para representar el acceso seguro al sistema segun los requisitos no funcionales de seguridad.
>   Uso de HTML
Se utilizo HTML para crear la estructura basica de las paginas y representar las funcionalidades principales del sistema.
>   Organizacion del proyecto
Se separaron los archivos dentro de la carpeta frontend para mantener una estructura ordenada y facilitar el mantenimiento del sistema.
>   Prototipado temprano
Se realizaron mockups y pantallas iniciales para visualizar la experiencia del usuario antes de avanzar al desarrollo completo.
> Diseño del login CSS
Se opto por tomar referencias de la pagina Booking para el diseño de nuestro login, un estilo simple para que el usuario a la hora de ingresar sus datos solo ponga lo mas importante.

> Esta sección es clave para la defensa oral del 25/06. 
## 3. Decisiones técnicas y observaciones

### Decisiones generales
- Se utilizó HTML para estructurar el contenido de las pantallas y representar las funcionalidades principales del sistema.
- Se utilizó CSS para el diseño visual y la distribución de los elementos de la interfaz.
- Se organizaron los archivos dentro de la carpeta frontend para mantener una estructura ordenada y facilitar el mantenimiento del sistema.
- Se realizaron wireframes y prototipos en Excalidraw y Figma antes de comenzar la implementación.
- Se tomaron referencias de Booking para lograr una interfaz simple y fácil de usar.

### Pantalla 01 — Login
- El diseño es simple y centrado, con un formulario de acceso al sistema.
- Tiene un header con el título del sistema, campos de email y contraseña, botón de ingresar y enlace de recuperación de contraseña.
- El diseño se basó en referencias de Booking para que el usuario se concentre únicamente en los datos necesarios para acceder.
- Cubre el acceso seguro al sistema según el RNF-07.

### Pantalla 02 — Catálogo con filtros
- Disposición con filtros a la izquierda y propiedades a la derecha utilizando CSS Grid.
- Los filtros incluyen ubicación, fechas, servicios y rango de precio.
- Las propiedades se muestran en una grilla con imagen, ubicación, precio y botón "Ver detalles".
- Se decidió no incluir paginación ni ordenamiento porque los datos utilizados son de ejemplo.
- Cubre el CU-03 "Buscar alojamiento" y el CU-04 "Filtrar por criterios".

### Pantalla 03 — Detalle de propiedad
- La información de la propiedad se muestra junto al formulario de reserva.
- Se incluyen imágenes, ubicación, valoración, comodidades y descripción.
- El formulario de reserva permanece visible para facilitar la acción principal de la pantalla.
- Se decidió no incluir galería ampliada ni funcionalidades adicionales para mantener la simplicidad del prototipo.
- Cubre el CU-05 "Realizar reserva".
- La propiedad mostrada mantiene coherencia con las propiedades presentadas en el catálogo.

### Pantalla 04 — Mis reservas
- Permite al huésped visualizar y gestionar sus reservas.
- Se muestran los datos principales de cada reserva para facilitar su consulta.
- Se priorizó una interfaz simple y ordenada.
- Se documentó como hallazgo que modificar y cancelar reservas no poseen un caso de uso específico en la Entrega 1.

### Pantalla 05 — Publicar propiedad
- Esta pantalla es utilizada por el Anfitrión y se diferencia de las demás porque permite gestionar propiedades en lugar de realizar reservas.
- El formulario se organiza en grupos de campos para facilitar la carga de información.
- Se agregaron servicios mediante checkboxes y carga de imágenes.
- Se decidió no incluir un mapa para seleccionar la ubicación en esta etapa.
- Se mantiene coherencia con el resto del sistema al publicar una propiedad destinada a aparecer posteriormente en el catálogo de alojamientos.
- Cubre el CU-01 "Publicar propiedad disponible".
  
### Pantalla Registro - Liviana
-Le permite al usuario como puerta de entrada al sistema de reservas poder insertar sus datos y crearse una cuenta.
-Se decidio dividir por lados los datos ingresados y del otro seleccionar el rol que el usuario quiera tomar.
-Al seleccionar el rol se le da una breve informacion de lo que va a poder hacer en la pagina.
-Tomamos en cuenta que si el usuario ya esta registrado pueda acceder al Inicio de Sesion (login) mediante un link. 
-Creamos un boton de "Crear Cuenta" que valide los datos y finalizar el flujo.

### Pantalla  — Reservas recibidas
- Diseñada para la vista del Anfitrión, permitiéndole gestionar las solicitudes pendientes de sus alojamientos.
- Mantiene la estructura alineada con los bocetos iniciales: incluye barra de filtros superior ("Más recientes") y notificación de solicitudes pendientes.
- Las solicitudes se organizan en tarjetas individuales que destacan la propiedad ("Apartamento vista al río"), datos del huésped, fechas de estadía, noches y monto total.
- Se agregaron botones de acción directa con código de colores claro (**Aprobar reserva** en verde y **Rechazar** en rojo) para facilitar la toma de decisiones rápidas.
- Cubre el CU-09 "Gestionar reservas recibidas".

### Uso de IA
- Se utilizó IA para consultas puntuales relacionadas con la organización del README y dudas sobre HTML y CSS.
