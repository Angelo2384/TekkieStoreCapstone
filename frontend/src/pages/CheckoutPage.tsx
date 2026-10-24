import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ShippingAddressSection,
  ShippingAddressData,
  ShippingAddressErrors,
} from '../components/checkout/ShippingAddressSection';
import { PaymentMethodSection } from '../components/checkout/PaymentMethodSection';
import { ShipmentMethodCard } from '../components/checkout/ShipmentMethodCard';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';
import { paymentService } from '../services/paymentService';
import { SAVED_SHIPPING_KEY } from '../utils/checkoutUtils';
import './CheckoutPage.css';

const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_FEE = 150;
// The old card form saved card details under these keys
const OLD_SAVED_CARD_KEYS = ['tekkie_store_saved_payment', 'tekkie_store_saved_payment_method'];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotal } = useCart();
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user || !user.customerId) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Shipping Form State (Restores previously saved shipping details if available)
  const [shippingData, setShippingData] = useState<ShippingAddressData>(() => {
    try {
      const saved = localStorage.getItem(SAVED_SHIPPING_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved shipping address', e);
    }
    return {
      fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      phone: user?.phone || '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
    };
  });
  const [shippingErrors, setShippingErrors] = useState<ShippingAddressErrors>({});
  const [shippingTouched, setShippingTouched] = useState<Record<string, boolean>>({});

  // Persist shipping details in localStorage for client caching
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SHIPPING_KEY, JSON.stringify(shippingData));
    } catch (e) {
      console.error('Failed to persist shipping details', e);
    }
  }, [shippingData]);

  // Card details must never sit in the browser; Paystack collects them now, so delete any old copies
  useEffect(() => {
    OLD_SAVED_CARD_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainFormRef = useRef<HTMLDivElement>(null);

  // Back from Paystack can restore this page with the button still disabled
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsSubmitting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // Financial Calculations: Total = Subtotal + Shipping (No VAT during checkout)
  const subtotal = cartTotal;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;

  // Real-time Shipping Validation Logic
  const validateShippingField = (
    field: keyof ShippingAddressData,
    value?: string
  ): string | undefined => {
    const trimmed = (value || '').trim();

    switch (field) {
      case 'fullName': {
        if (!trimmed) return 'Please enter your full name.';
        if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
        return undefined;
      }
      case 'phone': {
        if (!trimmed) return 'Please enter your phone number.';
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length < 10) {
          return 'Phone number must have at least 10 digits.';
        }
        return undefined;
      }
      case 'streetNumber': {
        if (!trimmed) return 'Please enter your street number.';
        // Allows digits and optional single letter suffix like 42 or 42A
        if (!/^\d+[a-zA-Z]?$/.test(trimmed)) {
          return 'Please enter a valid street number (e.g. 42 or 42A).';
        }
        return undefined;
      }
      case 'streetName': {
        if (!trimmed) return 'Please enter your street name.';
        if (trimmed.length < 2) return 'Street name must be at least 2 characters.';
        // Must not be purely numbers
        if (/^\d+$/.test(trimmed)) {
          return 'Street name cannot contain only numbers.';
        }
        return undefined;
      }
      case 'suburb': {
        if (!trimmed) return 'Please enter your suburb.';
        if (/^\d+$/.test(trimmed)) {
          return 'Suburb cannot contain only numbers.';
        }
        return undefined;
      }
      case 'city': {
        if (!trimmed) return 'Please enter your city.';
        // No numbers allowed in city
        if (/\d/.test(trimmed)) {
          return 'City cannot contain numbers.';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
          return 'Please enter a valid city name.';
        }
        return undefined;
      }
      case 'province': {
        if (!trimmed) return 'Please select your province.';
        return undefined;
      }
      case 'postalCode': {
        if (!trimmed) return 'Please enter your 4-digit postal code.';
        if (!/^\d{4}$/.test(trimmed)) {
          return 'Postal code must contain exactly 4 digits.';
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleShippingChange = (field: keyof ShippingAddressData, value: string) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
    if (shippingTouched[field]) {
      const error = validateShippingField(field, value);
      setShippingErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleShippingBlur = (field: keyof ShippingAddressData) => {
    setShippingTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateShippingField(field, shippingData[field]);
    setShippingErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Full Form Validation & Checkout Submission
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checking out.');
      return;
    }

    const newShippingErrors: ShippingAddressErrors = {};
    const newShippingTouched: Record<string, boolean> = {};
    let isShippingValid = true;

    (Object.keys(shippingData) as Array<keyof ShippingAddressData>).forEach((field) => {
      newShippingTouched[field] = true;
      const error = validateShippingField(field, shippingData[field]);
      if (error) {
        newShippingErrors[field] = error;
        isShippingValid = false;
      }
    });

    setShippingTouched(newShippingTouched);
    setShippingErrors(newShippingErrors);

    if (!isShippingValid) {
      const firstInvalidElement = document.querySelector('.input-error, [aria-invalid="true"]');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInvalidElement as HTMLElement).focus();
      }
      return;
    }

    // Nothing is saved until Paystack confirms payment, so Back or Cancel leaves the cart untouched
    setIsSubmitting(true);

    try {
      const checkout = await paymentService.startCheckout();
      window.location.href = checkout.authorizationUrl;
    } catch (err: any) {
      console.error('[CheckoutPage] Checkout submission error:', err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        alert(err?.response?.data?.message || err.message || 'Unable to start payment. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <section className="checkout-header-section">
        <div className="checkout-container">
          <div className="checkout-header-content">
            <span className="checkout-eyebrow">CHECKOUT & PAYMENT</span>
            <h1 className="checkout-main-title">SECURE CHECKOUT</h1>
            <p className="checkout-header-subtitle">
              Please complete your shipping address below, then pay securely on Paystack.
            </p>
          </div>
        </div>
      </section>

      <div className="checkout-container">
        <div className="checkout-breadcrumb-bar">
          <nav className="checkout-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="checkout-breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="checkout-breadcrumb-separator">/</span>
            <span className="checkout-breadcrumb-current">Secure Checkout</span>
          </nav>
        </div>
      </div>

      <main className="checkout-body-section" ref={mainFormRef}>
        <div className="checkout-container">
          <div className="checkout-layout-grid">
            {/* LEFT COLUMN: Shipping + Payment + Shipment Method */}
            <div className="checkout-main-column">
              {/* Shipping Address Section */}
              <ShippingAddressSection
                formData={shippingData}
                errors={shippingErrors}
                touched={shippingTouched}
                onChange={handleShippingChange}
                onBlur={handleShippingBlur}
              />

              {/* Payment Method Section */}
              <PaymentMethodSection />

              {/* Shipment Method Card */}
              <ShipmentMethodCard />
            </div>

            {/* RIGHT COLUMN: Order Summary Card */}
            <div className="checkout-summary-column">
              <CheckoutOrderSummary
                cart={cart}
                cartCount={cartCount}
                subtotal={subtotal}
                shippingFee={shippingFee}
                finalTotal={finalTotal}
                isSubmitting={isSubmitting}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
