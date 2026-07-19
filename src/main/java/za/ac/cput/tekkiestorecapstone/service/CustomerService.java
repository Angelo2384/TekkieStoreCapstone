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
    public boolean delete(String s) {return this.repo.existsById(s);}

    @Override
    public List<Customer> getAll() {return this.repo.findAll();}
}