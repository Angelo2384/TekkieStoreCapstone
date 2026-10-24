package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.dto.AuthResponse;
import za.ac.cput.tekkiestorecapstone.dto.LoginRequest;
import za.ac.cput.tekkiestorecapstone.dto.RegisterRequest;
import za.ac.cput.tekkiestorecapstone.dto.ResetPasswordRequest;
import za.ac.cput.tekkiestorecapstone.dto.SendCodeRequest;
import za.ac.cput.tekkiestorecapstone.service.AuthService;
import za.ac.cput.tekkiestorecapstone.service.EmailVerificationService;
import za.ac.cput.tekkiestorecapstone.service.PasswordResetService;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @Mock
    private EmailVerificationService verificationService;

    @Mock
    private PasswordResetService passwordResetService;

    @InjectMocks
    private AuthController authController;

    @Test
    void testForgotPasswordGivesTheSameReplyForAnyEmail() {
        ResponseEntity<Map<String, String>> response = authController.sendResetCode(new SendCodeRequest("anyone@test.com"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("If an account exists for this email, we've sent a code", response.getBody().get("message"));
        verify(passwordResetService).sendCode("anyone@test.com");
    }

    @Test
    void testResetPasswordEndpoint() {
        ResponseEntity<Map<String, String>> response =
                authController.resetPassword(new ResetPasswordRequest("sam@test.com", "123456", "new-password"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordResetService).resetPassword("sam@test.com", "123456", "new-password");
    }

    @Test
    void testRegisterEndpoint() {
        RegisterRequest request = new RegisterRequest("ethan@example.com", "pass123", "Ethan Williams", null, null, "0821234567");
        request.setCode("123456");
        AuthResponse mockResponse = new AuthResponse("C001", "ethan@example.com", "Ethan Williams", "jwt-token-xyz");

        when(authService.register(any(Customer.class))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("ethan@example.com", response.getBody().getEmail());
        assertEquals("jwt-token-xyz", response.getBody().getToken());
        assertEquals("CUSTOMER", response.getBody().getRole());
        verify(verificationService).checkCode("ethan@example.com", "123456");
        verify(verificationService).consumeCode("ethan@example.com");
    }

    @Test
    void testRegisterAsAdminIsRefused() {
        RegisterRequest request = new RegisterRequest("boss@tekkies.com", "pass123", "Boss", null, null, "0821234567", "ADMIN");
        request.setCode("123456");

        assertThrows(IllegalArgumentException.class, () -> authController.register(request));
        verify(authService, never()).register(any(Customer.class));
    }

    @Test
    void testRegisterWithWrongCodeCreatesNoAccount() {
        RegisterRequest request = new RegisterRequest("ethan@example.com", "pass123", "Ethan Williams", null, null, "0821234567");
        request.setCode("000000");
        doThrow(new IllegalArgumentException("That code is incorrect"))
                .when(verificationService).checkCode("ethan@example.com", "000000");

        assertThrows(IllegalArgumentException.class, () -> authController.register(request));
        verify(authService, never()).register(any(Customer.class));
    }

    @Test
    void testLoginEndpoint() {
        LoginRequest request = new LoginRequest("ethan@example.com", "pass123");
        AuthResponse mockResponse = new AuthResponse("C001", "ethan@example.com", "Ethan Williams", "jwt-token-xyz");

        when(authService.login(eq("ethan@example.com"), eq("pass123"))).thenReturn(mockResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("jwt-token-xyz", response.getBody().getToken());
        assertEquals("CUSTOMER", response.getBody().getRole());
    }

    @Test
    void testBadCredentialsExceptionHandler() {
        BadCredentialsException ex = new BadCredentialsException("Invalid email or password");
        ResponseEntity<Map<String, Object>> response = authController.handleBadCredentials(ex);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().get("status"));
        assertEquals("Unauthorized", response.getBody().get("error"));
    }
}
