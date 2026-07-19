
/* ShoeSize.java
Domain Layer of the ShoeSize Entity
Author: Redah Gamieldien(222641681)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.domain;

public class ShoeSize {
    private double sizeValue;
    private String sizeRegion;


    protected ShoeSize() {}

    private ShoeSize(Builder builder){
        this.sizeValue = builder.sizeValue;
        this.sizeRegion = builder.sizeRegion;
    }

    public double getSizeValue() {
        return sizeValue;
    }

    public String getSizeRegion() {
        return sizeRegion;
    }

    @Override
    public String toString() {
        return "ShoeSize{" +
                "sizeValue=" + sizeValue +
                ", sizeRegion='" + sizeRegion + '\'' +
                '}';
    }

    public static class Builder {
        private double sizeValue;
        private String sizeRegion;

        public Builder setSizeValue(double sizeValue) {
            this.sizeValue = sizeValue;
            return this;
        }

        public Builder setSizeRegion(String sizeRegion) {
            this.sizeRegion = sizeRegion;
            return this;
        }

        public Builder copy(ShoeSize shoeSize) {
            this.sizeValue = shoeSize.sizeValue;
            this.sizeRegion = shoeSize.sizeRegion;
            return this;
        }

        public ShoeSize build() {
            return new ShoeSize(this);
        }

    }
}
