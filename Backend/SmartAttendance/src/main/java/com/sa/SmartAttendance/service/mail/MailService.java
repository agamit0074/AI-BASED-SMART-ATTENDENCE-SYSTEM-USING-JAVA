package com.sa.SmartAttendance.service.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    

    /**
     * Send HTML registration invite mail
     */
    public void sendHtmlInvite(String toEmail,String name,String registrationLink) {

        try {
            // Load HTML template
            ClassPathResource resource =
                    new ClassPathResource("email-templates/email-invite.html");

            String htmlTemplate = new String(
                    resource.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            // Replace placeholder
            String finalHtml =
                    htmlTemplate.replace("{{link}}", registrationLink)
                                .replace("{{name}}", name);

            // Create mail
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("SmartAttendance | Student Registration");
            helper.setText(finalHtml, true); // true = HTML

            mailSender.send(message);

        } catch (Exception e) {
        	    e.printStackTrace();
            throw new RuntimeException("Failed to send registration email");
        }
    }
}
