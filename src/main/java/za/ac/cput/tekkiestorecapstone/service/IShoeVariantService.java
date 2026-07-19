
/* IShoeVariantService.java
Interface Service Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;

import java.util.List;

public interface IShoeVariantService extends IService<ShoeVariant, String> {
    List<ShoeVariant> getAll();
}
