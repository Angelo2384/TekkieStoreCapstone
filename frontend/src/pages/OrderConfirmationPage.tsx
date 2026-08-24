import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  // Hardcoded data structure representing the order
  const orderData = {
    orderNumber: '#TK-88291',
    orderDate: 'Oct 24, 2024',
    paymentReference: 'VISA-4921',
    total: 'R4,230.00',
    product: {
      name: 'AIR MAX ELITE "NEON PULSE"',
      size: '10.5 US',
      quantity: 1,
      price: 'R4,230.00',
      image: '/Air Force 1 orange & white.png' // Fallback to available asset
    },
    delivery: {
      estimatedArrival: 'Oct 28 - 30',
      name: 'John Doe',
      address: [
        '123 Sneaker Avenue',
        'Apt 4B',
        'New York, NY 10012'
      ]
    }
  };

  return (
    <div className="order-conf-page">
      <main className="order-conf-container">
        
        {/* Header / Confirmation Section */}
        <section className="order-conf-header">
          <div className="order-conf-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 className="order-conf-title">ORDER CONFIRMED</h1>
          <p className="order-conf-subtitle">
            Thank you for your purchase. We've sent a confirmation email<br />
            with all the details.
          </p>
        </section>

        {/* Order Information Card */}
        <section className="order-info-card">
          <div className="info-column">
            <span className="info-label">ORDER NUMBER</span>
            <span className="info-value">{orderData.orderNumber}</span>
          </div>
          <div className="info-column">
            <span className="info-label">ORDER DATE</span>
            <span className="info-value">{orderData.orderDate}</span>
          </div>
          <div className="info-column">
            <span className="info-label">PAYMENT REF</span>
            <span className="info-value">{orderData.paymentReference}</span>
          </div>
          <div className="info-column">
            <span className="info-label">TOTAL AMOUNT</span>
            <span className="info-value highlight">{orderData.total}</span>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="order-main-grid">
          
          {/* Left Card: Order Summary */}
          <div className="summary-card">
            <h2 className="card-title">ORDER SUMMARY</h2>
            <hr className="card-divider" />
            
            <div className="product-row">
              <div className="product-image-box">
                <img src={orderData.product.image} alt={orderData.product.name} />
              </div>
              
              <div className="product-details">
                <span className="product-name">{orderData.product.name}</span>
                <span className="product-meta">Size: {orderData.product.size} | Qty: {orderData.product.quantity}</span>
              </div>
              
              <div className="product-price">
                {orderData.product.price}
              </div>
            </div>
          </div>

          {/* Right Card: Delivery */}
          <div className="delivery-card">
            <h2 className="card-title">DELIVERY</h2>
            <hr className="card-divider" />
            
            <div className="delivery-section">
              <span className="delivery-label">ESTIMATED ARRIVAL</span>
              <span className="delivery-date">{orderData.delivery.estimatedArrival}</span>
            </div>
            
            <div className="delivery-section shipping-section">
              <span className="delivery-label">SHIPPING TO</span>
              <div className="delivery-address">
                <p>{orderData.delivery.name}</p>
                {orderData.delivery.address.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="order-actions">
          <button 
            type="button" 
            className="btn-track"
            onClick={() => navigate('/track-order')}
          >
            TRACK MY ORDER
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="truck-icon">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </button>
          
          <button 
            type="button" 
            className="btn-continue"
            onClick={() => navigate('/catalogue')}
          >
            CONTINUE SHOPPING
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="order-conf-footer">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <h2>TEKKIES</h2>
            <p>© 2024 TEKKIES. ALL RIGHTS<br />RESERVED.</p>
          </div>
          <div className="footer-col">
            <a href="/shop">Shop</a>
            <a href="/support">Support</a>
          </div>
          <div className="footer-col">
            <a href="/returns">Returns</a>
            <a href="/privacy">Privacy</a>
          </div>
          <div className="footer-col">
            <a href="/terms">Terms</a>
            <a href="/editorial">Editorial</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default OrderConfirmationPage;
