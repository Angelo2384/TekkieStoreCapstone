package za.ac.cput.tekkiestorecapstone.service;

/* IOrderService.java
IOrderService model class
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.Order;
import java.util.List;

public interface IOrderService extends IService<Order, String> {
    List<Order> getAll();
}
