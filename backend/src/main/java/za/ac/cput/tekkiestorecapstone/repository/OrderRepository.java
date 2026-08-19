package za.ac.cput.tekkiestorecapstone.repository;

/* OrderRepository.java
OrderRepository model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
}
