package za.ac.cput.tekkiestorecapstone.service;

/* OrderItemServiceTest.java
OrderItem service tests
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
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.factory.OrderItemFactory;
import za.ac.cput.tekkiestorecapstone.repository.OrderItemRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class OrderItemServiceTest {

    @Mock
    OrderItemRepository repo;

    @InjectMocks
    OrderItemService service;

    private static OrderItem orderItem;

    @BeforeEach
    void setUp() {
        orderItem = OrderItemFactory.createOrderItem(
                "OI001",
                2,
                750.00,
                1500.00
        );
    }

    @Test
    void a_create() {
        when(repo.save(any(OrderItem.class))).thenReturn(orderItem);

        OrderItem created = service.create(orderItem);

        assertNotNull(created);
        assertEquals(orderItem.getOrderItemId(), created.getOrderItemId());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(orderItem.getOrderItemId()))
                .thenReturn(Optional.of(orderItem));

        OrderItem read = service.read(orderItem.getOrderItemId());

        assertNotNull(read);

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        OrderItem updated = new OrderItem.Builder()
                .copy(orderItem)
                .setQuantity(3)
                .setSubTotal(2250.00)
                .build();

        when(repo.save(any(OrderItem.class))).thenReturn(updated);

        OrderItem updatedItem = service.update(updated);

        assertNotNull(updatedItem);
        assertEquals(3, updatedItem.getQuantity());

        System.out.println("Success: " + updatedItem);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(orderItem.getOrderItemId());

        verify(repo).deleteById(orderItem.getOrderItemId());

        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(orderItem));

        List<OrderItem> all = service.getAll();

        assertNotNull(all);
        assertEquals(1, all.size());

        System.out.println("Success: " + all);
    }
}