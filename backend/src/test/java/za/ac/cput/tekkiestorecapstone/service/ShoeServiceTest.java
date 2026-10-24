/* ShoeServiceTest.java
ShoeServiceTest model class
Author: Lyle Solomons (230123872)
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
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.factory.ShoeFactory;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ShoeServiceTest {
    @Mock
    ShoeRepository repo;
    @Mock
    ShoeVariantRepository variantRepo;
    @Mock
    CartItemRepository cartItemRepo;

    @InjectMocks
    ShoeService service;
    private static Shoe shoe;

    @BeforeEach
    void setUp() {
        shoe = ShoeFactory.createShoe(
                "S001",
                "Adios",
                "Fakanese",
                "Sneaker",
                "Cheaper shoes with the same comfortability",
                "Unisex",
                BigDecimal.valueOf(320.00),
                List.of("https://res.cloudinary.com/test/shoe.jpg")
        );
    }

    @Test
    void a_create() {
        when(repo.save(any(Shoe.class))).thenReturn(shoe);

        Shoe created =  service.create(shoe);

        assertNotNull(created);
        assertEquals(created.getShoeId(),  shoe.getShoeId());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(shoe.getShoeId())).thenReturn(Optional.of(shoe));

        Shoe read =  service.read(shoe.getShoeId());
        assertNotNull(read);

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        Shoe updated = new Shoe.Builder().copy(shoe).setBrand("Ikes").build();

        when(repo.save(any(Shoe.class))).thenReturn(updated);
        Shoe updatedUpdated = service.update(shoe);
        assertNotNull(updatedUpdated);

        System.out.println("Success: " + updatedUpdated);

    }

    @Test
    void d_delete() {
        boolean success = service.delete(shoe.getShoeId());
        // Its cart lines and sizes are removed first, since they point at the shoe
        verify(cartItemRepo).findByShoe_ShoeId(shoe.getShoeId());
        verify(cartItemRepo).deleteAll(any());
        verify(variantRepo).findByShoe_ShoeId(shoe.getShoeId());
        verify(variantRepo).deleteAll(any());
        verify(repo).deleteById(shoe.getShoeId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(shoe));
        List<Shoe> all = service.getAll();

        assertNotNull(all);
        System.out.println("Success: " + all);
    }

    @Test
    void f_updateGivesAllSizesTheShoesColour() {
        Shoe black = new Shoe.Builder().copy(shoe).setColour("Black").build();
        ShoeVariant original = new ShoeVariant.Builder().setVariantId("S001-UK8").setShoe(black).setColour("Original").setStockQuantity(3).build();
        ShoeVariant alreadyBlack = new ShoeVariant.Builder().setVariantId("S001-UK9").setShoe(black).setColour("Black").setStockQuantity(2).build();
        when(repo.save(any(Shoe.class))).thenReturn(black);
        when(variantRepo.findByShoe_ShoeId("S001")).thenReturn(List.of(original, alreadyBlack));

        service.update(black);

        // Only the size with a different colour is saved
        verify(variantRepo).save(argThat(v -> v.getVariantId().equals("S001-UK8") && v.getColour().equals("Black")
                && v.getStockQuantity() == 3));
        verify(variantRepo, never()).save(argThat(v -> v.getVariantId().equals("S001-UK9")));
    }

    @Test
    void g_deleteIsRefusedWhileTheShoeHasStock() {
        ShoeVariant inStock = new ShoeVariant.Builder().setVariantId("S001-UK8").setShoe(shoe).setColour("Black").setStockQuantity(3).build();
        ShoeVariant soldOut = new ShoeVariant.Builder().setVariantId("S001-UK9").setShoe(shoe).setColour("Black").setStockQuantity(0).build();
        when(variantRepo.findByShoe_ShoeId("S001")).thenReturn(List.of(inStock, soldOut));

        IllegalStateException e = assertThrows(IllegalStateException.class, () -> service.delete("S001"));

        assertTrue(e.getMessage().contains("3 pairs in stock"));
        verify(repo, never()).deleteById(any());
        verify(variantRepo, never()).deleteAll(any());
        verify(cartItemRepo, never()).deleteAll(any());
    }
}
