/*
 * AuthController.java
 * Controller handling authentication endpoints (login and register)
 * Author: Ethan Williams (221454780)
 */
package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AuthResponse;
import za.ac.cput.tekkiestorecapstone.dto.LoginRequest;
import za.ac.cput.tekkiestorecapstone.dto.RegisterRequest;
import za.ac.cput.tekkiestorecapstone.dto.ResetPasswordRequest;
import za.ac.cput.tekkiestorecapstone.dto.SendCodeRequest;
import za.ac.cput.tekkiestorecapstone.service.AuthService;
import za.ac.cput.tekkiestorecapstone.service.EmailVerificationService;
import za.ac.cput.tekkiestorecapstone.service.PasswordResetService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService verificationService;
    private final PasswordResetService passwordResetService;

    @Autowired
    public AuthController(AuthService authService, EmailVerificationService verificationService,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.verificationService = verificationService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/send-code")
    public ResponseEntity<Map<String, String>> sendCode(@RequestBody SendCodeRequest request) {
        verificationService.sendCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Verification code sent"));
    }

    // Same reply whether or not the account exists
    @PostMapping("/forgot-password/send-code")
    public ResponseEntity<Map<String, String>> sendResetCode(@RequestBody SendCodeRequest request) {
        passwordResetService.sendCode(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "If an account exists for this email, we've sent a code"));
    }

    @PostMapping("/forgot-password/verify-code")
    public ResponseEntity<Map<String, String>> verifyResetCode(@RequestBody ResetPasswordRequest request) {
        passwordResetService.checkCode(request.getEmail(), request.getCode());
        return ResponseEntity.ok(Map.of("message", "Code verified"));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getEmail(), request.getCode(), request.getPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Admins are only created by AdminSeeder, never through public signup
        if ("ADMIN".equalsIgnoreCase(request.getRole().trim())) {
            throw new IllegalArgumentException("Admin accounts can't be created through signup");
        }
        // No account is created unless the emailed code is correct
        verificationService.checkCode(request.getEmail(), request.getCode());
        Customer customer = request.toCustomer();
        AuthResponse response = authService.register(customer);
        verificationService.consumeCode(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.UNAUTHORIZED.value());
        response.put("error", "Unauthorized");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
