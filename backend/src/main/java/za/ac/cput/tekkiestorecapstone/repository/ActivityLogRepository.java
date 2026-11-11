/*
 * ActivityLogRepository.java
 * Repository for the admin portal's activity log
 */
package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.ActivityLog;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {
    // The newest 500 entries, newest first
    List<ActivityLog> findTop500ByOrderByCreatedAtDesc();
}
