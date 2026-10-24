package za.ac.cput.tekkiestorecapstone.service;

/* EmailService.java
Sends emails through SMTP (e.g. Gmail). Verification codes are only ever emailed, never logged.
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String host;
    private final String from;

    public EmailService(ObjectProvider<JavaMailSender> mailSender,
                        @Value("${spring.mail.host:}") String host,
                        @Value("${mail.from:}") String from) {
        this.mailSender = mailSender;
        this.host = host.trim();
        this.from = from.trim();
    }

    public void sendVerificationCode(String to, String code) {
        send(to, "Your Sole Town verification code",
                "Your Sole Town verification code is " + code + ".\n\n"
                + "It expires in 10 minutes. If you didn't try to create an account, you can ignore this email.");
    }

    public void sendPasswordResetCode(String to, String code) {
        send(to, "Reset your Sole Town password",
                "Your Sole Town password reset code is " + code + ".\n\n"
                + "It expires in 10 minutes. If you didn't ask to reset your password, you can ignore this email "
                + "and your password will stay the same.");
    }

    private void send(String to, String subject, String text) {
        JavaMailSender sender = mailSender.getIfAvailable();
        // Without email there is no safe way to deliver a code, so the request can't continue
        if (host.isBlank() || sender == null) {
            log.error("Email not sent: MAIL_HOST is not set in backend/env/.env");
            throw new IllegalStateException("Email isn't set up on the server, so we can't send your code right now.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            sender.send(message);
        } catch (MailException e) {
            log.error("Could not send email to {}", to, e);
            throw new IllegalStateException("We couldn't send the email. Please try again.");
        }
    }
}
