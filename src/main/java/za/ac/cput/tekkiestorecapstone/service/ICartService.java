package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.Cart;
import java.util.List;

public interface ICartService extends IService<Cart, String> {
    List<Cart> getAll();
}