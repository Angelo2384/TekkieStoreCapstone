package za.ac.cput.tekkiestorecapstone.service;

/* EmailVerificationService.java
Emails a 6-digit code at signup and checks it before the account is created
*/

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.EmailVerification;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.EmailVerificationRepository;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;

@Service
public class EmailVerificationService {

    private static final Duration CODE_LIFETIME = Duration.ofMinutes(10);
    private static final Duration RESEND_WAIT = Duration.ofSeconds(60);
    private static final int MAX_ATTEMPTS = 5;

    private final EmailVerificationRepository repo;
    private final CustomerRepository customerRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom random = new SecureRandom();

    public EmailVerificationService(EmailVerificationRepository repo, CustomerRepository customerRepo,
                                    PasswordEncoder passwordEncoder, EmailService emailService) {
        this.repo = repo;
        this.customerRepo = customerRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Signup code
    public void sendCode(String email) {
        String address = validAddress(email);
        if (customerRepo.findByEmail(address).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        if (sentRecently(key(address))) {
            throw new IllegalArgumentException("Please wait a minute before requesting another code");
        }
        String code = newCode();
        // Send first, so a failed email doesn't start the one-minute resend wait
        emailService.sendVerificationCode(address, code);
        save(key(address), code);
    }

    // Password reset code. Gives no sign of whether the account exists, so it can't be used to look people up.
    public void sendPasswordResetCode(String email) {
        String address = validAddress(email);
        if (customerRepo.findByEmail(address).isEmpty() || sentRecently(resetKey(address))) {
            return;
        }
        String code = newCode();
        emailService.sendPasswordResetCode(address, code);
        save(resetKey(address), code);
    }

    // Doesn't use the code up, so a signup that fails for another reason can be retried with the same code
    public void checkCode(String email, String code) {
        check(key(email), code);
    }

    public void checkResetCode(String email, String code) {
        check(resetKey(email), code);
    }

    public void consumeCode(String email) {
        repo.deleteById(key(email));
    }

    public void consumeResetCode(String email) {
        repo.deleteById(resetKey(email));
    }

    private void check(String key, String code) {
        EmailVerification verification = repo.findById(key).orElse(null);
        if (verification == null) {
            throw new IllegalArgumentException("Please request a verification code first");
        }
        if (verification.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Your code has expired. Please request a new one.");
        }
        if (verification.getAttempts() >= MAX_ATTEMPTS) {
            throw new IllegalArgumentException("Too many incorrect attempts. Please request a new code.");
        }
        if (code == null || !passwordEncoder.matches(code.trim(), verification.getCodeHash())) {
            repo.save(new EmailVerification.Builder()
                    .copy(verification)
                    .setAttempts(verification.getAttempts() + 1)
                    .build());
            throw new IllegalArgumentException("That code is incorrect");
        }
    }

    private boolean sentRecently(String key) {
        EmailVerification existing = repo.findById(key).orElse(null);
        return existing != null && existing.getSentAt().plus(RESEND_WAIT).isAfter(Instant.now());
    }

    private String newCode() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    private void save(String key, String code) {
        Instant now = Instant.now();
        repo.save(new EmailVerification.Builder()
                .setEmail(key)
                .setCodeHash(passwordEncoder.encode(code))
                .setSentAt(now)
                .setExpiresAt(now.plus(CODE_LIFETIME))
                .setAttempts(0)
                .build());
    }

    private static String validAddress(String email) {
        String address = email == null ? "" : email.trim();
        if (!address.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Please enter a valid email address");
        }
        return address;
    }

    private static String key(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    // Reset codes are stored separately, so a signup code can never reset a password (or the other way round)
    private static String resetKey(String email) {
        return "reset:" + key(email);
    }
}
