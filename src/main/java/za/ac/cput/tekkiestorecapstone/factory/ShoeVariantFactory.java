
/* ShoeVariantFactory.java
Factory Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;


import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class ShoeVariantFactory {


    public static ShoeVariant createShoeVariant(String variantId,
                                                ShoeSize size,
                                                String colour,
                                                int stockQuantity) {

        if (Helper.isNullOrEmpty(variantId)
                || Helper.isNullOrEmpty(colour)) {
            return null;
        }

        if (size == null || stockQuantity < 0) {
            return null;
        }

        return new ShoeVariant.Builder()
                .setVariantId(variantId)
                .setSize(size)
                .setColour(colour)
                .setStockQuantity(stockQuantity)
                .build();
    }
}
