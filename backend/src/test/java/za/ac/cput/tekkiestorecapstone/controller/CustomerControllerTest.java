/*
 * CustomerControllerTest.java
 * CustomerControllerTest model class
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.factory.CustomerFactory;
import za.ac.cput.tekkiestorecapstone.service.CustomerService;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CustomerControllerTest {

    @Mock
    private CustomerService service;

    @InjectMocks
    private CustomerController controller;

    private static Customer customer;

    @BeforeEach
    void setUp() {
        customer = CustomerFactory.createCustomer(
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
    }

    @Test
    void a_create() {
        when(service.create(any(Customer.class))).thenReturn(customer);

        Customer created = controller.create(customer);

        assertNotNull(created);
        assertEquals(customer.getCustomerId(), created.getCustomerId());
        assertEquals(customer.getEmail(), created.getEmail());
        assertEquals(customer.getName().getFirstName(), created.getName().getFirstName());

        System.out.println("Customer created: " + created);
    }

    @Test
    void b_read() {
        when(service.read("C001")).thenReturn(customer);

        Customer found = controller.read("C001");

        assertNotNull(found);
        assertEquals("C001", found.getCustomerId());
        assertEquals("johnsmith@gmail.com", found.getEmail());

        System.out.println("Customer found: " + found);
    }

    @Test
    void c_update() {
        Customer updated = new Customer.Builder()
                .copy(customer)
                .setEmail("john.updated@gmail.com")
                .setMobileNumber("0837654321")
                .build();

        when(service.update(any(Customer.class))).thenReturn(updated);

        Customer updatedCustomer = controller.update(updated);

        assertNotNull(updatedCustomer);
        assertEquals("john.updated@gmail.com", updatedCustomer.getEmail());
        assertEquals("0837654321", updatedCustomer.getMobileNumber());

        System.out.println("Customer updated: " + updatedCustomer);
    }

    @Test
    void d_delete() {
        when(service.delete("C001")).thenReturn(true);

        boolean deleted = controller.delete("C001");

        assertTrue(deleted);

        System.out.println("Customer deleted: " + deleted);
    }

    @Test
    void e_getAll() {
        when(service.getAll()).thenReturn(List.of(customer));

        List<Customer> customers = controller.getAll();

        assertNotNull(customers);
        assertEquals(1, customers.size());
        assertEquals("C001", customers.get(0).getCustomerId());

        System.out.println("All customers: " + customers);
    }
}