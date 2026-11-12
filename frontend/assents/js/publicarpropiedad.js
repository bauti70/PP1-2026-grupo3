const form = document.getElementById('form-publicar');
const campoNombre = document.getElementById('nombre');
const campoDireccion = document.getElementById('direccion');
const campoDescripcion = document.getElementById('descripcion');
const campoPrecio = document.getElementById('precio');
const campoImagenes = document.getElementById('imagenes');
const ocupantesMax = document.getElementById('ocupantes-maximos');
const ocupantesMin = document.getElementById('ocupantes-minimos');
const cajaImagenes = document.querySelector('.caja-imagenes');
const vistaPrevia = document.querySelector('.vista-previa');
const mensajeImagenes = document.querySelector('.mensaje-imagenes');
const mensajePublicado = document.getElementById('mensaje-publicado');
const botonPublicar = document.querySelector('.btn-publicar');

const MAX_IMAGENES = 10;
const MAX_MB = 5;


// ---------- Textos: no aceptar solo espacios ----------

function validarTexto(campo) {
    if (campo.value !== '' && campo.value.trim() === '') {
        campo.setCustomValidity('No puede tener solo espacios.');
    } else {
        campo.setCustomValidity('');
    }
}

const camposTexto = [campoNombre, campoDireccion, campoDescripcion];

for (let i = 0; i < camposTexto.length; i = i + 1) {
    camposTexto[i].addEventListener('input', function() {
        validarTexto(this);
    });
}


// ---------- Ocupantes: el mínimo no puede superar al máximo ----------

function validarOcupantes() {
    if (parseInt(ocupantesMin.value) > parseInt(ocupantesMax.value)) {
        ocupantesMin.setCustomValidity('El mínimo no puede ser mayor que el máximo.');
    } else {
        ocupantesMin.setCustomValidity('');
    }
}

ocupantesMax.addEventListener('change', validarOcupantes);
ocupantesMin.addEventListener('change', validarOcupantes);


// ---------- Imágenes: validación y vista previa ----------

function mostrarImagenes() {
    const archivos = campoImagenes.files;

    vistaPrevia.innerHTML = '';
    mensajeImagenes.textContent = '';
    mensajeImagenes.classList.remove('error');
    campoImagenes.setCustomValidity('');

    if (archivos.length === 0) {
        return;
    }

    let error = '';

    if (archivos.length > MAX_IMAGENES) {
        error = 'Podés subir hasta ' + MAX_IMAGENES + ' imágenes.';
    }

    for (let i = 0; i < archivos.length; i = i + 1) {
        if (!archivos[i].type.startsWith('image/')) {
            error = '"' + archivos[i].name + '" no es una imagen.';
        } else if (archivos[i].size > MAX_MB * 1024 * 1024) {
            error = '"' + archivos[i].name + '" pesa más de ' + MAX_MB + ' MB.';
        }
    }

    if (error !== '') {
        mensajeImagenes.textContent = error;
        mensajeImagenes.classList.add('error');
        campoImagenes.setCustomValidity(error);
        return;
    }

    for (let i = 0; i < archivos.length; i = i + 1) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(archivos[i]);
        img.alt = archivos[i].name;
        vistaPrevia.appendChild(img);
    }

    if (archivos.length === 1) {
        mensajeImagenes.textContent = '1 imagen seleccionada';
    } else {
        mensajeImagenes.textContent = archivos.length + ' imágenes seleccionadas';
    }
}

campoImagenes.addEventListener('change', mostrarImagenes);

// Resaltar la caja al arrastrar archivos encima
cajaImagenes.addEventListener('dragover', function() {
    cajaImagenes.classList.add('arrastrando');
});

cajaImagenes.addEventListener('dragleave', function() {
    cajaImagenes.classList.remove('arrastrando');
});

cajaImagenes.addEventListener('drop', function() {
    cajaImagenes.classList.remove('arrastrando');
});


// ---------- Publicar ----------
// El navegador valida los campos "required" antes de llegar acá.

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const servicios = [];
    const marcados = form.querySelectorAll('input[name="servicios"]:checked');

    for (let i = 0; i < marcados.length; i = i + 1) {
        servicios.push(marcados[i].value);
    }

    const propiedad = {
        nombre: campoNombre.value.trim(),
        direccion: campoDireccion.value.trim(),
        email: document.getElementById('email').value.trim(),
        descripcion: campoDescripcion.value.trim(),
        precio: Number(campoPrecio.value),
        servicios: servicios,
        ocupantesMaximos: ocupantesMax.value,
        ocupantesMinimos: ocupantesMin.value,
        banos: document.getElementById('baños').value,
        habitaciones: document.getElementById('habitaciones').value,
        cantidadImagenes: campoImagenes.files.length
    };

    // Se guarda en el navegador (todavía no hay servidor)
    const guardadas = JSON.parse(localStorage.getItem('propiedadesPublicadas')) || [];
    guardadas.push(propiedad);
    localStorage.setItem('propiedadesPublicadas', JSON.stringify(guardadas));

    botonPublicar.disabled = true;
    mensajePublicado.textContent = '¡Propiedad publicada! Te llevamos a Mis propiedades...';
    mensajePublicado.hidden = false;

    setTimeout(function() {
        window.location.href = 'mispropiedades.html';
    }, 1500);
});