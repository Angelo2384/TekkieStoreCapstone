/*
 * ActivityLogService.java
 * Records the changes the owner and staff make in the admin portal, for the owner's Activity page
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.ActivityLog;
import za.ac.cput.tekkiestorecapstone.repository.ActivityLogRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ActivityLogService {

    private final ActivityLogRepository repository;

    public ActivityLogService(ActivityLogRepository repository) {
        this.repository = repository;
    }

    // Saves an entry under the logged-in owner or staff member; customers and startup jobs are not logged
    public void record(String description) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities().stream().noneMatch(a ->
                a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"))) {
            return;
        }
        repository.save(new ActivityLog.Builder()
                .setId(UUID.randomUUID().toString())
                .setActor(auth.getName())
                .setDescription(description)
                .setCreatedAt(Instant.now())
                .build());
    }

    public List<ActivityLog> getRecent() {
        return repository.findTop500ByOrderByCreatedAtDesc();
    }
}
