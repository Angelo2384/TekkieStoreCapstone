/*
DeliveryDetailsService.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;

import java.util.List;

@Service
public class DeliveryDetailsService implements IDeliveryDetailsService {
    private final DeliveryDetailsRepository repo;

    @Autowired DeliveryDetailsService(DeliveryDetailsRepository repo) {
        this.repo = repo;
    }

    @Override
    public DeliveryDetails create(DeliveryDetails deliveryDetails) {
        return this.repo.save(deliveryDetails);
    }

    @Override
    public DeliveryDetails read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public DeliveryDetails update(DeliveryDetails deliveryDetails) {
        return this.repo.save(deliveryDetails);
    }

    @Override
    public boolean delete(String variantId) {
        this.repo.deleteById(variantId);
        return true;
    }

    @Override
    public List<DeliveryDetails> getAll() {
        return this.repo.findAll();
    }
}
