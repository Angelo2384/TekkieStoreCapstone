/*
 * ICartService.java
 * Cart Service Interface
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.Cart;
import java.util.List;

public interface ICartService extends IService<Cart, String> {
    List<Cart> getAll();
}