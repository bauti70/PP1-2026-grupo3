package ar.edu.pp1.reservas.controlador;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CrearReservaRequest(
        @NotNull Long idAlojamiento,
        @NotNull Long idUsuario,
        @NotNull LocalDate fechaCheckIn,
        @NotNull LocalDate fechaCheckOut,
        @NotNull @Min(1) Integer cantidadHuespedes,
        String solicitudEspecial
) {
}
