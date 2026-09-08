package za.ac.cput.tekkiestorecapstone.factory;

/* OrderItemFactory.java
OrderItemFactory model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class OrderItemFactory {

    public static OrderItem createOrderItem(String orderItemId,
                                            int quantity,
                                            double unitPrice) {
        return createOrderItem(orderItemId, null, null, null, null, null, quantity, unitPrice);
    }

    public static OrderItem createOrderItem(String orderItemId,
                                            String shoeId,
                                            String shoeName,
                                            String brand,
                                            String size,
                                            String imageUrl,
                                            int quantity,
                                            double unitPrice) {

        if (Helper.isNullOrEmpty(orderItemId)) {
            return null;
        }

        if (quantity <= 0 || unitPrice < 0) {
            return null;
        }

        return new OrderItem.Builder()
                .setOrderItemId(orderItemId)
                .setShoeId(shoeId)
                .setShoeName(shoeName)
                .setBrand(brand)
                .setSize(size)
                .setImageUrl(imageUrl)
                .setQuantity(quantity)
                .setUnitPrice(unitPrice)
                .setSubTotal(quantity * unitPrice)
                .build();
    }
}