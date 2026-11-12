
package ar.edu.pp1.reservas.repositorio;

import ar.edu.pp1.reservas.entidad.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository
        extends JpaRepository<Reserva, Long> {

    List<Reserva> findByIdAlojamiento(Long idAlojamiento);

    @Query(value = """
            SELECT COUNT(*)
            FROM bloqueo_disponibilidad
            WHERE id_alojamiento = :idAlojamiento
              AND fecha >= :entrada
              AND fecha < :salida
            """, nativeQuery = true)
    long contarBloqueos(
            @Param("idAlojamiento") Long idAlojamiento,
            @Param("entrada") LocalDate entrada,
            @Param("salida") LocalDate salida
    );
}
