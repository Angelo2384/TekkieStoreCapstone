/*
 * ActivityLog.java
 * One change made in the admin portal: who made it, what changed, and when
 */
package za.ac.cput.tekkiestorecapstone.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "activity_log")
public class ActivityLog {
    @Id
    private String id;
    // Email of the owner or staff member who made the change
    private String actor;
    @Column(length = 500)
    private String description;
    private Instant createdAt;

    protected ActivityLog() {}

    private ActivityLog(Builder builder) {
        this.id = builder.id;
        this.actor = builder.actor;
        this.description = builder.description;
        this.createdAt = builder.createdAt;
    }

    public String getId() {
        return id;
    }

    public String getActor() {
        return actor;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public static class Builder {
        private String id;
        private String actor;
        private String description;
        private Instant createdAt;

        public Builder setId(String id) {
            this.id = id;
            return this;
        }

        public Builder setActor(String actor) {
            this.actor = actor;
            return this;
        }

        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ActivityLog build() {
            return new ActivityLog(this);
        }
    }
}
