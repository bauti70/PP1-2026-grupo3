# Entrega 3 — Frontend Codificado

**Grupo**: [Grupo 3]
**Proyecto**: [Sistema de reservas de alojamientos]
**Fecha de entrega**: 03/09/2026

---

## 1. Tabla de capacidades

Dónde vive cada capacidad JavaScript y qué caso de uso materializa. Los CU son los de tu Entrega 1, con los IDs que les puso tu grupo.

| Capacidad | Pantalla | Archivo JS | CU(s) | Qué hace |
|-----------|----------|------------|-------|----------|
| 1 · Login validado |login.html |login.js |cu-11 |verifica que no falte ningun dato y que no este en blanco o que falte algun signo importante |
| 2 · Listado desde datos |catalogo-filtro.html |catalogo.js |cu-12 |Obtiene alojamientos desde JSON y genera dinámicamente el listado de propiedades. |
| 3 · Acción del usuario |detallepropiedad.html |detallepropiedad.js, toastr.min.js,jquery.min.js|cu-13 |Permite completar y validar una reserva y agregarla a la lista de reservas. |
| 4 · Estados de interfaz |catalogo-filtro.html |catalogo.js |cu-14 |Gestiona estados de carga, contenido, ausencia de datos, errores, validaciones y confirmaciones. |
| 5 · Rol administrativo | mispropiedades.html | mispropiedades.js | CU-01 | Reutiliza el JSON de alojamientos para dibujar el panel del Anfitrion, aplicando los tres estados visuales (Cargando, Vacio, Error). |

> Las capacidades 1 a 4 son fijas. La 5 la elige el grupo entre las pantallas del rol administrativo, y se justifica abajo.

## 2. Archivos de datos

Los JSON que alimentan las pantallas. **Un archivo por entidad** — cada uno equivale a un futuro endpoint del backend.

| Archivo | Entidad del modelo de datos | Cuántos ítems | Qué pantalla lo consume |
|---------|------------------------------|---------------|--------------------------|
| `data/alojamientos.json` |Alojamientos |6 |catalogo-filtro.html y mispropiedades.html |
| `data/vacio.json` |- |0 |ninguna (de prueba para probar errores) |

> Los nombres de campo salen del **modelo de datos** entregado por la cátedra, en camelCase y con `id` en cada objeto. No se inventan.

## 3. Decisiones del grupo

**Organización de los archivos JS**: ¿un `.js` por pantalla o uno compartido? ¿Por qué?
Uno por pantallas para grandes cosas, faltan algunos pero los estamos desarrollando. nos enfocamos en las 5 mas importantes para esta entrega

> [Completar]

**Pantalla del rol administrativo elegida**: ¿cuál, qué capacidad se le dio y por qué tiene sentido para el CU que materializa?
Elegimos la pantalla de "Mis Propiedades". Le aplicamos las capacidades de renderizado de listas y estados de interfaz (Capacidades 2 y 4). Tiene sentido para nuestro CU-01 porque el anfitrión necesita ver el estado actual de las propiedades que tiene publicadas, y reciclar el JSON del catálogo nos permitió demostrar que entendemos cómo los mismos datos se presentan distinto según el rol del usuario.
> [Completar]

**Otras decisiones**: cualquier cosa resuelta distinto de lo pedido, con su justificación.
- Utilizamos fuentes externas para poder crear un sistema de notificacion para cuando el usuario ya confirme su reserva usando toastr
-Para las validaciones de texto (como buscar el "@" o el "." en el login), decidimos no utilizar expresiones regulares (Regex) complejas ni métodos avanzados como "includes()". Optamos por usar variables booleanas y bucles "for" tradicionales, manteniéndonos estrictamente dentro de los fundamentos teóricos lógicos vistos en la materia. Además, para la Capacidad 3, configuramos el código para que limpie el arreglo en memoria antes de guardar, mostrando solo la última reserva a modo de comprobante para mejorar la experiencia de usuario.
> [Completar]

## 4. Uso de IA

**Política del bloque: asistido.** Está permitido consultar errores de consola, pedir explicaciones y debuggear código propio. No está permitido generar una funcionalidad completa por prompt y pegarla.

**Declararlo no baja la nota. No declararlo y que la defensa lo evidencie, sí.**

| En qué se usó | Para qué | Herramienta |
|---------------|----------|-------------|
| nav-bar |ayudar a redondear en css |chatgpt |
| catalogo.js|ayuda a buscar errores|chatgpt |
| catalogo.js y mispropiedades.js | Comprensión de la estructura de "async / await" para el manejo de los tres estados del "fetch" | Gemini |
| detallepropiedad.js | Ayuda para estructurar la validación de fechas (salida mayor a entrada) | Gemini |
| detallepropiedad.js | Se utilizo para ayudar a colocar el sistema de notificacion para el guardado de reservas | Gemini
| organizacion de errores | Se uso para poder estructurar mejor los mensajes de errores especificos en cada campo | Gemini
> Recordá que la defensa individual tiene **piso**: si da menos de 4, la nota final no supera 5, por más que el trabajo del grupo esté impecable. Si hay algo de tu repo que no entendés, preguntá **antes** del 03/09.

## 5. Checklist antes de entregar

- [X] Las capacidades funcionan **servidas con Live Server**
- [X] La consola no tira errores al cargar ninguna pantalla
- [X] Agregar un ítem al JSON lo hace aparecer sin tocar el HTML
- [X] El estado vacío y el de error se pueden **provocar en vivo**
- [X] El guardado vive en su **propia función**, no suelto en el listener
- [X] Los nombres de campo coinciden con el modelo de datos
- [X] Están todas las pantallas del sistema, incluidas las del receso
- [X] Las tablas de arriba están completas
- [X] Cada integrante puede explicar **cualquier parte** del código

> La consigna completa está en [`consigna.md`](./consigna.md) y los criterios de evaluación en [`rubrica.md`](./rubrica.md).
