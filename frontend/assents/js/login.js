const form = document.querySelector('#form-login');

form.addEventListener('submit', async function (evento){
    evento.preventDefault();
    console.log('se envió');

    const email = document.querySelector('#input-email').value;
    const password = document.querySelector('#input-password').value;

    const msjEmail = document.querySelector('#error-email');
    const msjPassword = document.querySelector('#error-password');


    msjEmail.textContent = '';
    msjPassword.textContent = '';


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
    } else if (password.length < 8){
        msjPassword.textContent = 'La contraseña debe tener como mínimo 8 caracteres.';
        hayError = true;
    }

    if (hayError === true){
        return;
    }

    if (hayError === true){
        return;
    }
  
        try {
        const respuesta = await fetch(`http://${window.location.hostname}:8080/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!respuesta.ok) {
            msjPassword.textContent = 'Correo o contraseña incorrectos.';
            return;
        }

        const datosUsuario = await respuesta.json();

        localStorage.setItem('idUsuario', String(datosUsuario.id));
        localStorage.setItem('rolUsuario', datosUsuario.rol);
        localStorage.setItem('nombreUsuario', datosUsuario.nombre);
        
        localStorage.setItem('sesionIniciada', 'true');

        const paginaDestino = localStorage.getItem('volverA');

        if (paginaDestino !== null) {
            localStorage.removeItem('volverA');
            window.open(paginaDestino, '_self');
        } else {
            window.open('index.html', '_self');
        }

    } catch (error) {
        msjPassword.textContent = 'No se pudo conectar con el servidor.';
    }
    
});