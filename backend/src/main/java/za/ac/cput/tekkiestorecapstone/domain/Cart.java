/*
 * Cart.java
 * Cart Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.domain;

public class Cart {
    private String cartId;
    private double totalAmount;

    protected Cart(){}

    private Cart(Builder builder){
        this.cartId= builder.cartId;
        this.totalAmount= builder.totalAmount;
    }

    public String getCartId() {
        return cartId;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    @Override
    public String toString() {
        return "Cart{" +
                "cartId='" + cartId + '\'' +
                ", totalAmount=" + totalAmount +
                '}';
    }

    public static class Builder{
        private String cartId;
        private double totalAmount;

        public Builder setCartId(String cartId) {
            this.cartId = cartId;
            return this;
        }

        public Builder setTotalAmount(double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public Builder copy(Cart cart){
            this.cartId= cart.cartId;
            this.totalAmount= cart.totalAmount;
            return this;
        }
        public Cart build(){return new Cart(this);}
    }
}

