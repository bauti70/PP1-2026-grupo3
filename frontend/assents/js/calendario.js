(function () {
    'use strict';

    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var ESTADOS = { libre: 'Libre', ocupada: 'Ocupada', bloqueada: 'Bloqueada' };

   
    var RESERVAS = {
        '1': [[3, 5], [20, 23]],
        '2': [[8, 12]],
        '3': [[1, 2], [14, 16]]
    };

    function $(id) { return document.getElementById(id); }
    function pad(n) { return String(n).padStart(2, '0'); }
    function aISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function deISO(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
    function sumar(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    var el = {
        cuerpo: $('cal-cuerpo'),
        tabla: $('cal-tabla'),
        titulo: $('titulo-mes'),
        prev: $('cal-prev'),
        next: $('cal-next'),
        hoy: $('cal-hoy'),
        propiedad: $('propiedad'),
        form: $('form-bloqueo'),
        desde: $('desde'),
        hasta: $('hasta'),
        motivo: $('motivo'),
        resDias: $('res-dias'),
        resRango: $('res-rango'),
        aplicar: $('cal-aplicar'),
        mensaje: $('cal-mensaje'),
        hora: $('cal-hora')
    };

    var estado = {
        mes: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
        inicio: aISO(hoy),
        fin: aISO(sumar(hoy, 2)),
        esperandoFin: false,
        modo: 'bloquear',
        ocupadas: {},
        bloqueadas: {}
    };

    

    function claveStorage() { return 'calendario:bloqueos:' + el.propiedad.value; }

    function cargarPropiedad() {
        estado.ocupadas = {};
        (RESERVAS[el.propiedad.value] || []).forEach(function (r) {
            for (var i = r[0]; i <= r[1]; i++) estado.ocupadas[aISO(sumar(hoy, i))] = true;
        });
        try {
            estado.bloqueadas = JSON.parse(localStorage.getItem(claveStorage())) || {};
        } catch (e) {
            estado.bloqueadas = {};
        }
    }

    function guardar() {
        try { localStorage.setItem(claveStorage(), JSON.stringify(estado.bloqueadas)); } catch (e) { /* sin storage */ }
        var d = new Date();
        el.hora.textContent = 'Actualizado hoy, ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function estadoDe(iso) {
        if (estado.ocupadas[iso]) return 'ocupada';
        if (estado.bloqueadas[iso]) return 'bloqueada';
        return 'libre';
    }

    function diasDelRango() {
        var dias = [];
        var d = deISO(estado.inicio);
        var fin = deISO(estado.fin);
        while (d <= fin) {
            dias.push(aISO(d));
            d = sumar(d, 1);
        }
        return dias;
    }

   

    function celda(fecha, fuera, enRango) {
        var iso = aISO(fecha);
        var num = fecha.getDate();
        if (fuera) {
            return '<td class="cal-dia-fuera"><span class="cal-numero">' + num + '</span></td>';
        }
        var est = estadoDe(iso);
        var clase = enRango ? 'cal-dia-seleccionado' : '';
        var label = num + ' de ' + MESES[fecha.getMonth()] + ', ' + ESTADOS[est].toLowerCase() + (enRango ? ', seleccionado' : '');
        var marca = enRango ? '<i class="fa-solid fa-circle-check cal-marca-seleccion" aria-hidden="true"></i>' : '';
        return '<td class="' + clase + '" data-fecha="' + iso + '" tabindex="0" aria-label="' + label + '">' +
            '<span class="cal-numero">' + num + '</span>' + marca +
            '<span class="cal-estado cal-' + est + '"><i class="fa-solid fa-circle" aria-hidden="true"></i> ' + ESTADOS[est] + '</span>' +
            '</td>';
    }

    function renderCalendario() {
        var anio = estado.mes.getFullYear();
        var mes = estado.mes.getMonth();
        var diasMes = new Date(anio, mes + 1, 0).getDate();
        var offset = (estado.mes.getDay() + 6) % 7; 
        var semanas = Math.ceil((offset + diasMes) / 7);
        var rango = {};
        diasDelRango().forEach(function (d) { rango[d] = true; });

        el.titulo.innerHTML = MESES[mes].charAt(0).toUpperCase() + MESES[mes].slice(1) + ' <span>' + anio + '</span>';
        el.tabla.setAttribute('aria-label', 'Disponibilidad de ' + MESES[mes] + ' de ' + anio);

        var html = '';
        for (var s = 0; s < semanas; s++) {
            html += '<tr>';
            for (var c = 0; c < 7; c++) {
                var fecha = new Date(anio, mes, 1 - offset + s * 7 + c);
                var fuera = fecha.getMonth() !== mes;
                html += celda(fecha, fuera, !fuera && rango[aISO(fecha)]);
            }
            html += '</tr>';
        }
        el.cuerpo.innerHTML = html;
    }

    function textoRango() {
        var a = deISO(estado.inicio);
        var b = deISO(estado.fin);
        if (estado.inicio === estado.fin) {
            return a.getDate() + ' de ' + MESES[a.getMonth()] + ' de ' + a.getFullYear();
        }
        if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
            return a.getDate() + '–' + b.getDate() + ' de ' + MESES[b.getMonth()] + ' de ' + b.getFullYear();
        }
        return a.getDate() + ' de ' + MESES[a.getMonth()] + ' – ' + b.getDate() + ' de ' + MESES[b.getMonth()] + ' de ' + b.getFullYear();
    }

    function renderFormulario() {
        var n = diasDelRango().length;
        var txt = n + (n === 1 ? ' día' : ' días');
        var bloquear = estado.modo === 'bloquear';

        el.desde.value = estado.inicio;
        el.hasta.value = estado.fin;
        el.resDias.textContent = txt;
        el.resRango.textContent = textoRango();
        el.motivo.disabled = !bloquear;
        el.aplicar.innerHTML = '<i class="fa-solid ' + (bloquear ? 'fa-lock' : 'fa-unlock') + '" aria-hidden="true"></i> ' +
            (bloquear ? 'Bloquear ' : 'Liberar ') + txt;

        document.querySelectorAll('.cal-modo').forEach(function (b) {
            b.classList.toggle('cal-modo-activo', b.dataset.modo === estado.modo);
        });
    }

    function render() {
        renderCalendario();
        renderFormulario();
    }

    function mostrarMensaje(texto, tipo) {
        el.mensaje.textContent = texto;
        el.mensaje.className = 'cal-mensaje cal-mensaje-' + tipo;
        el.mensaje.hidden = false;
    }

    function limpiarMensaje() { el.mensaje.hidden = true; }

  

    function fijarRango(a, b) {
        if (a > b) { var t = a; a = b; b = t; }
        estado.inicio = a;
        estado.fin = b;
    }

    function irAlMesDe(iso) {
        var d = deISO(iso);
        estado.mes = new Date(d.getFullYear(), d.getMonth(), 1);
    }

    function clickDia(iso) {
        limpiarMensaje();
        if (!estado.esperandoFin) {
            estado.inicio = iso;
            estado.fin = iso;
            estado.esperandoFin = true;
        } else {
            fijarRango(estado.inicio, iso);
            estado.esperandoFin = false;
        }
        render();
    }

    el.cuerpo.addEventListener('click', function (e) {
        var td = e.target.closest('td[data-fecha]');
        if (td) clickDia(td.dataset.fecha);
    });

    el.cuerpo.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var td = e.target.closest('td[data-fecha]');
        if (!td) return;
        e.preventDefault();
        clickDia(td.dataset.fecha);
        var nueva = el.cuerpo.querySelector('td[data-fecha="' + td.dataset.fecha + '"]');
        if (nueva) nueva.focus();
    });

    

    el.prev.addEventListener('click', function () {
        estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() - 1, 1);
        renderCalendario();
    });

    el.next.addEventListener('click', function () {
        estado.mes = new Date(estado.mes.getFullYear(), estado.mes.getMonth() + 1, 1);
        renderCalendario();
    });

    el.hoy.addEventListener('click', function () {
        estado.mes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fijarRango(aISO(hoy), aISO(hoy));
        estado.esperandoFin = false;
        limpiarMensaje();
        render();
    });

    el.propiedad.addEventListener('change', function () {
        cargarPropiedad();
        limpiarMensaje();
        renderCalendario();
    });

   

    document.querySelectorAll('.cal-modo').forEach(function (b) {
        b.addEventListener('click', function () {
            estado.modo = b.dataset.modo;
            limpiarMensaje();
            renderFormulario();
        });
    });

    el.desde.addEventListener('change', function () {
        if (!el.desde.value) return;
        var fin = el.hasta.value && el.hasta.value >= el.desde.value ? el.hasta.value : el.desde.value;
        fijarRango(el.desde.value, fin);
        estado.esperandoFin = false;
        irAlMesDe(estado.inicio);
        limpiarMensaje();
        render();
    });

    el.hasta.addEventListener('change', function () {
        if (!el.hasta.value) return;
        var ini = el.desde.value && el.desde.value <= el.hasta.value ? el.desde.value : el.hasta.value;
        fijarRango(ini, el.hasta.value);
        estado.esperandoFin = false;
        limpiarMensaje();
        render();
    });

    document.querySelectorAll('.cal-btn-rapido').forEach(function (b) {
        b.addEventListener('click', function () {
            var ini = deISO(estado.inicio);
            var fin;
            if (b.dataset.rapido === 'finde') {
                var hastaSabado = (6 - ini.getDay() + 7) % 7; 
                if (ini.getDay() === 0) hastaSabado = 6; 
                ini = sumar(ini, hastaSabado);
                fin = sumar(ini, 1);
            } else {
                fin = sumar(ini, Number(b.dataset.rapido) - 1);
            }
            fijarRango(aISO(ini), aISO(fin));
            estado.esperandoFin = false;
            irAlMesDe(estado.inicio);
            limpiarMensaje();
            render();
        });
    });

    function aplicar() {
        var dias = diasDelRango();
        var bloquear = estado.modo === 'bloquear';

        if (dias.some(function (d) { return d < aISO(hoy); })) {
            mostrarMensaje('No se pueden modificar fechas pasadas.', 'error');
            return;
        }
        if (dias.some(function (d) { return estado.ocupadas[d]; })) {
            mostrarMensaje('El rango incluye días con reserva confirmada. Elegí otro rango.', 'error');
            return;
        }

        var cambios = 0;
        dias.forEach(function (d) {
            if (bloquear && !estado.bloqueadas[d]) {
                estado.bloqueadas[d] = { motivo: el.motivo.value };
                cambios++;
            } else if (!bloquear && estado.bloqueadas[d]) {
                delete estado.bloqueadas[d];
                cambios++;
            }
        });

        if (cambios === 0) {
            mostrarMensaje(bloquear ? 'Esos días ya estaban bloqueados.' : 'Esos días ya estaban libres.', 'error');
            return;
        }

        guardar();
        render();
        mostrarMensaje((bloquear ? 'Se bloquearon ' : 'Se liberaron ') + cambios + (cambios === 1 ? ' día.' : ' días.'), 'ok');
    }

    el.aplicar.addEventListener('click', aplicar);
    el.form.addEventListener('submit', function (e) { e.preventDefault(); aplicar(); });

   

    cargarPropiedad();
    render();
})();