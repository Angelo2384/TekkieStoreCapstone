package za.ac.cput.tekkiestorecapstone.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.dto.CreateAdminRequest;
import za.ac.cput.tekkiestorecapstone.repository.CartRepository;
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

    @Mock
    private CartRepository cartRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ActivityLogService activityLog;

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

    @Test
    void testCreateAdminSuccess() {
        CreateAdminRequest req = new CreateAdminRequest("newadmin@tekkies.com", "pass123", "New Administrator", null, null, "0821234567");
        when(customerRepository.findByEmail("newadmin@tekkies.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass123")).thenReturn("encoded-pass");
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminAccountResponse resp = service.createAdmin(req);

        assertNotNull(resp);
        assertEquals("newadmin@tekkies.com", resp.getEmail());
        assertFalse(resp.isActive());

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer saved = captor.getValue();
        assertEquals("newadmin@tekkies.com", saved.getEmail());
        assertEquals("encoded-pass", saved.getPassword());
        // Accounts created here are always staff
        assertEquals("STAFF", saved.getRole());
        assertTrue(saved.isMustChangePassword());
        assertEquals("New", saved.getName().getFirstName());
        assertEquals("Administrator", saved.getName().getLastName());
    }

    @Test
    void testDeleteStaffRemovesTheAccount() {
        Customer staff = new Customer.Builder().setCustomerId("S001").setEmail("staff@tekkies.com").setRole("STAFF").build();
        when(customerRepository.findByEmail("staff@tekkies.com")).thenReturn(Optional.of(staff));

        service.deleteStaff("staff@tekkies.com");

        verify(customerRepository).delete(staff);
        verify(activityLog).record("Deleted staff account staff@tekkies.com");
    }

    @Test
    void testDeleteStaffAlsoRemovesTheirCart() {
        Customer staff = new Customer.Builder().setCustomerId("S001").setEmail("staff@tekkies.com").setRole("STAFF").build();
        List<Cart> carts = List.of(new Cart.Builder().setCartId("S001").setCustomer(staff).build());
        when(customerRepository.findByEmail("staff@tekkies.com")).thenReturn(Optional.of(staff));
        when(cartRepository.findByCustomer_CustomerId("S001")).thenReturn(carts);

        service.deleteStaff("staff@tekkies.com");

        verify(cartRepository).deleteAll(carts);
        verify(customerRepository).delete(staff);
    }

    @Test
    void testDeleteStaffRefusesTheOwnerAccount() {
        when(customerRepository.findByEmail("soletown@tekkies.com"))
                .thenReturn(Optional.of(admin("soletown@tekkies.com", null)));

        assertThrows(IllegalArgumentException.class, () -> service.deleteStaff("soletown@tekkies.com"));
        verify(customerRepository, never()).delete(any());
    }

    @Test
    void testDeleteStaffRejectsUnknownEmail() {
        when(customerRepository.findByEmail("ghost@tekkies.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.deleteStaff("ghost@tekkies.com"));
        verify(customerRepository, never()).delete(any());
    }

    @Test
    void testCreateAdminRejectsNonTekkiesEmail() {
        CreateAdminRequest req = new CreateAdminRequest("hacker@gmail.com", "pass123", "Fake Admin", null, null, "0821234567");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.createAdmin(req));
        assertEquals("Admin accounts must use an @tekkies.com email address", ex.getMessage());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void testCreateAdminRejectsDuplicateEmail() {
        CreateAdminRequest req = new CreateAdminRequest("exists@tekkies.com", "pass123", "Existing Admin", null, null, "0821234567");
        when(customerRepository.findByEmail("exists@tekkies.com")).thenReturn(Optional.of(admin("exists@tekkies.com", null)));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.createAdmin(req));
        assertEquals("An account with this email already exists", ex.getMessage());
        verify(customerRepository, never()).save(any());
    }

    @Test
    void testCreateAdminRejectsShortPassword() {
        CreateAdminRequest req = new CreateAdminRequest("valid@tekkies.com", "123", "Admin Valid", null, null, "0821234567");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.createAdmin(req));
        assertEquals("Password must be at least 6 characters", ex.getMessage());
    }

    @Test
    void testCreateAdminRejectsMissingName() {
        CreateAdminRequest req = new CreateAdminRequest("valid@tekkies.com", "pass123", "   ", null, null, "0821234567");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.createAdmin(req));
        assertEquals("First name and last name are required", ex.getMessage());
    }
}
