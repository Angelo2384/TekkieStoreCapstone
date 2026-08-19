/*
 * CustomerFactory.java
 * Factory for Customer Domain Entity
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.util.Helper;

public class CustomerFactory {

    public static Customer createCustomer(
            String customerId,
            String firstName,
            String middleName,
            String lastName,
            String email,
            String mobileNumber,
            String streetNumber,
            String streetName,
            String suburb,
            String city,
            String postalCode) {

        // Validate Customer fields
        if (Helper.isNullOrEmpty(customerId)
                || Helper.isNullOrEmpty(email)
                || Helper.isNullOrEmpty(mobileNumber)) {
            return null;
        }

        // Validate email format
        if (!Helper.isValidEmail(email)) {
            return null;
        }

        // Create Name value object
        Name name = NameFactory.createName(firstName, middleName, lastName);
        if (name == null) {
            return null;
        }

        // Create Address value object
        Address address = AddressFactory.createAddress(
                streetNumber,
                streetName,
                suburb,
                city,
                postalCode
        );
        if (address == null) {
            return null;
        }

        // Create Customer entity
        return new Customer.Builder()
                .setCustomerId(customerId)
                .setName(name)
                .setEmail(email)
                .setMobileNumber(mobileNumber)
                .setAddress(address)
                .build();
    }
}