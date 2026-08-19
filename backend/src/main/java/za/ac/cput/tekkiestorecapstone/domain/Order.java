package za.ac.cput.tekkiestorecapstone.domain;

/* Order.java
Order model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import java.util.Date;

public class Order {

    private String orderId;
    private Date orderDate;
    private double totalAmount;
    private OrderStatus status;
    private String paymentReference;

    // Default constructor
    protected Order() {
    }


    // Builder constructor
    private Order(Builder builder) {
        this.orderId = builder.orderId;
        this.orderDate = builder.orderDate;
        this.totalAmount = builder.totalAmount;
        this.status = builder.status;
        this.paymentReference = builder.paymentReference;
    }

    // Getters
    public String getOrderId() {
        return orderId;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", orderDate=" + orderDate +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                ", paymentReference='" + paymentReference + '\'' +
                '}';
    }

    // Builder
    public static class Builder {

        private String orderId;
        private Date orderDate;
        private double totalAmount;
        private OrderStatus status;
        private String paymentReference;

        public Builder setOrderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public Builder setOrderDate(Date orderDate) {
            this.orderDate = orderDate;
            return this;
        }

        public Builder setTotalAmount(double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder setStatus(OrderStatus status) {
            this.status = status;
            return this;
        }

        public Builder setPaymentReference(String paymentReference) {
            this.paymentReference = paymentReference;
            return this;
        }

        public Builder copy(Order order) {
            this.orderId = order.orderId;
            this.orderDate = order.orderDate;
            this.totalAmount = order.totalAmount;
            this.status = order.status;
            this.paymentReference = order.paymentReference;
            return this;
        }

        public Order build() {
            return new Order(this);
        }
    }
}