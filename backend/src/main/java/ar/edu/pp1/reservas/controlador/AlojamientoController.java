package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.entidad.Alojamiento;
import ar.edu.pp1.reservas.repositorio.AlojamientoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/alojamientos")
public class AlojamientoController {

    private final AlojamientoRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public AlojamientoController(
            AlojamientoRepository repository,
            JdbcTemplate jdbcTemplate
    ) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Alojamiento> listar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate entrada,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate salida
    ) {
        if ((entrada == null) != (salida == null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Completá ambas fechas"
            );
        }

        if (entrada != null &&
                (entrada.isBefore(LocalDate.now()) || !salida.isAfter(entrada))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Rango de fechas inválido"
            );
        }

        return repository.findByPublicadoTrue()
                .stream()
                .filter(alojamiento ->
                        entrada == null ||
                                estaDisponibleEnFechas(alojamiento.getId(), entrada, salida))
                .map(this::agregarServicios)
                .toList();
    }
    private boolean estaDisponibleEnFechas(
            Long idAlojamiento,
            LocalDate entrada,
            LocalDate salida
    ) {
        Long ocupaciones = jdbcTemplate.queryForObject("""
            SELECT
                (SELECT COUNT(*) FROM reserva r
                 WHERE r.id_alojamiento = ?
                   AND r.estado = 'CONFIRMADA'
                   AND r.fecha_check_in < ?
                   AND r.fecha_check_out > ?)
                +
                (SELECT COUNT(*) FROM bloqueo_disponibilidad b
                 WHERE b.id_alojamiento = ?
                   AND b.fecha >= ?
                   AND b.fecha < ?)
            """,
                Long.class,
                idAlojamiento, salida, entrada,
                idAlojamiento, entrada, salida
        );

        return ocupaciones != null && ocupaciones == 0;
    }

    @GetMapping("/{id}")
    public Alojamiento obtenerPorId(@PathVariable Long id) {
        Alojamiento alojamiento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Alojamiento no encontrado"
                ));

        return agregarServicios(alojamiento);
    }

    private Alojamiento agregarServicios(Alojamiento alojamiento) {

        Map<String, Boolean> servicios = new LinkedHashMap<>();

        servicios.put("wifi", false);
        servicios.put("desayuno", false);
        servicios.put("pileta", false);
        servicios.put("estacionamiento", false);
        servicios.put("aireAcondicionado", false);
        servicios.put("aceptaMascotas", false);

        List<String> nombres = jdbcTemplate.queryForList(
                "SELECT s.nombre " +
                        "FROM alojamiento_servicio als " +
                        "JOIN servicio s ON als.id_servicio = s.id_servicio " +
                        "WHERE als.id_alojamiento = ?",
                String.class,
                alojamiento.getId()
        );

        for (String nombre : nombres) {
            switch (nombre.toLowerCase(Locale.ROOT).trim()) {
                case "wifi", "wi-fi" ->
                        servicios.put("wifi", true);

                case "desayuno" ->
                        servicios.put("desayuno", true);

                case "pileta" ->
                        servicios.put("pileta", true);

                case "cochera", "estacionamiento" ->
                        servicios.put("estacionamiento", true);

                case "aire acondicionado" ->
                        servicios.put("aireAcondicionado", true);

                case "acepta mascotas" ->
                        servicios.put("aceptaMascotas", true);
            }
        }

        alojamiento.setServicios(servicios);

        return alojamiento;
    }
}