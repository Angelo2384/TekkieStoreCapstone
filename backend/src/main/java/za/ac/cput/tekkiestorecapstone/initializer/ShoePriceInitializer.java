package za.ac.cput.tekkiestorecapstone.initializer;

/* ShoePriceInitializer.java
Rounds prices that were saved with cents to whole rands, so the price shown is exactly the price charged
*/

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@Order(5) // After the shoes have been seeded
public class ShoePriceInitializer implements ApplicationRunner {

    private final ShoeRepository shoeRepository;

    public ShoePriceInitializer(ShoeRepository shoeRepository) {
        this.shoeRepository = shoeRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (Shoe shoe : shoeRepository.findAll()) {
            if (isWholeRands(shoe.getBasePrice()) && isWholeRands(shoe.getSalePrice())) {
                continue;
            }
            shoeRepository.save(new Shoe.Builder()
                    .copy(shoe)
                    .setBasePrice(toWholeRands(shoe.getBasePrice()))
                    .setSalePrice(toWholeRands(shoe.getSalePrice()))
                    .build());
        }
    }

    private static boolean isWholeRands(BigDecimal price) {
        return price == null || price.stripTrailingZeros().scale() <= 0;
    }

    private static BigDecimal toWholeRands(BigDecimal price) {
        return price == null ? null : price.setScale(0, RoundingMode.HALF_UP);
    }
}
