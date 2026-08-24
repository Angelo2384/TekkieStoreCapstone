import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop, type UserOrder } from '../context/ShopContext';
import { Avatar } from '../components/ui';
import './OrderHistoryPage.css';

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, orders, addToCart, logout, wishlist } = useShop();

  // Selected Order for Details / Tracking Modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<UserOrder | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; actionText?: string; actionLink?: string } | null>(null);

  const showToast = (text: string, actionText?: string, actionLink?: string) => {
    setToastMessage({ text, actionText, actionLink });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Format ZAR currency
  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle Logout
  const handleSignOut = () => {
    logout();
    showToast('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  // Handle Reorder entire order
  const handleReorderOrder = (order: UserOrder) => {
    let totalItemsAdded = 0;
    order.items.forEach(item => {
      addToCart(item.product, item.size, item.color, item.quantity);
      totalItemsAdded += item.quantity;
    });

    showToast(
      `Added ${totalItemsAdded} item${totalItemsAdded > 1 ? 's' : ''} from ${order.id} to your cart!`,
      'View Cart →',
      '/cart'
    );
  };

  // Handle Reorder single item
  const handleReorderItem = (item: UserOrder['items'][0]) => {
    addToCart(item.product, item.size, item.color, item.quantity);
    showToast(`Added "${item.product.name}" (UK ${item.size}) to your cart!`, 'View Cart →', '/cart');
  };

  // Stats calculation
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItemsCount = orders.reduce((sum, order) => sum + (order.itemsCount || order.items.reduce((s, i) => s + i.quantity, 0)), 0);

  return (
    <div className="order-history-page">
      <div className="order-history-container">

        {/* Breadcrumb Navigation */}
        <nav className="order-history-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/profile">My Account</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">Order History</span>
        </nav>

        {/* Main 2-Column Grid Layout */}
        <div className="order-history-grid">

          {/* LEFT: Account Sidebar */}
          <aside className="order-history-sidebar">
            <div className="account-user-card">
              <div className="user-avatar-wrap">
                <Avatar
                  alt={`${user.firstName} ${user.lastName}`}
                  initials={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  size="lg"
                  className="sidebar-avatar"
                />
                <span className="verified-badge-pill" title="Verified Account">✓</span>
              </div>

              <div className="user-meta-info">
                <h2 className="user-full-name">{user.firstName} {user.lastName}</h2>
                <span className="user-email">{user.email}</span>
                <div className="membership-tier-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{user.memberTier}</span>
                </div>
              </div>

              <div className="sidebar-loyalty-meter">
                <div className="loyalty-meter-header">
                  <span>Tekkie Club Points</span>
                  <strong>{user.memberPoints} pts</strong>
                </div>
                <div className="loyalty-bar-track">
                  <div className="loyalty-bar-progress" style={{ width: '75%' }}></div>
                </div>
                <span className="loyalty-subtext">550 pts away from VIP Tier 4</span>
              </div>
            </div>

            {/* Sidebar Navigation Menu */}
            <nav className="account-nav-menu" aria-label="Account navigation">
              <Link to="/profile" className="account-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </Link>

              <Link to="/order-history" className="account-nav-item is-active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Order History</span>
                <span className="nav-item-badge">{orders.length}</span>
              </Link>

              <Link to="/delivery" className="account-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Delivery</span>
              </Link>

              <Link to="/wishlist" className="account-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Wishlist</span>
                {wishlist.size > 0 && (
                  <span className="nav-item-badge wishlist-count">{wishlist.size}</span>
                )}
              </Link>

              <div className="nav-menu-divider"></div>

              <button
                type="button"
                className="account-nav-item logout-btn"
                onClick={handleSignOut}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* RIGHT: Main Order History Content Area */}
          <main className="order-history-main">

            {/* Page Header */}
            <div className="order-history-header-card">
              <div className="header-text-group">
                <h1 className="order-history-title">Order History</h1>
                <p className="order-history-subtitle">
                  Review and track all your previous purchases, view shipment details, and easily reorder your favourite kicks.
                </p>
              </div>

              {/* Quick Order Stats Bar */}
              <div className="order-summary-stats">
                <div className="summary-stat-box">
                  <span className="summary-stat-label">Total Orders</span>
                  <strong className="summary-stat-value">{orders.length}</strong>
                </div>
                <div className="summary-stat-box">
                  <span className="summary-stat-label">Total Pairs</span>
                  <strong className="summary-stat-value">{totalItemsCount}</strong>
                </div>
                <div className="summary-stat-box">
                  <span className="summary-stat-label">Total Value</span>
                  <strong className="summary-stat-value primary-color">{formatZAR(totalSpent)}</strong>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="empty-orders-card">
                <div className="empty-icon-wrap">📦</div>
                <h3 className="empty-title">No orders found</h3>
                <p className="empty-desc">You haven&apos;t placed any orders yet. Discover our latest sneaker drops and start your collection!</p>
                <Link to="/catalogue" className="browse-catalogue-btn">
                  Explore Latest Drops &rarr;
                </Link>
              </div>
            ) : (
              <div className="orders-cards-stack">
                {orders.map((order) => (
                  <article key={order.id} className="order-history-card">
                    {/* Order Top Bar */}
                    <div className="order-card-header">
                      <div className="order-header-main-meta">
                        <div className="order-number-badge">
                          <span className="order-label">Order</span>
                          <span className="order-id">{order.id}</span>
                        </div>
                        <span className="order-dot-separator">•</span>
                        <span className="order-date">{order.date}</span>
                      </div>

                      <div className={`order-status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-indicator-dot"></span>
                        <span className="status-text">{order.status}</span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="order-card-items">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="order-item-row">
                          <div className="item-thumbnail-box">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="item-product-img"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                              }}
                            />
                          </div>

                          <div className="item-details-content">
                            <div className="item-brand-row">
                              <span className="item-brand">{item.product.brand}</span>
                              <span className="item-category-tag">{item.product.category || 'Sneaker'}</span>
                            </div>
                            <h4 className="item-title">{item.product.name}</h4>
                            <div className="item-specs-pills">
                              <span className="spec-pill">Size: <strong>UK {item.size}</strong></span>
                              <span className="spec-pill">Color: <strong>{item.color}</strong></span>
                              <span className="spec-pill">Qty: <strong>{item.quantity}</strong></span>
                            </div>
                          </div>

                          <div className="item-price-action-box">
                            <div className="item-pricing">
                              <span className="item-unit-price">{formatZAR(item.price)} each</span>
                              <strong className="item-total-price">{formatZAR(item.price * item.quantity)}</strong>
                            </div>
                            <button
                              type="button"
                              className="single-item-reorder-btn"
                              title="Reorder this specific item"
                              onClick={() => handleReorderItem(item)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                              </svg>
                              <span>Reorder Item</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Actions */}
                    <div className="order-card-bottom">
                      <div className="order-bottom-meta">
                        <div className="order-shipping-dest">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="dest-text">{order.deliveryAddress}</span>
                        </div>
                        <div className="order-grand-total">
                          <span className="grand-total-label">Total Order:</span>
                          <span className="grand-total-val">{formatZAR(order.total)}</span>
                        </div>
                      </div>

                      <div className="order-action-buttons-group">
                        <button
                          type="button"
                          className="action-btn details-btn"
                          onClick={() => setSelectedOrderForDetails(order)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          className="action-btn reorder-btn"
                          onClick={() => handleReorderOrder(order)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <polyline points="23 20 23 14 17 14"></polyline>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                          </svg>
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </main>
        </div>

      </div>

      {/* Interactive Order Details Modal */}
      {selectedOrderForDetails && (
        <div className="order-details-modal-backdrop" role="dialog" aria-modal="true">
          <div className="order-details-modal-card">
            {/* Modal Header */}
            <div className="modal-top-header">
              <div className="modal-header-titles">
                <div className="modal-badge-row">
                  <span className="modal-order-tag">ORDER DETAILS</span>
                  <span className={`order-status-badge ${selectedOrderForDetails.status.toLowerCase().replace(' ', '-')}`}>
                    <span className="status-indicator-dot"></span>
                    <span className="status-text">{selectedOrderForDetails.status}</span>
                  </span>
                </div>
                <h3 className="modal-main-title">{selectedOrderForDetails.id}</h3>
                <p className="modal-meta-date">Placed on {selectedOrderForDetails.date}</p>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedOrderForDetails(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="modal-scrollable-body">

              {/* Delivery Tracking Steps */}
              <div className="modal-section-card">
                <div className="section-title-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  <h4>Shipment Tracking</h4>
                </div>
                <div className="tracking-code-pill">
                  <span>Courier: <strong>RAM Express ZA</strong></span>
                  <span>Tracking Number: <strong>{selectedOrderForDetails.trackingNumber}</strong></span>
                </div>

                <div className="tracking-timeline-list">
                  <div className="timeline-step is-complete">
                    <div className="step-check">✓</div>
                    <div className="step-info">
                      <span className="step-heading">Order Placed & Payment Verified</span>
                      <span className="step-timestamp">{selectedOrderForDetails.date} • 10:14 AM</span>
                    </div>
                  </div>
                  <div className="timeline-step is-complete">
                    <div className="step-check">✓</div>
                    <div className="step-info">
                      <span className="step-heading">Sneakers Authenticated & Packaged</span>
                      <span className="step-timestamp">{selectedOrderForDetails.date} • 02:30 PM</span>
                    </div>
                  </div>
                  <div className="timeline-step is-complete">
                    <div className="step-check">✓</div>
                    <div className="step-info">
                      <span className="step-heading">Dispatched via Express Courier</span>
                      <span className="step-timestamp">Cape Town Sorting Hub</span>
                    </div>
                  </div>
                  <div className="timeline-step is-complete">
                    <div className="step-check">✓</div>
                    <div className="step-info">
                      <span className="step-heading">Delivered to Destination</span>
                      <span className="step-timestamp">{selectedOrderForDetails.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address & Contact info */}
              <div className="modal-section-card">
                <div className="section-title-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <h4>Delivery Address</h4>
                </div>
                <div className="address-box-content">
                  <p className="address-name">{user.firstName} {user.lastName}</p>
                  <p className="address-text">{selectedOrderForDetails.deliveryAddress}</p>
                  <p className="address-contact">Phone: {user.phone} • Email: {user.email}</p>
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="modal-section-card">
                <div className="section-title-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  <h4>Purchased Items ({selectedOrderForDetails.items.length})</h4>
                </div>

                <div className="modal-items-list">
                  {selectedOrderForDetails.items.map((item, idx) => (
                    <div key={idx} className="modal-item-row">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="modal-item-thumb"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                        }}
                      />
                      <div className="modal-item-info">
                        <span className="modal-item-brand">{item.product.brand}</span>
                        <strong className="modal-item-name">{item.product.name}</strong>
                        <span className="modal-item-specs">UK {item.size} • {item.color} • Qty: {item.quantity}</span>
                      </div>
                      <div className="modal-item-pricing">
                        <span className="modal-item-unit">{formatZAR(item.price)} each</span>
                        <strong className="modal-item-subtotal">{formatZAR(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="modal-section-card pricing-card">
                <div className="section-title-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  <h4>Payment Summary</h4>
                </div>

                <div className="pricing-breakdown-list">
                  <div className="breakdown-line">
                    <span>Items Subtotal</span>
                    <span>{formatZAR(selectedOrderForDetails.total)}</span>
                  </div>
                  <div className="breakdown-line">
                    <span>Express Courier Delivery</span>
                    <span className="free-shipping-tag">FREE</span>
                  </div>
                  <div className="breakdown-line">
                    <span>SA VAT (15% Included)</span>
                    <span>{formatZAR(selectedOrderForDetails.total * 0.15)}</span>
                  </div>
                  <div className="breakdown-divider"></div>
                  <div className="breakdown-line total-line">
                    <strong>Total Amount Paid</strong>
                    <strong className="total-highlight">{formatZAR(selectedOrderForDetails.total)}</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="modal-bottom-bar">
              <button
                type="button"
                className="modal-action-btn print-invoice-btn"
                onClick={() => {
                  showToast(`Invoice for ${selectedOrderForDetails.id} downloaded successfully!`);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download Invoice</span>
              </button>

              <button
                type="button"
                className="modal-action-btn reorder-all-btn"
                onClick={() => {
                  handleReorderOrder(selectedOrderForDetails);
                  setSelectedOrderForDetails(null);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <polyline points="23 20 23 14 17 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
                <span>Reorder All Items</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="order-history-toast" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="toast-text-body">{toastMessage.text}</span>
          {toastMessage.actionLink && (
            <Link to={toastMessage.actionLink} className="toast-action-btn">
              {toastMessage.actionText}
            </Link>
          )}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
