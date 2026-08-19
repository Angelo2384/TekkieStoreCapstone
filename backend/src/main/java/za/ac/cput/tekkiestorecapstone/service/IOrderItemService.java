package za.ac.cput.tekkiestorecapstone.service;

/* IOrderItemService.java
OrderItem service interface
Author: Qaasim Isaacs(222544422)
Date: 19 july 2026
*/

import za.ac.cput.tekkiestorecapstone.domain.OrderItem;

import java.util.List;

public interface IOrderItemService extends IService<OrderItem, String> {

    List<OrderItem> getAll();

}
