import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  BackendOrder,
  BackendOrderStatus,
  ORDER_STATUS_CONFIGS,
} from '../../../services/orderService';
import {
  deliveryService,
  DeliveryDetailsData,
} from '../../../services/deliveryService';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderItemsList } from './OrderItemsList';
import { formatPrice } from '../../../utils/formatters';

interface OrderDetailsDrawerProps {
  order: BackendOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    order: BackendOrder,
    newStatus: BackendOrderStatus
  ) => Promise<boolean>;
}

const STATUS_OPTIONS: { value: BackendOrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Order Confirmed (PENDING)' },
  { value: 'PAID', label: 'Payment Received (PAID)' },
  { value: 'PACKED', label: 'Packed & Ready (PACKED)' },
  { value: 'SHIPPED', label: 'Dispatched in Transit (SHIPPED)' },
  { value: 'DELIVERED', label: 'Delivered (DELIVERED)' },
  { value: 'CANCELLED', label: 'Cancelled (CANCELLED)' },
];

/**
 * Inner content component keyed by order.orderId
 * Ensures state resets cleanly on order change without requiring reactive effects.
 */
const OrderDetailsContent: React.FC<{
  order: BackendOrder;
  onClose: () => void;
  onUpdateStatus: (
    order: BackendOrder,
    newStatus: BackendOrderStatus
  ) => Promise<boolean>;
}> = ({ order, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<BackendOrderStatus>(() => {
    return (order.status || 'PENDING').toUpperCase() as BackendOrderStatus;
  });
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsData | null>(null);
  const [loadingDelivery, setLoadingDelivery] = useState(true);

  // Fetch delivery details on mount of this specific order
  useEffect(() => {
    let isMounted = true;

    deliveryService
      .getDeliveryDetailsByOrderId(order.orderId)
      .then((data) => {
        if (isMounted) {
          setDeliveryDetails(data);
          setLoadingDelivery(false);
        }
      })
      .catch((err) => {
        console.warn(`[OrderDetailsDrawer] Delivery fetch failed for ${order.orderId}:`, err);
        if (isMounted) {
          setDeliveryDetails(null);
          setLoadingDelivery(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [order.orderId]);

  // Format customer full name
  const customerName = order.customer?.name
    ? [
        order.customer.name.firstName,
        order.customer.name.middleName,
        order.customer.name.lastName,
      ]
        .filter(Boolean)
        .join(' ')
    : 'Valued Customer';

  // Format date
  const dateObj = new Date(order.orderDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : String(order.orderDate || 'N/A');

  const currentStatusNormalized = (order.status || 'PENDING').toUpperCase() as BackendOrderStatus;
  const hasStatusChanged = selectedStatus !== currentStatusNormalized;

  const handleSaveStatus = async () => {
    if (!hasStatusChanged || isSavingStatus) return;

    setIsSavingStatus(true);
    setStatusFeedback(null);

    const success = await onUpdateStatus(order, selectedStatus);
    setIsSavingStatus(false);

    if (success) {
      const newLabel = ORDER_STATUS_CONFIGS[selectedStatus]?.label || selectedStatus;
      setStatusFeedback({
        type: 'success',
        message: `Order status updated to "${newLabel}".`,
      });
      setTimeout(() => {
        setStatusFeedback(null);
      }, 4000);
    } else {
      setStatusFeedback({
        type: 'error',
        message: 'Failed to update order status. Please check connection.',
      });
      setSelectedStatus(currentStatusNormalized);
    }
  };

  return (
    <div
      className="order-drawer-panel"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Order Details for #${order.orderId}`}
    >
      {/* DRAWER HEADER */}
      <header className="order-drawer-header">
        <div className="drawer-header-left">
          <div className="drawer-title-row">
            <h2 className="drawer-order-id">#{order.orderId}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="drawer-order-date">
            <Clock size={13} aria-hidden="true" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <button
          type="button"
          className="drawer-close-btn"
          onClick={onClose}
          aria-label="Close details drawer"
          title="Close drawer (Esc)"
        >
          <X size={18} />
        </button>
      </header>

      {/* DRAWER CONTENT SCROLLER */}
      <div className="order-drawer-body">
        {/* SECTION 1: FULFILMENT & STATUS UPDATER */}
        <section className="drawer-section fulfilment-section">
          <div className="drawer-section-header">
            <div className="section-title-wrap">
              <CheckCircle2 size={16} className="section-icon text-brand" />
              <h3 className="drawer-section-title">Order Fulfilment Status</h3>
            </div>
          </div>

          <div className="status-updater-card">
            <div className="status-updater-row">
              <div className="status-select-wrap">
                <label htmlFor="drawer-status-select" className="status-select-label">
                  Lifecycle Status:
                </label>
                <select
                  id="drawer-status-select"
                  className="drawer-status-dropdown"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as BackendOrderStatus)
                  }
                  disabled={isSavingStatus}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="save-status-btn"
                onClick={handleSaveStatus}
                disabled={!hasStatusChanged || isSavingStatus}
              >
                {isSavingStatus ? 'Updating...' : 'Save Status'}
              </button>
            </div>

            {statusFeedback && (
              <div
                className={`status-feedback-banner ${
                  statusFeedback.type === 'success' ? 'feedback-success' : 'feedback-error'
                }`}
              >
                {statusFeedback.type === 'success' ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertCircle size={15} />
                )}
                <span>{statusFeedback.message}</span>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: CUSTOMER */}
        <section className="drawer-section">
          <div className="drawer-section-header">
            <div className="section-title-wrap">
              <User size={16} className="section-icon" />
              <h3 className="drawer-section-title">Customer Information</h3>
            </div>
          </div>

          <div className="drawer-info-grid">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value font-semibold">{customerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">
                {order.customer?.email ? (
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="contact-link"
                  >
                    {order.customer.email}
                  </a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile Phone</span>
              <span className="info-value">
                {order.customer?.mobileNumber ? (
                  <a
                    href={`tel:${order.customer.mobileNumber}`}
                    className="contact-link"
                  >
                    {order.customer.mobileNumber}
                  </a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer ID</span>
              <span className="info-value text-muted font-mono">
                {order.customer?.customerId || 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: ORDER ITEMS */}
        <section className="drawer-section">
          <div className="drawer-section-header">
            <div className="section-title-wrap">
              <ShoppingBag size={16} className="section-icon" />
              <h3 className="drawer-section-title">
                Purchased Items ({order.orderItems?.length || 0})
              </h3>
            </div>
          </div>

          <OrderItemsList items={order.orderItems || []} />
        </section>

        {/* SECTION 4: PAYMENT BREAKDOWN */}
        <section className="drawer-section">
          <div className="drawer-section-header">
            <div className="section-title-wrap">
              <CreditCard size={16} className="section-icon" />
              <h3 className="drawer-section-title">Payment & Financials</h3>
            </div>
          </div>

          <div className="payment-summary-card">
            <div className="payment-meta-row">
              <div className="info-item">
                <span className="info-label">Payment Method</span>
                <span className="info-value font-semibold uppercase">
                  {order.paymentMethod || 'Card'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Reference</span>
                <span className="info-value font-mono">
                  {order.paymentReference || 'N/A'}
                </span>
              </div>
            </div>

            <div className="payment-divider" />

            <div className="financial-rows">
              <div className="financial-row">
                <span className="financial-label">Subtotal</span>
                <span className="financial-value">
                  {formatPrice(order.subtotal || 0)}
                </span>
              </div>

              <div className="financial-row">
                <span className="financial-label">Shipping Fee</span>
                <span className="financial-value">
                  {order.shippingFee && order.shippingFee > 0
                    ? formatPrice(order.shippingFee)
                    : 'FREE'}
                </span>
              </div>

              <div className="financial-row total-row">
                <span className="total-label">Total Amount Paid</span>
                <span className="total-value">
                  {formatPrice(order.totalAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: DELIVERY DETAILS */}
        <section className="drawer-section">
          <div className="drawer-section-header">
            <div className="section-title-wrap">
              <Truck size={16} className="section-icon" />
              <h3 className="drawer-section-title">Delivery & Courier</h3>
            </div>
          </div>

          {loadingDelivery ? (
            <div className="delivery-loading-box">
              <span>Checking delivery status...</span>
            </div>
          ) : deliveryDetails ? (
            <div className="delivery-details-card">
              <div className="drawer-info-grid">
                <div className="info-item">
                  <span className="info-label">Recipient Name</span>
                  <span className="info-value font-semibold">
                    {deliveryDetails.fullName || customerName}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Contact Phone</span>
                  <span className="info-value">
                    {deliveryDetails.phone ||
                      order.customer?.mobileNumber ||
                      'N/A'}
                  </span>
                </div>

                <div className="info-item full-width">
                  <span className="info-label">Shipping Address</span>
                  <span className="info-value">
                    {deliveryDetails.address ? (
                      `${deliveryDetails.address.streetNumber || ''} ${
                        deliveryDetails.address.streetName || ''
                      }, ${deliveryDetails.address.suburb || ''}, ${
                        deliveryDetails.address.city || ''
                      }, ${deliveryDetails.address.province || ''} ${
                        deliveryDetails.address.postalCode || ''
                      }`.trim()
                    ) : (
                      'Standard Delivery'
                    )}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Courier Service</span>
                  <span className="info-value courier-badge">
                    {deliveryDetails.courier || 'DSV Express'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Tracking Number</span>
                  <span className="info-value font-mono tracking-badge">
                    {deliveryDetails.trackingNumber || 'Pending'}
                  </span>
                </div>

                {deliveryDetails.estimatedDeliveryDate && (
                  <div className="info-item">
                    <span className="info-label">Estimated Delivery</span>
                    <span className="info-value font-semibold text-brand">
                      {deliveryDetails.estimatedDeliveryDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="delivery-unassigned-box">
              <Truck size={20} className="text-muted" />
              <p className="unassigned-text">
                Delivery details have not been assigned yet.
              </p>
              <span className="unassigned-hint">
                Details will appear once courier dispatch is confirmed.
              </span>
            </div>
          )}
        </section>
      </div>

      {/* DRAWER FOOTER */}
      <footer className="order-drawer-footer">
        <button
          type="button"
          className="drawer-footer-close-btn"
          onClick={onClose}
        >
          Close Panel
        </button>
      </footer>
    </div>
  );
};

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div
      className="order-drawer-backdrop"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <OrderDetailsContent
        key={order.orderId}
        order={order}
        onClose={onClose}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};
