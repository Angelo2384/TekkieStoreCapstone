/*
 * CartRepository.java
 * Repository for Cart Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
}