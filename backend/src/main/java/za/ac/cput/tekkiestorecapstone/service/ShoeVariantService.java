
/* ShoeVariantService.java
Service Layer of the ShoeVariant Entity
Author: Redah Gamieldien(222641681)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeSize;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.util.List;

@Service
public class ShoeVariantService implements IShoeVariantService {

    private final ShoeVariantRepository repo;
    private final ActivityLogService activityLog;

    @Autowired
    ShoeVariantService(ShoeVariantRepository repo, ActivityLogService activityLog) {
        this.repo = repo;
        this.activityLog = activityLog;
    }

    @Override
    public ShoeVariant create(ShoeVariant shoeVariant) {
        ShoeVariant saved = this.repo.save(shoeVariant);
        this.activityLog.record("Added " + label(saved) + " with " + saved.getStockQuantity() + " in stock");
        return saved;
    }

    @Override
    public ShoeVariant read(String variantId) {
        return this.repo.findById(variantId).orElse(null);
    }

    @Override
    @Transactional
    public ShoeVariant update(ShoeVariant shoeVariant) {
        // Read before saving, so the log can show what the stock was changed from
        ShoeVariant before = shoeVariant.getVariantId() == null ? null : this.repo.findById(shoeVariant.getVariantId()).orElse(null);
        Integer oldStock = before == null ? null : before.getStockQuantity();
        String name = before == null ? null : label(before);
        ShoeVariant saved = this.repo.save(shoeVariant);
        if (oldStock != null && oldStock != saved.getStockQuantity()) {
            this.activityLog.record("Stock for " + name + " changed from " + oldStock + " to " + saved.getStockQuantity());
        }
        return saved;
    }

    @Override
    @Transactional
    public boolean delete(String variantId) {
        ShoeVariant before = this.repo.findById(variantId).orElse(null);
        String entry = before == null ? null : "Removed " + label(before) + " (" + before.getStockQuantity() + " in stock)";
        this.repo.deleteById(variantId);
        if (entry != null) {
            this.activityLog.record(entry);
        }
        return true;
    }

    @Override
    public List<ShoeVariant> getAll() {
        return this.repo.findAll();
    }

    @Override
    public List<ShoeVariant> getVariantsByShoeId(String shoeId) {
        return this.repo.findByShoe_ShoeId(shoeId);
    }

    // How a size is written in the activity log, e.g. "Nike Air Max 90, UK 8"
    private String label(ShoeVariant variant) {
        Shoe shoe = variant.getShoe();
        String name = shoe == null ? variant.getVariantId()
                : shoe.getShoeName() != null ? shoe.getShoeName() : shoe.getShoeId();
        ShoeSize size = variant.getSize();
        if (size == null) {
            return name;
        }
        double value = size.getSizeValue();
        String number = value == Math.floor(value) ? String.valueOf((int) value) : String.valueOf(value);
        return name + ", " + size.getSizeRegion() + " " + number;
    }
}
