
/* ShoeVariantFactoryTest.java
Test For the Factory Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;


import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.core.annotation.Order;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;

import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ShoeVariantFactoryTest {

    private ShoeSize validSize = new ShoeSize.Builder()
            .setSizeValue(9.5)
            .setSizeRegion("UK")
            .build();

    @Test
    @Order(1) // Runs first
    public void createShoeVariant() {

        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validSize,
                "Black",
                10
        );

        assertNotNull(variant);
        System.out.println(variant.toString());
    }

    @Test
    @Order(2)
    public void createShoeVariantWithMissingColour() {

        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validSize,
                "",
                10
        );

        assertNull(variant);
    }

    @Test
    @Order(3)
    public void createShoeVariantWithNullSize() {

        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                null,
                "Black",
                10
        );

        assertNull(variant);
    }

    @Test
    @Order(4)
    public void createShoeVariantWithNegativeStock() {

        ShoeVariant variant = ShoeVariantFactory.createShoeVariant(
                "VAR001",
                validSize,
                "Black",
                -5
        );

        assertNull(variant);
    }
}
