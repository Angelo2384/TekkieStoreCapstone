package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.service.AdminAccountService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminAccountService service;

    @InjectMocks
    private AdminController controller;

    private final Authentication admin = new UsernamePasswordAuthenticationToken("soletown@tekkies.com", null, List.of());

    @Test
    void testGetAdmins() {
        List<AdminAccountResponse> admins = List.of(new AdminAccountResponse("soletown@tekkies.com", null, null, true));
        when(service.getAdmins()).thenReturn(admins);

        assertEquals(admins, controller.getAdmins());
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
}
