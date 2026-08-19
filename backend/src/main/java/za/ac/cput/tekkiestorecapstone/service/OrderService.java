package za.ac.cput.tekkiestorecapstone.service;

/* OrderService.java
OrderService model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.repository.OrderRepository;

import java.util.List;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository repo;

    @Autowired
    OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    @Override
    public Order create(Order order) {
        return this.repo.save(order);
    }

    @Override
    public Order read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public Order update(Order order) {
        return this.repo.save(order);
    }

    @Override
    public boolean delete(String s) {
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<Order> getAll() {
        return this.repo.findAll();
    }
}