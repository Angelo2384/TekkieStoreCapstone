import React from 'react';
import { BackendOrder } from '../../../services/orderService';
import { formatPrice } from '../../../utils/formatters';
import { OrderStatusBadge } from './OrderStatusBadge';
import {
  ChevronRight,
  Package,
  AlertCircle,
  RefreshCw,
  SearchX,
  CreditCard,
} from 'lucide-react';

interface OrdersTableProps {
  orders: BackendOrder[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectOrder: (order: BackendOrder) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  error,
  onRetry,
  onSelectOrder,
  hasActiveFilters,
  onClearFilters,
}) => {
  // Helper to calculate total items quantity
  const calculateTotalQuantity = (order: BackendOrder): number => {
    if (!order.orderItems || order.orderItems.length === 0) return 0;
    return order.orderItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  // Helper to format date cleanly
  const formatOrderDate = (dateVal: string | number): string => {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal || 'Recent');
    return d.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="orders-table-wrapper">
        <div className="table-responsive">
          <table className="admin-table orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton-row">
                  <td>
                    <div className="skeleton-box skeleton-order-id" />
                    <div className="skeleton-box skeleton-subtext" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-name" />
                    <div className="skeleton-box skeleton-subtext" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-badge" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-date" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-payment" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-price" />
                  </td>
                  <td>
                    <div className="skeleton-box skeleton-pill" />
                  </td>
                  <td className="th-action">
                    <div className="skeleton-box skeleton-btn" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="orders-table-error-state">
        <div className="error-state-card">
          <AlertCircle size={36} className="error-icon" />
          <h3 className="error-title">We couldn't load orders.</h3>
          <p className="error-description">{error}</p>
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RefreshCw size={15} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  // EMPTY STATE: FILTERED VS EMPTY DATABASE
  if (orders.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="orders-table-empty-state">
          <SearchX size={38} className="empty-icon" />
          <h3 className="empty-title">No orders match your filters.</h3>
          <p className="empty-subtitle">
            Try adjusting your search keywords, order status, or payment method filter.
          </p>
          <button
            type="button"
            className="clear-filters-action-btn"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        </div>
      );
    }

    return (
      <div className="orders-table-empty-state">
        <Package size={40} className="empty-icon" />
        <h3 className="empty-title">No orders have been placed yet.</h3>
        <p className="empty-subtitle">
          New purchases made on the TekkieStore live storefront will immediately appear here.
        </p>
      </div>
    );
  }

  // POPULATED TABLE
  return (
    <div className="orders-table-wrapper">
      <div className="table-responsive">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th className="th-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => {
              const totalQty = calculateTotalQuantity(ord);
              const custName = ord.customer?.name
                ? [
                    ord.customer.name.firstName,
                    ord.customer.name.lastName,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : 'Customer';

              const custEmail = ord.customer?.email || 'No email provided';

              return (
                <tr
                  key={ord.orderId}
                  className="order-table-row"
                  onClick={() => onSelectOrder(ord)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectOrder(ord);
                    }
                  }}
                >
                  {/* ORDER NUMBER & REF */}
                  <td className="td-order">
                    <div className="order-id-cell">
                      <span className="order-primary-id">#{ord.orderId}</span>
                      {ord.paymentReference && (
                        <span className="order-ref-sub">
                          Ref: {ord.paymentReference}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* CUSTOMER INFO */}
                  <td className="td-customer">
                    <div className="customer-cell">
                      <span className="customer-name">{custName}</span>
                      <span className="customer-sub" title={custEmail}>
                        {custEmail}
                      </span>
                    </div>
                  </td>

                  {/* ITEMS QUANTITY */}
                  <td className="td-items">
                    <span className="items-count-pill">
                      {totalQty} {totalQty === 1 ? 'item' : 'items'}
                    </span>
                  </td>

                  {/* ORDER DATE */}
                  <td className="td-date">
                    <span className="order-date-text">
                      {formatOrderDate(ord.orderDate)}
                    </span>
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="td-payment">
                    <div className="payment-method-cell">
                      <CreditCard size={13} className="payment-icon text-muted" />
                      <span className="payment-text">
                        {ord.paymentMethod || 'Card'}
                      </span>
                    </div>
                  </td>

                  {/* TOTAL AMOUNT */}
                  <td className="td-total">
                    <span className="order-total-amount">
                      {formatPrice(ord.totalAmount || 0)}
                    </span>
                  </td>

                  {/* STATUS BADGE */}
                  <td className="td-status">
                    <OrderStatusBadge status={ord.status} />
                  </td>

                  {/* ACTION BUTTON */}
                  <td
                    className="td-action th-action"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="view-order-btn"
                      onClick={() => onSelectOrder(ord)}
                      title={`View details for #${ord.orderId}`}
                    >
                      <span>View</span>
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
