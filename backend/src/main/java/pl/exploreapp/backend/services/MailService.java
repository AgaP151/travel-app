package pl.exploreapp.backend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTestEmail(String to) {
        if (isMailNotConfigured()) {
            logger.warn("Mail is not configured. Skipping test email to {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            if (mailUsername != null && !mailUsername.isBlank()) {
                message.setFrom(mailUsername);
            }

            message.setTo(to);
            message.setSubject("Travel App - test mailingu");
            message.setText(
                    "Cześć!\n\n" +
                    "To jest testowa wiadomość z aplikacji Travel App.\n\n" +
                    "Jeśli widzisz ten mail, oznacza to, że mailing działa poprawnie.\n\n" +
                    "Pozdrawiamy,\n" +
                    "Travel App"
            );

            mailSender.send(message);
            logger.info("Test email sent to {}", to);

        } catch (Exception error) {
            logger.error("Could not send test email to {}", to, error);
        }
    }

    public void sendTripInviteEmail(String to, String tripTitle, String invitedByEmail) {
        if (isMailNotConfigured()) {
            logger.warn("Mail is not configured. Skipping invite email to {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            if (mailUsername != null && !mailUsername.isBlank()) {
                message.setFrom(mailUsername);
            }

            message.setTo(to);
            message.setSubject("Travel App - zaproszenie do podróży");
            message.setText(
                    "Cześć!\n\n" +
                    "Masz nowe zaproszenie do podróży w aplikacji Travel App.\n\n" +
                    "Podróż: " + tripTitle + "\n" +
                    "Zaproszenie od: " + invitedByEmail + "\n\n" +
                    "Zaloguj się do aplikacji, aby zobaczyć szczegóły podróży.\n\n" +
                    "Pozdrawiamy,\n" +
                    "Travel App"
            );

            mailSender.send(message);
            logger.info("Trip invite email sent to {}", to);

        } catch (Exception error) {
            logger.error("Could not send trip invite email to {}", to, error);
        }
    }

    private boolean isMailNotConfigured() {
        return mailHost == null || mailHost.isBlank();
    }
}