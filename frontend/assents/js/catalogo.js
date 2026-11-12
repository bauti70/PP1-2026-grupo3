

const formBusqueda = document.querySelector('#form-busqueda-header');
const inputBusqueda = document.querySelector('#busqueda-header');
const errorBusqueda = document.querySelector('#error-busqueda-header');
const formFiltros = document.querySelector('#form-filtros');
const inputUbicacion = document.querySelector('#ubi');
const inputEntrada = document.querySelector('#entrada');
const inputSalida = document.querySelector('#sali');
const inputHuespedes = document.querySelector('#huespedes');
const inputPrecioMin = document.querySelector('#min');
const inputPrecioMax = document.querySelector('#max');
const checkWifi = document.querySelector('#wifi');
const checkDesayuno = document.querySelector('#des');
const checkPileta = document.querySelector('#pile');
const checkEstacionamiento = document.querySelector('#miento');
const selectTipo = document.querySelector('#tipo-alojamiento');
const selectOrden = document.querySelector('#orden-alojamientos');
const errorFechas = document.querySelector('#error-fechas');
const errorPrecios = document.querySelector('#error-precios');
const errorHuespedes = document.querySelector('#error-huespedes');
const contadorResultados = document.querySelector('.resultados-count');
const contenedor = document.querySelector('#lista-alojamientos');

let todosLosAlojamientos = [];
let datosCargados = false;
let filtrosAplicados = {
    ubicacion: '',
    entrada: '',
    salida: '',
    huespedes: '',
    precioMin: '',
    precioMax: '',
    wifi: false,
    desayuno: false,
    pileta: false,
    estacionamiento: false
};


function normalizarTexto(texto) {
    let resultado = '';
    let espacioPendiente = false;

    for (let i = 0; i < texto.length; i = i + 1) {
        let letra = texto[i].toLowerCase();

        if (letra === 'á') {
            letra = 'a';
        } else if (letra === 'é') {
            letra = 'e';
        } else if (letra === 'í') {
            letra = 'i';
        } else if (letra === 'ó') {
            letra = 'o';
        } else if (letra === 'ú' || letra === 'ü') {
            letra = 'u';
        } else if (letra === 'ñ') {
            letra = 'n';
        }

        if (letra === ' ' || letra === '\t' || letra === '\n' || letra === '\r') {
            if (resultado !== '') {
                espacioPendiente = true;
            }
        } else {
            if (espacioPendiente === true) {
                resultado = resultado + ' ';
                espacioPendiente = false;
            }

            resultado = resultado + letra;
        }
    }

    return resultado;
}


function contieneTexto(texto, busqueda) {
    let encontrado = false;

    for (let i = 0; i <= texto.length - busqueda.length; i = i + 1) {
        let coincide = true;

        for (let j = 0; j < busqueda.length; j = j + 1) {
            if (texto[i + j] !== busqueda[j]) {
                coincide = false;
            }
        }

        if (coincide === true) {
            encontrado = true;
        }
    }

    return encontrado;
}


function obtenerFechaHoy() {
    const hoy = new Date();
    let mes = '' + (hoy.getMonth() + 1);
    let dia = '' + hoy.getDate();

    if (hoy.getMonth() + 1 < 10) {
        mes = '0' + mes;
    }

    if (hoy.getDate() < 10) {
        dia = '0' + dia;
    }

    return hoy.getFullYear() + '-' + mes + '-' + dia;
}


function formatearFecha(fecha) {
    const partes = fecha.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}


function validarFiltros() {
    let hayError = false;

    errorFechas.textContent = '';
    errorPrecios.textContent = '';
    errorHuespedes.textContent = '';

    if (inputEntrada.validity.badInput === true || inputSalida.validity.badInput === true) {
        errorFechas.textContent = 'Ingresá fechas válidas.';
        hayError = true;
    } else if ((inputEntrada.value === '' && inputSalida.value !== '') || (inputEntrada.value !== '' && inputSalida.value === '')) {
        errorFechas.textContent = 'Completá tanto la entrada como la salida.';
        hayError = true;
    } else if (inputEntrada.value !== '' && inputSalida.value !== '') {
        if (inputEntrada.value < obtenerFechaHoy()) {
            errorFechas.textContent = 'La entrada no puede ser anterior a hoy.';
            hayError = true;
        } else if (inputSalida.value <= inputEntrada.value) {
            errorFechas.textContent = 'La salida debe ser posterior a la entrada.';
            hayError = true;
        }
    }

    if (inputPrecioMin.validity.badInput === true || inputPrecioMax.validity.badInput === true) {
        errorPrecios.textContent = 'Ingresá precios válidos.';
        hayError = true;
    } else if ((inputPrecioMin.value !== '' && Number(inputPrecioMin.value) < 0) || (inputPrecioMax.value !== '' && Number(inputPrecioMax.value) < 0)) {
        errorPrecios.textContent = 'Los precios no pueden ser negativos.';
        hayError = true;
    } else if (inputPrecioMin.value !== '' && inputPrecioMax.value !== '' && Number(inputPrecioMin.value) > Number(inputPrecioMax.value)) {
        errorPrecios.textContent = 'El precio mínimo no puede superar al máximo.';
        hayError = true;
    }
        if (inputHuespedes.validity.badInput === true) {
        errorHuespedes.textContent = 'Ingresá una cantidad válida de huéspedes.';
        hayError = true;
    } else if (inputHuespedes.value !== '') {
        const cantidadHuespedes = Number(inputHuespedes.value);

        if (cantidadHuespedes < 1 || cantidadHuespedes % 1 !== 0) {
            errorHuespedes.textContent = 'Ingresá un número entero de 1 o más huéspedes.';
            hayError = true;
        }
    }


    return hayError === false;
}


