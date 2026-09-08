import api from './api';

export interface BackendOrderItem {
  orderItemId: string;
  shoeId: string;
  shoeName: string;
  brand: string;
  size: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface BackendOrderCustomer {
  customerId: string;
  email?: string;
  name?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
  mobileNumber?: string;
}

export interface BackendOrder {
  orderId: string;
  orderDate: string | number;
  subtotal: number;
  shippingFee: number;
  vat: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  status: string;
  customer: BackendOrderCustomer;
  orderItems: BackendOrderItem[];
}

export interface CreateOrderPayload {
  orderId: string;
  orderDate?: string;
  subtotal: number;
  shippingFee: number;
  vat: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  status?: string;
  customer: {
    customerId: string;
  };
  orderItems: BackendOrderItem[];
}

/**
 * Maps backend OrderStatus enum strings to user-friendly UI status labels.
 * Section 27 requirement:
 * PENDING -> Order Confirmed
 * PAID / PACKED -> Processing
 * SHIPPED -> Dispatched
 * DELIVERED -> Delivered
 * CANCELLED -> Cancelled
 */
export const formatOrderStatus = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'Order Confirmed';
    case 'PAID':
    case 'PACKED':
      return 'Processing';
    case 'SHIPPED':
      return 'Dispatched';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status || 'Order Confirmed';
  }
};

export const orderService = {
  /**
   * Submits a new Order with connected Customer reference and OrderItems to Spring Boot.
   * Endpoint: POST /order/create
   */
  createOrder: async (payload: CreateOrderPayload): Promise<BackendOrder> => {
    const response = await api.post<BackendOrder>('/order/create', payload);
    return response.data;
  },

  /**
   * Retrieves an Order by its ID from Spring Boot.
   * Endpoint: GET /order/read/{id}
   */
  getOrderById: async (orderId: string): Promise<BackendOrder | null> => {
    try {
      const response = await api.get<BackendOrder>(`/order/read/${encodeURIComponent(orderId)}`);
      return response.data;
    } catch (error) {
      console.warn(`[orderService] Failed to load order ${orderId}:`, error);
      return null;
    }
  },

  /**
   * Retrieves all Orders belonging to a specific Customer.
   * Endpoint: GET /order/customer/{customerId}
   */
  getOrdersByCustomerId: async (customerId: string): Promise<BackendOrder[]> => {
    try {
      const response = await api.get<BackendOrder[]>(`/order/customer/${encodeURIComponent(customerId)}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn(`[orderService] Failed to load orders for customer ${customerId}:`, error);
      return [];
    }
  },
};
