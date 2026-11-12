const CLAVE_PERFIL = 'perfilUsuario';

const form = document.querySelector('.form-page');
const botonesRol = document.querySelectorAll('.role-toggle button');
const secciones = {
    huesped: document.querySelector('#seccion-huesped'),
    anfitrion: document.querySelector('#seccion-anfitrion')
};

// Orden en que aparecen los campos de cada vista (sirve para mostrar errores y enfocar el primero)
const ORDEN = {
    huesped: ['nombre', 'contraseña', 'Email', 'telefono', 'nacimiento', 'ciudad', 'idioma'],
    anfitrion: ['nom_pub', 'dni', 'pago', 'Contactar']
};

const inputClave = document.querySelector('#contraseña');
const botonVerClave = document.querySelector('#ver-clave');
const inputNacimiento = document.querySelector('#nacimiento');
const imagenPerfil = document.querySelector('#foto-perfil');
const inputFoto = document.querySelector('#foto');
const botonCambiarFoto = document.querySelector('#cambiar-foto');
const botonQuitarFoto = document.querySelector('#quitar-foto');
const mensajeGuardado = document.querySelector('#mensaje-guardado');

let rolActivo = 'huesped';
let fotoPendiente = null; // null = sin cambios, '' = quitar foto, texto = foto nueva
let temporizadorMensaje = null;


/* ---------- Almacenamiento ---------- */

function leerPerfil() {
    try {
        const perfil = JSON.parse(localStorage.getItem(CLAVE_PERFIL));
        return perfil !== null && typeof perfil === 'object' ? perfil : {};
    } catch (error) {
        return {};
    }
}

function escribirPerfil(perfil) {
    try {
        localStorage.setItem(CLAVE_PERFIL, JSON.stringify(perfil));
        return true;
    } catch (error) {
        return false;
    }
}

function camposGuardables(rol) {
    return ORDEN[rol].filter(function (id) {
        return id !== 'contraseña';
    });
}

function cargarPerfil() {
    const perfil = leerPerfil();
    const todos = camposGuardables('huesped').concat(camposGuardables('anfitrion'));

    for (let i = 0; i < todos.length; i = i + 1) {
        if (typeof perfil[todos[i]] === 'string') {
            document.getElementById(todos[i]).value = perfil[todos[i]];
        }
    }

    mostrarFoto(typeof perfil.foto === 'string' ? perfil.foto : '');
}


/* ---------- Fechas ---------- */

function aISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return fecha.getFullYear() + '-' + mes + '-' + dia;
}

function fechaHaceAnios(anios) {
    const hoy = new Date();
    return aISO(new Date(hoy.getFullYear() - anios, hoy.getMonth(), hoy.getDate()));
}


/* ---------- Vistas Huésped / Anfitrión ---------- */

function cambiarRol(rol) {
    rolActivo = rol;

    secciones.huesped.classList.toggle('seccion-oculta', rol !== 'huesped');
    secciones.anfitrion.classList.toggle('seccion-oculta', rol !== 'anfitrion');

    for (let i = 0; i < botonesRol.length; i = i + 1) {
        const activo = botonesRol[i].dataset.rol === rol;
        botonesRol[i].classList.toggle('active', activo);
        botonesRol[i].setAttribute('aria-pressed', String(activo));
    }

    ocultarMensaje();
}

for (let i = 0; i < botonesRol.length; i = i + 1) {
    botonesRol[i].addEventListener('click', function () {
        cambiarRol(botonesRol[i].dataset.rol);
    });
}


/* ---------- Errores ---------- */

function ponerError(id, texto) {
    const mensaje = document.getElementById('error-' + id);
    const campo = document.getElementById(id);

    if (mensaje !== null) {
        mensaje.textContent = texto;
    }

    if (campo !== null) {
        campo.classList.toggle('input-invalido', texto !== '');
        campo.setAttribute('aria-invalid', texto !== '' ? 'true' : 'false');
    }
}

function mostrarErrores(rol, errores) {
    let primero = null;

    for (let i = 0; i < ORDEN[rol].length; i = i + 1) {
        const id = ORDEN[rol][i];
        const texto = errores[id] || '';

        ponerError(id, texto);

        if (texto !== '' && primero === null) {
            primero = id;
        }
    }

    return primero;
}

form.addEventListener('input', function (evento) {
    if (evento.target.id) {
        ponerError(evento.target.id, '');
    }
});

function mostrarMensaje(texto) {
    mensajeGuardado.textContent = texto;
    mensajeGuardado.hidden = false;

    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(ocultarMensaje, 4000);
}

function ocultarMensaje() {
    clearTimeout(temporizadorMensaje);
    mensajeGuardado.hidden = true;
}


/* ---------- Validaciones ---------- */

function valor(id) {
    return document.getElementById(id).value.trim();
}

function validarClave() {
    const clave = inputClave.value;

    if (clave === '') {
        return '';
    }

    if (clave.length <= 8) {
        return 'La contraseña debe tener más de 8 caracteres.';
    }

    if (/[A-Z]/.test(clave) === false) {
        return 'La contraseña debe tener al menos 1 letra mayúscula.';
    }

    if (/[0-9]/.test(clave) === false) {
        return 'La contraseña debe tener al menos 1 número.';
    }

    if (/[^\p{L}\d\s]/u.test(clave) === false) {
        return 'La contraseña debe tener al menos 1 carácter especial.';
    }

    return '';
}

