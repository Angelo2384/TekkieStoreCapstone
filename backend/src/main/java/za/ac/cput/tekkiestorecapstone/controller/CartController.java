/*
 * CartController.java
 * CartController model class
 * Author: Ethan Williams 221454780
 * Date: 19 July 2026
 */

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.service.CartService;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService service;

    @Autowired
    CartController(CartService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Cart create(@RequestBody Cart cart) {
        return service.create(cart);
    }

    @GetMapping("/read/{id}")
    public Cart read(@PathVariable String id) {
        return service.read(id);
    }

    @PostMapping("/update")
    public Cart update(@RequestBody Cart cart) {
        return service.update(cart);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {
        return service.delete(id);
    }

    @GetMapping("/getAll")
    public List<Cart> getAll() {
        return service.getAll();
    }
}