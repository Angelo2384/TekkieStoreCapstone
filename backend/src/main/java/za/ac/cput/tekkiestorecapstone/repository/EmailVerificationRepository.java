package za.ac.cput.tekkiestorecapstone.repository;

/* EmailVerificationRepository.java
Signup verification codes, keyed by email
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.EmailVerification;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, String> {
}
