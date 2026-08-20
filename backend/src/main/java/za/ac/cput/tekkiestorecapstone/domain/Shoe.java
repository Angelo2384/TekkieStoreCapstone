/* Shoe.java
Shoe model class
Author: Lyle Solomons (230123872)
Date: 18 July 2026
*/

package za.ac.cput.tekkiestorecapstone.domain;

//represents a shoe entity in the system.
public class Shoe {
    private String shoeId;
    private String brand;
    private String shoeName;
    private String category;
    private String description;
    private String gender;
    private double basePrice;

    //Default constructor
    protected Shoe(){

    }

    // Constructor that uses the Builder object to initialize fields
    private Shoe(Builder builder){
        this.shoeId = builder.shoeId;
        this.brand = builder.brand;
        this.shoeName = builder.shoeName;
        this.category = builder.category;
        this.description = builder.description;
        this.gender = builder.gender;
        this.basePrice = builder.basePrice;
    }

    // Getter methods to access private fields
    public String getShoeId() {
        return shoeId;
    }

    public String getBrand() {
        return brand;
    }
    public String getShoeName() {
        return shoeName;
    }
    public String getCategory() {
        return category;
    }
    public String getDescription() {
        return description;
    }
    public String getGender() {
        return gender;
    }
    public double getBasePrice() {
        return basePrice;
    }

    @Override
    public String toString() {
        return "Shoe{" +
                "shoeId='" + shoeId + '\'' +
                ", brand='" + brand + '\'' +
                ", shoeName='" + shoeName + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", gender='" + gender + '\'' +
                ", basePrice='" + basePrice + '\'' +
                '}';
    }

    // Static Builder class that implements the Builder Design Pattern.
    public static class Builder{
        private String shoeId;
        private String brand;
        private String shoeName;
        private String category;
        private String description;
        private String gender;
        private double basePrice;

        public Builder setShoeId(String shoeId) {
            this.shoeId = shoeId;
            return this;
        }
        public Builder setBrand(String brand) {
            this.brand = brand;
            return this;
        }
        public Builder setShoeName(String shoeName) {
            this.shoeName = shoeName;
            return this;
        }
        public Builder setCategory(String category) {
            this.category = category;
            return this;
        }
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }
        public Builder setGender(String gender) {
            this.gender = gender;
            return this;
        }
        public Builder setBasePrice(double basePrice) {
            this.basePrice = basePrice;
            return this;
        }

        //Copies values from an existing Admin object
        public Builder copy(Shoe shoe){
            this.shoeId = shoe.shoeId;
            this.brand = shoe.brand;
            this.shoeName = shoe.shoeName;
            this.category = shoe.category;
            this.description = shoe.description;
            this.gender = shoe.gender;
            this.basePrice = shoe.basePrice;
            return this;
        }

        //Builds and returns a new Admin object
        public Shoe build(){
            return new Shoe(this);
        }
    }
}
