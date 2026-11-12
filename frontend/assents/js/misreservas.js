var main = document.querySelector('.reserva-main');
var mensajeVacio = document.querySelector('.reserva-vacio');


function actualizarVacio() {
    var tarjetas = document.querySelectorAll('.reserva-tarjeta');
    var visibles = 0;

    for (var i = 0; i < tarjetas.length; i++) {
        if (!tarjetas[i].hidden) {
            visibles++;
        }
    }

    mensajeVacio.hidden = visibles > 0;
}


main.addEventListener('click', function (e) {
    var boton = e.target.closest('button');
    if (!boton) {
        return;
    }

    var tarjeta = boton.closest('.reserva-tarjeta');
    var titulo = tarjeta.querySelector('h2').textContent;

    if (boton.classList.contains('reserva-btn-detalles')) {
        var detalles = tarjeta.querySelector('.reserva-detalles');
        detalles.hidden = !detalles.hidden;

        if (detalles.hidden) {
            boton.textContent = 'Ver detalles';
        } else {
            boton.textContent = 'Ocultar detalles';
        }
    }

    if (boton.classList.contains('reserva-btn-cancelar')) {
        if (confirm('¿Seguro que querés cancelar la reserva "' + titulo + '"?')) {
            tarjeta.remove();
            actualizarVacio();
        }
    }
});