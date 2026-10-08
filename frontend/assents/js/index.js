const formBusqueda = document.querySelector('#form-busqueda-inicio');
const inputBusqueda = document.querySelector('#input-busqueda');
const mensajeLogin = document.querySelector('#mensaje-login');

const estaLogueado = localStorage.getItem('sesionIniciada');

inputBusqueda.addEventListener('focus', function() {
    if (estaLogueado !== 'true'){
        inputBusqueda.blur();
        mensajeLogin.textContent = 'Debes iniciar sesion arriba para poder continuar con tu busqueda.';
    }
});

formBusqueda.addEventListener('submit', function(evento){
    if (estaLogueado !== 'true'){
        evento.preventDefault();
        mensajeLogin.textContent = 'Debes iniciar sesion arriba para poder continuar con tu busqueda.';
    }
});