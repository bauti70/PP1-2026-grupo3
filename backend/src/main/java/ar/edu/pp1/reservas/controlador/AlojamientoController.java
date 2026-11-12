package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.entidad.Alojamiento;
import ar.edu.pp1.reservas.repositorio.AlojamientoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

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
    public List<Alojamiento> listar() {
        return repository.findByPublicadoTrue()
                .stream()
                .map(this::agregarServicios)
                .toList();
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