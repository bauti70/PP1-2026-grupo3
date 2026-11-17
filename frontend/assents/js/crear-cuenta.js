const inputClave = document.querySelector('#clave');
const reqLargo = document.querySelector('#req-largo');
const reqMayus = document.querySelector('#req-mayus');
const reqNum = document.querySelector('#req-num');
const reqEsp = document.querySelector('#req-esp');

inputClave.addEventListener('input', function() {
    const valor = inputClave.value;

    if (valor.length > 8) {
        reqLargo.className = 'req-valido';
        reqLargo.innerHTML = '<i class="fa-solid fa-check"></i> Más de 8 caracteres';
    } else {
        reqLargo.className = 'req-invalido';
        reqLargo.innerHTML = '<i class="fa-solid fa-xmark"></i> Más de 8 caracteres';
    }

    let tieneMayuscula = false;
    let tieneNumero = false;
    let tieneEspecial = false;

    for (let i = 0; i < valor.length; i = i + 1) {
        let caracter = valor[i];
        if (caracter >= 'A' && caracter <= 'Z') {
            tieneMayuscula = true;
        } else if (caracter >= '0' && caracter <= '9') {
            tieneNumero = true;
        } else if (!(caracter >= 'a' && caracter <= 'z')) {
            tieneEspecial = true;
        }
    }

    if (tieneMayuscula === true) {
        reqMayus.className = 'req-valido';
        reqMayus.innerHTML = '<i class="fa-solid fa-check"></i> 1 letra mayúscula';
    } else {
        reqMayus.className = 'req-invalido';
        reqMayus.innerHTML = '<i class="fa-solid fa-xmark"></i> 1 letra mayúscula';
    }

    if (tieneNumero === true) {
        reqNum.className = 'req-valido';
        reqNum.innerHTML = '<i class="fa-solid fa-check"></i> 1 número';
    } else {
        reqNum.className = 'req-invalido';
        reqNum.innerHTML = '<i class="fa-solid fa-xmark"></i> 1 número';
    }

    if (tieneEspecial === true) {
        reqEsp.className = 'req-valido';
        reqEsp.innerHTML = '<i class="fa-solid fa-check"></i> 1 carácter especial';
    } else {
        reqEsp.className = 'req-invalido';
        reqEsp.innerHTML = '<i class="fa-solid fa-xmark"></i> 1 carácter especial';
    }
});

const selector = document.getElementById('selector-rol');
const cajaInfo = document.getElementById('caja-info-dinamica');

const textoHuesped = `
    <p style="margin-top: 0; font-weight: bold; color: #444;">ROL DE HUESPED:</p>
    <ul style="color: #666; font-size: 14px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Busca alojamiento para tus próximas fechas.</li>
        <li style="margin-bottom: 8px;">Realiza nuevas reservas de forma segura.</li>
        <li>Accede al panel de "Mis reservas" para ver o cancelar tus estadías.</li>
    </ul>
`;

const textoAnfitrion = `
    <p style="margin-top: 0; font-weight: bold; color: #444;">ROL DE ANFITRION:</p>
    <ul style="color: #666; font-size: 14px; padding-left: 20px;">
        <li style="margin-bottom: 8px;">Publica, edita y retira propiedades del catálogo.</li>
        <li style="margin-bottom: 8px;">Controla qué fechas están libres o bloqueadas en tu calendario.</li>
        <li>Revisa y organiza las reservas entrantes.</li>
    </ul>
`;

if (cajaInfo) {
    cajaInfo.innerHTML = textoHuesped;
}

if (selector) {
    selector.addEventListener('change', function() {
        if (this.value === 'huesped') {
            cajaInfo.innerHTML = textoHuesped;
        } else if (this.value === 'anfitrion') {
            cajaInfo.innerHTML = textoAnfitrion;
        }
    });
}

const formCrear = document.querySelector('.cuenta-contenedor-columnas');

