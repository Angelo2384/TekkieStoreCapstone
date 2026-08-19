/* ShoeRepository.java
ShoeRepository model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;

@Repository
public interface ShoeRepository extends JpaRepository<Shoe, String> {
}
