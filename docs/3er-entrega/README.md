# Entrega 3 — Frontend Codificado

**Grupo**: [Nombre del grupo]
**Proyecto**: [Nombre del proyecto elegido]
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
| 5 · Rol administrativo | | | | |

> Las capacidades 1 a 4 son fijas. La 5 la elige el grupo entre las pantallas del rol administrativo, y se justifica abajo.

## 2. Archivos de datos

Los JSON que alimentan las pantallas. **Un archivo por entidad** — cada uno equivale a un futuro endpoint del backend.

| Archivo | Entidad del modelo de datos | Cuántos ítems | Qué pantalla lo consume |
|---------|------------------------------|---------------|--------------------------|
| `data/alojamientos` |- |6 |catalogo-filtro |
| `data/vacio` |- |0 |ninguna (de prueba para probar errores) |

> Los nombres de campo salen del **modelo de datos** entregado por la cátedra, en camelCase y con `id` en cada objeto. No se inventan.

## 3. Decisiones del grupo

**Organización de los archivos JS**: ¿un `.js` por pantalla o uno compartido? ¿Por qué?
uno por pantallas para grandes cosas, faltan algunos pero los estamos desarrollando. nos enfocamos en las 5 mas importantes para esta entrega

> [Completar]

**Pantalla del rol administrativo elegida**: ¿cuál, qué capacidad se le dio y por qué tiene sentido para el CU que materializa?
tomamos la pantalla de crear cuenta para que el usuario antes de registrarse a la página se le diera la opción de seleccionar que rol desea cumplir en nuestra página con una breve descripción de su funcionamiento. se decidió de esta manera para dar mayor rapidez y no tener que crear una página nueva
> [Completar]

**Otras decisiones**: cualquier cosa resuelta distinto de lo pedido, con su justificación.

> [Completar]

## 4. Uso de IA

**Política del bloque: asistido.** Está permitido consultar errores de consola, pedir explicaciones y debuggear código propio. No está permitido generar una funcionalidad completa por prompt y pegarla.

**Declararlo no baja la nota. No declararlo y que la defensa lo evidencie, sí.**

| En qué se usó | Para qué | Herramienta |
|---------------|----------|-------------|
|nav-bar |ayudar a redondear en css |chatgpt |
|catalogo.js|ayuda a buscar errores|chatgpt |

> Recordá que la defensa individual tiene **piso**: si da menos de 4, la nota final no supera 5, por más que el trabajo del grupo esté impecable. Si hay algo de tu repo que no entendés, preguntá **antes** del 03/09.

## 5. Checklist antes de entregar

- [ ] Las capacidades funcionan **servidas con Live Server**
- [ ] La consola no tira errores al cargar ninguna pantalla
- [ ] Agregar un ítem al JSON lo hace aparecer sin tocar el HTML
- [ ] El estado vacío y el de error se pueden **provocar en vivo**
- [ ] El guardado vive en su **propia función**, no suelto en el listener
- [ ] Los nombres de campo coinciden con el modelo de datos
- [ ] Están todas las pantallas del sistema, incluidas las del receso
- [ ] Las tablas de arriba están completas
- [ ] Cada integrante puede explicar **cualquier parte** del código

> La consigna completa está en [`consigna.md`](./consigna.md) y los criterios de evaluación en [`rubrica.md`](./rubrica.md).
