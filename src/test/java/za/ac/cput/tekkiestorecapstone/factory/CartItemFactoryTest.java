package za.ac.cput.tekkiestorecapstone.factory;


import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
 class CartItemFactoryTest {

    @Test
    @Order(1)
    public void createCartItem(){
        CartItem cartItem = CartItemFactory.createCartItem("DD01", 2, 900.00);
        assertNotNull(cartItem);
        System.out.print(cartItem.toString());

    }
    @Test
    @Order(2)
    public void createCartItemWithInvalidQuantity(){
        CartItem cartItem = CartItemFactory.createCartItem("DD01", 0, 900.00);
        assertNotNull(cartItem);

    }


}
