package za.ac.cput.tekkiestorecapstone.service;

/* PasswordResetService.java
Resets a customer's password after they prove they own the email with a code
*/

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

@Service
public class PasswordResetService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService verificationService;

    public PasswordResetService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder,
                                EmailVerificationService verificationService) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationService = verificationService;
    }

    public void sendCode(String email) {
        verificationService.sendPasswordResetCode(email);
    }

    public void checkCode(String email, String code) {
        verificationService.checkResetCode(email, code);
    }

    public void resetPassword(String email, String code, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("Please enter a new password");
        }
        // Checked again here, so the new-password step can't be reached without a valid code
        verificationService.checkResetCode(email, code);
        Customer customer = customerRepository.findByEmail(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Your code has expired. Please request a new one."));

        customerRepository.save(new Customer.Builder()
                .copy(customer)
                .setPassword(passwordEncoder.encode(newPassword))
                .build());
        verificationService.consumeResetCode(email);
    }
}
