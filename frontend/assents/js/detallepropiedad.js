//console.log('funciona');
const reservas = [];

function formatearFecha(fecha){
    let partes = fecha.split('-');
    return partes[2] + '-' + partes[1] + '-' + partes[0];
}

function crearItemReserva(reserva){
    let html = '<article class="reserva-propiedad" style="margin-top: 15px; border-top: 2px solid #ccc; padding-top: 15px; background-color: #f9f9f9; padding: 15px; border-radius: 10px;">';
    html = html + '<div class="reserva-info">';
    html = html + '<h2 style="margin-top:0; font-size: 18px;">' + reserva.alojamiento + '</h2>';
    html = html + '<p> Fecha de llegada: ' + formatearFecha(reserva.fechaEntrada) + ' hasta ' + formatearFecha(reserva.fechaSalida) + '</p>';
    html = html + '<p><strong>Huéspedes:</strong> ' + reserva.huespedes + ' | <strong>Estado:</strong> ' + reserva.estado + '</p>';
    html = html + '</div>';
    html = html + '</article>';
    return html;
}

function renderReservas(lista){
    const contenedor = document.querySelector('#lista-reservas');
    if(!contenedor) return; 
    let html = '';
    for (let i = 0; i < lista.length; i = i + 1){
        html = html + crearItemReserva(lista[i]);
    }
    contenedor.innerHTML = html;
}

async function guardarReserva(reserva){
    reservas.length = 0; 
    reservas.push(reserva);
}

const formReserva = document.querySelector('#form-reserva');

if(formReserva) {
    formReserva.addEventListener('submit', async function(evento){
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
            msjllegada.textContent = 'Por favor, ingrese una fecha de llegada.';
            formularioValido = false;
        }
        
        if (fechaSalida === ''){
            msjsalida.textContent = 'Por favor, ingrese una fecha de salida.';
            formularioValido = false;
        }

        if (fechaEntrada !== '' && fechaSalida !== ''){
            if(fechaSalida <= fechaEntrada){
                msjsalida.textContent = 'La fecha de salida es inválida. Debe ser posterior a la llegada.';
                formularioValido = false;
            }
        }    

        if (huespedes === '' || huespedes < 1 || huespedes > 4){
            msjhuespedes.textContent = 'Ingrese una cantidad de huespedes valida (maximo 4).';
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

        await guardarReserva(reserva);
        renderReservas(reservas);
        formReserva.reset();

        if (typeof toastr !== 'undefined') {
            toastr.options = {
                "closeButton": true,
                "progressBar": true,
                "positionClass": "toast-bottom-right",
                "timeOut": "4000"
            };
            toastr.success('¡SU RESERVA FUE PROCESADA CON EXITO!', 'Reserva Confirmada');
        } else {
            alert('¡SU RESERVA FUE PROCESADA CON EXITO!');
        }
    });
}
