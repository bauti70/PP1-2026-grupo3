const tarjetas = document.querySelectorAll('.tarjeta-reserva-anfitrion');
const selectorMostrar = document.getElementById('ordenar');
const textoNotificacion = document.querySelector('.caja-notificacion p');
const mensajeVacio = document.querySelector('.reservas-vacio');

const ESTADOS = {
    pendiente: { clase: 'estado-pendiente', icono: 'fa-clock', texto: 'Pendiente de aprobación' },
    activa: { clase: 'estado-activa', icono: 'fa-circle-check', texto: 'Activa / Confirmada' },
    cancelada: { clase: 'estado-cancelada', icono: 'fa-circle-xmark', texto: 'Cancelada' }
};


// ---------- Estado de cada reserva ----------

function obtenerEstado(tarjeta) {
    const badge = tarjeta.querySelector('.badge-estado');

    if (badge.classList.contains('estado-pendiente')) {
        return 'pendiente';
    }
    if (badge.classList.contains('estado-activa')) {
        return 'activa';
    }
    return 'cancelada';
}

function cambiarEstado(tarjeta, nuevoEstado) {
    const badge = tarjeta.querySelector('.badge-estado');
    const datos = ESTADOS[nuevoEstado];

    badge.className = 'badge-estado ' + datos.clase;
    badge.innerHTML = '<i class="fa-solid ' + datos.icono + '" aria-hidden="true"></i> ' + datos.texto;

    // Solo el estilo del botón: relleno si está viva, contorno si está cancelada
    const botonContacto = tarjeta.querySelector('.btn-contacto');
    if (nuevoEstado === 'cancelada') {
        botonContacto.classList.add('btn-contacto-contorno');
    } else {
        botonContacto.classList.remove('btn-contacto-contorno');
    }

    actualizarNotificacion();
    aplicarFiltro();
}


// ---------- Aviso de solicitudes pendientes ----------

function actualizarNotificacion() {
    let pendientes = 0;

    for (let i = 0; i < tarjetas.length; i = i + 1) {
        if (obtenerEstado(tarjetas[i]) === 'pendiente') {
            pendientes = pendientes + 1;
        }
    }

    if (pendientes === 0) {
        textoNotificacion.innerHTML = 'No tenés solicitudes pendientes.';
    } else if (pendientes === 1) {
        textoNotificacion.innerHTML = 'Tenés <strong>1 solicitud pendiente</strong> por responder.';
    } else {
        textoNotificacion.innerHTML = 'Tenés <strong>' + pendientes + ' solicitudes pendientes</strong> por responder.';
    }
}


// ---------- Filtro "Mostrar" ----------

function aplicarFiltro() {
    const filtro = selectorMostrar.value;
    let visibles = 0;

    for (let i = 0; i < tarjetas.length; i = i + 1) {
        const estado = obtenerEstado(tarjetas[i]);
        let mostrar = true;

        if (filtro === 'pendientes') {
            mostrar = estado === 'pendiente';
        } else if (filtro === 'confirmadas') {
            mostrar = estado === 'activa';
        } else if (filtro === 'canceladas') {
            mostrar = estado === 'cancelada';
        }

        if (mostrar) {
            tarjetas[i].style.display = '';
            visibles = visibles + 1;
        } else {
            tarjetas[i].style.display = 'none';
        }
    }

    mensajeVacio.hidden = visibles > 0;
}

selectorMostrar.addEventListener('change', aplicarFiltro);


// ---------- Menú de los tres puntos ----------

function cerrarMenus() {
    const menus = document.querySelectorAll('.menu-opciones');
    const botones = document.querySelectorAll('.btn-opciones');

    for (let i = 0; i < menus.length; i = i + 1) {
        menus[i].hidden = true;
    }
    for (let i = 0; i < botones.length; i = i + 1) {
        botones[i].setAttribute('aria-expanded', 'false');
    }
}

function armarMenu(tarjeta, menu) {
    const estado = obtenerEstado(tarjeta);

    if (estado === 'pendiente') {
        menu.innerHTML =
            '<button type="button" data-accion="aceptar">Aceptar reserva</button>' +
            '<button type="button" data-accion="rechazar" class="opcion-peligro">Rechazar solicitud</button>';
    } else if (estado === 'activa') {
        menu.innerHTML =
            '<button type="button" data-accion="cancelar" class="opcion-peligro">Cancelar reserva</button>';
    } else {
        menu.innerHTML = '<p>Sin acciones disponibles</p>';
    }
}

document.addEventListener('click', function(e) {
    const botonOpciones = e.target.closest('.btn-opciones');
    const botonAccion = e.target.closest('.menu-opciones button');

    // Abrir o cerrar el menú de una reserva
    if (botonOpciones) {
        const tarjeta = botonOpciones.closest('.tarjeta-reserva-anfitrion');
        const menu = tarjeta.querySelector('.menu-opciones');
        const estabaAbierto = !menu.hidden;

        cerrarMenus();

        if (!estabaAbierto) {
            armarMenu(tarjeta, menu);
            menu.hidden = false;
            botonOpciones.setAttribute('aria-expanded', 'true');
        }
        return;
    }

    // Elegir una acción del menú
    if (botonAccion) {
        const tarjeta = botonAccion.closest('.tarjeta-reserva-anfitrion');
        const nombre = tarjeta.querySelector('.nombre-propiedad').textContent.trim();
        const accion = botonAccion.dataset.accion;

        if (accion === 'aceptar') {
            cambiarEstado(tarjeta, 'activa');
        } else if (accion === 'rechazar') {
            if (confirm('¿Querés rechazar la solicitud de "' + nombre + '"?')) {
                cambiarEstado(tarjeta, 'cancelada');
            }
        } else if (accion === 'cancelar') {
            if (confirm('¿Querés cancelar la reserva de "' + nombre + '"?')) {
                cambiarEstado(tarjeta, 'cancelada');
            }
        }

        cerrarMenus();
        return;
    }

    // Click en cualquier otro lado: cerrar menús
    cerrarMenus();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarMenus();
    }
});


// ---------- Al cargar la página ----------

actualizarNotificacion();
aplicarFiltro();