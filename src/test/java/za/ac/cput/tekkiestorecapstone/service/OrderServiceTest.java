package za.ac.cput.tekkiestorecapstone.service;

/* OrderServiceTest.java
OrderServiceTest model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.factory.OrderFactory;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class OrderServiceTest {

    @Mock
    OrderRepository repo;

    @InjectMocks
    OrderService service;

    private static Order order;

    @BeforeEach
    void setUp() {

        order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                1500.00,
                "PAY001"
        );
    }

    @Test
    void a_create() {

        when(repo.save(any(Order.class))).thenReturn(order);

        Order created = service.create(order);

        assertNotNull(created);
        assertEquals(created.getOrderId(), order.getOrderId());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {

        when(repo.findById(order.getOrderId())).thenReturn(Optional.of(order));

        Order read = service.read(order.getOrderId());

        assertNotNull(read);

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {

        Order updated = new Order.Builder()
                .copy(order)
                .setPaymentReference("PAY002")
                .build();

        when(repo.save(any(Order.class))).thenReturn(updated);

        Order updatedOrder = service.update(updated);

        assertNotNull(updatedOrder);
        assertEquals("PAY002", updatedOrder.getPaymentReference());

        System.out.println("Success: " + updatedOrder);
    }

    @Test
    void d_delete() {

        boolean success = service.delete(order.getOrderId());

        verify(repo).deleteById(order.getOrderId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {

        when(repo.findAll()).thenReturn(List.of(order));

        List<Order> all = service.getAll();

        assertNotNull(all);

        System.out.println("Success: " + all);
    }
}