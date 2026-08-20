
/* ShoeVariantControllerTest.java
ShoeVariantControllerTest model class
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/
package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.factory.ShoeSizeFactory;
import za.ac.cput.tekkiestorecapstone.factory.ShoeVariantFactory;
import za.ac.cput.tekkiestorecapstone.service.ShoeVariantService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeVariantControllerTest {

    @Mock
    private ShoeVariantService service;

    @InjectMocks
    private ShoeVariantController controller;

    private static ShoeVariant shoeVariant;
    private static ShoeSize size;

    @BeforeEach
    void setUp() {
        size = ShoeSizeFactory.createShoeSize(7.0, "UK");

        shoeVariant = ShoeVariantFactory.createShoeVariant(
                "V001",
                size,
                "Black",
                15
        );
    }

    @Test
    void a_create() {
        when(service.create(any(ShoeVariant.class))).thenReturn(shoeVariant);

        ShoeVariant created = controller.create(shoeVariant);

        assertNotNull(created);
        assertEquals(shoeVariant.getVariantId(), created.getVariantId());

        System.out.println("ShoeVariant: " + created);
    }

    @Test
    void b_read() {
        when(service.read("V001")).thenReturn(shoeVariant);

        ShoeVariant found = controller.read("V001");

        assertNotNull(found);
        assertEquals("V001", found.getVariantId());

        System.out.println("ShoeVariant: " + found);
    }

    @Test
    void c_update() {
        ShoeVariant updated = new ShoeVariant.Builder()
                .copy(shoeVariant)
                .setColour("White")
                .build();

        when(service.update(any(ShoeVariant.class))).thenReturn(updated);

        ShoeVariant result = controller.update(shoeVariant);

        assertNotNull(result);

        System.out.println("Success: " + result);
    }

    @Test
    void d_delete() {
        when(service.delete("V001")).thenReturn(true);

        boolean deleted = controller.delete("V001");

        assertTrue(deleted);

        System.out.println("Success: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(shoeVariant));

        List<ShoeVariant> variants = controller.getAll();

        assertNotNull(variants);

        System.out.println("ShoeVariants: " + variants);
    }
}
