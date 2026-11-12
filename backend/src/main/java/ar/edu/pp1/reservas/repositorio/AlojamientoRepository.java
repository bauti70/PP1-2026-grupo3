
package ar.edu.pp1.reservas.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ar.edu.pp1.reservas.entidad.Alojamiento;

public interface AlojamientoRepository
        extends JpaRepository<Alojamiento, Long> {

    List<Alojamiento> findByPublicadoTrue();
}
