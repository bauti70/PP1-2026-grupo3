const formBusqueda = document.querySelector('#form-busqueda-inicio');
const inputBusqueda = document.querySelector('#input-busqueda');
const errorBusqueda = document.querySelector('#error-busqueda');
const listaDestacados = document.querySelector('#lista-destacados');
const enlaceLogin = document.querySelector('#enlace-login');

let alojamientosInicio = [];


function mostrarEstado(texto, tipo, contenedor) {
    contenedor.innerHTML = `<p class="mensaje-inicio ${tipo}">${texto}</p>`;
}


function crearTarjetaInicio(alojamiento) {
    const idActual = obtenerIdAlojamientoActual(alojamiento.nombre);
    let descripcion = `Alojamiento en ${alojamiento.ubicacion} para hasta ${alojamiento.capacidad} personas.`;
    let calificacionHtml = '';

    if (typeof alojamiento.descripcion === 'string' && alojamiento.descripcion !== '') {
        descripcion = alojamiento.descripcion;
    }

    if (typeof alojamiento.calificacion === 'number' && alojamiento.calificacion >= 0 && alojamiento.calificacion <= 5) {
        calificacionHtml = `<p class="destino-calificacion"><i class="fa-solid fa-star" aria-hidden="true"></i> ${alojamiento.calificacion} / 5</p>`;
    }

    return `
        <a href="detallepropiedad.html?id=${idActual}" class="destino-item">
            <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">

            <div class="destino-info">
                <h3>${alojamiento.nombre}</h3>
                <p class="destino-ubicacion">${alojamiento.ubicacion}</p>
                ${calificacionHtml}
                <p class="destino-descripcion">${descripcion}</p>
                <p class="destino-capacidad">Hasta ${alojamiento.capacidad} huéspedes</p>
            </div>
        </a>
    `;
}


function mostrarDestacados() {
    let html = '';
    let cantidadDestacados = 0;

    for (let i = 0; i < alojamientosInicio.length; i = i + 1) {
        const alojamiento = alojamientosInicio[i];

        if (obtenerIdAlojamientoActual(alojamiento.nombre) !== null && typeof alojamiento.calificacion === 'number' && alojamiento.calificacion >= 4.5 && alojamiento.calificacion <= 5) {
            html = html + crearTarjetaInicio(alojamiento);
            cantidadDestacados = cantidadDestacados + 1;
        }
    }

    if (alojamientosInicio.length === 0) {
        mostrarEstado('Todavía no hay alojamientos cargados.', 'vacio', listaDestacados);
    } else if (cantidadDestacados === 0) {
        mostrarEstado('No hay alojamientos disponibles.', 'vacio', listaDestacados);
    } else {
        listaDestacados.innerHTML = html;
    }
}

async function cargarDatosInicio() {
    mostrarEstado('Cargando alojamientos destacados...', 'cargando', listaDestacados);

    try {
        const respuesta = await fetch('data/alojamientos.json');

        if (respuesta.ok === false) {
            throw new Error('No se pudo leer el archivo de alojamientos.');
        }

        alojamientosInicio = await respuesta.json();

        mostrarDestacados();
    } catch (error) {
        mostrarEstado('No pudimos cargar los alojamientos destacados. Recargá la página para volver a intentar.', 'error', listaDestacados);
        console.error(error);
    }
}

formBusqueda.addEventListener('submit', function(evento) {
    errorBusqueda.textContent = '';

    let hayError = false;
    let tieneTexto = false;
    const ciudad = inputBusqueda.value;

    for (let i = 0; i < ciudad.length; i = i + 1) {
        if (ciudad[i] !== ' ' && ciudad[i] !== '\t' && ciudad[i] !== '\n' && ciudad[i] !== '\r') {
            tieneTexto = true;
        }
    }

    if (tieneTexto === false) {
        errorBusqueda.textContent = 'Escribí una ciudad para buscar alojamientos.';
        hayError = true;
    }

    if (hayError === true) {
        evento.preventDefault();
        return;
    }
});


inputBusqueda.addEventListener('input', function() {
    errorBusqueda.textContent = '';
});


enlaceLogin.addEventListener('click', function() {
    localStorage.setItem('volverA', 'index.html');
});


cargarDatosInicio();

(function mostrarRolUsuario() {
    const etiqueta = document.querySelector('#etiqueta-rol');
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const rol = localStorage.getItem('rolUsuario');

    if (!etiqueta) {
        return;
    }

    if (sesionIniciada === 'true' && rol === 'HUESPED') {
        etiqueta.textContent = 'Huésped';
        etiqueta.hidden = false;
    } else if (sesionIniciada === 'true' && rol === 'ANFITRION') {
        etiqueta.textContent = 'Anfitrión';
        etiqueta.hidden = false;
    } else {
        etiqueta.hidden = true;
    }
})();

(function mostrarNombreUsuario() {
    const etiquetaNombre = document.querySelector('#nombre-usuario');
    const nombre = localStorage.getItem('nombreUsuario');
    const sesionIniciada = localStorage.getItem('sesionIniciada');

    if (!etiquetaNombre) {
        return;
    }

    if (sesionIniciada === 'true' && nombre && nombre !== 'undefined') {
        etiquetaNombre.textContent = nombre;
        etiquetaNombre.hidden = false;
    } else {
        etiquetaNombre.hidden = true;
    }
})();