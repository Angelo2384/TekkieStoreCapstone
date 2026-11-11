/* ShoeService.java
ShoeService model class
Author: Lyle Solomons (230123872)
Date: 19 July 2026
*/

package za.ac.cput.tekkiestorecapstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.tekkiestorecapstone.domain.Shoe;
import za.ac.cput.tekkiestorecapstone.domain.ShoeVariant;
import za.ac.cput.tekkiestorecapstone.repository.CartItemRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeRepository;
import za.ac.cput.tekkiestorecapstone.repository.ShoeVariantRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShoeService implements IShoeService {
    private final ShoeRepository repo;
    private final ShoeVariantRepository variantRepo;
    private final CartItemRepository cartItemRepo;
    private final ActivityLogService activityLog;

    // Injects the Spring Data JPA repositories
    @Autowired ShoeService(ShoeRepository repo, ShoeVariantRepository variantRepo, CartItemRepository cartItemRepo,
                           ActivityLogService activityLog) {
        this.repo = repo;
        this.variantRepo = variantRepo;
        this.cartItemRepo = cartItemRepo;
        this.activityLog = activityLog;
    }

    // Saves a new shoe record
    @Override
    public Shoe create(Shoe shoe) {
        Shoe saved = this.repo.save(shoe);
        this.activityLog.record("Added shoe " + label(saved) + " at " + rands(saved.getBasePrice()));
        return saved;
    }

    // Looks up a shoe by ID, returns null if not found
    @Override
    public Shoe read(String s) {
        return this.repo.findById(s).orElse(null);
    }

    // Saves changes to an existing shoe and gives all its sizes the shoe's colour
    @Override
    @Transactional
    public Shoe update(Shoe shoe) {
        // Read before saving, so the log can show what the price and sale were changed from
        Shoe before = shoe.getShoeId() == null ? null : this.repo.findById(shoe.getShoeId()).orElse(null);
        String oldPrice = before == null ? null : rands(before.getBasePrice());
        String oldSale = before == null ? null : percent(before.getSalePercentage());
        Shoe saved = this.repo.save(shoe);
        String colour = saved.getColour();
        if (colour != null && !colour.isBlank()) {
            for (ShoeVariant variant : this.variantRepo.findByShoe_ShoeId(saved.getShoeId())) {
                if (!colour.equals(variant.getColour())) {
                    this.variantRepo.save(new ShoeVariant.Builder().copy(variant).setColour(colour).build());
                }
            }
        }

        List<String> changes = new ArrayList<>();
        if (oldPrice != null && !oldPrice.equals(rands(saved.getBasePrice()))) {
            changes.add("price " + oldPrice + " to " + rands(saved.getBasePrice()));
        }
        if (oldSale != null && !oldSale.equals(percent(saved.getSalePercentage()))) {
            changes.add("sale " + oldSale + " to " + percent(saved.getSalePercentage()));
        }
        this.activityLog.record("Edited shoe " + label(saved) + (changes.isEmpty() ? "" : ": " + String.join(", ", changes)));
        return saved;
    }

    // Deletes a shoe with its sizes and cart lines, only once all its stock is 0; past orders keep their own copy of the shoe's details
    @Override
    @Transactional
    public boolean delete(String s) {
        String name = this.repo.findById(s).map(this::label).orElse(s);
        List<ShoeVariant> sizes = this.variantRepo.findByShoe_ShoeId(s);
        int stock = 0;
        for (ShoeVariant size : sizes) {
            stock += size.getStockQuantity();
        }
        if (stock > 0) {
            throw new IllegalStateException("This shoe still has " + stock + (stock == 1 ? " pair" : " pairs")
                    + " in stock. Set its stock to 0 on the Inventory page before deleting it.");
        }
        this.cartItemRepo.deleteAll(this.cartItemRepo.findByShoe_ShoeId(s));
        this.variantRepo.deleteAll(sizes);
        this.repo.deleteById(s);
        this.activityLog.record("Deleted shoe " + name);
        return true;
    }

    // Returns all shoes from the database
    @Override
    public List<Shoe> getAll() {
        return this.repo.findAll();
    }

    // How a shoe, a price and a sale percentage are written in the activity log
    private String label(Shoe shoe) {
        return shoe.getShoeName() + " (" + shoe.getShoeId() + ")";
    }

    private String rands(BigDecimal price) {
        return "R" + (price == null ? "0" : price.setScale(0, RoundingMode.HALF_UP).toPlainString());
    }

    private String percent(BigDecimal percentage) {
        return (percentage == null ? "0" : percentage.setScale(0, RoundingMode.HALF_UP).toPlainString()) + "%";
    }
}
