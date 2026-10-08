//console.log('funciona');
//alojamiento.length
//alojamiento[0].nombre

let todosLosAlojamientos =[];

function crearTarjeta(alojamiento) {
    return `
        <article class="tarjeta">
            <div class="tarjeta-imagen-wrapper">
                <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">
                <i class="fa-regular fa-heart icono-favorito"></i>
                <span class="badge-categoria">${alojamiento.nombre.split(' ')[0]}</span>
            </div>
            <div class="tarjeta-cuerpo">
                <div class="tarjeta-info-izq">
                    <h3 class="tarjeta-titulo">${alojamiento.nombre}</h3>
                    <p class="tarjeta-ubicacion"><i class="fa-solid fa-location-dot"></i> ${alojamiento.ubicacion}</p>
                </div>
                <div class="tarjeta-info-der">
                    <p class="tarjeta-precio"><strong>$${alojamiento.precioNoche}</strong> <span class="noche">/ noche</span></p>
                    <a href="detallepropiedad.html?id=${alojamiento.id}" class="btn-detalles">Ver detalles</a>
                </div>
            </div>
        </article>
    `;
}


function renderAlojamientos(lista){
    const contenedor = document.querySelector('#lista-alojamientos');

    let html = '';
    for (const alojamiento of lista){
        html = html + crearTarjeta(alojamiento);
    }

    contenedor.innerHTML = html;
}


function mostrarMensaje(texto, tipo) {
 const contenedor = document.querySelector('#lista-alojamientos');
 contenedor.innerHTML = `<p class="mensaje ${tipo}">${texto}</p>`;
}

async function cargarAlojamientos(){
    mostrarMensaje('Cargando alojamientos...', 'cargando');

    try{
        const respuesta = await fetch('data/alojamientos.json');
        const alojamientosData = await respuesta.json();

        if (alojamientosData.length === 0) {
            mostrarMensaje('No hay alojamientos para mostrar.', 'error');
            return;
        }

        todosLosAlojamientos = alojamientosData;

        renderAlojamientos(todosLosAlojamientos);


     } catch (error) {
        console.error('Error al cargar los alojamientos:', error);
        mostrarMensaje('Error al cargar los alojamientos.', 'error');
    }
}
cargarAlojamientos();

const formFiltros = document.querySelector('#form-filtros');
formFiltros.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const ubiBuscada = document.querySelector('#ubi').value.toLowerCase();
    const precioMin = document.querySelector('#min').value;
    const precioMax = document.querySelector('#max').value;

    let alojamientosFiltrados = [];

    for (let i = 0; i < todosLosAlojamientos.length; i = i + 1){
        let aloja = todosLosAlojamientos[i];

        let pasaFiltro = true;

        if (ubiBuscada !== ''){
            let ubicacionAlojamientos = aloja.ubicacion.toLowerCase();
            if (ubicacionAlojamientos.includes(ubiBuscada) === false){
                pasaFiltro = false;
            }
        }

        if (precioMin !== ''){
            if (aloja.precioNoche < Number(precioMin)){
                pasaFiltro = false;
            }
        }

        if (precioMax !== ''){
            if (aloja.precioNoche > Number(precioMax)){
                pasaFiltro = false;
            }
        }

        if (pasaFiltro === true){
            alojamientosFiltrados.push(aloja);
        }
    }
    if (alojamientosFiltrados.length === 0){
        mostrarMensaje('No se encontraron alojamientos que cumplan con tus filtros.', 'error');
    } else {
        renderAlojamientos(alojamientosFiltrados);
    }

});

formFiltros.addEventListener('reset', function(){
    renderAlojamientos(todosLosAlojamientos);
})