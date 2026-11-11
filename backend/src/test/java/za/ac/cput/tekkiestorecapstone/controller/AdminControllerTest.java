package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.dto.CreateAdminRequest;
import za.ac.cput.tekkiestorecapstone.service.AdminAccountService;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminAccountService service;

    @InjectMocks
    private AdminController controller;

    private final Authentication admin = new UsernamePasswordAuthenticationToken(
            "soletown@tekkies.com", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
    private final Authentication customer = new UsernamePasswordAuthenticationToken(
            "customer@example.com", null, List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));

    @Test
    void testGetAdmins() {
        List<AdminAccountResponse> admins = List.of(new AdminAccountResponse("soletown@tekkies.com", "ADMIN", null, null, true));
        when(service.getAdmins()).thenReturn(admins);

        assertEquals(admins, controller.getAdmins());
    }

    @Test
    void testCreateAdminByAuthenticatedAdmin() {
        CreateAdminRequest req = new CreateAdminRequest("newadmin@tekkies.com", "pass123", "New Admin", "New", "Admin", "0821234567");
        AdminAccountResponse resp = new AdminAccountResponse("newadmin@tekkies.com", "STAFF", Instant.now(), null, false);
        when(service.createAdmin(req)).thenReturn(resp);

        ResponseEntity<AdminAccountResponse> result = controller.createAdmin(req, admin);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertEquals("newadmin@tekkies.com", result.getBody().getEmail());
    }

    @Test
    void testCreateAdminForbiddenWhenNotAdmin() {
        CreateAdminRequest req = new CreateAdminRequest("newadmin@tekkies.com", "pass123", "New Admin", "New", "Admin", "0821234567");

        ResponseEntity<AdminAccountResponse> result = controller.createAdmin(req, customer);

        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
    }

    @Test
    void testHeartbeatMarksTheLoggedInAdminActive() {
        assertEquals(HttpStatus.NO_CONTENT, controller.heartbeat(admin).getStatusCode());
        verify(service).markActive("soletown@tekkies.com");
    }

    @Test
    void testOfflineMarksTheLoggedInAdminOffline() {
        assertEquals(HttpStatus.NO_CONTENT, controller.offline(admin).getStatusCode());
        verify(service).markOffline("soletown@tekkies.com");
    }

    @Test
    void testIllegalArgumentExceptionHandler() {
        ResponseEntity<Map<String, Object>> response = controller.handleIllegalArgument(new IllegalArgumentException("Invalid email"));
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid email", response.getBody().get("message"));
    }
}
