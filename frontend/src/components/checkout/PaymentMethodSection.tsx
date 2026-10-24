import React from 'react';
import { ShieldCheck } from 'lucide-react';

// Card details are entered on Paystack's own page, so this store never sees or stores them
export const PaymentMethodSection: React.FC = () => {
  return (
    <section className="checkout-card payment-card" aria-labelledby="payment-heading">
      <div className="card-header">
        <h2 id="payment-heading" className="card-title">
          PAYMENT METHOD
        </h2>
      </div>

      <div className="payment-options-container">
        <div className="payment-option-box selected">
          <div className="payment-option-header">
            <div className="payment-radio-left">
              <span className="custom-radio checked" aria-hidden="true">
                <span className="radio-dot" />
              </span>
              <div className="payment-option-title-group">
                <span className="payment-option-title">Paystack (Test mode)</span>
                <span className="payment-option-desc">Pay by card on Paystack's secure page</span>
              </div>
            </div>
            <ShieldCheck size={22} aria-hidden="true" />
          </div>

          <div className="eft-info-box">
            <p className="eft-instruction-text">
              When you click <strong>Pay with Paystack</strong>, you will be taken to Paystack to complete your
              payment. This is a test environment, so <strong>no real money is charged</strong>. Use one of these test
              cards with any future expiry date:
            </p>
            <ul className="eft-instruction-text">
              <li>
                <strong>Quick payment:</strong> 4084 0840 8408 4081, CVV 408
              </li>
              <li>
                <strong>With bank PIN &amp; OTP steps:</strong> 5060 6666 6666 6666 666, CVV 123, PIN 1234, OTP 123456
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
