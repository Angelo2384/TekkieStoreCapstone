import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  orderService,
  BackendOrder,
  formatOrderStatus,
} from '../services/orderService';

export interface OrderItem {
  id: string;
  productId: string | number;
  name: string;
  brand: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export interface OrderShippingAddress {
  recipientName: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  fullAddress: string;
}

export interface Order {
  id: string; // e.g. "TK-88291"
  orderNumber: string; // e.g. "#TK-88291"
  createdAt: string; // ISO date string
  dateFormatted: string; // e.g. "Oct 24, 2026"
  estimatedArrival: string; // e.g. "Oct 28 - 30"
  status: 'Order Confirmed' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  shippingFee: number;
  shippingMethod: string;
  vat: number; // 15% VAT included portion
  total: number;
  shippingAddress: OrderShippingAddress;
  paymentMethod: 'card' | 'eft' | 'PAYSTACK';
  paymentReference: string; // e.g. Paystack's transaction id, "VISA-4921" on older orders
  trackingNumber: string; // e.g. "DSV-ZA-99482710"
}

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  fetchOrderById: (orderId: string) => Promise<Order | undefined>;
  setActiveOrderById: (orderId: string) => void;
  refreshOrders: () => Promise<Order[]>;
}

const getUserOrdersStorageKey = (customerId?: string) =>
  customerId ? `tekkie_orders_${customerId}` : null;
const getUserActiveOrderStorageKey = (customerId?: string) =>
  customerId ? `tekkie_active_order_${customerId}` : null;

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper to calculate 3 to 5 business days range
const calculateEstimatedArrival = (baseDate: Date): string => {
  const addBusinessDays = (start: Date, days: number): Date => {
    const result = new Date(start);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      const dayOfWeek = result.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        added++;
      }
    }
    return result;
  };

  const startEst = addBusinessDays(baseDate, 3);
  const endEst = addBusinessDays(baseDate, 5);

  const startMonth = startEst.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endEst.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startEst.getDate();
  const endDay = endEst.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
};

