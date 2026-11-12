package ar.edu.pp1.reservas.entidad;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long id;

    @Column(name = "id_alojamiento")
    private Long idAlojamiento;

    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "fecha_check_in")
    private LocalDate fechaCheckIn;

    @Column(name = "fecha_check_out")
    private LocalDate fechaCheckOut;

    @Column(name = "cantidad_huespedes")
    private Integer cantidadHuespedes;

    @Column(name = "importe_total")
    private BigDecimal importeTotal;

    private String estado;

    @Column(name = "solicitud_especial")
    private String solicitudEspecial;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSolicitudEspecial() {
        return solicitudEspecial;
    }

    public void setSolicitudEspecial(String solicitudEspecial) {
        this.solicitudEspecial = solicitudEspecial;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getImporteTotal() {
        return importeTotal;
    }

    public void setImporteTotal(BigDecimal importeTotal) {
        this.importeTotal = importeTotal;
    }

    public Integer getCantidadHuespedes() {
        return cantidadHuespedes;
    }

    public void setCantidadHuespedes(Integer cantidadHuespedes) {
        this.cantidadHuespedes = cantidadHuespedes;
    }

    public LocalDate getFechaCheckOut() {
        return fechaCheckOut;
    }

    public void setFechaCheckOut(LocalDate fechaCheckOut) {
        this.fechaCheckOut = fechaCheckOut;
    }

    public LocalDate getFechaCheckIn() {
        return fechaCheckIn;
    }

    public void setFechaCheckIn(LocalDate fechaCheckIn) {
        this.fechaCheckIn = fechaCheckIn;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdAlojamiento() {
        return idAlojamiento;
    }

    public void setIdAlojamiento(Long idAlojamiento) {
        this.idAlojamiento = idAlojamiento;
    }

    public Reserva() {
    }

}