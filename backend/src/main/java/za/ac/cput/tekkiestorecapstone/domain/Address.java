/*
 * Address.java
 * Address Value Object
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.domain;

public class Address {
    private String streetNumber;
    private String streetName;
    private String suburb;
    private String city;
    private String postalCode;

    protected Address(){}

    private Address(Builder build){
        this.streetNumber= build.streetNumber;
        this.streetName= build.streetName;
        this.suburb= build.suburb;
        this.city= build.city;
        this.postalCode= build.postalCode;
    }
    public String getStreetNumber() {
        return streetNumber;
    }

    public String getStreetName() {
        return streetName;
    }

    public String getSuburb() {
        return suburb;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    @Override
    public String toString() {
        return "Address{" +
                "streetNumber='" + streetNumber + '\'' +
                ", streetName='" + streetName + '\'' +
                ", suburb='" + suburb + '\'' +
                ", city='" + city + '\'' +
                ", postalCode='" + postalCode + '\'' +
                '}';
    }

    public static class Builder{
        private String streetNumber;
        private String streetName;
        private String suburb;
        private String city;
        private String postalCode;

        public Builder setStreetNumber(String streetNumber) {
            this.streetNumber = streetNumber;
            return this;
        }

        public Builder setStreetName(String streetName) {
            this.streetName = streetName;
            return this;
        }

        public Builder setSuburb(String suburb) {
            this.suburb = suburb;
            return this;
        }

        public Builder setCity(String city) {
            this.city = city;
            return this;
        }

        public Builder setPostalCode(String postalCode) {
            this.postalCode = postalCode;
            return this;
        }

        public Builder copy(Address address){
            this.streetNumber =address.streetNumber;
            this.streetName= address.streetName;
            this.suburb= address.suburb;
            this.city= address.city;
            this.postalCode= address.postalCode;
            return this;
        }
        public Address build(){return new Address(this);}
    }
}
