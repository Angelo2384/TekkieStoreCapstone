import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Avatar } from '../components/ui';
import './DeliveryPage.css';

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, orders, logout, wishlist } = useShop();

  // Pick the most recent order, or null if no orders exist
  const latestOrder = orders.length > 0 ? orders[0] : null;

  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);

  // Format ZAR currency
  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Handle Logout
  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Handle Copy Tracking Number
  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  // Determine step progress based on order.status
  // Processing = step 1 done (Ordered done, Shipped active)
  // In Transit = steps 1 & 2 done (Ordered & Shipped done, Out for Delivery active)
  // Delivered = all 4 steps done
  const getStepStatus = (stepIndex: number, status?: string) => {
    if (!status || status === 'Delivered') {
      return { isDone: true, isActive: false };
    }
    if (status === 'In Transit') {
      if (stepIndex <= 2) return { isDone: true, isActive: false };
      if (stepIndex === 3) return { isDone: false, isActive: true };
      return { isDone: false, isActive: false };
    }
    if (status === 'Processing') {
      if (stepIndex === 1) return { isDone: true, isActive: false };
      if (stepIndex === 2) return { isDone: false, isActive: true };
      return { isDone: false, isActive: false };
    }
    return { isDone: false, isActive: false };
  };

  const getProgressLineWidth = (status?: string) => {
    if (!status || status === 'Delivered') return '100%';
    if (status === 'In Transit') return '66%';
    if (status === 'Processing') return '33%';
    return '0%';
  };

  const steps = [
    {
      index: 1,
      label: 'Ordered',
      date: latestOrder ? `${latestOrder.date} • 10:15 AM` : 'Order Confirmed',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      index: 2,
      label: 'Shipped',
      date: latestOrder ? `${latestOrder.date} • 02:45 PM` : 'Authenticated & Packed',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8"></polyline>
          <rect x="1" y="3" width="22" height="5"></rect>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      )
    },
    {
      index: 3,
      label: 'Out for Delivery',
      date: '23 August 2026 • 08:30 AM',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      )
    },
    {
      index: 4,
      label: 'Delivered',
      date: '23 August 2026 • 01:20 PM',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  return (
    <div className="delivery-page">
      <div className="delivery-container">

        {/* Breadcrumb */}
        <nav className="delivery-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/profile">My Account</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">Delivery Details</span>
        </nav>

        {/* Main 2-Column Grid */}
        <div className="delivery-grid">

          {/* LEFT: Account Sidebar */}
          <aside className="delivery-sidebar">
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

            {/* Sidebar Nav */}
            <nav className="account-nav-menu" aria-label="Account navigation">
              <Link to="/profile" className="account-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </Link>

              <Link to="/order-history" className="account-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Order History</span>
                <span className="nav-item-badge">{orders.length}</span>
              </Link>

              <Link to="/delivery" className="account-nav-item is-active">
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

          {/* RIGHT: Main Delivery Details Content */}
          <main className="delivery-main-content">

            {/* Header */}
            <div className="delivery-header-card">
              <div className="delivery-header-title-row">
                <div>
                  <h1 className="delivery-page-title">Delivery Details</h1>
                  <p className="delivery-page-subtitle">
                    Track your shipment in real time, view courier dispatch status, and check your delivery destination.
                  </p>
                </div>
                {latestOrder && (
                  <div className="delivery-order-tag-pill">
                    <span className="tag-label">Order</span>
                    <span className="tag-order-id">{latestOrder.id}</span>
                  </div>
                )}
              </div>
            </div>

            {!latestOrder ? (
              <div className="delivery-empty-card">
                <div className="empty-icon-wrap">🚚</div>
                <h3 className="empty-title">No Active Shipments</h3>
                <p className="empty-desc">You do not have any recent orders to track at the moment.</p>
                <Link to="/catalogue" className="browse-drops-btn">
                  Explore Latest Drops &rarr;
                </Link>
              </div>
            ) : (
              <>
                {/* 1. Tracking Status Card (4-Step Horizontal Tracker) */}
                <section className="delivery-card tracking-status-card">
                  <div className="card-section-header">
                    <div className="header-icon-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 14 14"></polyline>
                      </svg>
                      <h3 className="section-title">Tracking Status</h3>
                    </div>
                    <div className={`status-pill ${latestOrder.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="status-pill-dot"></span>
                      <span>{latestOrder.status}</span>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="progress-tracker-wrap">
                    <div className="progress-tracker-bar">
                      <div
                        className="progress-tracker-line-fill"
                        style={{ width: getProgressLineWidth(latestOrder.status) }}
                      ></div>
                    </div>

                    <div className="progress-steps-row">
                      {steps.map((step) => {
                        const { isDone, isActive } = getStepStatus(step.index, latestOrder.status);
                        return (
                          <div
                            key={step.index}
                            className={`tracker-step-item ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
                          >
                            <div className="step-circle-icon">
                              {isDone ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                step.icon
                              )}
                            </div>
                            <div className="step-label-group">
                              <span className="step-name">{step.label}</span>
                              <span className="step-date">{step.date}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* 2. Side-by-Side Cards: Delivery Address & Carrier Details */}
                <div className="delivery-two-cards-row">
                  {/* Delivery Address Card */}
                  <div className="delivery-card info-card">
                    <div className="card-section-header">
                      <div className="header-icon-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <h3 className="section-title">Delivery Address</h3>
                      </div>
                      <span className="country-badge">🇿🇦 South Africa</span>
                    </div>

                    <div className="address-body-content">
                      <h4 className="recipient-name">{user.firstName} {user.lastName}</h4>
                      <p className="address-text-line">{user.address.street}</p>
                      {user.address.apartment && (
                        <p className="address-text-line">{user.address.apartment}</p>
                      )}
                      <p className="address-text-line">
                        {user.address.city}, {user.address.province}, {user.address.postalCode}
                      </p>
                      <p className="address-text-line country-name">{user.address.country}</p>

                      <div className="contact-meta-row">
                        <span className="meta-label">Phone:</span>
                        <span className="meta-value">{user.phone}</span>
                      </div>

                      {user.address.instructions && (
                        <div className="delivery-instruction-card">
                          <span className="pin-icon">📌</span>
                          <span className="instruction-msg">{user.address.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Carrier Details Card */}
                  <div className="delivery-card info-card">
                    <div className="card-section-header">
                      <div className="header-icon-title">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <h3 className="section-title">Carrier Details</h3>
                      </div>
                      <span className="carrier-verified-badge">✓ Verified Courier</span>
                    </div>

                    <div className="carrier-body-content">
                      <div className="carrier-info-block">
                        <span className="info-block-label">Courier Name</span>
                        <strong className="info-block-value">RAM Hand-to-Hand Couriers ZA</strong>
                      </div>

                      <div className="carrier-info-block">
                        <span className="info-block-label">Delivery Service</span>
                        <span className="info-block-value">Standard Express Air Freight (1-3 Business Days)</span>
                      </div>

                      <div className="tracking-number-badge-box">
                        <div className="tracking-label-val">
                          <span className="tracking-badge-title">TRACKING NUMBER</span>
                          <strong className="tracking-badge-code">{latestOrder.trackingNumber}</strong>
                        </div>
                        <button
                          type="button"
                          className="copy-tracking-btn"
                          onClick={() => handleCopyTracking(latestOrder.trackingNumber)}
                          title="Copy tracking number"
                        >
                          {copiedTracking ? (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="carrier-status-note">
                        <span className="note-dot"></span>
                        <span className="note-text">
                          Package successfully delivered to destination and signed for by recipient.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Items in Shipment Card */}
                <section className="delivery-card items-shipment-card">
                  <div className="card-section-header">
                    <div className="header-icon-title">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                      <h3 className="section-title">Items in Shipment ({latestOrder.items.length})</h3>
                    </div>
                    <span className="order-placed-meta">Placed on {latestOrder.date}</span>
                  </div>

                  <div className="shipment-items-list">
                    {latestOrder.items.map((item, idx) => (
                      <div key={idx} className="shipment-item-row">
                        <div className="item-image-wrapper">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="item-img"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                            }}
                          />
                        </div>

                        <div className="item-info-col">
                          <span className="item-brand-tag">{item.product.brand}</span>
                          <h4 className="item-product-name">{item.product.name}</h4>
                          <div className="item-specs-row">
                            <span className="spec-badge">Size: <strong>UK {item.size}</strong></span>
                            <span className="spec-badge">Color: <strong>{item.color}</strong></span>
                            <span className="spec-badge">Qty: <strong>{item.quantity}</strong></span>
                          </div>
                        </div>

                        <div className="item-status-price-col">
                          <span className="item-shipped-badge">
                            <span className="shipped-dot"></span>
                            <span>SHIPPED</span>
                          </span>
                          <strong className="item-price-val">{formatZAR(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

          </main>
        </div>

      </div>
    </div>
  );
};

export default DeliveryPage;
