package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.List;

@Service
public class ShoeVariantService implements IShoeVariantService {

    private final ShoeVariantRepository repo;

    @Autowired
    ShoeVariantService(ShoeVariantRepository repo) {
        this.repo = repo;
    }

    @Override
    public ShoeVariant create(ShoeVariant shoeVariant) {
        return this.repo.save(shoeVariant);
    }

    @Override
    public ShoeVariant read(String variantId) {
        return this.repo.findById(variantId).orElse(null);
    }

    @Override
    public ShoeVariant update(ShoeVariant shoeVariant) {
        return this.repo.save(shoeVariant);
    }

    @Override
    public boolean delete(String variantId) {
        this.repo.deleteById(variantId);
        return true;
    }

    @Override
    public List<ShoeVariant> getAll() {
        return this.repo.findAll();
    }
}
