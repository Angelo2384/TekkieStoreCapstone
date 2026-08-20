/*
 * CustomerFactoryTest.java
 * Test class for CustomerFactory
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.Order;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.domain.Address;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CustomerFactoryTest {

    // ===== NAME FACTORY TESTS =====
    @Test
    @Order(1)
    public void testNameFactory_Success() {
        Name name = NameFactory.createName("John", "Michael", "Smith");

        assertNotNull(name);
        assertEquals("John", name.getFirstName());
        assertEquals("Michael", name.getMiddleName());
        assertEquals("Smith", name.getLastName());
        System.out.println("Name: " + name);
    }

    @Test
    @Order(2)
    public void testNameFactory_Invalid_ReturnsNull() {
        Name name = NameFactory.createName("", "Michael", "Smith");
        assertNull(name);
    }

    // ===== ADDRESS FACTORY TESTS =====
    @Test
    @Order(3)
    public void testAddressFactory_Success() {
        Address address = AddressFactory.createAddress(
                "12", "Main Road", "Claremont", "Cape Town", "7708"
        );

        assertNotNull(address);
        assertEquals("12", address.getStreetNumber());
        assertEquals("Main Road", address.getStreetName());
        System.out.println("Address: " + address);
    }

    @Test
    @Order(4)
    public void testAddressFactory_Invalid_ReturnsNull() {
        Address address = AddressFactory.createAddress(
                "", "Main Road", "Claremont", "Cape Town", "7708"
        );
        assertNull(address);
    }

    // ===== CUSTOMER FACTORY TESTS =====
    @Test
    @Order(5)
    public void createCustomer_Success() {
        Customer customer = CustomerFactory.createCustomer(
                "C001",
                "John",
                "Michael",
                "Smith",
                "johnsmith@gmail.com",
                "0821234567",
                "12",
                "Main Road",
                "Claremont",
                "Cape Town",
                "7708"
        );

        assertNotNull(customer);
        System.out.println("Customer: " + customer);
    }

    @Test
    @Order(6)
    public void createCustomer_InvalidEmail_ReturnsNull() {
        Customer customer = CustomerFactory.createCustomer(
                "C003",
                "John",
                "Michael",
                "Smith",
                "invalid-email",
                "0821234567",
                "12",
                "Main Road",
                "Claremont",
                "Cape Town",
                "7708"
        );

        assertNull(customer);
    }
}