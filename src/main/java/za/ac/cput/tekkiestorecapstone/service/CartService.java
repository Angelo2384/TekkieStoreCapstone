package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Cart;
import za.ac.cput.tekkiestorecapstone.repository.CartRepository;
import java.util.List;

@Service
public class CartService implements ICartService {
    private final CartRepository repo;

    @Autowired
    CartService(CartRepository repo) {this.repo = repo;}

    @Override
    public Cart create(Cart cart) {return this.repo.save(cart);}

    @Override
    public Cart read(String s) {return this.repo.findById(s).orElse(null);}

    @Override
    public Cart update(Cart cart) {return this.repo.save(cart);}

    @Override
    public boolean delete(String s) {return this.repo.existsById(s);}

    @Override
    public List<Cart> getAll() {return this.repo.findAll();}
}