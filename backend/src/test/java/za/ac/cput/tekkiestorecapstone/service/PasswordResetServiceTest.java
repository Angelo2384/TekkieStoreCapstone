package za.ac.cput.tekkiestorecapstone.service;

/* PasswordResetServiceTest.java
Tests for resetting a password with an emailed code
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
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class PasswordResetServiceTest {

    @Mock
    CustomerRepository customerRepository;

    @Mock
    EmailVerificationService verificationService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);
    private PasswordResetService service;

    @BeforeEach
    void setUp() {
        service = new PasswordResetService(customerRepository, passwordEncoder, verificationService);
    }

    @Test
    void a_correctCode_savesTheNewPasswordHashed_andUsesUpTheCode() {
        Customer customer = new Customer.Builder()
                .setCustomerId("C1").setEmail("sam@test.com").setPassword(passwordEncoder.encode("old-password"))
                .build();
        when(customerRepository.findByEmail("sam@test.com")).thenReturn(Optional.of(customer));

        service.resetPassword("sam@test.com", "123456", "new-password");

        ArgumentCaptor<Customer> saved = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(saved.capture());
        assertTrue(passwordEncoder.matches("new-password", saved.getValue().getPassword()));
        assertEquals("C1", saved.getValue().getCustomerId());
        verify(verificationService).consumeResetCode("sam@test.com");
    }

    @Test
    void b_wrongCode_leavesThePasswordUnchanged() {
        doThrow(new IllegalArgumentException("That code is incorrect"))
                .when(verificationService).checkResetCode("sam@test.com", "000000");

        assertThrows(IllegalArgumentException.class,
                () -> service.resetPassword("sam@test.com", "000000", "new-password"));
        verify(customerRepository, never()).save(any());
        verify(verificationService, never()).consumeResetCode(anyString());
    }

    @Test
    void c_blankPassword_isRejected() {
        assertThrows(IllegalArgumentException.class, () -> service.resetPassword("sam@test.com", "123456", " "));
        verify(customerRepository, never()).save(any());
    }
}
