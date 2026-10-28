import api from './api';
import { ShippingAddressData } from '../components/checkout/ShippingAddressSection';

export interface PaystackCheckout {
  orderId: string;
  authorizationUrl: string;
}

export interface PaymentResult {
  orderId: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
}

export const paymentService = {
  /**
   * Starts a Paystack payment for the logged-in user's cart; the backend decides the price,
   * including the promo discount after checking the code itself.
   * Endpoint: POST /payments/paystack/checkout
   */
  startCheckout: async (promoCode: string | null = null): Promise<PaystackCheckout> => {
    const response = await api.post<PaystackCheckout>('/payments/paystack/checkout', { promoCode });
    return response.data;
  },

  /**
   * Confirms the payment with Paystack and, if paid, creates the order with this delivery address.
   * Endpoint: POST /payments/paystack/verify/{orderId}
   */
  verifyPayment: async (orderId: string, shipping: ShippingAddressData): Promise<PaymentResult> => {
    const response = await api.post<PaymentResult>(
      `/payments/paystack/verify/${encodeURIComponent(orderId)}`,
      shipping
    );
    return response.data;
  },
};
