package za.ac.cput.tekkiestorecapstone.domain;

public class Cart {
    private String cartId;
    private double totalAmount;

    private Cart(){}

    protected Cart(Builder builder){

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

