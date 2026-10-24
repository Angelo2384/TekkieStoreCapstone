/*
 * EmailVerification.java
 * A signup verification code waiting to be confirmed (the code itself is stored hashed)
 */
package za.ac.cput.tekkiestorecapstone.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "email_verification")
public class EmailVerification {
    @Id
    private String email;
    private String codeHash;
    private Instant sentAt;
    private Instant expiresAt;
    private int attempts;

    protected EmailVerification() {}

    private EmailVerification(Builder builder) {
        this.email = builder.email;
        this.codeHash = builder.codeHash;
        this.sentAt = builder.sentAt;
        this.expiresAt = builder.expiresAt;
        this.attempts = builder.attempts;
    }

    public String getEmail() {
        return email;
    }

    public String getCodeHash() {
        return codeHash;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public int getAttempts() {
        return attempts;
    }

    public static class Builder {
        private String email;
        private String codeHash;
        private Instant sentAt;
        private Instant expiresAt;
        private int attempts;

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setCodeHash(String codeHash) {
            this.codeHash = codeHash;
            return this;
        }

        public Builder setSentAt(Instant sentAt) {
            this.sentAt = sentAt;
            return this;
        }

        public Builder setExpiresAt(Instant expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public Builder setAttempts(int attempts) {
            this.attempts = attempts;
            return this;
        }

        public Builder copy(EmailVerification verification) {
            this.email = verification.email;
            this.codeHash = verification.codeHash;
            this.sentAt = verification.sentAt;
            this.expiresAt = verification.expiresAt;
            this.attempts = verification.attempts;
            return this;
        }

        public EmailVerification build() {
            return new EmailVerification(this);
        }
    }
}
