package za.ac.cput.tekkiestorecapstone.service;
/*
 CartItemServiceTest.java
 CartItemServiceTest model class
 Author: Angelo Adams
 Date: 19 July 2026
*/

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith ;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;
import za.ac.cput.tekkiestorecapstone.factory.CartItemFactory;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CartItemServiceTest {

    @Mock
    CartItemRepository repo;

    @InjectMocks
    CartItemService service;

    private static CartItem cartItem;

    @BeforeEach
    void setUp() {
        cartItem = CartItemFactory.createCartItem("CI001", 2, 150.00);
    }

    @Test
    void a_create() {
        when(repo.save(any(CartItem.class))).thenReturn(cartItem);

        CartItem created = service.create(cartItem);

        assertNotNull(created);
        assertEquals(created.getCartItem(), cartItem.getCartItem());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(cartItem.getCartItem())).thenReturn(Optional.of(cartItem));

        CartItem read = service.read(cartItem.getCartItem());

        assertNotNull(read);

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        CartItem updated = new CartItem.Builder()
                .copy(cartItem)
                .setQuantity(3)
                .build();

        when(repo.save(any(CartItem.class))).thenReturn(updated);

        CartItem updatedCartItem = service.update(cartItem);

        assertNotNull(updatedCartItem);

        System.out.println("Success: " + updatedCartItem);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(cartItem.getCartItem());

        verify(repo).existsById(cartItem.getCartItem());

        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(cartItem));

        List<CartItem> all = service.getAll();

        assertNotNull(all);

        System.out.println("Success: " + all);
    }
}
