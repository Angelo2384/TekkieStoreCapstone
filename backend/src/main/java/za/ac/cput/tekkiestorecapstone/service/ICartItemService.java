package za.ac.cput.tekkiestorecapstone.service;


import za.ac.cput.tekkiestorecapstone.domain.CartItem;

import java.util.List;

public interface ICartItemService extends IService<CartItem, String> {
    List<CartItem> getAll();
}