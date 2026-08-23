import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTS, type Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import './CataloguePage.css';

const AVAILABLE_SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5];

const BRAND_COUNTS: { name: string; count: number }[] = [
  { name: 'Nike', count: 42 },
  { name: 'Adidas', count: 28 },
  { name: 'New Balance', count: 15 }
];

const CataloguePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  // Shop context for cart and wishlist
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Unisex']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([8]);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Local notification feedback
  const [addedAnimationId, setAddedAnimationId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle Category
  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  // Toggle Brand
  const handleToggleBrand = (brandName: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  // Toggle Size
  const handleToggleSize = (size: number) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Clear All Filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
  };

  // Wishlist toggle
  const handleToggleWishlistClick = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  // Add to cart handler
  const handleAddToCartClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedAnimationId(product.id);
    setToastMessage(`Added ${product.name} to cart`);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 900);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // URL search query filter if present
      if (searchParamQuery.trim()) {
        const query = searchParamQuery.trim().toLowerCase();
        const matchesQuery = 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category)) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const matchesBrand = selectedBrands.some(
          b => b.toLowerCase() === product.brand.toLowerCase()
        );
        if (!matchesBrand) {
          return false;
        }
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const matchesSize = selectedSizes.some(s => product.sizes.includes(s));
        if (!matchesSize) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'name-az') {
        return a.name.localeCompare(b.name);
      }
      // default: latest
      return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
    });
  }, [selectedCategories, selectedBrands, selectedSizes, sortBy, searchParamQuery]);

  // Format ZAR currency
  const formatPrice = (price: number) => {
    return `R${price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="catalogue-page">
      <div className="catalogue-container">
        
        {/* Top Catalogue Toolbar */}
        <div className="catalogue-toolbar">
          <div className="toolbar-left">
            <button 
              className="filters-toggle-btn"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              aria-label="Toggle Filters"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <span>FILTERS</span>
            </button>
            <span className="products-count-text">
              {searchParamQuery ? (
                <>Results for <strong>"{searchParamQuery}"</strong> ({filteredProducts.length} items)</>
              ) : (
                <>Showing <strong>{Math.min(filteredProducts.length, 12)}</strong> of {PRODUCTS.length} products</>
              )}
            </span>
          </div>

          <div className="toolbar-right">
            <div className="sort-dropdown-wrapper">
              <select 
                className="sort-dropdown-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
              >
                <option value="latest">Latest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A-Z</option>
              </select>
              <span className="dropdown-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="catalogue-content-layout">
          
          {/* Filter Sidebar */}
          <aside className={`catalogue-sidebar ${isMobileFilterOpen ? 'is-open' : ''}`}>
            <div className="sidebar-card">
              <div className="filter-card-header">
                <h2 className="filter-heading">FILTERS</h2>
                <button 
                  type="button" 
                  className="clear-all-btn"
                  onClick={handleClearAll}
                >
                  CLEAR ALL
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">CATEGORY</h3>
                <div className="checkbox-list">
                  {['Men', 'Women', 'Unisex'].map(category => (
                    <label key={category} className="filter-checkbox-label">
                      <input 
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleToggleCategory(category)}
                        className="custom-checkbox-input"
                      />
                      <span className="custom-checkbox-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                      <span className="filter-option-text">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-group">
                <h3 className="filter-group-title">BRAND</h3>
                <div className="checkbox-list">
                  {BRAND_COUNTS.map(({ name, count }) => (
                    <label key={name} className="filter-checkbox-label with-count">
                      <div className="label-left">
                        <input 
                          type="checkbox"
                          checked={selectedBrands.includes(name)}
                          onChange={() => handleToggleBrand(name)}
                          className="custom-checkbox-input"
                        />
                        <span className="custom-checkbox-box">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span className="filter-option-text">{name}</span>
                      </div>
                      <span className="brand-count-badge">{count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="filter-group size-group">
                <h3 className="filter-group-title">SIZE (US)</h3>
                <div className="size-buttons-grid">
                  {AVAILABLE_SIZES.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        className={`size-chip-btn ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleToggleSize(size)}
                        aria-pressed={isSelected}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Close Button */}
              {isMobileFilterOpen && (
                <button 
                  className="mobile-apply-btn"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="catalogue-products-area">
            {filteredProducts.length === 0 ? (
              <div className="empty-products-state">
                <h3>No sneakers match your filters</h3>
                <p>Try resetting some filters or searching for another keyword.</p>
                <button className="reset-filters-cta" onClick={handleClearAll}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="catalogue-products-grid">
                {filteredProducts.map(product => {
                  const wishlisted = isWishlisted(product.id);
                  const isAdded = addedAnimationId === product.id;

                  return (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="product-card-link"
                    >
                      <article className="product-card">
                        <div className="product-image-container">
                          {/* Badge */}
                          {product.badge && (
                            <span className={`product-badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                              {product.badge}
                            </span>
                          )}

                          {/* Wishlist Heart */}
                          <button 
                            type="button"
                            className={`product-wishlist-btn ${wishlisted ? 'is-active' : ''}`}
                            onClick={(e) => handleToggleWishlistClick(product.id, e)}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <svg viewBox="0 0 24 24" fill={wishlisted ? 'var(--color-primary)' : 'none'} stroke={wishlisted ? 'var(--color-primary)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </button>

                          {/* Sneaker Image */}
                          <div className="image-wrapper">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="product-img"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                              }}
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                          <span className="product-brand">{product.brand}</span>
                          <h3 className="product-name">{product.name}</h3>
                          
                          <div className="product-price-row">
                            <span className="product-price">{formatPrice(product.price)}</span>
                            
                            <button 
                              type="button"
                              className={`product-add-btn ${isAdded ? 'is-added' : ''}`}
                              onClick={(e) => handleAddToCartClick(product, e)}
                              aria-label={`Add ${product.name} to cart`}
                            >
                              {isAdded ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="catalogue-pagination" aria-label="Pagination">
              <button 
                type="button" 
                className="pagination-btn pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button 
                type="button" 
                className={`pagination-btn pagination-num ${currentPage === 1 ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(1)}
                aria-current={currentPage === 1 ? 'page' : undefined}
              >
                1
              </button>

              <button 
                type="button" 
                className={`pagination-btn pagination-num ${currentPage === 2 ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(2)}
                aria-current={currentPage === 2 ? 'page' : undefined}
              >
                2
              </button>

              <button 
                type="button" 
                className={`pagination-btn pagination-num ${currentPage === 3 ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(3)}
                aria-current={currentPage === 3 ? 'page' : undefined}
              >
                3
              </button>

              <span className="pagination-ellipsis">&hellip;</span>

              <button 
                type="button" 
                className={`pagination-btn pagination-num ${currentPage === 8 ? 'is-active' : ''}`}
                onClick={() => setCurrentPage(8)}
                aria-current={currentPage === 8 ? 'page' : undefined}
              >
                8
              </button>

              <button 
                type="button" 
                className="pagination-btn pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 8))}
                disabled={currentPage === 8}
                aria-label="Next page"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

          </main>
        </div>

        {/* "THE ARCHIVE" Editorial Section */}
        <section className="archive-section">
          <div className="archive-content">
            <h2 className="archive-title">THE ARCHIVE</h2>
            <p className="archive-description">
              Explore our curated selection of premium streetwear and high-performance utility footwear.<br />
              Designed for the bold, engineered for the street.
            </p>
          </div>
        </section>

      </div>

      {/* Floating Toast Feedback */}
      {toastMessage && (
        <div className="catalogue-toast" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CataloguePage;
