//console.log('funciona');

const reservas = [];

function crearItemReserva(reserva){
    return `
        <article class="reserva-propiedad" style="margin-top: 15px; border-top: 2px solid #ccc; padding-top: 15px;">
            <div class="reserva-info">
                <h2>${reserva.alojamiento}</h2>
                <p><strong>Fechas:</strong> ${reserva.fechaEntrada} al ${reserva.fechaSalida}</p>
                <p><strong>Huéspedes:</strong> ${reserva.huespedes} | <strong>Estado:</strong> ${reserva.estado}</p>
            </div>
        </article>
    `;
}

function renderReservas(lista){
    const contenedor = document.querySelector('#lista-reservas');
    let html = '';
    for (const reserva of lista){
        html = html + crearItemReserva(reserva);
    }
    contenedor.innerHTML = html;
}

const formReserva = document.querySelector('.form-reserva');
const cajaError = document.querySelector('#error-reserva');

formReserva.addEventListener('submit', function(evento){
    evento.preventDefault();

    const fechaEntrada = document.querySelector('#llegada').value;
    const fechaSalida = document.querySelector('#salida').value;
    const huespedes = document.querySelector('#huespedes').value;

    if (fechaEntrada === '' || fechaSalida === '' || huespedes === '') {
        cajaError.textContent = 'Error: Complete todos los campos del formulario.';
        cajaError.classList.add('visible');
        return;
    }

    cajaError.textContent = '';
    cajaError.classList.remove('visible');

    const reserva = {
        id: reservas.length + 1,
        alojamiento: 'Apartamento vista al rio',
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida,
        huespedes: huespedes,
        estado: 'CONFIRMADA'
    };

    guardarReserva(reserva);
    renderReservas(reservas);
    formReserva.reset();
})

async function guardarReserva(reserva){
    reservas.push(reserva);
}