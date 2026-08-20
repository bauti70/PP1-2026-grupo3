//console.log('funciona');
const alojamientos = [
    {id: 1, nombre: 'Apartamento vista al rio', ubicacion: 'Palermo, Buenos Aires', capacidad: 2, precioNoche: 225000, imagen: '../docs/2da-entrega/imagenes_referencia/Apartamento vista al río.webp'},
    {id: 2, nombre: 'Casa en la montaña', ubicacion: 'Bariloche, Rio Negro', capacidad: 4, precioNoche: 15000, imagen: '../docs/2da-entrega/imagenes_referencia/Casa en la montaña.jpg'},
    {id: 3, nombre: 'Departamento Centrico', ubicacion: 'Mendoza', capacidad: 2, precioNoche: 8000, imagen: '../docs/2da-entrega/imagenes_referencia/Departamento Céntrico.jpg'},
    {id: 4, nombre: 'Cabaña en el lago', ubicacion: 'Cordoba, El Durazno', capacidad: 3, precioNoche: 12500, imagen: '../docs/2da-entrega/imagenes_referencia/Cabaña en el lago.jpg'},
    {id: 5, nombre: 'Cabaña en el bosque', ubicacion: 'Bariloche', capacidad: 6, precioNoche: 24000, imagen: '../docs/2da-entrega/imagenes_referencia/Cabaña en Bariloche.jpg'}

];

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
renderAlojamientos(alojamientos);