function estaDisponible(alojamiento, entrada, salida) {
    let disponible = true;

    if (entrada !== '' && salida !== '') {
        for (let i = 0; i < alojamiento.periodosNoDisponibles.length; i = i + 1) {
            const periodo = alojamiento.periodosNoDisponibles[i];

            if (entrada < periodo.salida && salida > periodo.entrada) {
                disponible = false;
            }
        }
    }

    return disponible;
}


function ordenarAlojamientos(lista) {
    const orden = selectOrden.value;

    for (let i = 0; i < lista.length - 1; i = i + 1) {
        for (let j = 0; j < lista.length - 1 - i; j = j + 1) {
            let intercambiar = false;

            if (orden === 'precio-menor' && lista[j].precioNoche > lista[j + 1].precioNoche) {
                intercambiar = true;
            } else if (orden === 'precio-mayor' && lista[j].precioNoche < lista[j + 1].precioNoche) {
                intercambiar = true;
            } else if ((orden === 'puntuacion' || orden === 'destacados') && lista[j].calificacion < lista[j + 1].calificacion) {
                intercambiar = true;
            }

            if (intercambiar === true) {
                const auxiliar = lista[j];
                lista[j] = lista[j + 1];
                lista[j + 1] = auxiliar;
            }
        }
    }
}


function crearServicios(servicios) {
    let html = '';

    if (servicios.wifi === true) {
        html = html + '<span><i class="fa-solid fa-wifi" aria-hidden="true"></i> Wi-Fi</span>';
    }

    if (servicios.desayuno === true) {
        html = html + '<span><i class="fa-solid fa-mug-hot" aria-hidden="true"></i> Desayuno</span>';
    }

    if (servicios.pileta === true) {
        html = html + '<span><i class="fa-solid fa-water-ladder" aria-hidden="true"></i> Pileta</span>';
    }

    if (servicios.estacionamiento === true) {
        html = html + '<span><i class="fa-solid fa-square-parking" aria-hidden="true"></i> Estacionamiento</span>';
    }

    return html;
}


function crearTarjeta(alojamiento) {
    let destacadoHtml = '';
    let disponibilidadHtml = '';
    let calificacionHtml = '';

    if (typeof alojamiento.calificacion === 'number' && alojamiento.calificacion >= 0 && alojamiento.calificacion <= 5) {
        calificacionHtml = `<p class="tarjeta-puntuacion"><i class="fa-solid fa-star" aria-hidden="true"></i> ${alojamiento.calificacion} / 5</p>`;
    }

    if (alojamiento.calificacion >= 4.5) {
        destacadoHtml = '<span class="badge-destacado">Destacado</span>';
    }

    return `
        <article class="tarjeta">
            <div class="tarjeta-imagen-wrapper">
                <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">
                <i class="fa-regular fa-heart icono-favorito" aria-hidden="true"></i>
                <span class="badge-categoria">${alojamiento.tipo}</span>
                ${destacadoHtml}
            </div>

            <div class="tarjeta-cuerpo">
                <div class="tarjeta-info-izq">
                    <h3 class="tarjeta-titulo">${alojamiento.nombre}</h3>
                    <p class="tarjeta-ubicacion"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${alojamiento.ubicacion}</p>
                    ${calificacionHtml}
                    <p class="tarjeta-capacidad">Hasta ${alojamiento.capacidad} huéspedes</p>
                </div>

                <div class="tarjeta-info-der">
                    <p class="tarjeta-precio"><strong>$${alojamiento.precioNoche}</strong> <span class="noche">/ noche</span></p>
                    <a href="detallepropiedad.html?id=${alojamiento.id}" class="btn-detalles">Ver detalles</a>
                </div>
            </div>

            <div class="tarjeta-servicios">${crearServicios(alojamiento.servicios)}</div>
            ${disponibilidadHtml}
        </article>
    `;
}


function actualizarContador(cantidad) {
    if (cantidad === 1) {
        contadorResultados.textContent = '(1 alojamiento)';
    } else {
        contadorResultados.textContent = `(${cantidad} alojamientos)`;
    }
}


function mostrarMensaje(texto, tipo) {
    contenedor.innerHTML = `<p class="mensaje ${tipo}">${texto}</p>`;
}


