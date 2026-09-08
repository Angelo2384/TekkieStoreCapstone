package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class CartItemFactory {
    public static CartItem createCartItem(String cartItemId, int quantity, double unitPrice ){
        if (Helper.isNullOrEmpty(cartItemId) ){
            return null;
        }
        if (quantity <= 0 || unitPrice <=0 ){
            return null;
        }

        double subTotal = quantity * unitPrice;

        return new CartItem.Builder()
                .setCartItemId(cartItemId)
                .setQuantity(quantity)
                .setSubTotal(subTotal)
                .setUnitPrice(unitPrice)
                .build() ;
    }

    public static CartItem createCartItem(
            String cartItemId,
            Cart cart,
            Shoe shoe,
            ShoeVariant shoeVariant,
            ShoeSize shoeSize,
            int quantity,
            double unitPrice
    ) {
        if (Helper.isNullOrEmpty(cartItemId)) {
            return null;
        }
        if (quantity <= 0 || unitPrice <= 0) {
            return null;
        }

        double subTotal = quantity * unitPrice;

        return new CartItem.Builder()
                .setCartItemId(cartItemId)
                .setCart(cart)
                .setShoe(shoe)
                .setShoeVariant(shoeVariant)
                .setShoeSize(shoeSize)
                .setQuantity(quantity)
                .setSubTotal(subTotal)
                .setUnitPrice(unitPrice)
                .build();
    }
}