formCrear.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const apellido = document.querySelector('#apellido').value.trim();
    const correo = document.querySelector('#correo').value;
    const clave = document.querySelector('#clave').value;
    const claveRep = document.querySelector('#clave_rep').value;

    const msjNombre = document.querySelector('#error-nombre');
    const msjApellido = document.querySelector('#error-apellido');
    const msjCorreo = document.querySelector('#error-correo');
    const msjClave = document.querySelector('#error-clave');
    const msjClaveRep = document.querySelector('#error-clave-rep');

    msjNombre.textContent = '';
    msjApellido.textContent = '';
    msjCorreo.textContent = '';
    msjClave.textContent = '';
    msjClaveRep.textContent = '';

    let hayError = false;

    if (nombre === '') {
        msjNombre.textContent = 'El nombre no puede estar vacío.';
        hayError = true;
    }

    if (apellido === '' || apellido.length > 60) {
    msjApellido.textContent = 'Ingresá un apellido válido.';
    hayError = true;
    }

    if (correo === '') {
        msjCorreo.textContent = 'Ingrese un correo electronico válido.';
        hayError = true;
    } else {
        let tieneArroba = false;
        let tienePunto = false;
        for (let i = 0; i < correo.length; i = i + 1) {
            if (correo[i] === '@') tieneArroba = true;
            if (correo[i] === '.') tienePunto = true;
        }
        if (tieneArroba === false || tienePunto === false) {
            msjCorreo.textContent = 'Email inválido. Debe contener un @ y un punto.';
            hayError = true;
        }
    }

    if (clave === '') {
        msjClave.textContent = 'Por favor, ingrese una contraseña que cumpla con los requisitos.';
        hayError = true;
    } else if (clave.length <= 8) {
        msjClave.textContent = 'La contraseña debe tener más de 8 caracteres.';
        hayError = true;
    } else {
        let tieneMayuscula = false;
        let tieneNumero = false;
        let tieneEspecial = false;

        for (let i = 0; i < clave.length; i = i + 1) {
            let caracter = clave[i];
            if (caracter >= 'A' && caracter <= 'Z') tieneMayuscula = true;
            else if (caracter >= '0' && caracter <= '9') tieneNumero = true;
            else if (!(caracter >= 'a' && caracter <= 'z')) tieneEspecial = true;
        }

        if (tieneMayuscula === false || tieneNumero === false || tieneEspecial === false) {
            msjClave.textContent = 'Faltan requisitos: Asegúrese de cumplir con todo lo indicado arriba.';
            hayError = true;
        }
    }

    if (claveRep === '') {
        msjClaveRep.textContent = 'Debe repetir la contraseña.';
        hayError = true;
    } else if (claveRep !== clave) {
        msjClaveRep.textContent = 'Las contraseñas no coinciden.';
        hayError = true;
    }

    if (hayError === true) {
        return;
    }

    const mensajeExito = document.getElementById('mensaje-exito');
const botonCrearFormulario = document.querySelector('.btn-crear-cuenta');

mensajeExito.style.display = 'none';
botonCrearFormulario.disabled = true;

try {
    const respuesta = await fetch('http://localhost:8080/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre.trim(),
            apellido: apellido,
            email: correo.trim(),
            password: clave,
            telefono: null,
            rol: selector.value.toUpperCase()

        })
    });

    if (respuesta.status === 201) {
        mensajeExito.textContent = '¡Cuenta creada correctamente! Ahora podés iniciar sesión.';
        mensajeExito.style.display = 'block';

        setTimeout(function () {
            window.location.href = 'login.html';
        }, 2000);

        return;
    }

    if (respuesta.status === 409) {
        msjCorreo.textContent = 'Este correo ya está registrado.';
    } else if (respuesta.status === 400) {
        msjCorreo.textContent = 'Los datos ingresados no son válidos.';
    } else {
        msjCorreo.textContent = 'No se pudo crear la cuenta.';
    }

    } catch (error) {
        msjCorreo.textContent = 'No se pudo conectar con el servidor.';
    }
botonCrearFormulario.disabled = false;
});