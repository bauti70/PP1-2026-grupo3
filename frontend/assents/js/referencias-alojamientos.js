const idsActualesAlojamientos = {
    'Apartamento vista al rio': 7,
    'Casa en la montaña': 8,
    'Departamento Centrico': 9,
    'Cabaña en el lago': 10,
    'Cabaña en el bosque': 11,
    'Selina Salta': 12,
    'Cabaña Rancho Pampa': 14
};


function obtenerIdAlojamientoActual(nombre) {
    let id = null;

    if (typeof idsActualesAlojamientos[nombre] === 'number') {
        id = idsActualesAlojamientos[nombre];
    }

    return id;
}


async function cargarCalificacionesInicio() {
    let alojamientos = [];

    try {
        const respuesta = await fetch('data/alojamientos.json');

        if (respuesta.ok === false) {
            throw new Error('No se pudieron leer las calificaciones del inicio.');
        }

        const datos = await respuesta.json();

        if (Array.isArray(datos) === false) {
            throw new Error('El archivo de alojamientos debe contener una lista.');
        }

        alojamientos = datos;
    } catch (error) {
        console.warn('No se pudieron cargar las calificaciones del inicio.', error);
    }

    return alojamientos;
}


function obtenerCalificacionAlojamiento(alojamiento, alojamientosInicio) {
    let calificacion = null;

    if (typeof alojamiento.calificacion === 'number' && alojamiento.calificacion >= 0 && alojamiento.calificacion <= 5) {
        calificacion = alojamiento.calificacion;
    } else {
        for (let i = 0; i < alojamientosInicio.length; i = i + 1) {
            const referencia = alojamientosInicio[i];

            if (referencia !== null && typeof referencia === 'object') {
                const idActual = obtenerIdAlojamientoActual(referencia.nombre);

                if (idActual === alojamiento.id && referencia.nombre === alojamiento.nombre && typeof referencia.calificacion === 'number' && referencia.calificacion >= 0 && referencia.calificacion <= 5) {
                    calificacion = referencia.calificacion;
                    break;
                }
            }
        }
    }

    return calificacion;
}
