/* ShoeVariantController.java
ShoeVariantController model class
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.service.ShoeVariantService;

import java.util.List;

@RestController
@RequestMapping("/shoeVariant")
public class ShoeVariantController {

    private final ShoeVariantService service;

    @Autowired
    ShoeVariantController(ShoeVariantService service) {this.service = service;}

    @PostMapping("/create")
    public ShoeVariant create(@RequestBody ShoeVariant shoeVariant) {return service.create(shoeVariant);}

    @GetMapping("/read/{id}")
    public ShoeVariant read(@PathVariable String id) {return service.read(id);}

    @PostMapping("/update")
    public ShoeVariant update(@RequestBody ShoeVariant shoeVariant) {return service.update(shoeVariant);}

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable String id) {return service.delete(id);}

    @GetMapping("/getAll")
    public List<ShoeVariant> getAll() {return service.getAll();}
}
