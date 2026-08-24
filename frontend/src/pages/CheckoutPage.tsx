import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useShop();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobile: '',
    streetNum: '',
    streetName: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const formatZAR = (amount: number) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      navigate('/order-confirmation');
    }, 1500);
  };



  // Define first item for the mock-up summary display if cart is not empty
  const summaryItem = cartItems.length > 0 ? cartItems[0] : null;

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="checkout-logo-container" onClick={() => navigate('/')}>
          <span className="checkout-logo-icon">T.</span>
          <span className="checkout-logo-text">TEKKIES</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="checkout-main">
        <div className="checkout-content-grid">
          
          {/* Left Column: Forms */}
          <div className="checkout-form-column">
            <div className="checkout-page-header">
              <h1 className="checkout-title">Secure Checkout</h1>
              <p className="checkout-subtitle">Please complete your details below to finalize your order.</p>
            </div>

            <hr className="checkout-divider" />

            <form onSubmit={handleSubmit} className="checkout-form" id="checkout-form">
              {/* Customer Information */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <span className="section-icon">👤</span> Customer Information
                </h2>
                
                <div className="form-row-3">
                  <div className="input-group">
                    <label htmlFor="firstName">FIRST NAME</label>
                    <input type="text" id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="middleName">MIDDLE NAME</label>
                    <input type="text" id="middleName" name="middleName" placeholder="Optional" value={formData.middleName} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">LAST NAME</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-row-2">
                  <div className="input-group">
                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <input type="email" id="email" name="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="mobile">MOBILE NUMBER</label>
                    <input type="tel" id="mobile" name="mobile" placeholder="+27 82 123 4567" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                </div>
              </section>

              <hr className="checkout-divider" />

              {/* Shipping Address */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <span className="section-icon">🚚</span> Shipping Address
                </h2>
                
                <div className="form-row-2">
                  <div className="input-group">
                    <label htmlFor="streetNum">STREET NUMBER</label>
                    <input type="text" id="streetNum" name="streetNum" placeholder="42" value={formData.streetNum} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="streetName">STREET NAME</label>
                    <input type="text" id="streetName" name="streetName" placeholder="Sneakerhead Ave" value={formData.streetName} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-row-2">
                  <div className="input-group">
                    <label htmlFor="suburb">SUBURB</label>
                    <input type="text" id="suburb" name="suburb" placeholder="Rosebank" value={formData.suburb} onChange={handleInputChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="city">CITY</label>
                    <input type="text" id="city" name="city" placeholder="Johannesburg" value={formData.city} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-row-2">
                  <div className="input-group">
                    <label htmlFor="province">PROVINCE</label>
                    <select id="province" name="province" value={formData.province} onChange={handleInputChange} required>
                      <option value="" disabled>Select Province</option>
                      <option value="Eastern Cape">Eastern Cape</option>
                      <option value="Free State">Free State</option>
                      <option value="Gauteng">Gauteng</option>
                      <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                      <option value="Limpopo">Limpopo</option>
                      <option value="Mpumalanga">Mpumalanga</option>
                      <option value="North West">North West</option>
                      <option value="Northern Cape">Northern Cape</option>
                      <option value="Western Cape">Western Cape</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="postalCode">POSTAL CODE</label>
                    <input type="text" id="postalCode" name="postalCode" placeholder="2196" value={formData.postalCode} onChange={handleInputChange} required />
                  </div>
                </div>
              </section>

              <hr className="checkout-divider" />

              {/* Payment Method */}
              <section className="checkout-section">
                <h2 className="section-title">
                  <span className="section-icon">💳</span> Payment Method
                </h2>
                
                <div className="payment-options">
                  <label className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <div className="payment-card-header">
                      <div className="radio-group">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="card" 
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')} 
                        />
                        <span>Credit / Debit Card</span>
                      </div>
                      <span className="payment-icon">💳</span>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="payment-details">
                        <div className="input-group">
                          <input type="text" placeholder="Card Number" maxLength={19} required={paymentMethod === 'card'} />
                        </div>
                        <div className="form-row-2">
                          <div className="input-group">
                            <input type="text" placeholder="MM/YY" maxLength={5} required={paymentMethod === 'card'} />
                          </div>
                          <div className="input-group">
                            <input type="text" placeholder="CVC" maxLength={4} required={paymentMethod === 'card'} />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  <label className={`payment-card ${paymentMethod === 'apple_pay' ? 'selected' : ''}`}>
                    <div className="payment-card-header">
                      <div className="radio-group">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="apple_pay" 
                          checked={paymentMethod === 'apple_pay'}
                          onChange={() => setPaymentMethod('apple_pay')} 
                        />
                        <span>Apple Pay</span>
                      </div>
                      <span className="payment-icon">Pay</span>
                    </div>
                  </label>
                </div>
              </section>

              <div className="submit-section-mobile">
                <hr className="checkout-divider" />
                <button type="submit" className="submit-order-btn" disabled={isSubmitting || cartItems.length === 0}>
                  {isSubmitting ? 'PROCESSING...' : '🔒 PLACE SECURE ORDER'}
                </button>
                <p className="terms-text">BY PLACING YOUR ORDER, YOU AGREE TO OUR<br/>TERMS & CONDITIONS.</p>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-column">
            <div className="order-summary-box">
              <h2 className="summary-box-title">ORDER SUMMARY</h2>
              
              {summaryItem ? (
                <div className="summary-product">
                  <div className="summary-product-img-wrapper">
                    <img src={summaryItem.product.image} alt={summaryItem.product.name} />
                  </div>
                  <div className="summary-product-details">
                    <div className="product-info-top">
                      <span className="product-name">{summaryItem.product.name}</span>
                      <span className="product-price">{formatZAR(summaryItem.product.price)}</span>
                    </div>
                    <span className="product-size">Size: {summaryItem.size}</span>
                    <span className="product-qty">Quantity: {summaryItem.quantity}</span>
                  </div>
                </div>
              ) : (
                <p className="empty-cart-msg">Your cart is empty.</p>
              )}

              <hr className="summary-divider" />

              <div className="summary-line-items">
                <div className="line-item">
                  <span>Subtotal</span>
                  <span>{formatZAR(subtotal)}</span>
                </div>
                <div className="line-item">
                  <span>Shipping</span>
                  <span>{shipping === 0 && subtotal > 0 ? 'Calculated at next step' : formatZAR(shipping)}</span>
                </div>
                <div className="line-item">
                  <span>Taxes (15% VAT included)</span>
                  <span>{formatZAR(tax)}</span>
                </div>
              </div>

              <hr className="summary-divider" />

              <div className="summary-total">
                <span className="total-label">TOTAL</span>
                <span className="total-value">{formatZAR(total)}</span>
              </div>

              <div className="submit-section-desktop">
                <button 
                  type="button" 
                  className="submit-order-btn" 
                  onClick={() => {
                    const form = document.getElementById('checkout-form') as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }}
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? 'PROCESSING...' : '🔒 PLACE SECURE ORDER'}
                </button>
                <p className="terms-text">BY PLACING YOUR ORDER, YOU AGREE TO OUR<br/>TERMS & CONDITIONS.</p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="checkout-footer">
        <p>© 2024 TEKKIES. ALL RIGHTS RESERVED. SECURE CHECKOUT.</p>
      </footer>
    </div>
  );
};

export default CheckoutPage;
