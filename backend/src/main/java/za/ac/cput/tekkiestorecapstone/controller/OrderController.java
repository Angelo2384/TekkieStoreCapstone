package za.ac.cput.tekkiestorecapstone.controller;

/* OrderController.java
OrderController model class
Author: Qaasim Isaacs(222544422)
Date: 19 July 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.Order;
import za.ac.cput.tekkiestorecapstone.domain.OrderStatus;
import za.ac.cput.tekkiestorecapstone.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService service;

    @Autowired
    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Order create(@RequestBody Order order) {
        return service.create(order);
    }

    @GetMapping("/read/{id}")
    public Order read(@PathVariable String id) {
        return service.read(id);
    }

    @PutMapping("/update")
    public Order update(@RequestBody Order order) {
        return service.update(order);
    }

    // Changes only the status, e.g. {"status": "SHIPPED"}. Admin only (SecurityConfig).
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable String orderId, @RequestBody Map<String, OrderStatus> body) {
        OrderStatus status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().build();
        }
        Order updated = service.updateStatus(orderId, status);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Order> getAll() {
        return service.getAll();
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomerId(@PathVariable String customerId) {
        return service.getOrdersByCustomerId(customerId);
    }
}