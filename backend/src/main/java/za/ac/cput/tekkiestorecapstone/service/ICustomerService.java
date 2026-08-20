/*
 * ICustomerService.java
 * Customer Service Interface
 * Author: Ethan Williams (221454780)
 * Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.Customer;
import java.util.List;

public interface ICustomerService extends IService<Customer, String> {
    List<Customer> getAll();
}