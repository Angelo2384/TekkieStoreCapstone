/* ShoeFactoryTest.java
ShoeFactoryTest model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.core.annotation.Order;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;

import static org.junit.jupiter.api.Assertions.*;

// Enables tests to run in order using @Order
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ShoeFactoryTest {

    @Test
    @Order(1)  // Runs first
    public void createShoe() {
        Shoe shoe = ShoeFactory.createShoe("S001", "Adios", "Fakanese", "Sneaker", "Cheaper shows with the same comfortability", "UniSex", 320.00f);
        assertNotNull(shoe);
        System.out.println(shoe.toString());
    }

    @Test
    @Order(2)
    public void createShoeWithoutBrand() {
        Shoe shoe = ShoeFactory.createShoe("S001", "", "Fakanese", "Sneaker", "Cheaper shows with the same comfortability", "UniSex", 320.00f);
        assertNull(shoe);
    }
}