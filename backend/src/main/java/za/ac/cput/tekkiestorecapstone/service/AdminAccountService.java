/*
 * AdminAccountService.java
 * Lists admin accounts and tracks which admins have the admin site open right now
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class AdminAccountService {

    // The admin site checks in every minute, so 2 minutes allows for one late check-in
    static final Duration ACTIVE_WINDOW = Duration.ofMinutes(2);

    private final CustomerRepository customerRepository;

    public AdminAccountService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<AdminAccountResponse> getAdmins() {
        Instant cutoff = Instant.now().minus(ACTIVE_WINDOW);
        return customerRepository.findByRoleIgnoreCase("ADMIN").stream()
                .sorted((a, b) -> a.getEmail().compareToIgnoreCase(b.getEmail()))
                .map(admin -> new AdminAccountResponse(admin.getEmail(), admin.getCreatedAt(), admin.getLastLoginAt(),
                        admin.getLastSeenAt() != null && admin.getLastSeenAt().isAfter(cutoff)))
                .toList();
    }

    public void markActive(String email) {
        setLastSeen(email, Instant.now());
    }

    public void markOffline(String email) {
        setLastSeen(email, null);
    }

    private void setLastSeen(String email, Instant time) {
        customerRepository.findByEmail(email).ifPresent(admin ->
                customerRepository.save(new Customer.Builder().copy(admin).setLastSeenAt(time).build()));
    }
}
