//console.log('funciona');
const reservas = [];

let alojamientoSeleccionado = null;

const infoPropiedad = document.querySelector('.info-propiedad');
const columnaReserva = document.querySelector('.columna-reserva');
const formReserva = document.querySelector('#form-reserva');
const botonReservar = document.querySelector('.btn-confirmar');


function crearDetalle(alojamiento) {
    let descripcion = `Alojamiento en ${alojamiento.ubicacion} para hasta ${alojamiento.capacidad} personas.`;
    let calificacionHtml = '';

    if (typeof alojamiento.descripcion === 'string' && alojamiento.descripcion !== '') {
        descripcion = alojamiento.descripcion;
    }

    if (typeof alojamiento.calificacion === 'number' && alojamiento.calificacion >= 0 && alojamiento.calificacion <= 5) {
        calificacionHtml = `<p class="texto-secundario"><i class="fa-solid fa-star" aria-hidden="true"></i> ${alojamiento.calificacion} / 5</p>`;
    }

    return `
        <div class="galeria-fotos galeria-una-foto">
            <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}" class="foto-principal">
        </div>

        <div class="encabezado-info">
            <h1>${alojamiento.nombre}</h1>
            <button type="button" class="btn-favorito" aria-label="Agregar a favoritos">
                <i class="fa-regular fa-heart" aria-hidden="true"></i>
            </button>
        </div>

        <p class="texto-secundario">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            ${alojamiento.ubicacion}
        </p>

        ${calificacionHtml}

        <div class="contenedor-etiquetas">
            <span class="etiqueta">
                <i class="fa-regular fa-user" aria-hidden="true"></i>
                Hasta ${alojamiento.capacidad} personas
            </span>
        </div>

        <p class="descripcion-texto">${descripcion}</p>
    `;
}


async function cargarDetalle() {
    alojamientoSeleccionado = null;
    columnaReserva.hidden = true;
    botonReservar.disabled = true;

    infoPropiedad.innerHTML = '<p class="mensaje-detalle">Cargando alojamiento...</p>';

    const parametros = new URLSearchParams(window.location.search);
    const idRecibido = parametros.get('id');

    let idBuscado = 1;

    if (idRecibido !== null) {
        idBuscado = Number(idRecibido);
    }

    try {
        const respuesta = await fetch('data/alojamientos.json');

        if (respuesta.ok === false) {
            throw new Error('No se pudo cargar el archivo de alojamientos.');
        }

        const alojamientos = await respuesta.json();

        for (let i = 0; i < alojamientos.length; i = i + 1) {
            if (alojamientos[i].id === idBuscado) {
                alojamientoSeleccionado = alojamientos[i];
                break;
            }
        }

        if (alojamientoSeleccionado === null) {
            infoPropiedad.innerHTML = '<p class="mensaje-detalle">El alojamiento solicitado no está disponible.</p>';
            return;
        }

        infoPropiedad.innerHTML = crearDetalle(alojamientoSeleccionado);

        document.querySelector('.precio-encabezado h2').textContent = '$' + alojamientoSeleccionado.precioNoche;
        document.querySelector('#huespedes').max = alojamientoSeleccionado.capacidad;
        document.title = alojamientoSeleccionado.nombre + ' - Detalle';

        botonReservar.disabled = false;
        columnaReserva.hidden = false;
    } catch (error) {
        alojamientoSeleccionado = null;

        infoPropiedad.innerHTML = '<p class="mensaje-detalle error">No pudimos cargar el alojamiento. Recargá la página para volver a intentar.</p>';
        console.error(error);
    }
}


function formatearFecha(fecha) {
    const partes = fecha.split('-');
    return partes[2] + '-' + partes[1] + '-' + partes[0];
}


function crearItemReserva(reserva) {
    return `
        <article class="reserva-propiedad">
            <h2>${reserva.alojamiento}</h2>
            <p>Fecha de llegada: ${formatearFecha(reserva.fechaEntrada)} hasta ${formatearFecha(reserva.fechaSalida)}</p>
            <p><strong>Huéspedes:</strong> ${reserva.huespedes} | <strong>Estado:</strong> ${reserva.estado}</p>
        </article>
    `;
}


function renderReservas(lista) {
    const contenedor = document.querySelector('#lista-reservas');
    let html = '';

    for (let i = 0; i < lista.length; i = i + 1) {
        html = html + crearItemReserva(lista[i]);
    }

    contenedor.innerHTML = html;
}


async function guardarReserva(reserva) {
    reservas.length = 0;
    reservas.push(reserva);
}


formReserva.addEventListener('submit', async function(evento) {
    evento.preventDefault();

    if (alojamientoSeleccionado === null) {
        return;
    }

    const sesion = localStorage.getItem('sesionIniciada');
    const mensajeBloqueo = document.querySelector('#mensaje-bloqueo');

    if (sesion !== 'true') {
        mensajeBloqueo.style.display = 'block';
        return;
    }

    mensajeBloqueo.style.display = 'none';

    const fechaEntrada = document.querySelector('#llegada').value;
    const fechaSalida = document.querySelector('#salida').value;
    const huespedes = Number(document.querySelector('#huespedes').value);

    const msjLlegada = document.querySelector('#error-llegada');
    const msjSalida = document.querySelector('#error-salida');
    const msjHuespedes = document.querySelector('#error-huespedes');

    msjLlegada.textContent = '';
    msjSalida.textContent = '';
    msjHuespedes.textContent = '';

    let hayError = false;

    if (fechaEntrada === '') {
        msjLlegada.textContent = 'Por favor, ingresá una fecha de llegada.';
        hayError = true;
    }

    if (fechaSalida === '') {
        msjSalida.textContent = 'Por favor, ingresá una fecha de salida.';
        hayError = true;
    }

    if (fechaEntrada !== '' && fechaSalida !== '' && fechaSalida <= fechaEntrada) {
        msjSalida.textContent = 'La salida debe ser posterior a la llegada.';
        hayError = true;
    }

    if (huespedes < 1 || huespedes > alojamientoSeleccionado.capacidad || huespedes % 1 !== 0) {
        msjHuespedes.textContent = 'Ingresá una cantidad entera de huéspedes entre 1 y ' + alojamientoSeleccionado.capacidad + '.';
        hayError = true;
    }

    if (hayError === true) {
        return;
    }

    const reserva = {
        id: reservas.length + 1,
        alojamientoId: alojamientoSeleccionado.id,
        alojamiento: alojamientoSeleccionado.nombre,
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida,
        huespedes: huespedes,
        estado: 'CONFIRMADA'
    };

    await guardarReserva(reserva);
    renderReservas(reservas);
    formReserva.reset();

    if (typeof toastr !== 'undefined') {
        toastr.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-bottom-right',
            timeOut: '4000'
        };

        toastr.success('¡Tu reserva fue procesada con éxito!', 'Reserva confirmada');
    }
});


cargarDetalle();