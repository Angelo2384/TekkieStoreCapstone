package za.ac.cput.tekkiestorecapstone.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAccountServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private AdminAccountService service;

    private Customer admin(String email, Instant lastSeenAt) {
        return new Customer.Builder()
                .setCustomerId(email)
                .setEmail(email)
                .setRole("ADMIN")
                .setCreatedAt(Instant.parse("2026-10-01T08:00:00Z"))
                .setLastLoginAt(Instant.parse("2026-10-24T09:30:00Z"))
                .setLastSeenAt(lastSeenAt)
                .build();
    }

    @Test
    void testAdminsAreListedWithTheirDatesAndActiveStatus() {
        Instant now = Instant.now();
        when(customerRepository.findByRoleIgnoreCase("ADMIN")).thenReturn(List.of(
                admin("zara@tekkies.com", now.minusSeconds(30)),
                admin("away@tekkies.com", now.minus(Duration.ofMinutes(10))),
                admin("never@tekkies.com", null)));

        List<AdminAccountResponse> admins = service.getAdmins();

        assertEquals(3, admins.size());
        // Sorted by email
        assertEquals("away@tekkies.com", admins.get(0).getEmail());
        assertEquals("never@tekkies.com", admins.get(1).getEmail());
        assertEquals("zara@tekkies.com", admins.get(2).getEmail());

        assertFalse(admins.get(0).isActive());
        assertFalse(admins.get(1).isActive());
        assertTrue(admins.get(2).isActive());

        assertEquals(Instant.parse("2026-10-01T08:00:00Z"), admins.get(2).getCreatedAt());
        assertEquals(Instant.parse("2026-10-24T09:30:00Z"), admins.get(2).getLastLoginAt());
    }

    @Test
    void testHeartbeatRecordsTheAdminAsSeenNow() {
        when(customerRepository.findByEmail("soletown@tekkies.com"))
                .thenReturn(Optional.of(admin("soletown@tekkies.com", null)));

        service.markActive("soletown@tekkies.com");

        ArgumentCaptor<Customer> saved = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(saved.capture());
        assertNotNull(saved.getValue().getLastSeenAt());
        assertTrue(Duration.between(saved.getValue().getLastSeenAt(), Instant.now()).toSeconds() < 5);
        // Other details are kept
        assertEquals(Instant.parse("2026-10-01T08:00:00Z"), saved.getValue().getCreatedAt());
        assertEquals("ADMIN", saved.getValue().getRole());
    }

    @Test
    void testLogoutMarksTheAdminOffline() {
        when(customerRepository.findByEmail("soletown@tekkies.com"))
                .thenReturn(Optional.of(admin("soletown@tekkies.com", Instant.now())));

        service.markOffline("soletown@tekkies.com");

        ArgumentCaptor<Customer> saved = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(saved.capture());
        assertNull(saved.getValue().getLastSeenAt());
    }

    @Test
    void testUnknownEmailChangesNothing() {
        when(customerRepository.findByEmail("ghost@tekkies.com")).thenReturn(Optional.empty());

        service.markActive("ghost@tekkies.com");

        verify(customerRepository, never()).save(any());
    }
}
