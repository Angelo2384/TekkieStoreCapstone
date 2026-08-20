/*
 * CustomerService.java
 * Customer Service Implementation
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import java.util.List;

@Service
public class CustomerService implements ICustomerService {
    private final CustomerRepository repo;

    @Autowired
    CustomerService(CustomerRepository repo) {this.repo = repo;}

    @Override
    public Customer create(Customer customer) {return this.repo.save(customer);}

    @Override
    public Customer read(String s) {return this.repo.findById(s).orElse(null);}

    @Override
    public Customer update(Customer customer) {return this.repo.save(customer);}

    @Override
    public boolean delete(String s) {
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<Customer> getAll() {return this.repo.findAll();}
}