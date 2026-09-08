package za.ac.cput.tekkiestorecapstone.service;

/* OrderItemService.java
OrderItem service implementation
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.OrderItem;
import za.ac.cput.tekkiestorecapstone.repository.OrderItemRepository;

import java.util.List;

@Service
public class OrderItemService implements IOrderItemService {

    private final OrderItemRepository repo;

    @Autowired
    public OrderItemService(OrderItemRepository repo) {
        this.repo = repo;
    }

    @Override
    public OrderItem create(OrderItem orderItem) {
        return this.repo.save(orderItem);
    }

    @Override
    public OrderItem read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public OrderItem update(OrderItem orderItem) {
        if (orderItem == null || orderItem.getOrderItemId() == null || !this.repo.existsById(orderItem.getOrderItemId())) {
            return null;
        }
        return this.repo.save(orderItem);
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
    public List<OrderItem> getAll() {
        return this.repo.findAll();
    }
}