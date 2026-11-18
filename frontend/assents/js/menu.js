var rolMenu = localStorage.getItem('rolUsuario');
var sesionMenu = localStorage.getItem('sesionIniciada');

var paginas = [
    ['Catálogo', 'catalog-filtro.html']
];

if (sesionMenu === 'true') {

    if (rolMenu === 'HUESPED') {
        paginas.push(
            ['Mis reservas', 'misreservas.html']
        );
    }

    if (rolMenu === 'ANFITRION') {
        paginas.push(
            ['Mis propiedades', 'mispropiedades.html'],
            ['Publicar propiedad', 'publicarpropiedad.html'],
            ['Reservas recibidas', 'reservas-recibidas.html'],
            ['Calendario', 'calendario.html']
        );
    }

    paginas.push(['Editar perfil', 'editar.html']);
}

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

if(localStorage.getItem('sesionIniciada') === 'true'){
    html += '<button type="button" id="btn-cerrar-sesion" class="menu-cerrar-sesion">Cerrar sesión</button>';
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

const botonCerrarSesion = document.querySelector('#btn-cerrar-sesion');

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', async function () {
        try {
            const respuesta = await fetch(`http://${window.location.hostname}:8080/api/login/cerrar-sesion`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo cerrar la sesión');
            }

            localStorage.removeItem('idUsuario');
            localStorage.removeItem('rolUsuario');
            localStorage.removeItem('nombreUsuario');
            localStorage.removeItem('sesionIniciada');
            localStorage.removeItem('volverA');

            window.location.href = 'index.html';

        } catch (error) {
            alert('No se pudo cerrar la sesión. Intentalo nuevamente.');
        }
    });
}