package za.ac.cput.tekkiestorecapstone.service;

/* EmailVerificationServiceTest.java
Tests for signup verification codes
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.EmailVerification;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.EmailVerificationRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class EmailVerificationServiceTest {

    @Mock
    EmailVerificationRepository repo;

    @Mock
    CustomerRepository customerRepo;

    @Mock
    EmailService emailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private EmailVerificationService service;

    @BeforeEach
    void setUp() {
        service = new EmailVerificationService(repo, customerRepo, passwordEncoder, emailService);
    }

    @Test
    void a_sendCode_emailsCodeAndStoresOnlyItsHash() {
        when(customerRepo.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(repo.findById("new@test.com")).thenReturn(Optional.empty());

        service.sendCode("new@test.com");

        ArgumentCaptor<String> code = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendVerificationCode(eq("new@test.com"), code.capture());
        assertTrue(code.getValue().matches("\\d{6}"));

        ArgumentCaptor<EmailVerification> saved = ArgumentCaptor.forClass(EmailVerification.class);
        verify(repo).save(saved.capture());
        assertNotEquals(code.getValue(), saved.getValue().getCodeHash());
        assertTrue(passwordEncoder.matches(code.getValue(), saved.getValue().getCodeHash()));
    }

    @Test
    void b_sendCode_existingAccount_isRejected() {
        when(customerRepo.findByEmail("taken@test.com")).thenReturn(Optional.of(new Customer.Builder().build()));

        assertThrows(IllegalArgumentException.class, () -> service.sendCode("taken@test.com"));
        verify(emailService, never()).sendVerificationCode(anyString(), anyString());
    }

    @Test
    void c_sendCode_againWithinAMinute_isRejected() {
        when(customerRepo.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(repo.findById("new@test.com")).thenReturn(Optional.of(pending("123456", Instant.now(), 0)));

        assertThrows(IllegalArgumentException.class, () -> service.sendCode("new@test.com"));
        verify(emailService, never()).sendVerificationCode(anyString(), anyString());
    }

    @Test
    void d_checkCode_correctCode_passes() {
        when(repo.findById("new@test.com")).thenReturn(Optional.of(pending("123456", Instant.now(), 0)));

        assertDoesNotThrow(() -> service.checkCode("New@Test.com", "123456"));
        verify(repo, never()).save(any());
    }

    @Test
    void e_checkCode_wrongCode_countsAnAttempt() {
        when(repo.findById("new@test.com")).thenReturn(Optional.of(pending("123456", Instant.now(), 2)));

        assertThrows(IllegalArgumentException.class, () -> service.checkCode("new@test.com", "999999"));

        ArgumentCaptor<EmailVerification> saved = ArgumentCaptor.forClass(EmailVerification.class);
        verify(repo).save(saved.capture());
        assertEquals(3, saved.getValue().getAttempts());
    }

    @Test
    void f_checkCode_expired_isRejected() {
        Instant elevenMinutesAgo = Instant.now().minus(Duration.ofMinutes(11));
        when(repo.findById("new@test.com")).thenReturn(Optional.of(pending("123456", elevenMinutesAgo, 0)));

        assertThrows(IllegalArgumentException.class, () -> service.checkCode("new@test.com", "123456"));
    }

    @Test
    void g_checkCode_afterFiveWrongTries_rejectsEvenTheRightCode() {
        when(repo.findById("new@test.com")).thenReturn(Optional.of(pending("123456", Instant.now(), 5)));

        assertThrows(IllegalArgumentException.class, () -> service.checkCode("new@test.com", "123456"));
    }

    @Test
    void h_sendCode_whenEmailCantBeSent_storesNoCode() {
        when(customerRepo.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(repo.findById("new@test.com")).thenReturn(Optional.empty());
        doThrow(new IllegalStateException("Email isn't set up"))
                .when(emailService).sendVerificationCode(eq("new@test.com"), anyString());

        assertThrows(IllegalStateException.class, () -> service.sendCode("new@test.com"));
        verify(repo, never()).save(any());
    }

    @Test
    void i_checkCode_codeSentToAnotherEmail_cannotBeUsed() {
        // A code was emailed to new@test.com, but someone tries it while signing up as other@test.com
        when(repo.findById("other@test.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.checkCode("other@test.com", "123456"));
    }

    @Test
    void j_resetCode_unknownEmail_sendsNothingButGivesNoSign() {
        when(customerRepo.findByEmail("nobody@test.com")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> service.sendPasswordResetCode("nobody@test.com"));
        verify(emailService, never()).sendPasswordResetCode(anyString(), anyString());
        verify(repo, never()).save(any());
    }

    @Test
    void k_resetCode_existingAccount_isEmailedAndStoredSeparately() {
        when(customerRepo.findByEmail("sam@test.com")).thenReturn(Optional.of(new Customer.Builder().build()));
        when(repo.findById("reset:sam@test.com")).thenReturn(Optional.empty());

        service.sendPasswordResetCode("sam@test.com");

        verify(emailService).sendPasswordResetCode(eq("sam@test.com"), anyString());
        ArgumentCaptor<EmailVerification> saved = ArgumentCaptor.forClass(EmailVerification.class);
        verify(repo).save(saved.capture());
        assertEquals("reset:sam@test.com", saved.getValue().getEmail());
    }

    @Test
    void l_signupCode_cannotResetAPassword() {
        // Only a signup code exists for this email, stored under "new@test.com", not "reset:new@test.com"
        when(repo.findById("reset:new@test.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.checkResetCode("new@test.com", "123456"));
    }

    @Test
    void m_resetCode_askedAgainWithinAMinute_isQuietlyIgnored() {
        when(customerRepo.findByEmail("sam@test.com")).thenReturn(Optional.of(new Customer.Builder().build()));
        when(repo.findById("reset:sam@test.com")).thenReturn(Optional.of(pending("123456", Instant.now(), 0)));

        assertDoesNotThrow(() -> service.sendPasswordResetCode("sam@test.com"));
        verify(emailService, never()).sendPasswordResetCode(anyString(), anyString());
    }

    private EmailVerification pending(String code, Instant sentAt, int attempts) {
        return new EmailVerification.Builder()
                .setEmail("new@test.com")
                .setCodeHash(passwordEncoder.encode(code))
                .setSentAt(sentAt)
                .setExpiresAt(sentAt.plus(Duration.ofMinutes(10)))
                .setAttempts(attempts)
                .build();
    }
}
