/*
 * AdminAccountResponse.java
 * One row on the admin "Admin Logins" page
 */
package za.ac.cput.tekkiestorecapstone.dto;

import java.time.Instant;

public class AdminAccountResponse {
    private String email;
    private Instant createdAt;
    private Instant lastLoginAt;
    private boolean active;

    public AdminAccountResponse() {}

    public AdminAccountResponse(String email, Instant createdAt, Instant lastLoginAt, boolean active) {
        this.email = email;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this.active = active;
    }

    public String getEmail() {
        return email;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getLastLoginAt() {
        return lastLoginAt;
    }

    public boolean isActive() {
        return active;
    }
}
