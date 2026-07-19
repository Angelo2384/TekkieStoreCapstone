
/* ShoeSizeFactory.java
Factory Layer of the ShoeSize Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class ShoeSizeFactory {
    public static ShoeSize createShoeSize(double sizeValue, String sizeRegion) {

        if (sizeValue <= 0 || Helper.isNullOrEmpty(sizeRegion)) {
            return null;
        }

        return new ShoeSize.Builder()
                .setSizeValue(sizeValue)
                .setSizeRegion(sizeRegion)
                .build();
    }
}
