
package ar.edu.pp1.reservas.servicio;

import ar.edu.pp1.reservas.controlador.CrearReservaRequest;
import ar.edu.pp1.reservas.entidad.Alojamiento;
import ar.edu.pp1.reservas.entidad.Reserva;
import ar.edu.pp1.reservas.repositorio.AlojamientoRepository;
import ar.edu.pp1.reservas.repositorio.ReservaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final AlojamientoRepository alojamientoRepository;
    private final JdbcTemplate jdbcTemplate;

    public ReservaService(
            ReservaRepository reservaRepository,
            AlojamientoRepository alojamientoRepository,
            JdbcTemplate jdbcTemplate) {

        this.reservaRepository = reservaRepository;
        this.alojamientoRepository = alojamientoRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void validarDatos(
            Long idAlojamiento,
            LocalDate entrada,
            LocalDate salida,
            Integer huespedes) {

        if (entrada == null || salida == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Las fechas son obligatorias"
            );
        }

        if (entrada.isBefore(LocalDate.now())
                || !salida.isAfter(entrada)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Las fechas no son validas"
            );
        }

        if (idAlojamiento == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El alojamiento es obligatorio"
            );
        }

        Alojamiento alojamiento = alojamientoRepository.findById(idAlojamiento)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Alojamiento no encontrado"
                ));

        if (!Boolean.TRUE.equals(alojamiento.getPublicado())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El alojamiento no esta publicado"
            );
        }

        if (huespedes == null || huespedes < 1
                || huespedes > alojamiento.getCapacidad()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cantidad de huespedes no permitida"
            );
        }

        for (Reserva existente :
                reservaRepository.findByIdAlojamiento(idAlojamiento)) {

            if ("CONFIRMADA".equals(existente.getEstado())
                    && entrada.isBefore(existente.getFechaCheckOut())
                    && salida.isAfter(existente.getFechaCheckIn())) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "El alojamiento ya esta reservado para esas fechas"
                );
            }
        }

        if (reservaRepository.contarBloqueos(
                idAlojamiento, entrada, salida) > 0) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El alojamiento tiene fechas bloqueadas"
            );
        }
    }

    @Transactional
    public Reserva crearReserva(CrearReservaRequest datos) {

        validarDatos(
                datos.idAlojamiento(),
                datos.fechaCheckIn(),
                datos.fechaCheckOut(),
                datos.cantidadHuespedes()
        );

        Integer usuariosValidos = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuario " + "WHERE id_usuario = ? AND activo = 1 " + "AND rol IN ('HUESPED', 'ANFITRION')",
                Integer.class,
                datos.idUsuario()
        );

        if (usuariosValidos == null || usuariosValidos == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario no esta activo o no tiene un rol valido"
            );
        }


        Integer alojamientoPropio = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM alojamiento " +
                        "WHERE id_alojamiento = ? AND id_usuario_anfitrion = ?",
                Integer.class,
                datos.idAlojamiento(),
                datos.idUsuario()
        );

        if (alojamientoPropio != null && alojamientoPropio > 0) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No puedes reservar tu propio alojamiento"
            );
        }

        Alojamiento alojamiento = alojamientoRepository
                .findById(datos.idAlojamiento())
                .orElseThrow();

        long noches = ChronoUnit.DAYS.between(
                datos.fechaCheckIn(),
                datos.fechaCheckOut()
        );

        BigDecimal total = alojamiento.getPrecioPorNoche()
                .multiply(BigDecimal.valueOf(noches));

        Reserva reserva = new Reserva();

        reserva.setIdAlojamiento(datos.idAlojamiento());
        reserva.setIdUsuario(datos.idUsuario());
        reserva.setFechaCheckIn(datos.fechaCheckIn());
        reserva.setFechaCheckOut(datos.fechaCheckOut());
        reserva.setCantidadHuespedes(datos.cantidadHuespedes());
        reserva.setImporteTotal(total);
        reserva.setEstado("CONFIRMADA");
        reserva.setSolicitudEspecial(datos.solicitudEspecial());

        return reservaRepository.save(reserva);
    }

    public List<Map<String, Object>> obtenerMisReservas(Long idUsuario) {

        return jdbcTemplate.queryForList("""
            SELECT
                r.id_reserva AS id,
                r.id_alojamiento AS idAlojamiento,
                a.nombre AS alojamiento,
                a.descripcion AS descripcion,
                a.imagen AS imagen,
                r.fecha_check_in AS fechaCheckIn,
                r.fecha_check_out AS fechaCheckOut,
                r.cantidad_huespedes AS cantidadHuespedes,
                r.importe_total AS importeTotal,
                r.estado AS estado
            FROM reserva r
            JOIN alojamiento a
                ON r.id_alojamiento = a.id_alojamiento
            WHERE r.id_usuario = ?
            ORDER BY r.fecha_check_in DESC
            """, idUsuario);
    }

    @Transactional
    public void cancelarReserva(Long idReserva, Long idUsuario) {

        int filas = jdbcTemplate.update(
                "UPDATE reserva SET estado = 'CANCELADA' " +
                        "WHERE id_reserva = ? AND id_usuario = ? " +
                        "AND estado = 'CONFIRMADA'",
                idReserva,
                idUsuario
        );

        if (filas == 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cancelar esta reserva"
            );
        }
    }

}
