package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.servicio.ContrasenaUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final JdbcTemplate jdbcTemplate;

    public LoginController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public record LoginRequest(String email, String password) {
    }

    private record UsuarioLogin(Long id, String contrasena) {
    }

    @PostMapping
    public Map<String, Object> iniciarSesion(
            @RequestBody LoginRequest datos,
            HttpSession sesion) {

        if (datos.email() == null ||
                datos.email().isBlank() ||
                datos.password() == null ||
                datos.password().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Correo y contraseña obligatorios"
            );
        }

        String correo = datos.email().trim().toLowerCase(Locale.ROOT);

        List<UsuarioLogin> usuarios = jdbcTemplate.query(
                "SELECT id_usuario, contrasena FROM usuario " +
                        "WHERE correo = ? AND activo = 1 AND rol = 'HUESPED'",
                (resultado, fila) -> new UsuarioLogin(
                        resultado.getLong("id_usuario"),
                        resultado.getString("contrasena")
                ),
                correo
        );

        if (usuarios.isEmpty() ||
                !ContrasenaUtil.verificar(
                        datos.password(),
                        usuarios.get(0).contrasena()
                )) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Credenciales incorrectas"
            );
        }

        sesion.setAttribute("idUsuario", usuarios.get(0).id());

        return Map.of("autenticado", true);
    }
}
