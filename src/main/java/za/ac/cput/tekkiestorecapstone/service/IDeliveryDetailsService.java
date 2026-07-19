/*
IDeliveryDetailsService.java
Author: Rameez Karriem
Student Number: 222357320
Date: 19 July 2026
 */
package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.DeliveryDetails;

import java.util.List;

public interface IDeliveryDetailsService extends IService<DeliveryDetails, String> {
    List<DeliveryDetails> getAll();
}