function validarHuesped() {
    const errores = {};

    const nombre = valor('nombre');
    if (nombre.length < 2) {
        errores.nombre = 'Ingresá tu nombre completo.';
    } else if (/^[\p{L}\s'.-]+$/u.test(nombre) === false) {
        errores.nombre = 'El nombre solo puede tener letras y espacios.';
    }

    const errorClave = validarClave();
    if (errorClave !== '') {
        errores['contraseña'] = errorClave;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor('Email')) === false) {
        errores.Email = 'Ingresá un email válido (ej: nombre@correo.com).';
    }

    const telefono = valor('telefono');
    const digitos = telefono.replace(/\D/g, '');
    if (telefono === '') {
        errores.telefono = 'Ingresá un teléfono.';
    } else if (/^[+\d\s()-]+$/.test(telefono) === false || digitos.length < 8 || digitos.length > 15) {
        errores.telefono = 'Ingresá un teléfono válido (entre 8 y 15 dígitos).';
    }

    const nacimiento = valor('nacimiento');
    if (nacimiento === '') {
        errores.nacimiento = 'Ingresá tu fecha de nacimiento.';
    } else if (nacimiento > aISO(new Date())) {
        errores.nacimiento = 'La fecha de nacimiento no puede ser futura.';
    } else if (nacimiento > fechaHaceAnios(18)) {
        errores.nacimiento = 'Tenés que ser mayor de 18 años.';
    }

    if (valor('ciudad').length < 2) {
        errores.ciudad = 'Ingresá tu ciudad.';
    }

    return errores;
}

function validarAnfitrion() {
    const errores = {};

    if (valor('nom_pub').length < 2) {
        errores.nom_pub = 'Ingresá un nombre público o de empresa.';
    }

    if (/^\d{7,8}$/.test(valor('dni')) === false) {
        errores.dni = 'El DNI debe tener 7 u 8 números, sin puntos.';
    }

    const pago = valor('pago');
    if (pago === '') {
        errores.pago = 'Ingresá un CBU o un alias.';
    } else if (/^\d{22}$/.test(pago) === false && /^[A-Za-z0-9.-]{6,20}$/.test(pago) === false) {
        errores.pago = 'Ingresá un CBU de 22 dígitos o un alias de 6 a 20 caracteres (letras, números, punto o guion).';
    }

    return errores;
}


/* ---------- Contraseña: mostrar / ocultar ---------- */

botonVerClave.addEventListener('click', function () {
    const visible = inputClave.type === 'text';

    inputClave.type = visible ? 'password' : 'text';
    botonVerClave.textContent = visible ? 'Mostrar' : 'Ocultar';
});


/* ---------- Foto de perfil ---------- */

function mostrarFoto(origen) {
    imagenPerfil.hidden = origen === '';
    botonQuitarFoto.hidden = origen === '';

    if (origen !== '') {
        imagenPerfil.src = origen;
    }
}

function procesarFoto(archivo) {
    ponerError('foto', '');

    if (archivo === undefined) {
        return;
    }

    if (archivo.type.indexOf('image/') !== 0) {
        ponerError('foto', 'El archivo tiene que ser una imagen.');
        return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
        ponerError('foto', 'La imagen no puede pesar más de 5 MB.');
        return;
    }

    const lector = new FileReader();

    lector.onload = function () {
        const imagen = new Image();

        imagen.onload = function () {
            const maximo = 300;
            const escala = Math.min(1, maximo / Math.max(imagen.width, imagen.height));
            const lienzo = document.createElement('canvas');

            lienzo.width = Math.round(imagen.width * escala);
            lienzo.height = Math.round(imagen.height * escala);
            lienzo.getContext('2d').drawImage(imagen, 0, 0, lienzo.width, lienzo.height);

            fotoPendiente = lienzo.toDataURL('image/jpeg', 0.85);
            mostrarFoto(fotoPendiente);
        };

        imagen.onerror = function () {
            ponerError('foto', 'No se pudo leer la imagen.');
        };

        imagen.src = lector.result;
    };

    lector.onerror = function () {
        ponerError('foto', 'No se pudo leer el archivo.');
    };

    lector.readAsDataURL(archivo);
}

botonCambiarFoto.addEventListener('click', function () {
    inputFoto.click();
});

inputFoto.addEventListener('change', function () {
    procesarFoto(inputFoto.files[0]);
    inputFoto.value = '';
});

botonQuitarFoto.addEventListener('click', function () {
    fotoPendiente = '';
    mostrarFoto('');
});


/* ---------- Guardar ---------- */

form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje();

    const errores = rolActivo === 'huesped' ? validarHuesped() : validarAnfitrion();
    const primero = mostrarErrores(rolActivo, errores);

    if (primero !== null) {
        document.getElementById(primero).focus();
        return;
    }

    const perfil = leerPerfil();
    const campos = camposGuardables(rolActivo);

    for (let i = 0; i < campos.length; i = i + 1) {
        perfil[campos[i]] = valor(campos[i]);
    }

    if (fotoPendiente !== null) {
        perfil.foto = fotoPendiente;
    }

    if (escribirPerfil(perfil) === false) {
        ponerError('foto', 'No se pudo guardar: el almacenamiento del navegador está lleno.');
        return;
    }

    fotoPendiente = null;
    inputClave.value = '';

    mostrarMensaje(rolActivo === 'huesped' ? 'Datos personales guardados.' : 'Datos de anfitrión guardados.');
});


/* ---------- Inicio ---------- */

inputNacimiento.max = fechaHaceAnios(18);
cargarPerfil();