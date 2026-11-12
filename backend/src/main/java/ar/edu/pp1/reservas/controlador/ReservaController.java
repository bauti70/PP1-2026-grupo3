
package ar.edu.pp1.reservas.controlador;

import ar.edu.pp1.reservas.entidad.Reserva;
import ar.edu.pp1.reservas.servicio.ReservaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva crear(@Valid @RequestBody CrearReservaRequest datos) {
        return reservaService.crearReserva(datos);
    }
}
