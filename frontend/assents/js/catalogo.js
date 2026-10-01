//console.log('funciona');
//alojamiento.length
//alojamiento[0].nombre

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


        renderAlojamientos(alojamientosData);

                
     

     } catch (error) {
        console.error('Error al cargar los alojamientos:', error);
        mostrarMensaje('Error al cargar los alojamientos.', 'error');
    }
}
cargarAlojamientos();