const mapBackendOrderToOrder = (
  bo: BackendOrder,
  fallbackShipping?: OrderShippingAddress,
  fallbackTracking?: string
): Order => {
  const dateObj = new Date(bo.orderDate);
  const dateFormatted = isNaN(dateObj.getTime())
    ? 'Recent'
    : dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
  const estimatedArrival = calculateEstimatedArrival(isNaN(dateObj.getTime()) ? new Date() : dateObj);

  const items: OrderItem[] = (bo.orderItems || []).map((bi) => ({
    id: bi.orderItemId,
    productId: bi.shoeId,
    name: bi.shoeName,
    brand: bi.brand,
    price: bi.unitPrice,
    size: bi.size,
    quantity: bi.quantity,
    image: bi.imageUrl,
  }));

  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);

  const recipientName = bo.customer?.name
    ? `${bo.customer.name.firstName || ''} ${bo.customer.name.lastName || ''}`.trim()
    : '';

  const defaultAddress: OrderShippingAddress = fallbackShipping || {
    recipientName: recipientName || '',
    streetNumber: '',
    streetName: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    fullAddress: '',
  };

  return {
    id: bo.orderId,
    orderNumber: `#${bo.orderId}`,
    createdAt: typeof bo.orderDate === 'string' ? bo.orderDate : new Date(bo.orderDate).toISOString(),
    dateFormatted,
    estimatedArrival,
    status: formatOrderStatus(bo.status) as any,
    items,
    itemsCount: totalQuantity,
    subtotal: bo.subtotal,
    shippingFee: bo.shippingFee,
    shippingMethod: 'DSV EXPRESS AIR',
    vat: bo.vat ?? Math.round((bo.subtotal || 0) * 0.15),
    total: bo.totalAmount,
    shippingAddress: defaultAddress,
    paymentMethod: (bo.paymentMethod as any) || 'card',
    paymentReference: bo.paymentReference,
    trackingNumber: (bo as any).trackingNumber || fallbackTracking || '',
  };
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const customerId = user?.customerId;

  const [orders, setOrders] = useState<Order[]>(() => {
    if (!customerId) return [];
    try {
      const key = getUserOrdersStorageKey(customerId);
      const saved = key ? localStorage.getItem(key) : null;
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
      return [];
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    if (!customerId) return null;
    try {
      const key = getUserActiveOrderStorageKey(customerId);
      return key ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  });

  // Switch or clear orders whenever authenticated customer changes
  useEffect(() => {
    // Clean up any legacy unspecced storage key
    localStorage.removeItem('tekkie_store_orders');
    localStorage.removeItem('tekkie_store_active_order_id');

    if (!customerId) {
      setOrders([]);
      setActiveOrderId(null);
      return;
    }

    const key = getUserOrdersStorageKey(customerId);
    const activeKey = getUserActiveOrderStorageKey(customerId);
    try {
      const saved = key ? localStorage.getItem(key) : null;
      setOrders(saved ? JSON.parse(saved) : []);
      const savedActive = activeKey ? localStorage.getItem(activeKey) : null;
      setActiveOrderId(savedActive || null);
    } catch {
      setOrders([]);
      setActiveOrderId(null);
    }

    refreshOrders();
  }, [customerId]);

  // Persist customer-scoped orders
  useEffect(() => {
    if (!customerId) return;
    const key = getUserOrdersStorageKey(customerId);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders to localStorage', e);
    }
  }, [orders, customerId]);

  // Persist customer-scoped activeOrderId
  useEffect(() => {
    if (!customerId) return;
    const key = getUserActiveOrderStorageKey(customerId);
    if (!key) return;
    try {
      if (activeOrderId) {
        localStorage.setItem(key, activeOrderId);
      } else {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Failed to persist activeOrderId to localStorage', e);
    }
  }, [activeOrderId, customerId]);

  const activeOrder = orders.find((o) => o.id === activeOrderId) || (orders.length > 0 ? orders[0] : null);

  const refreshOrders = async (): Promise<Order[]> => {
    if (!customerId) {
      setOrders([]);
      setActiveOrderId(null);
      return [];
    }
    try {
      const backendOrders = await orderService.getOrdersByCustomerId(customerId);
      if (Array.isArray(backendOrders)) {
        const mappedList: Order[] = backendOrders.map((bo) => {
          const existing = orders.find((o) => o.id === bo.orderId);
          return mapBackendOrderToOrder(
            bo,
            existing?.shippingAddress,
            existing?.trackingNumber
          );
        });
        setOrders(mappedList);
        return mappedList;
      } else {
        setOrders([]);
        return [];
      }
    } catch (err) {
      console.warn('[OrderContext] Failed to refresh orders from backend:', err);
      return [];
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const cleanId = orderId.replace('#', '').trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === cleanId || o.orderNumber.toUpperCase() === `#${cleanId}`
    );
  };

  const fetchOrderById = async (orderId: string): Promise<Order | undefined> => {
    const existing = getOrderById(orderId);
    if (existing) return existing;

    const cleanId = orderId.replace('#', '').trim();
    const bo = await orderService.getOrderById(cleanId);
    if (bo) {
      // Backend enforces ownership: only proceed if order is returned
      const mapped = mapBackendOrderToOrder(bo);
      setOrders((prev) => [mapped, ...prev.filter((o) => o.id !== mapped.id)]);
      setActiveOrderId(mapped.id);
      return mapped;
    }
    return undefined;
  };

  const setActiveOrderById = (orderId: string) => {
    const found = getOrderById(orderId);
    if (found) {
      setActiveOrderId(found.id);
    }
  };

  const value: OrderContextType = {
    orders,
    activeOrder,
    getOrderById,
    fetchOrderById,
    setActiveOrderById,
    refreshOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
