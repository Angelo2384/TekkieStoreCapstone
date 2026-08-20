package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.CartItem;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;

import java.util.List;

@Service
public class CartItemService implements ICartItemService {

    private final CartItemRepository repo;

    @Autowired
    CartItemService(CartItemRepository repo) {
        this.repo = repo;
    }

    @Override
    public CartItem create(CartItem cartItem) {
        return this.repo.save(cartItem);
    }

    @Override
    public CartItem read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public CartItem update(CartItem cartItem) {
        return this.repo.save(cartItem);
    }

    @Override
    public boolean delete(String s) {
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<CartItem> getAll() {
        return this.repo.findAll();
    }
}
