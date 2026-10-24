package za.ac.cput.tekkiestorecapstone.initializer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShoeColourInitializerTest {

    @Mock
    private ShoeRepository shoeRepository;

    @Mock
    private ShoeVariantRepository shoeVariantRepository;

    @InjectMocks
    private ShoeColourInitializer initializer;

    private Shoe shoe(String id, String colour) {
        return new Shoe.Builder().setShoeId(id).setShoeName("Test " + id).setColour(colour).build();
    }

    @Test
    void testShoeWithoutColourGetsTheColourOfItsSizes() {
        Shoe shoe = shoe("NIKE-001", null);
        when(shoeRepository.findAll()).thenReturn(List.of(shoe));
        when(shoeVariantRepository.findByShoe_ShoeId("NIKE-001")).thenReturn(List.of(
                new ShoeVariant.Builder().setVariantId("NIKE-001-UK8").setShoe(shoe).setColour("Black").build()));

        initializer.run(null);

        verify(shoeRepository).save(argThat(saved -> saved.getShoeId().equals("NIKE-001") && saved.getColour().equals("Black")));
    }

    @Test
    void testShoeThatHasAColourIsLeftAlone() {
        when(shoeRepository.findAll()).thenReturn(List.of(shoe("NIKE-002", "White")));

        initializer.run(null);

        verify(shoeVariantRepository, never()).findByShoe_ShoeId(anyString());
        verify(shoeRepository, never()).save(any());
    }

    @Test
    void testShoeWithNoSizesIsSkipped() {
        when(shoeRepository.findAll()).thenReturn(List.of(shoe("NIKE-003", null)));
        when(shoeVariantRepository.findByShoe_ShoeId("NIKE-003")).thenReturn(List.of());

        initializer.run(null);

        verify(shoeRepository, never()).save(any());
    }
}
