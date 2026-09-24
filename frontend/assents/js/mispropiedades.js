const contenedorMisPropiedades = document.querySelector('#lista-mis-propiedades');
const mensajeEstado = document.querySelector('#mensaje-estado');

async function cargarMisPropiedades(){
    mensajeEstado.style.color = '#5e5cee';
    mensajeEstado.textContent = 'Cargando propiedades...';
    contenedorMisPropiedades.innerHTML = '';

    try{
        const respuesta = await fetch('data/alojamientos.json');
        if (respuesta.ok === false){
            throw new Error('No se pudo acceder a la información de las propiedades');
        }

        const alojamientos = await respuesta.json();

        if (alojamientos.length === 0){
            mensajeEstado.style.color = '#5e5cee';
            mensajeEstado.textContent = 'Todavia no tienes propiedades registradas.';
            return;
        }
    

    mensajeEstado.textContent = '';

    for (let i = 0; i < alojamientos.length; i = i + 1){
        let aloja = alojamientos[i];
        
        let estadoPropiedad = 'Publicada';
        if (i % 2 === 0){
            estadoPropiedad = 'Reservada';
        }

        let htmlFila = '<article>';
            htmlFila = htmlFila + '<img src="' + aloja.imagen + '" alt="' + aloja.nombre + '" width="250">';
            htmlFila = htmlFila + '<h3>' + aloja.nombre + '</h3>';
            htmlFila = htmlFila + '<p><strong>Estado:</strong> ' + estadoPropiedad + '</p>';
            htmlFila = htmlFila + '<p>Ubicación: ' + aloja.ubicacion + '.</p>';
            htmlFila = htmlFila + '<p><strong>Tarifa:</strong> $' + aloja.precioNoche + ' por noche</p>';
            htmlFila = htmlFila + '<p><strong>Capacidad:</strong> ' + aloja.capacidad + ' personas</p>';
            htmlFila = htmlFila + '<p><strong>Servicios básicos:</strong></p>';
            htmlFila = htmlFila + '<ul>';
            htmlFila = htmlFila + '  <li>Wi-Fi</li>';
            htmlFila = htmlFila + '  <li>Agua caliente</li>';
            htmlFila = htmlFila + '</ul>';
            htmlFila = htmlFila + '<button style="margin-right: 5px;">Editar</button>';
        
        if (estadoPropiedad === 'Publicada'){
            htmlFila = htmlFila + '<button>Retirar</button>';
        } else {
            htmlFila = htmlFila + '<button>Publicar</button>';
        }
        htmlFila = htmlFila + '</article><hr>';

        contenedorMisPropiedades.innerHTML = contenedorMisPropiedades.innerHTML + htmlFila;
    }
    
    } catch (error) {
        mensajeEstado.style.color = 'red';
        mensajeEstado.textContent = 'Error al cargar las propiedades. Revisa tu conexión a internet e intenta nuevamente.';
        console.log(error);
    }
}

cargarMisPropiedades();