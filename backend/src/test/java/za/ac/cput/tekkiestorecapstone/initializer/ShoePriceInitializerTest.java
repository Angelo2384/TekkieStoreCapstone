package za.ac.cput.tekkiestorecapstone.initializer;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShoePriceInitializerTest {

    @Mock
    private ShoeRepository shoeRepository;

    @InjectMocks
    private ShoePriceInitializer initializer;

    private Shoe shoe(String base, String sale) {
        return new Shoe.Builder().setShoeId("ADI-001").setShoeName("Campus 00s")
                .setBasePrice(new BigDecimal(base)).setSalePrice(new BigDecimal(sale))
                .setSalePercentage(BigDecimal.valueOf(20)).build();
    }

    @Test
    void testSalePriceWithCentsIsRoundedToWholeRands() {
        when(shoeRepository.findAll()).thenReturn(List.of(shoe("1999.00", "1599.20")));

        initializer.run(null);

        verify(shoeRepository).save(argThat(saved ->
                saved.getSalePrice().compareTo(new BigDecimal("1599")) == 0
                        && saved.getBasePrice().compareTo(new BigDecimal("1999")) == 0));
    }

    @Test
    void testWholeRandPricesAreLeftAlone() {
        when(shoeRepository.findAll()).thenReturn(List.of(shoe("1999.00", "1599.00")));

        initializer.run(null);

        verify(shoeRepository, never()).save(any());
    }
}
