const botonesEditar = document.querySelectorAll('.misprop-boton-editar');

for (let i = 0; i < botonesEditar.length; i = i + 1) {
    botonesEditar[i].addEventListener('click', function() {
        window.location.href = 'mispropiedades.html';
    });
}

const botonesEstado = document.querySelectorAll('.misprop-boton-retirar, .misprop-boton-republicar');

for (let i = 0; i < botonesEstado.length; i = i + 1) {
    botonesEstado[i].addEventListener('click', function() {
        
        const fila = this.closest('.misprop-fila');
        const badge = fila.querySelector('.misprop-badge');

        if (this.textContent === 'Retirar') {
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
    });
}