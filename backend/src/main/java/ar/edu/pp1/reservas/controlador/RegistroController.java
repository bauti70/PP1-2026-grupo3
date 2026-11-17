package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.servicio.ContrasenaUtil;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/registro")
public class RegistroController {

    private final JdbcTemplate jdbcTemplate;

    public RegistroController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public record RegistroRequest(
            String nombre,
            String apellido,
            String email,
            String password,
            String telefono,
            String rol
    ) {
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registrar(@RequestBody RegistroRequest datos) {

        String nombre = datos.nombre() == null ? "" : datos.nombre().trim();
        String apellido = datos.apellido() == null ? "" : datos.apellido().trim();
        String correo = datos.email() == null
                ? ""
                : datos.email().trim().toLowerCase(Locale.ROOT);

        String password = datos.password();
        String telefono = datos.telefono() == null
                ? null
                : datos.telefono().trim();

        if (telefono != null && telefono.isEmpty()) {
            telefono = null;
        }

        String rol = datos.rol() == null
                ? "HUESPED"
                : datos.rol().trim().toUpperCase(Locale.ROOT);

        if (!rol.equals("HUESPED") && !rol.equals("ANFITRION")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El rol debe ser HUESPED o ANFITRION"
            );
        }


        if (nombre.isEmpty() || nombre.length() > 60 ||
                apellido.isEmpty() || apellido.length() > 60 ||
                correo.length() > 120 ||
                !correo.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") ||
                password == null || password.length() < 8 ||
                (telefono != null && telefono.length() > 30)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Datos inválidos. La contraseña debe tener al menos 8 caracteres"
            );
        }

        try {
            jdbcTemplate.update(
                    "INSERT INTO usuario " +
                            "(nombre, apellido, correo, contrasena, telefono, rol, activo) " +
                            "VALUES (?, ?, ?, ?, ?, ?, 1)",
                    nombre,
                    apellido,
                    correo,
                    ContrasenaUtil.proteger(password),
                    telefono,
                    rol
            );
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El correo ya está registrado"
            );
        }

        return Map.of("registrado", true);
    }
}
