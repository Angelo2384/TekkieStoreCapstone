package za.ac.cput.tekkiestorecapstone.domain;

public class Address {
    private String streetNumber;
    private String streetName;
    private String suburb;
    private String city;
    private String postalCode;

    public Address(){}

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

}
