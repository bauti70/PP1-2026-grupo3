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
    let resenas = '';

    if (Number.isInteger(alojamiento.resenas) && alojamiento.resenas >= 0) {
        resenas = ' (' + pluralizar(alojamiento.resenas, 'reseña', 'reseñas') + ')';
    }

    calificacionHtml = `<p class="detalle-calificacion"><i class="fa-solid fa-star" aria-hidden="true"></i> ${alojamiento.calificacion} / 5${resenas}</p>`;
}

    const favorito = esFavorito(alojamiento.id);

    return `
        ${crearCarrusel(obtenerImagenes(alojamiento), alojamiento.nombre)}

        <div class="encabezado-info">
            <h1>${escapar(alojamiento.nombre)}</h1>
            <button type="button" class="btn-favorito${favorito ? ' activo' : ''}" aria-label="Agregar a favoritos" aria-pressed="${favorito}">
                <i class="${favorito ? 'fa-solid' : 'fa-regular'} fa-heart" aria-hidden="true"></i>
            </button>
        </div>

        <p class="texto-secundario">
            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
            ${escapar(alojamiento.ubicacion)}
        </p>

        ${calificacionHtml}

        <div class="contenedor-etiquetas">
            <span class="etiqueta">
                <i class="fa-regular fa-user" aria-hidden="true"></i>
                Hasta ${alojamiento.capacidad} personas
            </span>
        </div>

        <p class="descripcion-texto">${escapar(descripcion)}</p>
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
        const respuesta = await fetch('http://localhost:8080/api/alojamientos/' + idBuscado);

        if (respuesta.ok === false) {
            throw new Error('No se pudo cargar el archivo de alojamientos.');
        }

        
        const datosApi = await respuesta.json();
        const calificacionesInicio = await cargarCalificacionesInicio();

        const ciudades = {
            1: 'Mar del Plata',
            2: 'Villa Carlos Paz',
            3: 'San Carlos de Bariloche',
            4: 'Mendoza',
            5: 'Buenos Aires',
            6: 'El Durazno',
            7: 'Salta Capital',
            8: 'Santa Rosa'
        };

        alojamientoSeleccionado = {
            ...datosApi,
            precioNoche: datosApi.precioPorNoche,
            ubicacion: ciudades[datosApi.idCiudad] || 'Ubicación pendiente',
            imagen: datosApi.id === 1
                ? 'assents/img/cabana-bariloche.jpg'
                : datosApi.imagen.replace('assets/', 'assents/'),
            calificacion: obtenerCalificacionAlojamiento(datosApi, calificacionesInicio)
        };


        if (alojamientoSeleccionado === null) {
            infoPropiedad.innerHTML = '<p class="mensaje-detalle">El alojamiento solicitado no está disponible.</p>';
            return;
        }

        infoPropiedad.innerHTML = crearDetalle(alojamientoSeleccionado);
        iniciarCarrusel();
        iniciarFavorito();

        const hoy = fechaHoyISO();

        document.querySelector('.precio-encabezado h2').textContent = formatearPrecio(alojamientoSeleccionado.precioNoche);
        inputHuespedes.max = alojamientoSeleccionado.capacidad;
        inputHuespedes.placeholder = 'Máx. ' + alojamientoSeleccionado.capacidad;
        inputLlegada.min = hoy;
        inputSalida.min = sumarDias(hoy, 1);
        document.title = alojamientoSeleccionado.nombre + ' - Detalle';

        botonReservar.disabled = false;
        columnaReserva.hidden = false;
    } catch (error) {
        alojamientoSeleccionado = null;

        infoPropiedad.innerHTML = '<p class="mensaje-detalle error">No pudimos cargar el alojamiento. Recargá la página para volver a intentar.</p>';
        console.error(error);
    }
}




function actualizarTotal() {
    if (alojamientoSeleccionado === null || seccionTotal === null) {
        return;
    }

    const llegada = inputLlegada.value;
    const salida = inputSalida.value;

    if (llegada === '' || salida === '' || salida <= llegada) {
        seccionTotal.hidden = true;
        return;
    }

    const noches = calcularNoches(llegada, salida);
    const precio = Number(alojamientoSeleccionado.precioNoche);

    tarifaTexto.textContent = formatearPrecio(precio) + ' x ' + pluralizar(noches, 'noche', 'noches');
    totalValor.textContent = formatearPrecio(precio * noches);
    seccionTotal.hidden = false;
}

inputLlegada.addEventListener('change', function () {
    if (inputLlegada.value !== '') {
        inputSalida.min = sumarDias(inputLlegada.value, 1);
    }

    actualizarTotal();
});

inputSalida.addEventListener('change', actualizarTotal);




function crearItemReserva(reserva) {
    return `
        <article class="reserva-propiedad">
            <h2>${escapar(reserva.alojamiento)}</h2>
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
    reservas.push(reserva);
}


formReserva.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    if (alojamientoSeleccionado === null) {
        return;
    }

    const sesion = localStorage.getItem('sesionIniciada');
    const mensajeBloqueo = document.querySelector('#mensaje-bloqueo');

    if (sesion !== 'true') {
        mensajeBloqueo.hidden = false;
        mensajeBloqueo.style.display = 'block';
        return;
    }

    mensajeBloqueo.hidden = true;
    mensajeBloqueo.style.display = 'none';

    const fechaEntrada = inputLlegada.value;
    const fechaSalida = inputSalida.value;
    const huespedes = Number(inputHuespedes.value);

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
    } else if (fechaEntrada < fechaHoyISO()) {
        msjLlegada.textContent = 'La llegada no puede ser una fecha pasada.';
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
    actualizarTotal();

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
