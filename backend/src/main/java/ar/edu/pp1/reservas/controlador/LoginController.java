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

    private record UsuarioLogin(
            Long id,
            String contrasena,
            String rol,
            String nombre
    ) {
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
                "SELECT id_usuario, contrasena, rol, CONCAT_WS('', nombre, apellido) AS nombre FROM usuario " +
                        "WHERE correo = ? AND activo = 1",

                (resultado, fila) -> new UsuarioLogin(
                        resultado.getLong("id_usuario"),
                        resultado.getString("contrasena"),
                        resultado.getString("rol"),
                        resultado.getString("nombre")
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

        UsuarioLogin usuario = usuarios.get(0);

        sesion.setAttribute("idUsuario", usuario.id());
        sesion.setAttribute("rol", usuario.rol());

        return Map.of(
                "autenticado", true,
                "id", usuario.id(),
                "rol", usuario.rol(),
                "nombre", usuario.nombre()
        );
    }

    @PostMapping("/cerrar-sesion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cerrarSesion(HttpSession sesion){
        sesion.invalidate();
    }
}
