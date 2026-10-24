/*
 * AdminController.java
 * Admin-only endpoints (locked to ADMIN in SecurityConfig): the admin account list and admin check-ins
 */
package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.tekkiestorecapstone.dto.AdminAccountResponse;
import za.ac.cput.tekkiestorecapstone.service.AdminAccountService;

import java.util.List;

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
}
