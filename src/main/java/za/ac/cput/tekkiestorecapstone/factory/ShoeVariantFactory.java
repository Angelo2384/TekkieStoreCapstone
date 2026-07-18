package za.ac.cput.tekkiestorecapstone.factory;


import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class ShoeVariantFactory {


    public static ShoeVariant createShoeVariant(String variantId,
                                                double sizeValue,
                                                String sizeRegion,
                                                String colour,
                                                int stockQuantity){

        if(Helper.isNullOrEmpty(variantId)
        || Helper.isNullOrEmpty(sizeRegion)
        || Helper.isNullOrEmpty(colour)){
            return null;
        }

     if (sizeValue <= 0 || stockQuantity < 0){
         return null;
     }
        ShoeSize size = new ShoeSize.Builder()
                .setSizeValue(sizeValue)
                .setSizeRegion(sizeRegion)
                .build();

     return new ShoeVariant.Builder()
             .setVariantId(variantId)
             .setSize(size)
             .setColour(colour)
             .setStockQuantity(stockQuantity)
             .build();
    }
}
