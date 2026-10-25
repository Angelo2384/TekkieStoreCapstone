import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { TrackingStatus } from '../components/Delivery/TrackingStatus';
import { DeliveryAddress } from '../components/Delivery/DeliveryAddress';
import { CarrierDetails } from '../components/Delivery/CarrierDetails';
import { ShipmentItems } from '../components/Delivery/ShipmentItems';
import { useAuth } from '../context/AuthContext';
import { useOrder, Order } from '../context/OrderContext';
import { deliveryService, BackendDeliveryDetailsResponse } from '../services/deliveryService';
import './DeliveryDetails.css';

export const DeliveryDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, activeOrder, getOrderById, fetchOrderById, refreshOrders } = useOrder();

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [backendDelivery, setBackendDelivery] = useState<BackendDeliveryDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Resolve the actual order for this customer. Runs once per order/customer: the order context's
  // list and functions change on every refresh, and depending on them reloaded forever for customers with no orders.
  useEffect(() => {
    let cancelled = false;

    const loadOrderAndDelivery = async () => {
      setIsLoading(true);

      if (!user || !user.customerId) {
        setCurrentOrder(null);
        setBackendDelivery(null);
        setIsLoading(false);
        return;
      }

      let resolvedOrder: Order | null = null;

      if (orderId) {
        const cleanId = orderId.replace('#', '').trim();
        const existing = getOrderById(cleanId);
        if (existing) {
          resolvedOrder = existing;
        } else {
          const fetched = await fetchOrderById(cleanId);
          resolvedOrder = fetched || null;
        }
      } else {
        if (orders.length > 0) {
          resolvedOrder = activeOrder || orders[0];
        } else {
          const liveOrders = await refreshOrders();
          resolvedOrder = liveOrders.length > 0 ? liveOrders[0] : null;
        }
      }
      if (cancelled) return;

      setCurrentOrder(resolvedOrder);

      if (resolvedOrder) {
        try {
          const cleanOrderId = resolvedOrder.id.replace('#', '').trim();
          const res = await deliveryService.getDeliveryDetailsByOrderId(cleanOrderId);
          if (!cancelled) setBackendDelivery(res);
        } catch (err) {
          console.warn('[DeliveryDetails] Delivery details lookup error:', err);
          if (!cancelled) setBackendDelivery(null);
        }
      } else {
        setBackendDelivery(null);
      }

      if (!cancelled) setIsLoading(false);
    };

    loadOrderAndDelivery();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, user?.customerId]);

  const handleRefresh = async () => {
    if (!currentOrder) return;
    const cleanId = currentOrder.id.replace('#', '').trim();
    try {
      const [updatedDelivery] = await Promise.all([
        deliveryService.getDeliveryDetailsByOrderId(cleanId),
        fetchOrderById(cleanId),
      ]);
      if (updatedDelivery) {
        setBackendDelivery(updatedDelivery);
      }
    } catch (err) {
      console.warn('[DeliveryDetails] Refresh error:', err);
    }
  };

  const orderNumber = currentOrder?.orderNumber || (currentOrder?.id ? `#${currentOrder.id.replace('#', '')}` : '—');
  const datePlaced = currentOrder?.dateFormatted || '—';
  const estimatedDelivery = backendDelivery?.estimatedDeliveryDate
    ? new Date(backendDelivery.estimatedDeliveryDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : currentOrder?.estimatedArrival || '—';
  const shipmentMethod = backendDelivery?.courier
    ? `${backendDelivery.courier} Express`
    : currentOrder?.shippingMethod || 'Standard Express Delivery';

  return (
    <div className="delivery-details-page">
      <section className="delivery-header-section">
        <div className="delivery-details-container">
          <div className="delivery-header-content">
            <span className="delivery-eyebrow">Tracking & Logistics</span>
            <h1 className="delivery-main-title">DELIVERY DETAILS</h1>
            <p className="delivery-header-subtitle">
              Live tracking, courier dispatch information, destination address, and package contents for your genuine orders.
            </p>
          </div>
        </div>
      </section>

      <div className="delivery-details-container">
        <div className="delivery-breadcrumb-bar">
          <nav className="delivery-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="delivery-breadcrumb-separator">/</span>
            <Link to="/profile">My Account</Link>
            <span className="delivery-breadcrumb-separator">/</span>
            <span className="delivery-breadcrumb-current">Delivery Details</span>
          </nav>
        </div>
      </div>

      <main className="delivery-body-section">
        <div className="delivery-details-container">
          {isLoading ? (
            <div className="delivery-loading-box">
              <div className="delivery-loading-spinner" />
              <span>Retrieving your delivery details...</span>
            </div>
          ) : !currentOrder ? (
            /* Requirement 4: Professional empty state when newly registered customer or no actual orders exist */
            <div className="delivery-empty-container">
              <div className="delivery-empty-card">
                <div className="delivery-empty-icon-wrapper">
                  <Package size={48} strokeWidth={1.5} className="delivery-empty-icon" />
                </div>
                <h2 className="delivery-empty-title">No Deliveries Scheduled</h2>
                <p className="delivery-empty-subtitle">
                  When you place an order, its delivery tracking will appear here.
                </p>
                <Link to="/catalogue" className="delivery-empty-btn">
                  <span>Start Shopping</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : (
            /* Requirement 3 & 7: Display genuine order and shipment details */
            <>
              <div className="order-meta-summary-card">
                <div className="order-meta-info-group">
                  {orders.length > 1 && (
                    <div className="order-picker-unit">
                      <label htmlFor="order-switcher" className="meta-unit-label">
                        Viewing Order
                      </label>
                      <select
                        id="order-switcher"
                        className="order-select-dropdown"
                        value={currentOrder.id}
                        onChange={(e) => navigate(`/delivery-details/${e.target.value}`)}
                      >
                        {orders.map((o) => (
                          <option key={o.id} value={o.id}>
                            #{o.orderNumber.replace('#', '')} ({o.dateFormatted})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="order-meta-unit">
                    <span className="meta-unit-label">Order Number</span>
                    <span className="meta-unit-value order-id">{orderNumber}</span>
                  </div>
                  <div className="order-meta-unit">
                    <span className="meta-unit-label">Date Placed</span>
                    <span className="meta-unit-value">{datePlaced}</span>
                  </div>
                  <div className="order-meta-unit">
                    <span className="meta-unit-label">Estimated Delivery</span>
                    <span className="meta-unit-value">{estimatedDelivery}</span>
                  </div>
                  <div className="order-meta-unit">
                    <span className="meta-unit-label">Shipment Method</span>
                    <span className="meta-unit-value">{shipmentMethod}</span>
                  </div>
                </div>

                <Link to="/profile" className="btn-back-dashboard">
                  <ArrowLeft size={16} />
                  <span>Back to Account</span>
                </Link>
              </div>

              <TrackingStatus order={currentOrder} deliveryData={backendDelivery} />

              <div className="delivery-two-col-grid">
                <DeliveryAddress order={currentOrder} deliveryData={backendDelivery} />
                <CarrierDetails
                  order={currentOrder}
                  deliveryData={backendDelivery}
                  onRefresh={handleRefresh}
                />
              </div>

              <ShipmentItems order={currentOrder} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
