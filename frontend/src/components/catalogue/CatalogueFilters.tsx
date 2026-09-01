import React from 'react';
import { ShoeBrand, ShoeCategory } from '../../types/catalogue';
import { RotateCcw } from 'lucide-react';
import './CatalogueFilters.css';

interface CatalogueFiltersProps {
  selectedBrands: ShoeBrand[];
  onToggleBrand: (brand: ShoeBrand) => void;
  selectedCategories: ShoeCategory[];
  onToggleCategory: (category: ShoeCategory) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  minPrice: number;
  maxPrice: number;
  currentMaxPrice: number;
  onChangeMaxPrice: (price: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onCloseMobile?: () => void;
}

const AVAILABLE_BRANDS: ShoeBrand[] = [
  'Nike',
  'adidas',
  'PUMA',
  'New Balance',
  'Converse',
  'Vans',
];

const AVAILABLE_CATEGORIES: ShoeCategory[] = ['Casual', 'Sneaker', 'Trainer'];

const AVAILABLE_SIZES = [
  'UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 
  'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12', 
  'UK 13', 'UK 14'
];

export const CatalogueFilters: React.FC<CatalogueFiltersProps> = ({
  selectedBrands,
  onToggleBrand,
  selectedCategories,
  onToggleCategory,
  selectedSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  currentMaxPrice,
  onChangeMaxPrice,
  onClearFilters,
  hasActiveFilters,
  onCloseMobile,
}) => {
  return (
    <aside className="catalogue-filters" aria-label="Catalogue Filters">
      <div className="filters-header">
        <h2 className="filters-title">FILTERS</h2>
        {hasActiveFilters && (
          <button 
            className="clear-all-btn" 
            onClick={onClearFilters}
            type="button"
            title="Reset active sidebar filters"
          >
            <RotateCcw size={14} /> Clear All
          </button>
        )}
      </div>

      {/* CATEGORY FILTER */}
      <div className="filter-group">
        <h3 className="filter-group-title">CATEGORY</h3>
        <div className="filter-options">
          {AVAILABLE_CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label key={cat} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleCategory(cat)}
                  className="filter-checkbox"
                />
                <span className="checkbox-custom" />
                <span className="filter-label-text">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* BRAND FILTER */}
      <div className="filter-group">
        <h3 className="filter-group-title">BRAND</h3>
        <div className="filter-options">
          {AVAILABLE_BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label key={brand} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleBrand(brand)}
                  className="filter-checkbox"
                />
                <span className="checkbox-custom" />
                <span className="filter-label-text">{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* SIZE FILTER */}
      <div className="filter-group">
        <h3 className="filter-group-title">SIZE (UK)</h3>
        <div className="size-pill-grid">
          {AVAILABLE_SIZES.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                className={`size-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => onToggleSize(sz)}
                aria-pressed={isSelected}
              >
                {sz.replace('UK ', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE RANGE FILTER */}
      <div className="filter-group">
        <div className="price-header-row">
          <h3 className="filter-group-title">MAX PRICE</h3>
          <span className="price-value-display">R{currentMaxPrice.toLocaleString()}</span>
        </div>
        <div className="price-slider-wrapper">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50}
            value={currentMaxPrice}
            onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
            className="price-range-slider"
            aria-label="Filter by maximum price"
          />
          <div className="price-range-labels">
            <span>R{minPrice.toLocaleString()}</span>
            <span>R{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* MOBILE ACTION BUTTON */}
      {onCloseMobile && (
        <div className="mobile-filters-apply">
          <button 
            type="button" 
            className="btn-apply-mobile" 
            onClick={onCloseMobile}
          >
            Apply Filters
          </button>
        </div>
      )}
    </aside>
  );
};
