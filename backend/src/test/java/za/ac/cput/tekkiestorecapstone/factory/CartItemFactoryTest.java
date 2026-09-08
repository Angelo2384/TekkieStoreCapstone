package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartItemFactoryTest {

    @Test
    @Order(1)
    public void createCartItem(){
        CartItem cartItem = CartItemFactory.createCartItem("DD01", 2, 900.00);
        assertNotNull(cartItem);
        System.out.println(cartItem.toString());
    }

    @Test
    @Order(2)
    public void createCartItemWithInvalidQuantity(){
        CartItem cartItem = CartItemFactory.createCartItem("DD01", 0, 900.00);
        assertNull(cartItem);
    }

    @Test
    @Order(3)
    public void createCartItemWithRelationships(){
        Cart cart = CartFactory.createCart("CART001", 1800.00);
        Shoe shoe = ShoeFactory.createShoe("S001", "Nike", "Air Max 90", "Sneaker", "Lifestyle", "Men", 900.00, List.of("https://res.cloudinary.com/test.jpg"));
        ShoeSize shoeSize = ShoeSizeFactory.createShoeSize(8.0, "UK");
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant("V001", shoe, shoeSize, "Black", 10);

        CartItem cartItem = CartItemFactory.createCartItem("DD01", cart, shoe, variant, shoeSize, 2, 900.00);
        assertNotNull(cartItem);
        assertNotNull(cartItem.getCart());
        assertEquals("CART001", cartItem.getCart().getCartId());
        assertNotNull(cartItem.getShoe());
        assertEquals("S001", cartItem.getShoe().getShoeId());
        assertNotNull(cartItem.getShoeVariant());
        assertEquals("V001", cartItem.getShoeVariant().getVariantId());
        assertNotNull(cartItem.getShoeSize());
        assertEquals(8.0, cartItem.getShoeSize().getSizeValue());
        assertEquals("UK", cartItem.getShoeSize().getSizeRegion());
        assertEquals(1800.00, cartItem.getSubTotal());
        System.out.println(cartItem.toString());
    }
}

