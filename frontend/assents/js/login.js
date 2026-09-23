//EL LOGIN VALIDA
const form = document.querySelector('#form-login');

form.addEventListener('submit', function (evento){
    evento.preventDefault();
    console.log('se envió');

    const email = document.querySelector('#input-email').value;
    const password = document.querySelector('#input-password').value;

    const msjEmail = document.querySelector('#error-email');
    const msjPassword = document.querySelector('#error-password');


    msjEmail.textContent = '';
    msjPassword.textContent = '';

    console.log(email, password);

    let hayError = false;

    if (email === ''){
        msjEmail.textContent = 'El email es obligatorio.';
        hayError = true;
    } else {
        
    let tieneArroba = false;
    let tienePunto = false;

    for (let i = 0; i < email.length; i = i + 1){
        if (email[i] === '@'){
            tieneArroba = true;
        }
        if (email[i] === '.'){
            tienePunto = true;
        }
    }

    if(tieneArroba === false || tienePunto === false){
        msjEmail.textContent = 'Email invalido debe contener un @ y un punto.';
        hayError = true;
    }

    }

    if (password === ''){
        msjPassword.textContent = 'La contraseña es obligatoria.';
        hayError = true;
    } 

    if (hayError === true){
        return;
    }

    window.open('index.html', '_self');

});
