package za.ac.cput.tekkiestorecapstone.initializer;

/* AdminSeederTest.java
Tests for creating the admin account on startup
*/

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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class AdminSeederTest {

    @Mock
    CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4);

    @Test
    void a_createsTheAdminWithAHashedPassword() {
        when(customerRepository.findByEmail("soletown@tekkies.com")).thenReturn(Optional.empty());

        new AdminSeeder(customerRepository, passwordEncoder, "soletown@tekkies.com", "secret").run();

        ArgumentCaptor<Customer> saved = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(saved.capture());
        assertEquals("soletown@tekkies.com", saved.getValue().getEmail());
        assertEquals("ADMIN", saved.getValue().getRole());
        assertNotEquals("secret", saved.getValue().getPassword());
        assertTrue(passwordEncoder.matches("secret", saved.getValue().getPassword()));
    }

    @Test
    void b_existingAccount_isLeftAlone() {
        when(customerRepository.findByEmail("soletown@tekkies.com")).thenReturn(Optional.of(new Customer.Builder().build()));

        new AdminSeeder(customerRepository, passwordEncoder, "soletown@tekkies.com", "secret").run();

        verify(customerRepository, never()).save(any());
    }

    @Test
    void c_notConfigured_createsNothing() {
        new AdminSeeder(customerRepository, passwordEncoder, "", "").run();

        verify(customerRepository, never()).save(any());
    }

    @Test
    void d_nonTekkiesEmail_createsNothing() {
        new AdminSeeder(customerRepository, passwordEncoder, "admin@gmail.com", "secret").run();

        verify(customerRepository, never()).save(any());
    }
}
