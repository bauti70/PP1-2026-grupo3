const listaReservas = document.querySelector('#lista-reservas');
const mensajeVacio = document.querySelector('.reserva-vacio');

function formatearFecha(fecha) {
    return String(fecha).substring(0, 10).split('-').reverse().join('/');
}

function crearTarjeta(reserva) {

    const tarjeta = document.createElement('section');
    tarjeta.className = 'reserva-tarjeta';
    tarjeta.dataset.estado = reserva.estado;

    tarjeta.innerHTML = `
        <article class="reserva-propiedad">
            <img class="reserva-imagen">
            <div class="reserva-info">
                <h2></h2>
                <p class="descripcion"></p>
                <p class="estado"></p>

                <div class="reserva-botones">
                    <button class="reserva-btn-detalles">Ver detalles</button>
                    <button class="reserva-btn-contacto" disabled>Contactar Anfitrión</button>
                    <button class="reserva-btn-cancelar" disabled>Cancelar</button>
                </div>

                <div class="reserva-detalles" hidden>
                    <p><strong>Entrada:</strong> ${formatearFecha(reserva.fechaCheckIn)}</p>
                    <p><strong>Salida:</strong> ${formatearFecha(reserva.fechaCheckOut)}</p>
                    <p><strong>Huéspedes:</strong> ${Number(reserva.cantidadHuespedes)}</p>
                    <p><strong>Total:</strong> $${Number(reserva.importeTotal).toLocaleString('es-AR')}</p>
                </div>
            </div>
        </article>
    `;

    tarjeta.querySelector('h2').textContent = reserva.alojamiento;
    tarjeta.querySelector('.descripcion').textContent = reserva.descripcion || '';
    tarjeta.querySelector('.estado').textContent = 'Estado: ' + reserva.estado;

    const imagen = tarjeta.querySelector('.reserva-imagen');
    imagen.alt = reserva.alojamiento;

    if (reserva.imagen) {
        imagen.src = reserva.imagen.replace('assets/', 'assents/');
    }

    const boton = tarjeta.querySelector('.reserva-btn-detalles');
    const detalles = tarjeta.querySelector('.reserva-detalles');

    boton.addEventListener('click', function () {
        detalles.hidden = !detalles.hidden;
        boton.textContent = detalles.hidden ? 'Ver detalles' : 'Ocultar detalles';
    });

    const botonCancelar= tarjeta.querySelector('.reserva-btn-cancelar');

    const esCancelada = reserva.estado === 'CANCELADA';

    botonCancelar.disabled = !esCancelada && reserva.estado !== 'CONFIRMADA';

    if (esCancelada) {
        botonCancelar.textContent = 'Volver a reservar';
        botonCancelar.classList.replace('reserva-btn-cancelar', 'reserva-btn-volver');
    }

    botonCancelar.addEventListener('click', async function(){

        if (esCancelada) {
            window.location.href = 'detallepropiedad.html?id=' + reserva.idAlojamiento;
            return;
        }
        
        if (!confirm('¿Seguro que quiere cancelar esta reserva?')){
            return;
        }
        
        botonCancelar.disabled = true;

        try{
            const respuesta = await fetch(
                `http://${window.location.hostname}:8080/api/reservas/${reserva.id}/cancelar`, {
                method: 'PUT',
                credentials: 'include'
                }
            );

            if (!respuesta.ok){
                throw new Error('No se pudo cancelar la reserva.');
            }

            alert('La reserva se canceló correctamente.');

            await cargarMisReservas();

        } catch (error){
            alert(error.message);
            botonCancelar.disabled = false;
        }
    });

    listaReservas.appendChild(tarjeta);
}

async function cargarMisReservas() {

    listaReservas.innerHTML = '';
    mensajeVacio.hidden = true;

    try {
        const respuesta = await fetch(
            `http://${window.location.hostname}:8080/api/reservas`, {
                method: 'GET',
                credentials: 'include'
            }
        );

        if (respuesta.status === 401) {
            throw new Error('Debés iniciar sesión para ver tus reservas.');
        }

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar las reservas.');
        }

        const reservas = await respuesta.json();

        if (reservas.length === 0) {
            mensajeVacio.textContent = 'Todavía no tenés reservas.';
            mensajeVacio.hidden = false;
            return;
        }

        reservas.forEach(crearTarjeta);

    } catch (error) {
        mensajeVacio.textContent = error.message;
        mensajeVacio.hidden = false;
    }
}

cargarMisReservas();