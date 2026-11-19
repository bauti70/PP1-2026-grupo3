const reservas = [];

let alojamientoSeleccionado = null;

const infoPropiedad = document.querySelector('.info-propiedad');
const columnaReserva = document.querySelector('.columna-reserva');
const formReserva = document.querySelector('#form-reserva');
const botonReservar = document.querySelector('.btn-confirmar');
const inputLlegada = document.querySelector('#llegada');
const inputSalida = document.querySelector('#salida');
const inputHuespedes = document.querySelector('#huespedes');
const seccionTotal = document.querySelector('#seccion-total');
const tarifaTexto = document.querySelector('#tarifa-texto');
const totalValor = document.querySelector('#total-valor');

const SERVICIOS = {
    wifi: { texto: 'WiFi', icono: 'fa-solid fa-wifi' },
    desayuno: { texto: 'Desayuno', icono: 'fa-solid fa-mug-hot' },
    pileta: { texto: 'Pileta', icono: 'fa-solid fa-person-swimming' },
    estacionamiento: { texto: 'Estacionamiento', icono: 'fa-solid fa-square-parking' }
};




function escapar(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatearPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-AR');
}

function pluralizar(cantidad, singular, plural) {
    return cantidad + ' ' + (cantidad === 1 ? singular : plural);
}

function aISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return fecha.getFullYear() + '-' + mes + '-' + dia;
}

function fechaHoyISO() {
    return aISO(new Date());
}

function sumarDias(iso, dias) {
    const partes = iso.split('-').map(Number);
    return aISO(new Date(partes[0], partes[1] - 1, partes[2] + dias));
}

function calcularNoches(llegada, salida) {
    const a = llegada.split('-').map(Number);
    const b = salida.split('-').map(Number);
    const diferencia = Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2]);
    return Math.round(diferencia / 86400000);
}

function formatearFecha(fecha) {
    const partes = fecha.split('-');
    return partes[2] + '-' + partes[1] + '-' + partes[0];
}




function leerFavoritos() {
    try {
        const lista = JSON.parse(localStorage.getItem('favoritos'));
        return Array.isArray(lista) ? lista : [];
    } catch (error) {
        return [];
    }
}

function esFavorito(id) {
    return leerFavoritos().indexOf(id) !== -1;
}

function alternarFavorito(id) {
    const lista = leerFavoritos();
    const posicion = lista.indexOf(id);

    if (posicion === -1) {
        lista.push(id);
    } else {
        lista.splice(posicion, 1);
    }

    try {
        localStorage.setItem('favoritos', JSON.stringify(lista));
    } catch (error) {
        
    }

    return posicion === -1;
}

function iniciarFavorito() {
    const boton = infoPropiedad.querySelector('.btn-favorito');

    if (boton === null) {
        return;
    }

    const icono = boton.querySelector('i');

    boton.addEventListener('click', function () {
        const activo = alternarFavorito(alojamientoSeleccionado.id);

        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', String(activo));
        icono.className = (activo ? 'fa-solid' : 'fa-regular') + ' fa-heart';
    });
}




function obtenerImagenes(alojamiento) {
    const lista = [];

    if (Array.isArray(alojamiento.imagenes)) {
        for (let i = 0; i < alojamiento.imagenes.length; i = i + 1) {
            if (typeof alojamiento.imagenes[i] === 'string' && alojamiento.imagenes[i] !== '') {
                lista.push(alojamiento.imagenes[i]);
            }
        }
    }

    if (lista.length === 0 && typeof alojamiento.imagen === 'string' && alojamiento.imagen !== '') {
        lista.push(alojamiento.imagen);
    }

    return lista;
}

