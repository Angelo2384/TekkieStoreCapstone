import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { paymentService } from '../services/paymentService';
import { SAVED_SHIPPING_KEY, setAppliedPromo } from '../utils/checkoutUtils';
import './CheckoutPage.css';

const CHECK_EVERY_MS = 3000;
const MAX_CHECKS = 10;

// Coming back here proves nothing, so the backend asks Paystack before any order is created
export const PaymentReturn: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCart } = useCart();
  const { refreshOrders } = useOrder();
  const cancelled = location.pathname.startsWith('/payment/cancel');
  const [status, setStatus] = useState<'checking' | 'paid' | 'failed' | 'waiting'>('checking');
  const [checkRound, setCheckRound] = useState(0);

  useEffect(() => {
    if (cancelled || !orderId) return;

    let checks = 0;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const checkPayment = async () => {
      try {
        // The delivery address the checkout page saved while the shopper typed it
        const shipping = JSON.parse(localStorage.getItem(SAVED_SHIPPING_KEY) || '{}');
        const result = await paymentService.verifyPayment(orderId, shipping);
        if (stopped) return;

        if (result.status === 'PAID') {
          setStatus('paid');
          setAppliedPromo(null);
          await Promise.all([refreshCart(), refreshOrders()]);
          navigate(`/order-confirmation/${orderId}`, { replace: true });
          return;
        }
        if (result.status === 'FAILED') {
          setStatus('failed');
          return;
        }
      } catch (err) {
        console.warn('[PaymentReturn] Could not confirm payment yet:', err);
        if (stopped) return;
      }

      // Still processing (or a hiccup reaching the server): try again shortly
      if (++checks < MAX_CHECKS) {
        timer = setTimeout(checkPayment, CHECK_EVERY_MS);
      } else {
        setStatus('waiting');
      }
    };

    // Started on a timer so React's development double-render cancels the first one instead of sending two requests
    timer = setTimeout(checkPayment, 0);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [orderId, cancelled, checkRound]);

  const checkAgain = () => {
    setStatus('checking');
    setCheckRound((round) => round + 1);
  };

  let icon = <Loader2 size={40} className="confirmation-check-icon" />;
  let title = 'CONFIRMING PAYMENT';
  let message = 'Checking your payment with Paystack. This only takes a moment.';

  if (cancelled) {
    icon = <XCircle size={40} className="confirmation-check-icon" />;
    title = 'PAYMENT CANCELLED';
    message = 'You cancelled on Paystack, so nothing was charged. Your cart is still saved.';
  } else if (status === 'paid') {
    icon = <CheckCircle2 size={40} className="confirmation-check-icon" />;
    title = 'PAYMENT RECEIVED';
    message = 'Thank you! Taking you to your order...';
  } else if (status === 'failed') {
    icon = <XCircle size={40} className="confirmation-check-icon" />;
    title = 'PAYMENT NOT COMPLETED';
    message = 'Paystack did not complete this payment, so nothing was charged. Your cart is still saved.';
  } else if (status === 'waiting') {
    icon = <Clock size={40} className="confirmation-check-icon" />;
    title = 'STILL CONFIRMING';
    message = "We couldn't confirm your payment yet. If you completed it, check again in a moment.";
  }

  return (
    <div className="checkout-page">
      <main className="checkout-body-section">
        <div className="checkout-container">
          <div className="order-confirmation-wrapper">
            <div className="order-confirmation-card" aria-live="polite">
              <div className="confirmation-badge-circle">{icon}</div>
              <span className="confirmation-eyebrow">PAYSTACK TEST MODE · ORDER {orderId}</span>
              <h1 className="confirmation-title">{title}</h1>
              <p className="confirmation-message">{message}</p>

              <div className="confirmation-actions">
                {status === 'waiting' && !cancelled && (
                  <button type="button" className="btn-back-home" onClick={checkAgain}>
                    Check again
                  </button>
                )}
                {(cancelled || status === 'failed') && (
                  <Link to="/checkout" className="btn-back-home">
                    Try again
                  </Link>
                )}
                <Link to="/cart" className="btn-view-tracking">
                  Back to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
