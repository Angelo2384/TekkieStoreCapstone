package za.ac.cput.tekkiestorecapstone.domain;

/* OrderItem.java
OrderItem model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

// Represents an item in an order.
public class OrderItem {

    private String orderItemId;
    private int quantity;
    private double unitPrice;
    private double subTotal;

    // Default constructor
    protected OrderItem() {

    }

    // Constructor using Builder
    private OrderItem(Builder builder) {
        this.orderItemId = builder.orderItemId;
        this.quantity = builder.quantity;
        this.unitPrice = builder.unitPrice;
        this.subTotal = builder.subTotal;
    }

    // Getters
    public String getOrderItemId() {
        return orderItemId;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public double getSubTotal() {
        return subTotal;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "orderItemId='" + orderItemId + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", subTotal=" + subTotal +
                '}';
    }

    // Builder class
    public static class Builder {

        private String orderItemId;
        private int quantity;
        private double unitPrice;
        private double subTotal;

        public Builder setOrderItemId(String orderItemId) {
            this.orderItemId = orderItemId;
            return this;
        }

        public Builder setQuantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder setUnitPrice(double unitPrice) {
            this.unitPrice = unitPrice;
            return this;
        }

        public Builder setSubTotal(double subTotal) {
            this.subTotal = subTotal;
            return this;
        }

        // Copies values from an existing OrderItem object
        public Builder copy(OrderItem orderItem) {
            this.orderItemId = orderItem.orderItemId;
            this.quantity = orderItem.quantity;
            this.unitPrice = orderItem.unitPrice;
            this.subTotal = orderItem.subTotal;
            return this;
        }

        // Builds and returns a new OrderItem object
        public OrderItem build() {
            return new OrderItem(this);
        }
    }
}