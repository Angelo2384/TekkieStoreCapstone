/*
DeliveryDetailsController.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.service.DeliveryDetailsService;

import java.util.List;

@RestController
@RequestMapping("/deliverydetails")
public class DeliveryDetailsController {
    private final DeliveryDetailsService service;

    @Autowired DeliveryDetailsController(DeliveryDetailsService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public DeliveryDetails create(@RequestBody DeliveryDetails deliveryDetails) {
        return service.create(deliveryDetails);
    }

    @GetMapping("/read/{id}")
    public DeliveryDetails read(@PathVariable String id) {
        return service.read(id);
    }

    @PostMapping("/update")
    public DeliveryDetails update(@RequestBody DeliveryDetails deliveryDetails) {
        return service.update(deliveryDetails);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<DeliveryDetails> getAll() {
        return service.getAll();
    }
}