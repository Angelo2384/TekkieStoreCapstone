package za.ac.cput.tekkiestorecapstone.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import za.ac.cput.tekkiestorecapstone.domain.ActivityLog;
import za.ac.cput.tekkiestorecapstone.repository.ActivityLogRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ActivityLogServiceTest {

    @Mock
    private ActivityLogRepository repository;

    @InjectMocks
    private ActivityLogService service;

    private void logInAs(String email, String role) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority(role))));
    }

    @AfterEach
    void logOut() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testStaffChangeIsRecordedUnderTheirEmail() {
        logInAs("staff@tekkies.com", "ROLE_STAFF");

        service.record("Edited shoe Puma Suede (PUM-004): price R1499 to R100");

        ArgumentCaptor<ActivityLog> saved = ArgumentCaptor.forClass(ActivityLog.class);
        verify(repository).save(saved.capture());
        assertEquals("staff@tekkies.com", saved.getValue().getActor());
        assertEquals("Edited shoe Puma Suede (PUM-004): price R1499 to R100", saved.getValue().getDescription());
        assertNotNull(saved.getValue().getId());
        assertNotNull(saved.getValue().getCreatedAt());
    }

    @Test
    void testOwnerChangeIsRecorded() {
        logInAs("soletown@tekkies.com", "ROLE_ADMIN");

        service.record("Deleted staff account staff@tekkies.com");

        verify(repository).save(any(ActivityLog.class));
    }

    @Test
    void testCustomerActionIsNotRecorded() {
        logInAs("customer@example.com", "ROLE_CUSTOMER");

        service.record("Should not be saved");

        verify(repository, never()).save(any());
    }

    @Test
    void testNothingIsRecordedWithoutALogin() {
        service.record("Should not be saved");

        verify(repository, never()).save(any());
    }
}
