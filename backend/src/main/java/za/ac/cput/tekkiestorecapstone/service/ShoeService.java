/* ShoeService.java
ShoeService model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;

import java.util.List;

@Service
public class ShoeService implements IShoeService {
    private final ShoeRepository repo;

    @Autowired ShoeService(ShoeRepository repo) {
        this.repo = repo;
    }

    @Override
    public Shoe create(Shoe shoe) {
        return this.repo.save(shoe);
    }

    @Override
    public Shoe read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    @Override
    public Shoe update(Shoe shoe) {
        return this.repo.save(shoe);
    }

    @Override
    public boolean delete(String s) {
        this.repo.deleteById(s);
        return true;
    }

    @Override
    public List<Shoe> getAll() {
        return this.repo.findAll();
    }
}
