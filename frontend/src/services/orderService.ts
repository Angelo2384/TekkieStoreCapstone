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
  vat?: number;
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
  vat?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  status?: string;
  customer: {
    customerId: string;
  };
  orderItems: BackendOrderItem[];
}

export type BackendOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderStatusConfig {
  status: BackendOrderStatus;
  label: string;
  queueLabel: string;
  badgeClass: string;
}

export const ORDER_STATUS_CONFIGS: Record<BackendOrderStatus, OrderStatusConfig> = {
  PENDING: {
    status: 'PENDING',
    label: 'Order Confirmed',
    queueLabel: 'New',
    badgeClass: 'status-badge-pending',
  },
  PAID: {
    status: 'PAID',
    label: 'Payment Received',
    queueLabel: 'Paid',
    badgeClass: 'status-badge-paid',
  },
  PACKED: {
    status: 'PACKED',
    label: 'Packed',
    queueLabel: 'Ready to Pack',
    badgeClass: 'status-badge-packed',
  },
  SHIPPED: {
    status: 'SHIPPED',
    label: 'Dispatched',
    queueLabel: 'In Transit',
    badgeClass: 'status-badge-shipped',
  },
  DELIVERED: {
    status: 'DELIVERED',
    label: 'Delivered',
    queueLabel: 'Delivered',
    badgeClass: 'status-badge-delivered',
  },
  CANCELLED: {
    status: 'CANCELLED',
    label: 'Cancelled',
    queueLabel: 'Cancelled',
    badgeClass: 'status-badge-cancelled',
  },
};

export const getOrderStatusConfig = (status?: string): OrderStatusConfig => {
  const normalized = (status || '').toUpperCase() as BackendOrderStatus;
  return (
    ORDER_STATUS_CONFIGS[normalized] || {
      status: 'PENDING',
      label: status || 'Order Confirmed',
      queueLabel: status || 'Pending',
      badgeClass: 'status-badge-pending',
    }
  );
};

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

  /**
   * Retrieves all Orders across the system from Spring Boot for administration.
   * Endpoint: GET /order/getAll
   */
  getAllOrders: async (): Promise<BackendOrder[]> => {
    const response = await api.get<BackendOrder[]>('/order/getAll');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Updates an existing Order in Spring Boot.
   * Endpoint: PUT /order/update
   */
  updateOrder: async (order: BackendOrder): Promise<BackendOrder> => {
    const response = await api.put<BackendOrder>('/order/update', order);
    return response.data;
  },

  /**
   * Updates an order's status while strictly preserving all other properties.
   * Endpoint: PUT /order/update
   */
  updateOrderStatus: async (
    order: BackendOrder,
    status: BackendOrderStatus | string
  ): Promise<BackendOrder> => {
    const updatedPayload: BackendOrder = {
      ...order,
      status,
    };
    return orderService.updateOrder(updatedPayload);
  },
};

