package za.ac.cput.tekkiestorecapstone.factory;

/* OrderFactory.java
OrderFactory model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.util.Date;

public class OrderFactory {

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    double totalAmount,
                                    String paymentReference) {

        if (Helper.isNullOrEmpty(orderId)
                || orderDate == null
                || Helper.isNullOrEmpty(paymentReference)) {
            return null;
        }

        if (totalAmount < 0) {
            return null;
        }

        return new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(orderDate)
                .setTotalAmount(totalAmount)
                .setPaymentReference(paymentReference)
                .build();
    }
}