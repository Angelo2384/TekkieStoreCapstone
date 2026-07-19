package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class CartFactory {

    public static Cart createCart(String cartId, double totalAmount) {

        if (Helper.isNullOrEmpty(cartId)) {
            return null;
        }

        if (totalAmount < 0) {
            return null;
        }

        return new Cart.Builder()
                .setCartId(cartId)
                .setTotalAmount(totalAmount)
                .build();
    }
}