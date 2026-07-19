package za.ac.cput.tekkiestorecapstone.factory;

/* OrderFactoryTest.java
OrderFactoryTest model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;


import za.ac.cput.tekkiestorecapstone.domain.Order;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class OrderFactoryTest {

    @Test
    @org.junit.jupiter.api.Order(1)
    public void createOrder() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                1500.00,
                "PAY001"
        );

        assertNotNull(order);
        System.out.println(order.toString());
    }

    @Test
    @org.junit.jupiter.api.Order(2)
    public void createOrderWithNullPaymentReference() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                1500.00,
                ""
        );

        assertNull(order);
    }

    @Test
    @org.junit.jupiter.api.Order(3)
    public void createOrderWithNegativeAmount() {

        Order order = OrderFactory.createOrder(
                "ORD001",
                new Date(),
                -1500.00,
                "PAY001"
        );

        assertNull(order);
    }
}