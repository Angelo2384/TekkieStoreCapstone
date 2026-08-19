package za.ac.cput.tekkiestorecapstone.domain;

public class CartItem {
    private String cartItemId;
    private int quantity;
    private double unitPrice;
    private double subTotal;


    protected CartItem(){
    }
    private CartItem(Builder build){
        this.cartItemId= build.cartItemId;
        this.quantity = build.quantity;
        this.subTotal = build.subTotal;
        this.unitPrice = build.unitPrice;

    }

    public String getCartItem(){
        return cartItemId;
    }
    public int getQuantity(){
        return quantity;
    }
    public double getSubTotal(){
        return subTotal;
    }

    @Override
    public String toString()  {
        return "CartItem{" + "cartItemId=" + cartItemId + '\'' + ", quantity=" + quantity + ", subtotal=" + subTotal + '}';

    }

    public static class Builder{
        private String cartItemId;
        private int quantity;
        private double unitPrice;
        private double subTotal;

        public Builder setCartItemId(String cartItemId) {
            this.cartItemId = cartItemId;
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
        public Builder copy(CartItem cartItem){
            this.cartItemId = cartItem.cartItemId;
            this.quantity = cartItem.quantity;
            this.unitPrice = cartItem.unitPrice;
            this.subTotal = cartItem.subTotal;
            return this;
        }
        public CartItem build(){
            return new CartItem(this);
        }

    }
}

