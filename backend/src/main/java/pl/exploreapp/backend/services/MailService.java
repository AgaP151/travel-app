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

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTripInviteEmail(String to, String tripTitle, String invitedByEmail) {
        if (mailHost == null || mailHost.isBlank()) {
            logger.warn("Mail host is not configured. Skipping invite email to {}", to);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Travel App - trip invitation");
            message.setText(
                    "You have been invited to trip: " + tripTitle + "\n\n" +
                            "Invited by: " + invitedByEmail + "\n\n" +
                            "Log in to Travel App to see the trip."
            );

            mailSender.send(message);

            logger.info("Trip invite email sent to {}", to);
        } catch (Exception error) {
            logger.error("Could not send trip invite email to {}", to, error);
        }
    }
}