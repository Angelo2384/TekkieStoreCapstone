import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, type Product } from '../data/products';
import './WishlistPage.css';

const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; actionText?: string; actionLink?: string } | null>(null);

  const showToast = (text: string, actionText?: string, actionLink?: string) => {
    setToastMessage({ text, actionText, actionLink });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Format ZAR currency
  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Cross-reference wishlist IDs with PRODUCTS
  const wishlistedProducts: Product[] = PRODUCTS.filter(p => wishlist.has(p.id));

  // Handle Add to Cart
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`Added "${product.name}" to cart!`, 'View Cart →', '/cart');
  };

  // Handle Remove from Wishlist
  const handleRemoveFromWishlist = (productId: number, productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    showToast(`Removed "${productName}" from your wishlist.`);
  };

  // Handle Share Wishlist
  const handleShareWishlist = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // ignore clipboard error
    }
    showToast('Wishlist link copied to clipboard!');
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">

        {/* Breadcrumb */}
        <nav className="wishlist-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/profile">My Account</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">My Wishlist</span>
        </nav>

        {/* Header with Share Button */}
        <div className="wishlist-header-row">
          <div className="wishlist-title-group">
            <h1 className="wishlist-page-title">My Wishlist</h1>
            <span className="wishlist-count-badge">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            type="button"
            className="share-wishlist-btn"
            onClick={handleShareWishlist}
            aria-label="Share wishlist"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>SHARE WISHLIST</span>
          </button>
        </div>

        {/* Wishlist Products Grid or Empty State */}
        {wishlistedProducts.length === 0 ? (
          <div className="wishlist-empty-card">
            <div className="empty-heart-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="empty-title">Your wishlist is empty</h2>
            <p className="empty-desc">
              Save your favorite sneakers here while browsing to keep track of drops, sizes, and exclusive releases.
            </p>
            <Link to="/catalogue" className="browse-catalogue-cta">
              Explore Catalogue &rarr;
            </Link>
          </div>
        ) : (
          <div className="wishlist-products-grid">
            {wishlistedProducts.map((product) => {
              // Demo stock check: treat products as in stock unless specifically marked out of stock
              const isOutOfStock = false;

              return (
                <div key={product.id} className="wishlist-product-card">
                  {/* Card Image Area */}
                  <div className="wishlist-card-image-wrap">
                    {/* Badge if available */}
                    {product.badge && (
                      <span className={`wishlist-badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Filled Heart (Remove from wishlist) Button */}
                    <button
                      type="button"
                      className="wishlist-heart-action-btn is-active"
                      onClick={(e) => handleRemoveFromWishlist(product.id, product.name, e)}
                      title="Remove from wishlist"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <svg viewBox="0 0 24 24" fill="var(--color-primary)" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>

                    {/* Sneaker Image Link */}
                    <Link to={`/product/${product.id}`} className="wishlist-image-link">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="wishlist-product-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                        }}
                      />
                    </Link>
                  </div>

                  {/* Card Info Area */}
                  <div className="wishlist-card-info">
                    <span className="wishlist-product-brand">{product.brand}</span>
                    <Link to={`/product/${product.id}`} className="wishlist-product-title-link">
                      <h3 className="wishlist-product-name">{product.name}</h3>
                    </Link>
                    <div className="wishlist-product-price-row">
                      <span className="wishlist-price-val">{formatZAR(product.price)}</span>
                    </div>

                    {/* Bottom Add to Cart / Out of Stock Button */}
                    {isOutOfStock ? (
                      <button
                        type="button"
                        className="wishlist-cart-btn is-out-of-stock"
                        disabled
                      >
                        OUT OF STOCK
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="wishlist-cart-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>ADD TO CART</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="wishlist-toast" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="toast-text">{toastMessage.text}</span>
          {toastMessage.actionLink && (
            <Link to={toastMessage.actionLink} className="toast-cta-btn">
              {toastMessage.actionText}
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default WishlistPage;
