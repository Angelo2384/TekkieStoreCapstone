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
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.util.List;

@Service
public class DeliveryDetailsService implements IDeliveryDetailsService {
    private final DeliveryDetailsRepository repo;
    private final OrderRepository orderRepo;

    @Autowired
    public DeliveryDetailsService(DeliveryDetailsRepository repo, OrderRepository orderRepo) {
        this.repo = repo;
        this.orderRepo = orderRepo;
    }

    @Override
    public DeliveryDetails create(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }

        if (deliveryDetails.getOrder() != null && deliveryDetails.getOrder().getOrderId() != null && this.orderRepo != null) {
            Order order = this.orderRepo.findById(deliveryDetails.getOrder().getOrderId()).orElse(null);
            if (order != null) {
                deliveryDetails.setOrder(order);
            }
        }

        return this.repo.save(deliveryDetails);
    }

    @Override
    public DeliveryDetails read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public DeliveryDetails update(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }

        if (deliveryDetails.getOrder() != null && deliveryDetails.getOrder().getOrderId() != null && this.orderRepo != null) {
            Order order = this.orderRepo.findById(deliveryDetails.getOrder().getOrderId()).orElse(null);
            if (order != null) {
                deliveryDetails.setOrder(order);
            }
        }

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

    @Override
    public DeliveryDetails getByOrderId(String orderId) {
        if (orderId == null) {
            return null;
        }
        return repo.findByOrder_OrderId(orderId).orElse(null);
    }
}

