package za.ac.cput.tekkiestorecapstone.initializer;

/* AdminSeeder.java
Creates the store's admin account on startup from ADMIN_EMAIL and ADMIN_PASSWORD in backend/env/.env
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.util.UUID;

@Component
@Order(3)
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;

    public AdminSeeder(CustomerRepository customerRepository, PasswordEncoder passwordEncoder,
                       @Value("${admin.email:}") String email,
                       @Value("${admin.password:}") String password) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.email = email.trim();
        this.password = password.trim();
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() || password.isBlank()) {
            log.info("ADMIN_EMAIL / ADMIN_PASSWORD not set, so no admin account was created");
            return;
        }
        // AuthService only lets @tekkies.com admins log in
        if (!email.toLowerCase().endsWith("@tekkies.com")) {
            log.warn("ADMIN_EMAIL must end with @tekkies.com, so no admin account was created");
            return;
        }
        // Created once only; an existing account is never changed
        if (customerRepository.findByEmail(email).isPresent()) {
            return;
        }

        customerRepository.save(new Customer.Builder()
                .setCustomerId(UUID.randomUUID().toString())
                .setEmail(email)
                .setPassword(passwordEncoder.encode(password))
                .setName(new Name.Builder().setFirstName("Sole Town").setLastName("Admin").build())
                .setMobileNumber("0000000000")
                .setRole("ADMIN")
                .build());
        log.info("Admin account created for {}", email);
    }
}
