import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop, type UserAddress } from '../context/ShopContext';
import { Avatar } from '../components/ui';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, orders, updateProfile, updateAddress, logout } = useShop();

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState<'personal' | 'orders'>('personal');

  const handleSelectTab = (tab: 'personal' | 'orders') => {
    setActiveTab(tab);
    const targetId = tab === 'personal' ? 'personal-info' : 'recent-orders';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Edit Mode States
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null);

  // Form States for Profile
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [shoeSize, setShoeSize] = useState<number>(user.shoeSize);
  const [gender, setGender] = useState<string>(user.gender);

  // Form States for Address
  const [street, setStreet] = useState<string>(user.address.street);
  const [apartment, setApartment] = useState<string>(user.address.apartment || '');
  const [city, setCity] = useState<string>(user.address.city);
  const [province, setProvince] = useState<string>(user.address.province);
  const [postalCode, setPostalCode] = useState<string>(user.address.postalCode);
  const [country, setCountry] = useState<string>(user.address.country);
  const [instructions, setInstructions] = useState<string>(user.address.instructions || '');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      phone,
      shoeSize,
      gender
    });
    setIsEditingProfile(false);
    showToast('Personal information updated successfully!');
  };

  // Save Address Changes
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Partial<UserAddress> = {
      street,
      apartment,
      city,
      province,
      postalCode,
      country,
      instructions
    };
    updateAddress(updated);
    setIsEditingAddress(false);
    showToast('Default delivery address updated!');
  };

  // Handle Logout
  const handleSignOut = () => {
    logout();
    showToast('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  // Format ZAR currency
  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Breadcrumb */}
        <nav className="profile-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">My Account</span>
        </nav>

        {/* Main 2-Column Grid Layout */}
        <div className="profile-content-grid">

          {/* LEFT: Profile Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-user-summary-card">
              <div className="user-avatar-wrap">
                <Avatar
                  alt={`${user.firstName} ${user.lastName}`}
                  initials={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  size="lg"
                  className="profile-main-avatar"
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
            <nav className="profile-nav-menu" aria-label="Account navigation">
              <button
                type="button"
                className={`profile-nav-item ${activeTab === 'personal' ? 'is-active' : ''}`}
                onClick={() => handleSelectTab('personal')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Profile</span>
              </button>

              <button
                type="button"
                className={`profile-nav-item ${activeTab === 'orders' ? 'is-active' : ''}`}
                onClick={() => handleSelectTab('orders')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span>Order History</span>
              </button>

              <Link to="/delivery" className="profile-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Delivery</span>
              </Link>

              <Link to="/wishlist" className="profile-nav-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Wishlist</span>
              </Link>

              <div className="nav-menu-divider"></div>

              <button
                type="button"
                className="profile-nav-item logout-btn"
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

          {/* RIGHT: Main Profile Content Area */}
          <main className="profile-main-content">

            {/* 1. PERSONAL INFORMATION SECTION */}
            <section className="profile-section-card" id="personal-info">
              <div className="section-card-header">
                <div>
                  <h3 className="section-card-title">PERSONAL INFORMATION</h3>
                  <p className="section-card-subtitle">Manage your personal details, contact info and sneaker preferences.</p>
                </div>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Edit Info</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="card-action-btn cancel-btn"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="info-display-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{user.firstName} {user.lastName}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <div className="info-value-with-badge">
                      <span className="info-value">{user.email}</span>
                      <span className="verified-chip">✓ Verified</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{user.phone}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Preferred Sneaker Size</span>
                    <span className="info-value badge-highlight">UK {user.shoeSize}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value">{user.gender}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">{user.birthDate}</span>
                  </div>
                </div>
              ) : (
                /* Editable Form */
                <form onSubmit={handleSaveProfile} className="profile-edit-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        type="text"
                        className="form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="lastName">Last Name</label>
                      <input
                        id="lastName"
                        type="text"
                        className="form-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="text"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label" htmlFor="shoeSize">Preferred Sneaker Size (UK)</label>
                      <select
                        id="shoeSize"
                        className="form-select"
                        value={shoeSize}
                        onChange={(e) => setShoeSize(Number(e.target.value))}
                      >
                        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12].map((s) => (
                          <option key={s} value={s}>UK {s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        className="form-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex / Prefer not to say">Unisex / Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-form-btn"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 2. DEFAULT ADDRESS SECTION */}
            <section className="profile-section-card" id="default-address">
              <div className="section-card-header">
                <div>
                  <h3 className="section-card-title">DEFAULT ADDRESS</h3>
                  <p className="section-card-subtitle">Your primary delivery destination for sneaker drops and checkout.</p>
                </div>
                {!isEditingAddress ? (
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Edit Address</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="card-action-btn cancel-btn"
                    onClick={() => setIsEditingAddress(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingAddress ? (
                <div className="address-display-card">
                  <div className="address-badge-row">
                    <span className="address-default-badge">DEFAULT SHIPPING DESTINATION</span>
                    <span className="address-country-flag">🇿🇦 South Africa</span>
                  </div>

                  <div className="address-details-body">
                    <h4 className="address-recipient-name">{user.firstName} {user.lastName}</h4>
                    <p className="address-line">{user.address.street}</p>
                    {user.address.apartment && (
                      <p className="address-line">{user.address.apartment}</p>
                    )}
                    <p className="address-line">
                      {user.address.city}, {user.address.province}, {user.address.postalCode}
                    </p>
                    <p className="address-line country-name">{user.address.country}</p>
                    
                    <div className="address-contact-meta">
                      <span className="meta-label">Phone:</span>
                      <span className="meta-val">{user.phone}</span>
                    </div>

                    {user.address.instructions && (
                      <div className="delivery-instruction-box">
                        <span className="instruction-icon">📌</span>
                        <span className="instruction-text">{user.address.instructions}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Editable Address Form */
                <form onSubmit={handleSaveAddress} className="address-edit-form">
                  <div className="form-group">
                    <label className="form-label" htmlFor="street">Street Address</label>
                    <input
                      id="street"
                      type="text"
                      className="form-input"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="apartment">Apartment, Suite, Unit, Building (Optional)</label>
                    <input
                      id="apartment"
                      type="text"
                      className="form-input"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                    />
                  </div>

                  <div className="form-grid-3">
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        className="form-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="province">Province</label>
                      <select
                        id="province"
                        className="form-select"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                      >
                        <option value="Western Cape">Western Cape</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="postalCode">Postal Code</label>
                      <input
                        id="postalCode"
                        type="text"
                        className="form-input"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Country</label>
                    <input
                      id="country"
                      type="text"
                      className="form-input"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="instructions">Courier Delivery Instructions</label>
                    <textarea
                      id="instructions"
                      className="form-textarea"
                      rows={2}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Leave with building security, dial 402 on intercom..."
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="save-btn">
                      Update Address
                    </button>
                    <button
                      type="button"
                      className="cancel-form-btn"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 3. RECENT ORDERS SECTION */}
            <section className="profile-section-card" id="recent-orders">
              <div className="section-card-header">
                <div>
                  <h3 className="section-card-title">RECENT ORDERS</h3>
                  <p className="section-card-subtitle">Track deliveries, inspect invoices, and reorder previous drops.</p>
                </div>
                <Link to="/order-history" className="view-all-orders-link">
                  View Full Order History &rarr;
                </Link>
              </div>

              <div className="orders-list">
                {orders.map((order) => (
                  <article key={order.id} className="order-card-row">
                    <div className="order-card-top-bar">
                      <div className="order-id-date">
                        <span className="order-id-number">{order.id}</span>
                        <span className="order-date-text">Placed on {order.date}</span>
                      </div>

                      <div className="order-status-pill delivered">
                        <span className="status-dot"></span>
                        <span>{order.status}</span>
                      </div>
                    </div>

                    {/* Items Grid Preview */}
                    <div className="order-items-preview-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-chip">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="order-item-thumb"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/Air Force 1 orange & white.png';
                            }}
                          />
                          <div className="order-item-desc">
                            <span className="item-name">{item.product.name}</span>
                            <span className="item-meta">Size UK {item.size} • {item.color} • Qty {item.quantity}</span>
                          </div>
                          <span className="item-price">{formatZAR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer & Actions */}
                    <div className="order-card-footer">
                      <div className="order-total-summary">
                        <span className="order-total-label">Total Paid</span>
                        <span className="order-total-val">{formatZAR(order.total)}</span>
                      </div>

                      <div className="order-actions-buttons">
                        <button
                          type="button"
                          className="order-action-btn secondary-btn"
                          onClick={() => setSelectedOrderForTracking(order.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 14 14"></polyline>
                          </svg>
                          <span>Track Shipment</span>
                        </button>

                        <button
                          type="button"
                          className="order-action-btn primary-btn"
                          onClick={() => {
                            showToast(`Order receipt for ${order.id} downloaded!`);
                          }}
                        >
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

          </main>
        </div>

      </div>

      {/* Tracking Modal Dialog */}
      {selectedOrderForTracking && (
        <div className="tracking-modal-overlay" role="dialog" aria-modal="true">
          <div className="tracking-modal-card">
            <div className="modal-header">
              <div className="tracking-header-icon">📦</div>
              <div>
                <h3 className="modal-title">TRACK SHIPMENT</h3>
                <p className="modal-subtitle">Tracking ID: RAM-ZA-8920194 • Standard Express Courier</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedOrderForTracking(null)}
                aria-label="Close tracking modal"
              >
                ✕
              </button>
            </div>

            <div className="tracking-steps-container">
              <div className="tracking-step is-complete">
                <div className="step-marker">✓</div>
                <div className="step-details">
                  <span className="step-title">Order Confirmed & Paid</span>
                  <span className="step-time">22 August 2026 • 10:15 AM</span>
                </div>
              </div>

              <div className="tracking-step is-complete">
                <div className="step-marker">✓</div>
                <div className="step-details">
                  <span className="step-title">Inspected & Authenticated</span>
                  <span className="step-time">22 August 2026 • 02:45 PM</span>
                </div>
              </div>

              <div className="tracking-step is-complete">
                <div className="step-marker">✓</div>
                <div className="step-details">
                  <span className="step-title">Dispatched from Cape Town Warehouse</span>
                  <span className="step-time">23 August 2026 • 08:30 AM</span>
                </div>
              </div>

              <div className="tracking-step is-complete">
                <div className="step-marker">✓</div>
                <div className="step-details">
                  <span className="step-title">Delivered to Recipient</span>
                  <span className="step-time">23 August 2026 • 01:20 PM</span>
                  <span className="step-location">123 Bree Street, Cape Town (Signed by: J. Doe)</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="close-tracking-btn"
                onClick={() => setSelectedOrderForTracking(null)}
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="profile-toast" role="alert">
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

export default ProfilePage;
