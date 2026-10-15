const selector = document.getElementById('selector-rol');
const cajaInfo = document.getElementById('caja-info-dinamica');

const textoAnfitrion = `
    <p>Rol de anfitrion:</p>
    <ul>
        <li>Publicar, edita y retire propiedades del catalogo</li>
        <li>Controla qué fechas están libres o bloqueadas en tu calendario</li>
        <li>Revisa y organiza las reservas entrantes.</li>
    </ul>
`;

const textoHuesped = `
    <p>Rol de huésped:</p>
    <ul>
        <li>Busca alojamiento para tus próximas fechas.</li>
        <li>Realiza nuevas reservas de forma segura.</li>
        <li>Accede al panel de "Mis reservas" para ver o cancelar tus estadías.</li>
    </ul>
`;

if (cajaInfo) {
    cajaInfo.innerHTML = textoAnfitrion;
}

if (selector) {
    selector.addEventListener('change', function() {
        if (this.value === 'anfitrion') {
            cajaInfo.innerHTML = textoAnfitrion;
        } else if (this.value === 'huesped') {
            cajaInfo.innerHTML = textoHuesped;
        }
    });
}