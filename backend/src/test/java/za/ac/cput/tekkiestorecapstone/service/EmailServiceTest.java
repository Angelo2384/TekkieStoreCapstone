package za.ac.cput.tekkiestorecapstone.service;

/* EmailServiceTest.java
Tests that verification codes are only ever delivered by email
*/

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class EmailServiceTest {

    @Mock
    ObjectProvider<JavaMailSender> provider;

    @Mock
    JavaMailSender mailSender;

    @Test
    void a_sendsTheCodeToThatEmailOnly() {
        when(provider.getIfAvailable()).thenReturn(mailSender);
        EmailService service = new EmailService(provider, "smtp.gmail.com", "store@soletown.test");

        service.sendVerificationCode("sam@test.com", "123456");

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(sent.capture());
        assertArrayEquals(new String[]{"sam@test.com"}, sent.getValue().getTo());
        assertTrue(sent.getValue().getText().contains("123456"));
    }

    @Test
    void b_withoutMailSettings_refusesInsteadOfPrintingTheCode() {
        when(provider.getIfAvailable()).thenReturn(mailSender);
        EmailService service = new EmailService(provider, "", "");

        assertThrows(IllegalStateException.class, () -> service.sendVerificationCode("sam@test.com", "123456"));
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void c_whenSmtpFails_reportsAFriendlyError() {
        when(provider.getIfAvailable()).thenReturn(mailSender);
        doThrow(new MailSendException("SMTP down")).when(mailSender).send(any(SimpleMailMessage.class));
        EmailService service = new EmailService(provider, "smtp.gmail.com", "store@soletown.test");

        assertThrows(IllegalStateException.class, () -> service.sendVerificationCode("sam@test.com", "123456"));
    }
}
