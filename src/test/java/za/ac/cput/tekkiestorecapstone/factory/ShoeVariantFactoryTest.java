package za.ac.cput.tekkiestorecapstone.factory;


import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.core.annotation.Order;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;

import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ShoeVariantFactoryTest {

    @Test
    @Order(1)
    public void createShoeVariant() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant("V001", 9.5, "US", "Red", 10);
        assertNotNull(variant);
        System.out.println(variant.toString());
    }
    @Test
    @Order(2)
    public void createShoeVariantWithNegativeStock() {
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant("V001", 9.5, "US", "Red", -10);
        assertNotNull(variant);
    }

    @Test
    @Order(3)
    public void createShoeVariantWithInvalidSize(){
        ShoeVariant variant = ShoeVariantFactory.createShoeVariant("V001", -9.5, "US", "Red", 10);
        assertNotNull(variant);
    }

}
