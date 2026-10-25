package za.ac.cput.tekkiestorecapstone.repository;

/* OrderRepository.java
OrderRepository model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomer_CustomerId(String customerId);

    // Changes only the status column, so the order's items, totals and customer are never touched
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Order o SET o.status = :status WHERE o.orderId = :orderId")
    int updateStatus(@Param("orderId") String orderId, @Param("status") OrderStatus status);
}
