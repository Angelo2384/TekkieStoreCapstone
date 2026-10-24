package za.ac.cput.tekkiestorecapstone.initializer;

/* ShoeColourInitializer.java
Gives shoes saved before Shoe had a colour the colour their sizes already use
*/

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.List;

@Component
@Order(4) // After ShoeVariantDataInitializer has created the sizes
public class ShoeColourInitializer implements ApplicationRunner {

    private final ShoeRepository shoeRepository;
    private final ShoeVariantRepository shoeVariantRepository;

    public ShoeColourInitializer(ShoeRepository shoeRepository, ShoeVariantRepository shoeVariantRepository) {
        this.shoeRepository = shoeRepository;
        this.shoeVariantRepository = shoeVariantRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (Shoe shoe : shoeRepository.findAll()) {
            if (shoe.getColour() != null && !shoe.getColour().isBlank()) {
                continue;
            }
            List<ShoeVariant> sizes = shoeVariantRepository.findByShoe_ShoeId(shoe.getShoeId());
            if (sizes.isEmpty()) {
                continue;
            }
            shoeRepository.save(new Shoe.Builder().copy(shoe).setColour(sizes.get(0).getColour()).build());
        }
    }
}
