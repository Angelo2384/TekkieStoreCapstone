/*
 * AdminAccountService.java
 * Lists admin accounts and tracks which admins have the admin site open right now
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.dto.CreateAdminRequest;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AdminAccountService {

    // The admin site checks in every minute, so 2 minutes allows for one late check-in
    static final Duration ACTIVE_WINDOW = Duration.ofMinutes(2);

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminAccountResponse> getAdmins() {
        Instant cutoff = Instant.now().minus(ACTIVE_WINDOW);
        return customerRepository.findByRoleIgnoreCase("ADMIN").stream()
                .sorted((a, b) -> a.getEmail().compareToIgnoreCase(b.getEmail()))
                .map(admin -> new AdminAccountResponse(admin.getEmail(), admin.getCreatedAt(), admin.getLastLoginAt(),
                        admin.getLastSeenAt() != null && admin.getLastSeenAt().isAfter(cutoff)))
                .toList();
    }

    public AdminAccountResponse createAdmin(CreateAdminRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        String email = request.getEmail().trim().toLowerCase();
        if (!email.endsWith("@tekkies.com")) {
            throw new IllegalArgumentException("Admin accounts must use an @tekkies.com email address");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }
        if (customerRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String first = request.getFirstName();
        String last = request.getLastName();
        if ((first == null || first.isBlank() || last == null || last.isBlank()) && request.getFullName() != null && !request.getFullName().isBlank()) {
            String[] parts = request.getFullName().trim().split("\\s+", 2);
            first = parts[0];
            last = parts.length > 1 ? parts[1] : "";
        }
        if (first == null || first.isBlank() || last == null || last.isBlank()) {
            throw new IllegalArgumentException("First name and last name are required");
        }

        String mobile = (request.getMobileNumber() != null && !request.getMobileNumber().isBlank())
                ? request.getMobileNumber().trim()
                : "0000000000";

        Customer newAdmin = new Customer.Builder()
                .setCustomerId(UUID.randomUUID().toString())
                .setEmail(email)
                .setPassword(passwordEncoder.encode(request.getPassword()))
                .setName(new Name.Builder().setFirstName(first).setLastName(last).build())
                .setMobileNumber(mobile)
                .setRole("ADMIN")
                .setCreatedAt(Instant.now())
                .build();

        Customer saved = customerRepository.save(newAdmin);
        return new AdminAccountResponse(saved.getEmail(), saved.getCreatedAt(), null, false);
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