function crearCarrusel(imagenes, nombre) {
    if (imagenes.length === 0) {
        return '<div class="galeria-fotos galeria-una-foto"><div class="carrusel-vacio">Sin fotos disponibles</div></div>';
    }

    let slides = '';
    let miniaturas = '';

    for (let i = 0; i < imagenes.length; i = i + 1) {
        const carga = i === 0 ? '' : ' loading="lazy"';
        const activa = i === 0 ? ' carrusel-miniatura-activa' : '';

        slides = slides + `
            <div class="carrusel-slide">
                <img class="foto-principal" src="${escapar(imagenes[i])}" alt="${escapar(nombre)} - foto ${i + 1} de ${imagenes.length}"${carga}>
            </div>
        `;

        miniaturas = miniaturas + `
            <button type="button" class="carrusel-miniatura${activa}" data-indice="${i}" aria-label="Ver foto ${i + 1}">
                <img src="${escapar(imagenes[i])}" alt="" loading="lazy">
            </button>
        `;
    }

    if (imagenes.length === 1) {
        return `
            <div class="galeria-fotos galeria-una-foto">
                <div class="carrusel">
                    <div class="carrusel-ventana">
                        <div class="carrusel-pista">${slides}</div>
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="galeria-fotos">
            <div class="carrusel" role="region" aria-roledescription="carrusel" aria-label="Fotos de ${escapar(nombre)}" tabindex="0">
                <div class="carrusel-ventana">
                    <div class="carrusel-pista">${slides}</div>
                </div>

                <button type="button" class="carrusel-btn carrusel-prev" aria-label="Foto anterior">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button type="button" class="carrusel-btn carrusel-next" aria-label="Foto siguiente">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>

                <span class="carrusel-contador" aria-live="polite">1 / ${imagenes.length}</span>
            </div>

            <div class="fotos-secundarias">${miniaturas}</div>
        </div>
    `;
}

function iniciarCarrusel() {
    const carrusel = infoPropiedad.querySelector('.carrusel');

    if (carrusel === null) {
        return;
    }

    const slides = carrusel.querySelectorAll('.carrusel-slide');
    const total = slides.length;

    if (total < 2) {
        return;
    }

    const pista = carrusel.querySelector('.carrusel-pista');
    const botonAnterior = carrusel.querySelector('.carrusel-prev');
    const botonSiguiente = carrusel.querySelector('.carrusel-next');
    const contador = carrusel.querySelector('.carrusel-contador');
    const miniaturas = infoPropiedad.querySelectorAll('.carrusel-miniatura');

    let actual = 0;

    function mostrar(indice) {
        actual = (indice + total) % total;

        pista.style.transform = 'translateX(-' + (actual * 100) + '%)';
        contador.textContent = (actual + 1) + ' / ' + total;

        for (let i = 0; i < miniaturas.length; i = i + 1) {
            miniaturas[i].classList.toggle('carrusel-miniatura-activa', i === actual);
        }

        miniaturas[actual].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }

    botonAnterior.addEventListener('click', function () {
        mostrar(actual - 1);
    });

    botonSiguiente.addEventListener('click', function () {
        mostrar(actual + 1);
    });

    for (let i = 0; i < miniaturas.length; i = i + 1) {
        miniaturas[i].addEventListener('click', function () {
            mostrar(Number(miniaturas[i].dataset.indice));
        });
    }

    carrusel.addEventListener('keydown', function (evento) {
        if (evento.key === 'ArrowLeft') {
            evento.preventDefault();
            mostrar(actual - 1);
        } else if (evento.key === 'ArrowRight') {
            evento.preventDefault();
            mostrar(actual + 1);
        }
    });

    let inicioX = 0;

    carrusel.addEventListener('touchstart', function (evento) {
        inicioX = evento.changedTouches[0].clientX;
    }, { passive: true });

    carrusel.addEventListener('touchend', function (evento) {
        const diferencia = evento.changedTouches[0].clientX - inicioX;

        if (diferencia > 50) {
            mostrar(actual - 1);
        } else if (diferencia < -50) {
            mostrar(actual + 1);
        }
    }, { passive: true });
}




function crearEtiquetas(alojamiento) {
    let html = '';

    if (typeof alojamiento.tipo === 'string' && alojamiento.tipo !== '') {
        html = html + `
            <span class="etiqueta">
                <i class="fa-solid fa-house" aria-hidden="true"></i>
                ${escapar(alojamiento.tipo)}
            </span>
        `;
    }

    html = html + `
        <span class="etiqueta">
            <i class="fa-regular fa-user" aria-hidden="true"></i>
            Hasta ${escapar(alojamiento.capacidad)} personas
        </span>
    `;

    if (Number.isInteger(alojamiento.habitaciones) && alojamiento.habitaciones > 0) {
        html = html + `
            <span class="etiqueta">
                <i class="fa-solid fa-bed" aria-hidden="true"></i>
                ${pluralizar(alojamiento.habitaciones, 'habitación', 'habitaciones')}
            </span>
        `;
    }

    if (Number.isInteger(alojamiento.banos) && alojamiento.banos > 0) {
        html = html + `
            <span class="etiqueta">
                <i class="fa-solid fa-bath" aria-hidden="true"></i>
                ${pluralizar(alojamiento.banos, 'baño', 'baños')}
            </span>
        `;
    }

    if (alojamiento.servicios !== null && typeof alojamiento.servicios === 'object') {
        const claves = Object.keys(alojamiento.servicios);
        for (let i = 0; i < claves.length; i = i + 1) {
            if (alojamiento.servicios[claves[i]] !== true) {
                continue;
            }

            let servicio = SERVICIOS[claves[i]];
            if (servicio === undefined) {
                servicio = { texto: claves[i].charAt(0).toUpperCase() + claves[i].slice(1), icono: 'fa-solid fa-check' };
            }
            html = html + `
                <span class="etiqueta">
                    <i class="${servicio.icono}" aria-hidden="true"></i>
                    ${escapar(servicio.texto)}
                </span>
            `;
        }
    }

    return html;
}

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
            ${crearEtiquetas(alojamiento)}
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
  const respuesta = await fetch(
        `http://${window.location.hostname}:8080/api/reservas`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                idAlojamiento: reserva.alojamientoId,
                idUsuario: Number(localStorage.getItem('idUsuario')),
                fechaCheckIn: reserva.fechaEntrada,
                fechaCheckOut: reserva.fechaSalida,
                cantidadHuespedes: reserva.huespedes,
                solicitudEspecial: null
            })
        }
    );

    if (!respuesta.ok) {

        const mensajes = {
            400: 'Los datos de la reserva no son válidos.',
            401: 'Debés iniciar sesión.',
            403: 'No tenés permiso para reservar este alojamiento.',
            409: 'El alojamiento no está disponible para esas fechas.'
        };

        throw new Error(
            mensajes[respuesta.status] || 'No se pudo realizar la reserva.'
        );
    }

    const reservaGuardada = await respuesta.json();

    reservas.push({
        ...reserva,
        id: reservaGuardada.id,
        estado: reservaGuardada.estado
    });
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

        if (botonReservar.disabled) {
    return;
}

botonReservar.disabled = true;

    try {
        await guardarReserva(reserva);
    } catch (error) {
        if (typeof toastr !== 'undefined') {
            toastr.error(error.message);
        } else {
            alert(error.message);
        }
        return;
    } finally {
        botonReservar.disabled = false;
    }

    if (document.querySelector('#lista-reservas')) {
        renderReservas(reservas);
    }
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
