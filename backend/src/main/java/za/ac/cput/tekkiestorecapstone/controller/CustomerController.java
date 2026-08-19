/*
 * CustomerController.java
 * CustomerController model class
 * Author: Ethan Williams 221454780
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.service.CustomerService;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    private final CustomerService service;

    @Autowired
    CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }

    @GetMapping("/read/{id}")
    public Customer read(@PathVariable String id) {
        return service.read(id);
    }

    @PostMapping("/update")
    public Customer update(@RequestBody Customer customer) {
        return service.update(customer);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Customer> getAll() {
        return service.getAll();
    }
}