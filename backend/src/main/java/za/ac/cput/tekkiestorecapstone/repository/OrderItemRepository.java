package za.ac.cput.tekkiestorecapstone.repository;

/* OrderItemRepository.java
OrderItem repository interface
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
}