function aplicarFiltros() {
    if (datosCargados === false) {
        return;
    }

    if (todosLosAlojamientos.length === 0) {
        actualizarContador(0);
        mostrarMensaje('No hay alojamientos disponibles.', 'vacio');
        return;
    }

    const ciudad = normalizarTexto(filtrosAplicados.ubicacion);
    const filtrados = [];

    for (let i = 0; i < todosLosAlojamientos.length; i = i + 1) {
        const alojamiento = todosLosAlojamientos[i];
        let pasaFiltro = true;

        if (filtrosAplicados.huespedes !== '' && alojamiento.capacidad < Number(filtrosAplicados.huespedes)) {
            pasaFiltro = false;
        }

        if (ciudad !== '' && contieneTexto(normalizarTexto(alojamiento.ubicacion), ciudad) === false) {
            pasaFiltro = false;
        }

        if (selectTipo.value !== '' && alojamiento.tipo !== selectTipo.value) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.wifi === true && alojamiento.servicios.wifi !== true) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.desayuno === true && alojamiento.servicios.desayuno !== true) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.pileta === true && alojamiento.servicios.pileta !== true) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.estacionamiento === true && alojamiento.servicios.estacionamiento !== true) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.precioMin !== '' && alojamiento.precioNoche < Number(filtrosAplicados.precioMin)) {
            pasaFiltro = false;
        }

        if (filtrosAplicados.precioMax !== '' && alojamiento.precioNoche > Number(filtrosAplicados.precioMax)) {
            pasaFiltro = false;
        }

        if (estaDisponible(alojamiento, filtrosAplicados.entrada, filtrosAplicados.salida) === false) {
            pasaFiltro = false;
        }

        if (pasaFiltro === true) {
            filtrados.push(alojamiento);
        }
    }

    actualizarContador(filtrados.length);

    if (filtrados.length === 0) {
        mostrarMensaje('No hay alojamientos disponibles que coincidan con los filtros elegidos.', 'vacio');
        return;
    }

    ordenarAlojamientos(filtrados);

    let html = '';

    for (let i = 0; i < filtrados.length; i = i + 1) {
        html = html + crearTarjeta(filtrados[i]);
    }

    contenedor.innerHTML = html;
}

async function cargarAlojamientos() {
    datosCargados = false;
    contadorResultados.textContent = '';
    mostrarMensaje('Cargando alojamientos...', 'cargando');

    try {
        const respuesta = await fetch('http://localhost:8080/api/alojamientos');

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

todosLosAlojamientos = datosApi.map(function(alojamiento) {
    return {
        ...alojamiento,
        imagen: alojamiento.id === 1
        ? 'assents/img/cabana-bariloche.jpg'
        : alojamiento.imagen,
        precioNoche: alojamiento.precioPorNoche,
        ubicacion: ciudades[alojamiento.idCiudad] || 'Ubicación pendiente',
        calificacion: obtenerCalificacionAlojamiento(alojamiento, calificacionesInicio),
        servicios: alojamiento.servicios || {},
        periodosNoDisponibles: []
    };
});
        datosCargados = true;
        aplicarFiltros();
    } catch (error) {
        todosLosAlojamientos = [];
        datosCargados = false;
        contadorResultados.textContent = '';

        mostrarMensaje('No pudimos cargar los alojamientos. Probá recargar la página.', 'error');
        console.error(error);
    }
}


formBusqueda.addEventListener('submit', function(evento) {
    evento.preventDefault();
    errorBusqueda.textContent = '';

    let hayError = false;

    if (normalizarTexto(inputBusqueda.value) === '') {
        errorBusqueda.textContent = 'Escribí una ciudad para buscar.';
        hayError = true;
    }

    if (hayError === true) {
        return;
    }

    filtrosAplicados.ubicacion = inputBusqueda.value;
    inputUbicacion.value = inputBusqueda.value;
    aplicarFiltros();
});


inputBusqueda.addEventListener('input', function() {
    errorBusqueda.textContent = '';
});


formFiltros.addEventListener('submit', function(evento) {
    evento.preventDefault();
    errorBusqueda.textContent = '';

    if (validarFiltros() === false) {
        return;
    }

    filtrosAplicados = {
        ubicacion: inputUbicacion.value,
        entrada: inputEntrada.value,
        salida: inputSalida.value,
        huespedes: inputHuespedes.value,
        precioMin: inputPrecioMin.value,
        precioMax: inputPrecioMax.value,
        wifi: checkWifi.checked,
        desayuno: checkDesayuno.checked,
        pileta: checkPileta.checked,
        estacionamiento: checkEstacionamiento.checked
    };

    inputBusqueda.value = filtrosAplicados.ubicacion;
    aplicarFiltros();
});


formFiltros.addEventListener('reset', function() {
    window.location.href = 'catalog-filtro.html';
});


selectTipo.addEventListener('change', function() {
    aplicarFiltros();
});


selectOrden.addEventListener('change', function() {
    aplicarFiltros();
});


const parametros = new URLSearchParams(window.location.search);
const ciudadRecibida = parametros.get('ciudad');

if (ciudadRecibida !== null) {
    inputUbicacion.value = ciudadRecibida;
    inputBusqueda.value = ciudadRecibida;
    filtrosAplicados.ubicacion = ciudadRecibida;
}

inputEntrada.min = obtenerFechaHoy();
inputSalida.min = obtenerFechaHoy();

cargarAlojamientos();
