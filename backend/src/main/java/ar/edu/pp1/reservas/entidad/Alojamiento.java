package ar.edu.pp1.reservas.entidad;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.LinkedHashMap;

@Entity
@Table(name = "alojamiento")
public class Alojamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alojamiento")
    private Long id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    private String descripcion;

    private String imagen;

    @Column(name = "precio_por_noche")
    private BigDecimal precioPorNoche;

    private Integer capacidad;

    private String tipo;

    private Boolean publicado;

    @Column(name = "id_ciudad")
    private Long idCiudad;

    @Column(name = "id_usuario_anfitrion")
    private Long idUsuarioAnfitrion;

    @Transient
    private Map<String, Boolean> servicios = new LinkedHashMap<>();

    public Alojamiento() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuarioAnfitrion() {
        return idUsuarioAnfitrion;
    }

    public void setIdUsuarioAnfitrion(Long idUsuarioAnfitrion) {
        this.idUsuarioAnfitrion = idUsuarioAnfitrion;
    }

    public Long getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(Long idCiudad) {
        this.idCiudad = idCiudad;
    }

    public Boolean getPublicado() {
        return publicado;
    }

    public void setPublicado(Boolean publicado) {
        this.publicado = publicado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrecioPorNoche() {
        return precioPorNoche;
    }

    public void setPrecioPorNoche(BigDecimal precioPorNoche) {
        this.precioPorNoche = precioPorNoche;
    }

    public Map<String, Boolean> getServicios() {
        return servicios;
    }

    public void setServicios(Map<String, Boolean> servicios) {
        this.servicios = servicios;
    }
}

