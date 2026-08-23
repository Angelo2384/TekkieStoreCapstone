import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop, type CartItem } from '../context/ShopContext';
import { PRODUCTS, type Product } from '../data/products';
import './CartPage.css';

const CartPage: React.FC = () => {
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    promoCode,
    discountPercentage,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    subtotal,
    shipping,
    freeShippingThreshold,
    tax,
    total,
    toggleWishlist,
    isWishlisted,
    addToCart
  } = useShop();

  const [inputPromo, setInputPromo] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Format ZAR currency
  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Free shipping calculation
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Handle Promo Code Submit
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;

    const result = applyPromoCode(inputPromo);
    if (result.success) {
      setPromoMessage({ type: 'success', text: result.message });
      setInputPromo('');
    } else {
      setPromoMessage({ type: 'error', text: result.message });
    }

    setTimeout(() => {
      setPromoMessage(null);
    }, 4000);
  };

  // Quick Apply Promo Code
  const handleQuickPromo = (code: string) => {
    const result = applyPromoCode(code);
    if (result.success) {
      setPromoMessage({ type: 'success', text: result.message });
    }
    setTimeout(() => {
      setPromoMessage(null);
    }, 4000);
  };

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle Remove Item
  const handleRemove = (item: CartItem) => {
    removeFromCart(item.id);
    showToast(`Removed ${item.product.name} from bag`);
  };

  // Handle Move to Wishlist
  const handleMoveToWishlist = (item: CartItem) => {
    if (!isWishlisted(item.product.id)) {
      toggleWishlist(item.product.id);
    }
    removeFromCart(item.id);
    showToast(`Moved ${item.product.name} to wishlist`);
  };

  // Handle Checkout
  const handleProceedToCheckout = () => {
    setIsCheckingOut(true);
  };

  // Curated recommended items for empty state & cross-sell
  const recommendedProducts: Product[] = PRODUCTS.slice(0, 4);

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* Breadcrumb Navigation */}
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/catalogue">Catalogue</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">Shopping Bag</span>
        </nav>

        {/* Page Header */}
        <div className="cart-header">
          <div className="cart-header-title-row">
            <h1 className="cart-title">
              SHOPPING BAG <span className="cart-count-badge">({cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'})</span>
            </h1>
            {cartItems.length > 0 && (
              <button
                type="button"
                className="cart-clear-btn"
                onClick={clearCart}
                aria-label="Clear all items in shopping bag"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Clear Bag</span>
              </button>
            )}
          </div>

          {/* Free Shipping Progress Meter */}
          {cartItems.length > 0 && (
            <div className="free-shipping-tracker">
              <div className="free-shipping-header">
                <div className="free-shipping-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div className="free-shipping-text">
                  {freeShippingLeft === 0 ? (
                    <span className="free-shipping-unlocked">
                      🎉 <strong>Awesome!</strong> You unlocked <strong>FREE Standard Delivery</strong> across South Africa!
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatZAR(freeShippingLeft)}</strong> more to get <strong>FREE Standard Delivery</strong>
                    </span>
                  )}
                </div>
              </div>
              <div className="shipping-progress-bar-bg" role="progressbar" aria-valuenow={freeShippingProgress} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className={`shipping-progress-bar-fill ${freeShippingProgress === 100 ? 'is-complete' : ''}`}
                  style={{ width: `${freeShippingProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Main Cart Body */}
        {cartItems.length > 0 ? (
          <div className="cart-content-grid">
            
            {/* Left Column: Cart Items List */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <span className="col-product">PRODUCT</span>
                <span className="col-price">PRICE</span>
                <span className="col-quantity">QUANTITY</span>
                <span className="col-total">TOTAL</span>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const itemTotalPrice = item.product.price * item.quantity;
                  const isItemWishlisted = isWishlisted(item.product.id);

                  return (
                    <article key={item.id} className="cart-item-row">
                      {/* Product Thumbnail */}
                      <div className="cart-item-image-wrapper">
                        <Link to={`/product/${item.product.id}`} className="cart-item-thumb-link">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="cart-item-img"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                            }}
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="cart-item-details">
                        <div className="cart-item-brand-row">
                          <span className="cart-item-brand">{item.product.brand}</span>
                          {item.product.badge && (
                            <span className="cart-item-badge">{item.product.badge}</span>
                          )}
                        </div>

                        <Link to={`/product/${item.product.id}`} className="cart-item-title-link">
                          <h2 className="cart-item-title">{item.product.name}</h2>
                        </Link>

                        {/* Selected Specs */}
                        <div className="cart-item-specs">
                          <div className="spec-tag size-spec">
                            <span className="spec-label">Size:</span>
                            <span className="spec-value">UK {item.size}</span>
                          </div>

                          <div className="spec-tag color-spec">
                            <span className="spec-label">Colour:</span>
                            <span className="spec-value">{item.color}</span>
                          </div>
                        </div>

                        {/* Mobile Price View */}
                        <div className="cart-item-mobile-price">
                          <span className="unit-price">{formatZAR(item.product.price)}</span>
                        </div>

                        {/* Item Action Controls */}
                        <div className="cart-item-actions-row">
                          <button
                            type="button"
                            className="cart-action-btn remove-btn"
                            onClick={() => handleRemove(item)}
                            aria-label={`Remove ${item.product.name} from bag`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            <span>Remove</span>
                          </button>

                          <span className="action-divider">•</span>

                          <button
                            type="button"
                            className={`cart-action-btn wishlist-btn ${isItemWishlisted ? 'is-active' : ''}`}
                            onClick={() => handleMoveToWishlist(item)}
                            aria-label="Save to Wishlist"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill={isItemWishlisted ? 'var(--color-primary)' : 'none'}
                              stroke={isItemWishlisted ? 'var(--color-primary)' : 'currentColor'}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>{isItemWishlisted ? 'Wishlisted' : 'Move to Wishlist'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop Unit Price */}
                      <div className="cart-item-col-price">
                        <span className="price-val">{formatZAR(item.product.price)}</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-item-col-quantity">
                        <div className="quantity-stepper" role="group" aria-label="Item quantity">
                          <button
                            type="button"
                            className="qty-btn qty-minus"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>

                          <span className="qty-number" aria-live="polite">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="qty-btn qty-plus"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={item.quantity >= 10}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="cart-item-col-total">
                        <span className="line-total-val">{formatZAR(itemTotalPrice)}</span>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Bottom Cart Navigation */}
              <div className="cart-bottom-actions">
                <Link to="/catalogue" className="continue-shopping-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Guarantee / Perks Box */}
              <div className="cart-perks-row">
                <div className="perk-item">
                  <div className="perk-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                  <div className="perk-info">
                    <h4>100% Verified Authentic</h4>
                    <p>Every sneaker inspected by in-house specialists</p>
                  </div>
                </div>

                <div className="perk-item">
                  <div className="perk-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className="perk-info">
                    <h4>Free 30-Day Returns</h4>
                    <p>Easy drop-offs across major South African hubs</p>
                  </div>
                </div>

                <div className="perk-item">
                  <div className="perk-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <div className="perk-info">
                    <h4>Encrypted Secure Checkout</h4>
                    <p>256-Bit SSL security guarantee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="cart-summary-sidebar">
              <div className="order-summary-card">
                <h2 className="summary-title">ORDER SUMMARY</h2>

                {/* Promo Code Input */}
                <div className="promo-section">
                  <form onSubmit={handleApplyPromo} className="promo-form">
                    <div className="promo-input-group">
                      <input
                        type="text"
                        className="promo-input"
                        placeholder="Promo code (e.g. TEKKIE20)"
                        value={inputPromo}
                        onChange={(e) => setInputPromo(e.target.value)}
                        aria-label="Enter voucher or promo code"
                      />
                      <button type="submit" className="promo-apply-btn" disabled={!inputPromo.trim()}>
                        Apply
                      </button>
                    </div>
                  </form>

                  {/* Promo Message */}
                  {promoMessage && (
                    <div className={`promo-feedback ${promoMessage.type}`} role="alert">
                      <span>{promoMessage.text}</span>
                    </div>
                  )}

                  {/* Active Promo Pill */}
                  {promoCode && discountPercentage > 0 && (
                    <div className="active-promo-tag">
                      <span className="promo-tag-name">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {promoCode} ({discountPercentage}% OFF)
                      </span>
                      <button
                        type="button"
                        className="promo-remove-btn"
                        onClick={removePromoCode}
                        aria-label="Remove promo code"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Quick Promos */}
                  {!promoCode && (
                    <div className="quick-promos">
                      <span className="quick-promo-hint">Available for you:</span>
                      <button
                        type="button"
                        className="quick-promo-chip"
                        onClick={() => handleQuickPromo('TEKKIE20')}
                      >
                        ⚡ <strong>TEKKIE20</strong> (20% Off)
                      </button>
                    </div>
                  )}
                </div>

                {/* Financial Summary Lines */}
                <div className="summary-lines">
                  <div className="summary-line">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">{formatZAR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="summary-line discount-line">
                      <span className="summary-label">
                        Discount ({promoCode})
                      </span>
                      <span className="summary-value discount-value">-{formatZAR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="summary-line">
                    <span className="summary-label">
                      Estimated Delivery
                      {shipping === 0 && <span className="free-tag">FREE</span>}
                    </span>
                    <span className="summary-value">
                      {shipping === 0 ? 'FREE' : formatZAR(shipping)}
                    </span>
                  </div>

                  <div className="summary-line tax-line">
                    <span className="summary-label">
                      Estimated Tax (15% VAT)
                      <span className="tax-hint" title="15% South African VAT included in price">ⓘ</span>
                    </span>
                    <span className="summary-value">{formatZAR(tax)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-line total-line">
                    <span className="total-label">Total</span>
                    <div className="total-value-wrapper">
                      <span className="currency-code">ZAR</span>
                      <span className="total-value">{formatZAR(total)}</span>
                    </div>
                  </div>
                  <p className="vat-notice">Includes 15% South African VAT</p>
                </div>

                {/* Checkout CTA */}
                <div className="summary-cta-section">
                  <button
                    type="button"
                    className="checkout-btn primary-cta"
                    onClick={handleProceedToCheckout}
                    aria-label="Proceed to secure checkout"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>PROCEED TO CHECKOUT</span>
                  </button>
                </div>

                {/* Accepted Payment Badges */}
                <div className="payment-methods-strip">
                  <span className="payment-chip">VISA</span>
                  <span className="payment-chip">Mastercard</span>
                  <span className="payment-chip">Ozow</span>
                  <span className="payment-chip">PayFast</span>
                  <span className="payment-chip">Mobicred</span>
                </div>
              </div>
            </aside>

          </div>
        ) : (
          /* Empty Cart State */
          <div className="empty-cart-view">
            <div className="empty-cart-card">
              <div className="empty-cart-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h2 className="empty-cart-title">YOUR SHOPPING BAG IS EMPTY</h2>
              <p className="empty-cart-desc">
                Looks like you haven't added any fresh kicks to your bag yet.<br />
                Explore our latest drops and exclusive archive to find your next pair.
              </p>
              <div className="empty-cart-actions">
                <Link to="/catalogue" className="empty-browse-btn">
                  EXPLORE CATALOGUE
                </Link>
                <Link to="/new-drops" className="empty-secondary-btn">
                  VIEW NEW DROPS
                </Link>
              </div>
            </div>

            {/* Recommended Products Grid */}
            <div className="recommended-section">
              <div className="recommended-header">
                <h3 className="recommended-title">TRENDING IN THE ARCHIVE</h3>
                <Link to="/catalogue" className="recommended-see-all">
                  See all &rarr;
                </Link>
              </div>

              <div className="recommended-grid">
                {recommendedProducts.map((prod) => (
                  <div key={prod.id} className="recommended-card">
                    <Link to={`/product/${prod.id}`} className="recommended-card-img-link">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="recommended-card-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                        }}
                      />
                    </Link>
                    <div className="recommended-card-body">
                      <span className="recommended-card-brand">{prod.brand}</span>
                      <h4 className="recommended-card-name">{prod.name}</h4>
                      <div className="recommended-card-footer">
                        <span className="recommended-card-price">{formatZAR(prod.price)}</span>
                        <button
                          type="button"
                          className="recommended-add-btn"
                          onClick={() => {
                            addToCart(prod);
                            showToast(`Added ${prod.name} to bag!`);
                          }}
                          aria-label={`Quick add ${prod.name} to bag`}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Checkout Modal */}
      {isCheckingOut && (
        <div className="checkout-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="checkout-modal-card">
            <div className="modal-header">
              <div className="modal-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div>
                <h3 id="modal-title" className="modal-title">SECURE CHECKOUT</h3>
                <p className="modal-subtitle">TekkieStore 256-Bit Encrypted Payment Gate</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCheckingOut(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Order Review List */}
              <div className="modal-order-summary">
                <div className="modal-section-title">ITEMS IN ORDER ({cartCount})</div>
                <div className="modal-items-preview">
                  {cartItems.map(item => (
                    <div key={item.id} className="modal-preview-row">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="modal-preview-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                        }}
                      />
                      <div className="modal-preview-info">
                        <span className="modal-preview-name">{item.product.name}</span>
                        <span className="modal-preview-meta">Size UK {item.size} • Qty {item.quantity}</span>
                      </div>
                      <span className="modal-preview-price">{formatZAR(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="modal-cost-breakdown">
                <div className="modal-cost-row">
                  <span>Subtotal</span>
                  <span>{formatZAR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="modal-cost-row discount">
                    <span>Discount ({promoCode})</span>
                    <span>-{formatZAR(discountAmount)}</span>
                  </div>
                )}
                <div className="modal-cost-row">
                  <span>Delivery</span>
                  <span>{shipping === 0 ? 'FREE' : formatZAR(shipping)}</span>
                </div>
                <div className="modal-cost-row total">
                  <span>Total Amount to Pay</span>
                  <span className="modal-total-value">{formatZAR(total)}</span>
                </div>
              </div>

              {/* Delivery Info Mock */}
              <div className="modal-delivery-info">
                <div className="delivery-icon">📍</div>
                <div>
                  <span className="delivery-title">Nationwide Delivery: 2 - 4 Business Days</span>
                  <span className="delivery-address">Standard Courier door-to-door delivery with tracking</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-submit-btn"
                disabled
                aria-disabled="true"
                style={{ cursor: 'not-allowed', opacity: 0.6 }}
                title="Pay Now button is non-functional"
              >
                PAY {formatZAR(total)} NOW
              </button>
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setIsCheckingOut(false)}
              >
                Cancel & Return to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="cart-toast" role="alert">
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

export default CartPage;
