

var paginas = [
    
    ['Catálogo', 'catalog-filtro.html'],
    ['Mis reservas', 'misreservas.html'],
    ['Mis propiedades', 'mispropiedades.html'],
    ['Publicar propiedad', 'publicarpropiedad.html'],
    ['Reservas recibidas', 'reservas-recibidas.html'],
    ['Calendario', 'calendario.html'],
    ['Editar perfil', 'editar.html'],
   
];

var paginaActual = location.pathname.split('/').pop();
if (paginaActual === '') {
    paginaActual = 'index.html';
}


var botonMenu = document.querySelector('.btn-menu');
if (!botonMenu) {
    botonMenu = document.createElement('button');
    botonMenu.className = 'btn-menu btn-menu-flotante';
    botonMenu.textContent = '☰';
    document.body.appendChild(botonMenu);
}
botonMenu.setAttribute('aria-label', 'Abrir menú');


var fondoMenu = document.createElement('div');
fondoMenu.className = 'menu-fondo';
document.body.appendChild(fondoMenu);


var menuLateral = document.createElement('nav');
menuLateral.className = 'menu-lateral';

var html = '<button class="menu-cerrar" aria-label="Cerrar menú">✕</button>';
for (var i = 0; i < paginas.length; i++) {
    var clase = '';
    if (paginas[i][1] === paginaActual) {
        clase = ' class="activo"';
    }
    html += '<a href="' + paginas[i][1] + '"' + clase + '>' + paginas[i][0] + '</a>';
}
menuLateral.innerHTML = html;
document.body.appendChild(menuLateral);


function abrirMenu() {
    menuLateral.classList.add('abierto');
    fondoMenu.classList.add('abierto');
}

function cerrarMenu() {
    menuLateral.classList.remove('abierto');
    fondoMenu.classList.remove('abierto');
}

botonMenu.addEventListener('click', abrirMenu);
fondoMenu.addEventListener('click', cerrarMenu);
menuLateral.querySelector('.menu-cerrar').addEventListener('click', cerrarMenu);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        cerrarMenu();
    }
});