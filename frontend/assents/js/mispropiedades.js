const filas = document.querySelectorAll('.misprop-fila');
const checkTodas = document.getElementById('estado-todas');
const checkPublicadas = document.getElementById('estado-publicadas');
const checkRetiradas = document.getElementById('estado-retiradas');
const mensajeVacio = document.querySelector('.misprop-vacio');
const buscador = document.querySelector('.buscador-header input');
const lupa = document.querySelector('.buscador-header i');




function estaPublicada(fila) {
    const badge = fila.querySelector('.misprop-badge');
    return badge.classList.contains('misprop-publicada');
}




function actualizarContadores() {
    let publicadas = 0;
    let retiradas = 0;

    for (let i = 0; i < filas.length; i = i + 1) {
        if (estaPublicada(filas[i])) {
            publicadas = publicadas + 1;
        } else {
            retiradas = retiradas + 1;
        }
    }

    document.querySelector('label[for="estado-todas"]').textContent = 'Todas (' + filas.length + ')';
    document.querySelector('label[for="estado-publicadas"]').textContent = 'Publicadas (' + publicadas + ')';
    document.querySelector('label[for="estado-retiradas"]').textContent = 'Retiradas (' + retiradas + ')';
    document.querySelector('.misprop-total strong').textContent = filas.length;
}




function aplicarFiltro() {
    let visibles = 0;

    for (let i = 0; i < filas.length; i = i + 1) {
        let mostrar = true;

        if (!checkTodas.checked) {
            const publicada = estaPublicada(filas[i]);
            mostrar = (publicada && checkPublicadas.checked) || (!publicada && checkRetiradas.checked);
        }

        if (mostrar) {
            filas[i].style.display = '';
            visibles = visibles + 1;
        } else {
            filas[i].style.display = 'none';
        }
    }

    mensajeVacio.hidden = visibles > 0;
}


checkTodas.addEventListener('change', function() {
    checkTodas.checked = true;
    checkPublicadas.checked = false;
    checkRetiradas.checked = false;
    aplicarFiltro();
});


function cambioFiltroEstado() {
    if (checkPublicadas.checked === checkRetiradas.checked) {
        checkTodas.checked = true;
        checkPublicadas.checked = false;
        checkRetiradas.checked = false;
    } else {
        checkTodas.checked = false;
    }
    aplicarFiltro();
}

checkPublicadas.addEventListener('change', cambioFiltroEstado);
checkRetiradas.addEventListener('change', cambioFiltroEstado);




const botonesEditar = document.querySelectorAll('.misprop-boton-editar');

for (let i = 0; i < botonesEditar.length; i = i + 1) {
    botonesEditar[i].addEventListener('click', function() {
        const fila = this.closest('.misprop-fila');
        window.location.href = 'editar_alojamiento.html?id=' + fila.dataset.id;
    });
}




const botonesEstado = document.querySelectorAll('.misprop-boton-retirar, .misprop-boton-republicar');

for (let i = 0; i < botonesEstado.length; i = i + 1) {
    botonesEstado[i].addEventListener('click', function() {

        const fila = this.closest('.misprop-fila');
        const badge = fila.querySelector('.misprop-badge');
        const nombre = fila.querySelector('.misprop-nombre').textContent;

        if (this.textContent === 'Retirar') {
            if (!confirm('¿Querés retirar "' + nombre + '"?')) {
                return;
            }

            badge.textContent = 'RETIRADA';
            badge.classList.remove('misprop-publicada');
            badge.classList.add('misprop-retirada');
            this.textContent = 'Republicar';
            this.classList.remove('misprop-boton-retirar');
            this.classList.add('misprop-boton-republicar');
        }
        else if (this.textContent === 'Republicar') {
            badge.textContent = 'PUBLICADA';
            badge.classList.remove('misprop-retirada');
            badge.classList.add('misprop-publicada');

            this.textContent = 'Retirar';
            this.classList.remove('misprop-boton-republicar');
            this.classList.add('misprop-boton-retirar');
        }

        actualizarContadores();
        aplicarFiltro();
    });
}




function buscarDestino() {
    const texto = buscador.value.trim();

    if (texto === '') {
        return;
    }

    window.location.href = 'catalog-filtro.html?ciudad=' + encodeURIComponent(texto);
}

buscador.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        buscarDestino();
    }
});

lupa.style.cursor = 'pointer';
lupa.addEventListener('click', buscarDestino);




actualizarContadores();
aplicarFiltro();