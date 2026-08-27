//EL LOGIN VALIDA
const form = document.querySelector('#form-login');
const cajaError = document.querySelector('#error-login');

form.addEventListener('submit', function (evento){
    evento.preventDefault();
    console.log('se envió');
    const email = document.querySelector('#input-email').value;
    const password = document.querySelector('#input-password').value;

    
    console.log(email, password);
    if (email == '' || password === ''){
    cajaError.textContent = 'Completá email y contraseña.';
    cajaError.classList.add('visible');
    return;
    }

    cajaError.textContent = '';
    cajaError.classList.remove('visible');

    window.location.href = "index.html";
});
