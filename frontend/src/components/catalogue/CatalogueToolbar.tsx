import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ShoeBrand, ShoeCategory } from '../../types/catalogue';
import './CatalogueToolbar.css';

interface CatalogueToolbarProps {
  displayedCount: number;
  filteredCount: number;
  currentPage: number;
  totalPages: number;
  sortBy: 'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  onChangeSort: (sort: 'latest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') => void;
  selectedBrands: ShoeBrand[];
  onRemoveBrand: (brand: ShoeBrand) => void;
  selectedCategories: ShoeCategory[];
  onRemoveCategory: (category: ShoeCategory) => void;
  selectedSizes: string[];
  onRemoveSize: (size: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export const CatalogueToolbar: React.FC<CatalogueToolbarProps> = ({
  displayedCount,
  filteredCount,
  currentPage,
  totalPages,
  sortBy,
  onChangeSort,
  selectedBrands,
  onRemoveBrand,
  selectedCategories,
  onRemoveCategory,
  selectedSizes,
  onRemoveSize,
  searchQuery,
  onClearSearch,
  onOpenMobileFilters,
  activeFilterCount,
}) => {
  const hasChips =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    Boolean(searchQuery);

  return (
    <div className="catalogue-toolbar-container">
      <div className="catalogue-toolbar">
        {/* LEFT: Product Counter */}
        <div className="toolbar-left">
          <span className="product-count-text">
            Showing <strong className="count-highlight">{displayedCount}</strong> of{' '}
            <strong className="count-highlight">{filteredCount}</strong> products
            {totalPages > 1 && (
              <span className="page-indicator-text"> (Page {currentPage} of {totalPages})</span>
            )}
          </span>
        </div>

        {/* RIGHT: Mobile Filter Button + Sorting Dropdown */}
        <div className="toolbar-right">
          <button
            type="button"
            className="mobile-filter-trigger"
            onClick={onOpenMobileFilters}
            aria-label="Open filter sidebar"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {activeFilterCount > 0 && <span className="filter-badge-pill">{activeFilterCount}</span>}
          </button>

          <div className="sort-wrapper">
            <label htmlFor="catalogue-sort" className="sort-label">
              Sort by:
            </label>
            <select
              id="catalogue-sort"
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as any)}
              className="sort-select"
              aria-label="Sort catalogue products"
            >
              <option value="latest">Latest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS ROW */}
      {hasChips && (
        <div className="active-filter-chips">
          {searchQuery && (
            <button
              type="button"
              className="filter-chip search-chip"
              onClick={onClearSearch}
              title="Clear search keyword"
            >
              Search: "{searchQuery}" <X size={13} />
            </button>
          )}

          {selectedBrands.map((brand) => (
            <button
              key={brand}
              type="button"
              className="filter-chip"
              onClick={() => onRemoveBrand(brand)}
              title={`Remove ${brand} filter`}
            >
              {brand} <X size={13} />
            </button>
          ))}

          {selectedCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="filter-chip"
              onClick={() => onRemoveCategory(cat)}
              title={`Remove ${cat} filter`}
            >
              {cat} <X size={13} />
            </button>
          ))}

          {selectedSizes.map((sz) => (
            <button
              key={sz}
              type="button"
              className="filter-chip"
              onClick={() => onRemoveSize(sz)}
              title={`Remove size ${sz} filter`}
            >
              {sz} <X size={13} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
