import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useShop } from '../context/ShopContext';
import './ProductDetailsPage.css';

const SIZE_GUIDE_DATA = [
  { us: '6', cm: '24.0 cm' },
  { us: '7', cm: '25.0 cm' },
  { us: '8', cm: '26.0 cm' },
  { us: '9', cm: '27.0 cm' },
  { us: '10', cm: '28.0 cm' },
  { us: '11', cm: '29.0 cm' },
  { us: '12', cm: '30.0 cm' },
];

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useShop();

  const product = productId ? getProductById(productId) : undefined;

  // Selected Options initialized directly from current product
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState<number | null>(product?.defaultSize ?? product?.sizes[0] ?? null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<boolean>(false);

  // Sync image if product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      setToastMessage('Please select a shoe size');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    setSizeError(false);
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setToastMessage(`Added ${product.name} (Size ${selectedSize}) to bag!`);

    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Handle Buy It Now
  const handleBuyItNow = () => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      setToastMessage('Please select a shoe size to proceed');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    setToastMessage(`Proceeding to checkout with ${product.name}...`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Product not found state
  if (!product) {
    return (
      <div className="product-not-found-page">
        <div className="not-found-container">
          <div className="not-found-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Product Not Found</h2>
          <p>The sneaker you are looking for might have been retired or does not exist.</p>
          <Link to="/catalogue" className="back-to-catalogue-cta">
            Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const galleryImages = product.images && product.images.length > 0
    ? product.images.slice(0, 4)
    : [product.image, product.image, product.image, product.image];

  return (
    <div className="product-details-page" key={product.id}>
      <div className="product-details-container">
        
        {/* Breadcrumb / Back Link */}
        <div className="product-breadcrumb">
          <button 
            type="button" 
            className="breadcrumb-back-btn"
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Back</span>
          </button>
          <span className="breadcrumb-divider">/</span>
          <Link to="/catalogue">Catalogue</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{product.brand}</span>
        </div>

        <div className="product-details-layout">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="product-gallery-section">
            <div className="product-main-image-box">
              {/* Wishlist Button */}
              <button
                type="button"
                className={`product-details-wishlist-btn ${wishlisted ? 'is-active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg viewBox="0 0 24 24" fill={wishlisted ? 'var(--color-primary)' : 'none'} stroke={wishlisted ? 'var(--color-primary)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              {/* Main Image */}
              <div className="main-image-wrapper">
                <img 
                  src={selectedImage || product.image} 
                  alt={product.name} 
                  className="product-main-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                  }}
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="product-thumbnails-grid">
              {galleryImages.map((imgSrc, index) => {
                const isActive = (selectedImage || product.image) === imgSrc;
                const isFourth = index === 3;

                return (
                  <button
                    key={index}
                    type="button"
                    className={`product-thumbnail-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSelectedImage(imgSrc)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                      }}
                    />
                    {isFourth && product.images && product.images.length > 4 && (
                      <span className="thumbnail-more-overlay">+{product.images.length - 3}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info & Actions */}
          <div className="product-information-panel">
            
            {/* Brand */}
            <span className="product-brand-tag">{product.brand}</span>

            {/* Name */}
            <h1 className="product-title-heading">{product.name}</h1>

            {/* Price & Rating */}
            <div className="product-price-rating-row">
              <span className="product-main-price">
                R{product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="product-rating-badge">
                <span className="rating-star">★</span>
                <span className="rating-score">{product.rating}</span>
                <span className="reviews-count">({product.reviewCount} Reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="product-editorial-description">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="product-option-group">
              <h3 className="option-title">COLOR</h3>
              <div className="color-swatches-list">
                {product.colors.map(color => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      className={`color-swatch-btn ${isSelected ? 'is-selected' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      aria-label={`Select color ${color.name}`}
                      aria-pressed={isSelected}
                    >
                      {isSelected && (
                        <span className="swatch-check" style={{ color: color.hex === '#ffffff' || color.hex === '#e5e7eb' ? '#111' : '#fff' }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="product-option-group">
              <div className="size-header-row">
                <h3 className="option-title">SIZE (US)</h3>
                <button 
                  type="button" 
                  className="size-guide-link"
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  Size Guide
                </button>
              </div>

              <div className={`size-options-grid ${sizeError ? 'has-error' : ''}`}>
                {product.sizes.map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      className={`size-select-btn ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      aria-pressed={isSelected}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Stock Notice */}
              <div className="stock-warning-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>
                  {selectedSize === 9 
                    ? 'Low Stock - Only 2 left in Size 9' 
                    : (product.stockMessage || `Fast selling in Size ${selectedSize || 'all sizes'}`)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-action-buttons">
              <button 
                type="button" 
                className={`add-to-cart-btn ${isAdded ? 'is-success' : ''}`}
                onClick={handleAddToCart}
              >
                <span>ADD TO CART</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>

              <button 
                type="button" 
                className="buy-it-now-btn"
                onClick={handleBuyItNow}
              >
                BUY IT NOW
              </button>
            </div>

            {/* Benefits Row */}
            <div className="product-benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div className="benefit-text">
                  <strong>Free Delivery</strong>
                  <span>On orders over R150</span>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <div className="benefit-text">
                  <strong>100% Authentic</strong>
                  <span>Guaranteed</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="size-guide-modal-overlay" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="size-guide-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Footwear Size Guide</h2>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsSizeGuideOpen(false)}
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>
            
            <p className="modal-subtitle">
              Measure from heel to toe on a flat surface to find your exact fit.
            </p>

            <table className="size-conversion-table">
              <thead>
                <tr>
                  <th>US Size</th>
                  <th>Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE_DATA.map(row => (
                  <tr key={row.us} className={selectedSize === Number(row.us) ? 'is-current-size' : ''}>
                    <td>US {row.us}</td>
                    <td>{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button 
              type="button" 
              className="modal-done-btn"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="product-details-toast" role="alert">
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

export default ProductDetailsPage;
