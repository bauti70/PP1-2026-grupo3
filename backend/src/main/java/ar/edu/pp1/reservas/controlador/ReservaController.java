package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.entidad.Reserva;
import ar.edu.pp1.reservas.servicio.ReservaService;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva crear(
            @Valid @RequestBody CrearReservaRequest datos,
            HttpServletRequest request) {

        HttpSession sesion = request.getSession(false);

        if (sesion == null || sesion.getAttribute("idUsuario") == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debes iniciar sesion"
            );
        }

        if (!sesion.getAttribute("idUsuario").equals(datos.idUsuario())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No puedes reservar en nombre de otro usuario"
            );
        }

        return reservaService.crearReserva(datos);
    }

    @GetMapping
    public List<Map<String, Object>> obtenerMisReservas(
            HttpServletRequest request){
        HttpSession sesion = request.getSession(false);

        if (sesion == null || sesion.getAttribute("idUsuario") == null){
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debes iniciar sesion"
            );
        }
        Long idUsuario = (Long) sesion.getAttribute("idUsuario");

        return reservaService.obtenerMisReservas(idUsuario);
    }

    @PutMapping("/{id}/cancelar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarReserva(
            @PathVariable Long id,
            HttpServletRequest request) {

        HttpSession sesion = request.getSession(false);

        if (sesion == null || sesion.getAttribute("idUsuario") == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debes iniciar sesion"
            );
        }

        Long idUsuario = (Long) sesion.getAttribute("idUsuario");

        reservaService.cancelarReserva(id, idUsuario);
    }
}