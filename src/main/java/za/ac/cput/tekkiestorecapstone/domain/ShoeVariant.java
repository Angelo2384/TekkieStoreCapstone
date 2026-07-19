
/* ShoeVariant.java
Domain Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.domain;

public class ShoeVariant {
    private String variantId;
    private ShoeSize size;
    private String colour;
    private int stockQuantity;

    protected ShoeVariant(){}


    private ShoeVariant(Builder builder){
        this.variantId = builder.variantId;
        this.size = builder.size;
        this.colour = builder.colour;
        this.stockQuantity = builder.stockQuantity;
    }


    public String getVariantId() {
        return variantId;
    }

    public ShoeSize getSize() {
        return size;
    }

    public String getColour() {
        return colour;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    @Override
    public String toString() {
        return "ShoeVariant{" +
                "variantId='" + variantId + '\'' +
                ", size=" + size +
                ", colour='" + colour + '\'' +
                ", stockQuantity=" + stockQuantity +
                '}';
    }

    public static class Builder{
        private String variantId;
        private ShoeSize size;
        private String colour;
        private int stockQuantity;

        public Builder setVariantId(String variantId) {
            this.variantId = variantId;
            return this;
        }

        public Builder setSize(ShoeSize size) {
            this.size = size;
            return this;
        }

        public Builder setColour(String colour) {
            this.colour = colour;
            return this;
        }

        public Builder setStockQuantity(int stockQuantity) {
            this.stockQuantity = stockQuantity;
            return this;
        }

        public Builder copy(ShoeVariant shoeVariant){
            this.variantId = shoeVariant.variantId;
            this.size = shoeVariant.size;
            this.colour = shoeVariant.colour;
            this.stockQuantity = shoeVariant.stockQuantity;
            return this;
        }

        public ShoeVariant build(){
            return new ShoeVariant(this);
        }
    }
}
