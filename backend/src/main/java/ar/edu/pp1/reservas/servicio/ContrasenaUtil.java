package ar.edu.pp1.reservas.servicio;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public final class ContrasenaUtil {

    private static final int ITERACIONES = 120000;
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private ContrasenaUtil() {
    }

    public static String proteger(String contrasena) {
        byte[] sal = new byte[16];
        ALEATORIO.nextBytes(sal);

        try {
            byte[] hash = derivar(contrasena, sal);

            return "pbkdf2$" + ITERACIONES + "$" +
                    Base64.getEncoder().encodeToString(sal) + "$" +
                    Base64.getEncoder().encodeToString(hash);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("Error al proteger la contraseña", e);
        }
    }

    public static boolean verificar(String ingresada, String guardada) {
        if (ingresada == null || guardada == null) {
            return false;
        }

        if (!guardada.startsWith("pbkdf2$")) {
            return MessageDigest.isEqual(
                    ingresada.getBytes(StandardCharsets.UTF_8),
                    guardada.getBytes(StandardCharsets.UTF_8)
            );
        }

        try {
            String[] partes = guardada.split("\\$");

            if (partes.length != 4 ||
                    Integer.parseInt(partes[1]) != ITERACIONES) {
                return false;
            }

            byte[] sal = Base64.getDecoder().decode(partes[2]);
            byte[] esperado = Base64.getDecoder().decode(partes[3]);
            byte[] obtenido = derivar(ingresada, sal);

            return MessageDigest.isEqual(esperado, obtenido);
        } catch (GeneralSecurityException | IllegalArgumentException e) {
            return false;
        }
    }

    private static byte[] derivar(
            String contrasena,
            byte[] sal
    ) throws GeneralSecurityException {

        PBEKeySpec datos = new PBEKeySpec(
                contrasena.toCharArray(),
                sal,
                ITERACIONES,
                256
        );

        try {
            return SecretKeyFactory
                    .getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(datos)
                    .getEncoded();
        } finally {
            datos.clearPassword();
        }
    }
}
