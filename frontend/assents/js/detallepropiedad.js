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

    const msjllegada = document.querySelector('#error-llegada');
    const msjsalida = document.querySelector('#error-salida');
    const msjhuespedes = document.querySelector('#error-huespedes');

    msjllegada.textContent = '';
    msjsalida.textContent = '';
    msjhuespedes.textContent = '';

    let formularioValido = true;

    if (fechaEntrada === ''){
        msjllegada.textContent = 'Por favor, ingrese la fecha de llegada.';
        formularioValido = false;
    }
    
    if (fechaSalida === ''){
        msjsalida.textContent = 'Por favor, ingrese la fecha de salida.';
        formularioValido = false;
    }

    if (fechaEntrada !== '' && fechaSalida !== ''){
        if(fechaSalida <= fechaEntrada){
            msjsalida.textContent = 'ERROR: La fecha de salida debe ser posterior a la fecha de llegada.';
            formularioValido = false;
        }
    }    

   
    if (huespedes === '' || huespedes < 1 || huespedes > 4){
        msjhuespedes.textContent = 'Ingrese la cantidad de huéspedes (max 4).';
        formularioValido = false;
    } 
    
    if (formularioValido === false){
        return;
    }


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

    

    toastr.options ={
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "timeOut": "4000"
    }
    toastr.success('¡SU RESERVA FUE PROCESADA CON EXITO!','Reserva Confirmada');
})

async function guardarReserva(reserva){
    reservas.length = 0;
    reservas.push(reserva);
}