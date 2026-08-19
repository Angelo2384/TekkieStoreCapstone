
/* ShoeVariantServiceTest.java
Test For the Service Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

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
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeVariantServiceTest {

    @Mock
    ShoeVariantRepository repo;

    @InjectMocks
    ShoeVariantService service;

    private static ShoeVariant shoeVariant;
    private static ShoeSize size;

    @BeforeEach
    void setUp() {
        size = ShoeSizeFactory.createShoeSize(7.0, "UK");

        shoeVariant = ShoeVariantFactory.createShoeVariant(
                "V001",
                size,
                "Black",
                10
        );
    }

    @Test
    void a_create() {
        when(repo.save(any(ShoeVariant.class))).thenReturn(shoeVariant);

        ShoeVariant created = service.create(shoeVariant);

        assertNotNull(created);
        assertEquals(shoeVariant.getVariantId(), created.getVariantId());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(shoeVariant.getVariantId()))
                .thenReturn(Optional.of(shoeVariant));

        ShoeVariant read = service.read(shoeVariant.getVariantId());

        assertNotNull(read);
        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        ShoeVariant updated = new ShoeVariant.Builder()
                .copy(shoeVariant)
                .setColour("White")
                .build();

        when(repo.save(any(ShoeVariant.class))).thenReturn(updated);

        ShoeVariant result = service.update(shoeVariant);

        assertNotNull(result);
        System.out.println("Success: " + result);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(shoeVariant.getVariantId());

        verify(repo).deleteById(shoeVariant.getVariantId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(shoeVariant));

        List<ShoeVariant> all = service.getAll();

        assertNotNull(all);
        System.out.println("Success: " + all);
    }
}
