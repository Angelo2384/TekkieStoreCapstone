package za.ac.cput.tekkiestorecapstone.factory;

/* OrderFactory.java
OrderFactory model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.util.Helper;

import java.util.Date;
import java.util.List;

public class OrderFactory {

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    double totalAmount,
                                    String paymentReference) {
        return createOrder(orderId, orderDate, totalAmount, OrderStatus.PENDING, paymentReference);
    }

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    double totalAmount,
                                    OrderStatus status,
                                    String paymentReference) {

        if (Helper.isNullOrEmpty(orderId)
                || orderDate == null
                || Helper.isNullOrEmpty(paymentReference)) {
            return null;
        }

        if (totalAmount < 0) {
            return null;
        }

        OrderStatus orderStatus = (status == null) ? OrderStatus.PENDING : status;

        return new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(orderDate)
                .setSubtotal(totalAmount)
                .setTotalAmount(totalAmount)
                .setStatus(orderStatus)
                .setPaymentReference(paymentReference)
                .build();
    }

    public static Order createOrder(String orderId,
                                    Date orderDate,
                                    double subtotal,
                                    double shippingFee,
                                    double vat,
                                    double totalAmount,
                                    String paymentMethod,
                                    String paymentReference,
                                    OrderStatus status,
                                    Customer customer,
                                    List<OrderItem> orderItems) {

        if (Helper.isNullOrEmpty(orderId)
                || orderDate == null
                || customer == null) {
            return null;
        }

        if (totalAmount < 0 || subtotal < 0) {
            return null;
        }

        OrderStatus orderStatus = (status == null) ? OrderStatus.PENDING : status;

        return new Order.Builder()
                .setOrderId(orderId)
                .setOrderDate(orderDate)
                .setSubtotal(subtotal)
                .setShippingFee(shippingFee)
                .setVat(vat)
                .setTotalAmount(totalAmount)
                .setPaymentMethod(paymentMethod)
                .setPaymentReference(paymentReference)
                .setStatus(orderStatus)
                .setCustomer(customer)
                .setOrderItems(orderItems)
                .build();
    }
}