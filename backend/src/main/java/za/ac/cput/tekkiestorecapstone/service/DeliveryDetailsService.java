/*
DeliveryDetailsService.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Address;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;
import za.ac.cput.tekkiestorecapstone.domain.Name;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.repository.DeliveryDetailsRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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

    // Builds a full name from a Name object, skipping any null/blank parts
    private String buildFullName(Name name) {
        if (name == null) return "";
        StringBuilder sb = new StringBuilder();
        if (name.getFirstName() != null && !name.getFirstName().isBlank()) {
            sb.append(name.getFirstName().trim());
        }
        if (name.getMiddleName() != null && !name.getMiddleName().isBlank()) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(name.getMiddleName().trim());
        }
        if (name.getLastName() != null && !name.getLastName().isBlank()) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(name.getLastName().trim());
        }
        return sb.toString();
    }

    // Looks up the linked Order and derives the required customer, fullName, phone,
    // and province from it, since the frontend never sends these directly.
    private DeliveryDetails enrichFromOrder(DeliveryDetails deliveryDetails) {
        if (deliveryDetails.getOrder() == null || deliveryDetails.getOrder().getOrderId() == null) {
            return deliveryDetails;
        }

        Order persistedOrder = orderRepo.findById(deliveryDetails.getOrder().getOrderId()).orElse(null);
        if (persistedOrder == null || persistedOrder.getCustomer() == null) {
            return deliveryDetails;
        }

        Customer customer = persistedOrder.getCustomer();
        DeliveryDetails.Builder builder = new DeliveryDetails.Builder()
                .copy(deliveryDetails)
                .setOrder(persistedOrder)
                .setCustomer(customer);

        String fullName = buildFullName(customer.getName());
        if (!fullName.isBlank()) {
            builder.setFullName(fullName);
        }

        if (customer.getMobileNumber() != null && !customer.getMobileNumber().isBlank()) {
            builder.setPhone(customer.getMobileNumber());
        }

        boolean needsProvince = deliveryDetails.getAddress() != null
                && (deliveryDetails.getAddress().getProvince() == null || deliveryDetails.getAddress().getProvince().isBlank());
        if (needsProvince && customer.getAddress() != null
                && customer.getAddress().getProvince() != null
                && !customer.getAddress().getProvince().isBlank()) {
            Address enrichedAddress = new Address.Builder()
                    .copy(deliveryDetails.getAddress())
                    .setProvince(customer.getAddress().getProvince().trim())
                    .build();
            builder.setAddress(enrichedAddress);
        }

        return builder.build();
    }

    @Override
    public DeliveryDetails create(DeliveryDetails deliveryDetails) {
        if (deliveryDetails == null) {
            return null;
        }

        DeliveryDetails enriched = enrichFromOrder(deliveryDetails);
        DeliveryDetails newDelivery = new DeliveryDetails.Builder()
                .copy(enriched)
                .setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                .build();

        return this.repo.save(newDelivery);
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

        DeliveryDetails enriched = enrichFromOrder(deliveryDetails);
        DeliveryDetails finalDetails = enriched;
        if (enriched.getDeliveryId() != null) {
            DeliveryDetails existing = this.repo.findById(enriched.getDeliveryId()).orElse(null);
            if (existing != null && existing.getCreatedAt() != null) {
                finalDetails = new DeliveryDetails.Builder()
                        .copy(enriched)
                        .setCreatedAt(existing.getCreatedAt())
                        .build();
            }
        }
        return this.repo.save(finalDetails);
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
