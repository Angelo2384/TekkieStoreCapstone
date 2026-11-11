/*
 * AdminController.java
 * Admin portal endpoints (locked in SecurityConfig): admin accounts for the main admin, check-ins for all portal users
 */
package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.dto.CreateAdminRequest;
import za.ac.cput.tekkiestorecapstone.service.AdminAccountService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminAccountService service;

    public AdminController(AdminAccountService service) {
        this.service = service;
    }

    @GetMapping("/accounts")
    public List<AdminAccountResponse> getAdmins() {
        return service.getAdmins();
    }

    @PostMapping("/register")
    public ResponseEntity<AdminAccountResponse> createAdmin(@RequestBody CreateAdminRequest request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getAuthorities().stream().noneMatch(a -> "ROLE_ADMIN".equalsIgnoreCase(a.getAuthority()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        AdminAccountResponse created = service.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Sent every minute while an admin is logged in
    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(Authentication authentication) {
        service.markActive(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    // Sent on logout so the admin shows as offline straight away
    @PostMapping("/offline")
    public ResponseEntity<Void> offline(Authentication authentication) {
        service.markOffline(authentication.getName());
        return ResponseEntity.noContent().build();
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
