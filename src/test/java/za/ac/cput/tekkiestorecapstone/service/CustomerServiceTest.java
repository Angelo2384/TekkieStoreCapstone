package za.ac.cput.tekkiestorecapstone.service;

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
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
class CustomerServiceTest {

    @Mock
    CustomerRepository repo;

    @InjectMocks
    CustomerService service;

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
        when(repo.save(any(Customer.class))).thenReturn(customer);

        Customer created = service.create(customer);

        assertNotNull(created);
        assertEquals(created.getCustomerId(), customer.getCustomerId());
        assertEquals(created.getEmail(), customer.getEmail());
        assertEquals(created.getName().getFirstName(), customer.getName().getFirstName());

        System.out.println("Success: " + created);
    }

    @Test
    void b_read() {
        when(repo.findById(customer.getCustomerId())).thenReturn(Optional.of(customer));

        Customer read = service.read(customer.getCustomerId());
        assertNotNull(read);
        assertEquals(customer.getCustomerId(), read.getCustomerId());

        System.out.println("Success: " + read);
    }

    @Test
    void c_update() {
        Customer updated = new Customer.Builder()
                .copy(customer)
                .setEmail("john.updated@gmail.com")
                .setMobileNumber("0837654321")
                .build();

        when(repo.save(any(Customer.class))).thenReturn(updated);

        Customer updatedCustomer = service.update(updated);
        assertNotNull(updatedCustomer);
        assertEquals("john.updated@gmail.com", updatedCustomer.getEmail());
        assertEquals("0837654321", updatedCustomer.getMobileNumber());

        System.out.println("Success: " + updatedCustomer);
    }

    @Test
    void d_delete() {
        boolean success = service.delete(customer.getCustomerId());
        verify(repo).deleteById(customer.getCustomerId());
        assertTrue(success);

        System.out.println("Success: " + success);
    }

    @Test
    void e_getAll() {
        when(repo.findAll()).thenReturn(List.of(customer));
        List<Customer> all = service.getAll();

        assertNotNull(all);
        assertEquals(1, all.size());
        System.out.println("Success: " + all);
    }
}