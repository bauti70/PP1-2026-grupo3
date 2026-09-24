//console.log('funciona');
//alojamiento.length
//alojamiento[0].nombre

function crearTarjeta(alojamiento) {
    return `
        <article class="tarjeta">
            <figure class="tarjeta-imagen">
                <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}">
            </figure>
            <section class="lista-tarjetas">
                <h3 class="tarjeta-titulo">${alojamiento.nombre}</h3>
                <p class="tarjeta-ubicacion">📍 ${alojamiento.ubicacion}</p>
                <p class="tarjeta-precio"><strong>$${alojamiento.precioNoche}</strong> / noche</p>
                <a href="#" class="btn-detalles">Ver detalles</a>
            </section>
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
        const respuesta = await fetch('data/alojamiento.json');
        const alojamientosData = await respuesta.json();

        if (alojamientosData.length === 0) {
            mostrarMensaje('No hay alojamientos para mostrar.', 'error');
            return;
        }


        renderAlojamientos(alojamientosData);

                
     

     } catch (error) {
        console.error('Error al cargar los alojamientos:', error);
        mostrarMensaje('Error al cargar los alojamientos.', 'error');
    }
}
cargarAlojamientos();