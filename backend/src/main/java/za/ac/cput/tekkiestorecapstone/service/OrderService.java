package za.ac.cput.tekkiestorecapstone.service;

/* OrderService.java
OrderService model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Customer;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.CustomerRepository;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repo;
    private final CustomerRepository customerRepo;
    private final ShoeVariantRepository shoeVariantRepo;

    @Autowired
    public OrderService(OrderRepository repo, CustomerRepository customerRepo, ShoeVariantRepository shoeVariantRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
        this.shoeVariantRepo = shoeVariantRepo;
    }

    // Finds the ShoeVariant matching an order item's shoeId + size (e.g. "UK 10")
    // and reduces its stock by the ordered quantity, never going below 0.
    private void decreaseVariantStock(OrderItem item) {
        String[] parts = item.getSize() != null ? item.getSize().trim().split("\\s+") : new String[0];
        if (parts.length < 2) return;

        String region = parts[0];
        double value;
        try {
            value = Double.parseDouble(parts[1]);
        } catch (NumberFormatException e) {
            return;
        }

        ShoeVariant match = shoeVariantRepo.findByShoe_ShoeId(item.getShoeId()).stream()
                .filter(v -> v.getSize() != null
                        && v.getSize().getSizeValue() == value
                        && region.equalsIgnoreCase(v.getSize().getSizeRegion()))
                .findFirst()
                .orElse(null);
        if (match == null) return;

        int newStock = Math.max(0, match.getStockQuantity() - item.getQuantity());
        ShoeVariant updated = new ShoeVariant.Builder()
                .copy(match)
                .setStockQuantity(newStock)
                .build();
        shoeVariantRepo.save(updated);
    }

    @Override
    public Order create(Order order) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getCustomerId() == null) {
            return null;
        }

        // Re-submitting the same order (e.g. a retried request) must not decrease stock twice
        if (order.getOrderId() != null && this.repo.existsById(order.getOrderId())) {
            return this.repo.findById(order.getOrderId()).orElse(null);
        }

        Customer customer = this.customerRepo.findById(order.getCustomer().getCustomerId()).orElse(null);
        if (customer == null) {
            return null;
        }

        Order.Builder orderBuilder = new Order.Builder()
                .copy(order)
                .setCustomer(customer)
                .setStatus(OrderStatus.PENDING);

        if (order.getOrderDate() == null) {
            orderBuilder.setOrderDate(new Date());
        }

        Order builtOrder = orderBuilder.build();

        if (builtOrder.getOrderItems() != null) {
            java.util.List<OrderItem> updatedItems = new java.util.ArrayList<>();
            for (OrderItem item : builtOrder.getOrderItems()) {
                OrderItem updatedItem = new OrderItem.Builder()
                        .copy(item)
                        .setOrder(builtOrder)
                        .setSubTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build();
                updatedItems.add(updatedItem);
            }
            builtOrder = new Order.Builder()
                    .copy(builtOrder)
                    .setOrderItems(updatedItems)
                    .build();
        }

        Order savedOrder = this.repo.save(builtOrder);

        if (savedOrder.getOrderItems() != null) {
            for (OrderItem item : savedOrder.getOrderItems()) {
                decreaseVariantStock(item);
            }
        }

        return savedOrder;
    }

    @Override
    public Order read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public Order update(Order order) {
        if (order == null || order.getOrderId() == null || !this.repo.existsById(order.getOrderId())) {
            return null;
        }
        return this.repo.save(order);
    }

    @Override
    public boolean delete(String s) {
        if (s == null || !this.repo.existsById(s)) {
            return false;
        }
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<Order> getAll() {
        return this.repo.findAll();
    }

    @Override
    public List<Order> getOrdersByCustomerId(String customerId) {
        if (customerId == null) {
            return List.of();
        }
        return this.repo.findByCustomer_CustomerId(customerId);
    }
}