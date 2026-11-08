//console.log('funciona');
//alojamiento.length
//alojamiento[0].nombre

const formFiltros = document.querySelector('#form-filtros');
const inputUbicacion = document.querySelector('#ubi');
const inputPrecioMin = document.querySelector('#min');
const inputPrecioMax = document.querySelector('#max');
const contadorResultados = document.querySelector('.resultados-count');

let todosLosAlojamientos = [];
let datosCargados = false;

const parametros = new URLSearchParams(window.location.search);
const ciudadRecibida = parametros.get('ciudad');

if (ciudadRecibida !== null) {
    inputUbicacion.value = ciudadRecibida;
}


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

    if (busqueda !== '') {
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
    }

    return encontrado;
}


function crearTarjeta(alojamiento) {
    let categoria = '';

    for (let i = 0; i < alojamiento.nombre.length; i = i + 1) {
        if (alojamiento.nombre[i] === ' ') {
            break;
        }

        categoria = categoria + alojamiento.nombre[i];
    }

    return `
        <article class="tarjeta">
            <div class="tarjeta-imagen-wrapper">
                <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">
                <i class="fa-regular fa-heart icono-favorito" aria-hidden="true"></i>
                <span class="badge-categoria">${categoria}</span>
            </div>

            <div class="tarjeta-cuerpo">
                <div class="tarjeta-info-izq">
                    <h3 class="tarjeta-titulo">${alojamiento.nombre}</h3>
                    <p class="tarjeta-ubicacion"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${alojamiento.ubicacion}</p>
                </div>

                <div class="tarjeta-info-der">
                    <p class="tarjeta-precio"><strong>$${alojamiento.precioNoche}</strong> <span class="noche">/ noche</span></p>
                    <a href="detallepropiedad.html?id=${alojamiento.id}" class="btn-detalles">Ver detalles</a>
                </div>
            </div>
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


function renderAlojamientos(lista) {
    const contenedor = document.querySelector('#lista-alojamientos');
    let html = '';

    for (let i = 0; i < lista.length; i = i + 1) {
        html = html + crearTarjeta(lista[i]);
    }

    contenedor.innerHTML = html;
    actualizarContador(lista.length);
}


function mostrarMensaje(texto, tipo) {
    const contenedor = document.querySelector('#lista-alojamientos');
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

    const ciudad = normalizarTexto(inputUbicacion.value);
    const precioMin = inputPrecioMin.value;
    const precioMax = inputPrecioMax.value;

    let hayError = false;

    if ((precioMin !== '' && Number(precioMin) < 0) || (precioMax !== '' && Number(precioMax) < 0)) {
        mostrarMensaje('Los precios no pueden ser negativos.', 'error');
        hayError = true;
    } else if (precioMin !== '' && precioMax !== '' && Number(precioMin) > Number(precioMax)) {
        mostrarMensaje('El precio mínimo no puede superar al máximo.', 'error');
        hayError = true;
    }

    if (hayError === true) {
        contadorResultados.textContent = '';
        return;
    }

    const filtrados = [];

    for (let i = 0; i < todosLosAlojamientos.length; i = i + 1) {
        const alojamiento = todosLosAlojamientos[i];
        const ubicacion = normalizarTexto(alojamiento.ubicacion);

        let pasaFiltro = true;

        if (ciudad !== '' && contieneTexto(ubicacion, ciudad) === false) {
            pasaFiltro = false;
        }

        if (precioMin !== '' && alojamiento.precioNoche < Number(precioMin)) {
            pasaFiltro = false;
        }

        if (precioMax !== '' && alojamiento.precioNoche > Number(precioMax)) {
            pasaFiltro = false;
        }

        if (pasaFiltro === true) {
            filtrados.push(alojamiento);
        }
    }

    if (filtrados.length === 0) {
        actualizarContador(0);
        mostrarMensaje('No encontramos alojamientos que coincidan con la ubicación y los precios indicados.', 'vacio');
    } else {
        renderAlojamientos(filtrados);
    }
}

async function cargarAlojamientos() {
    datosCargados = false;
    contadorResultados.textContent = '';

    mostrarMensaje('Cargando alojamientos...', 'cargando');

    try {
        const respuesta = await fetch('data/alojamientos.json');

        if (respuesta.ok === false) {
            throw new Error('No se pudo cargar el archivo de alojamientos.');
        }

        todosLosAlojamientos = await respuesta.json();
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

formFiltros.addEventListener('submit', function(evento) {
    evento.preventDefault();
    aplicarFiltros();
});


formFiltros.addEventListener('reset', function() {
    window.location.href = 'catalog-filtro.html';
});


cargarAlojamientos();