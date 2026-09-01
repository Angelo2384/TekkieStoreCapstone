import React from 'react';
import { Package, ExternalLink, RefreshCw, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../../types/profile';
import { MOCK_ORDERS } from '../../data/mockOrders';

interface RecentOrdersProps {
  orders?: Order[];
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders = MOCK_ORDERS }) => {
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'In Transit':
        return 'status-transit';
      case 'Processing':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="profile-card recent-orders-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Recent Orders</h2>
          <p className="profile-card-subtitle">
            Track, manage, and view status history for all your purchases.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty-state">
          <Package className="orders-empty-icon" size={40} />
          <h3 className="orders-empty-title">No Orders Placed Yet</h3>
          <p className="orders-empty-text">
            When you purchase sneakers, your order tracking and history will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              {/* Order Card Header */}
              <div className="order-header-bar">
                <div className="order-meta-left">
                  <div className="order-meta-col">
                    <span className="order-meta-label">Order Number</span>
                    <span className="order-meta-value order-id">#{order.orderNumber}</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="order-meta-label">Date Placed</span>
                    <span className="order-meta-value">{order.date}</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="order-meta-label">Total Amount</span>
                    <span className="order-meta-value order-price">
                      R {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="order-meta-right">
                  <span className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                    <span className="status-dot" />
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Products List */}
              <div className="order-products-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-product-row">
                    <div className="product-thumb-wrapper">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="product-thumb-img"
                        onError={(e) => {
                          // Fallback to default tekkies image if asset path not found
                          (e.currentTarget as HTMLImageElement).src = '/trending_shoe_1_1788049696433.jpg';
                        }}
                      />
                    </div>
                    <div className="product-details">
                      <span className="product-brand">{item.brand}</span>
                      <h4 className="product-name">{item.name}</h4>
                      <div className="product-specs">
                        <span className="spec-badge">Size: {item.size}</span>
                        <span className="spec-badge">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="product-price-col">
                      <span className="product-unit-price">
                        R {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions Footer */}
              <div className="order-footer-actions">
                <div className="order-actions-left">
                  {order.status === 'In Transit' && (
                    <button type="button" className="btn-order-action secondary">
                      <Truck size={15} />
                      <span>Track Package</span>
                    </button>
                  )}
                  <button type="button" className="btn-order-action secondary">
                    <ExternalLink size={15} />
                    <span>View Order Details</span>
                  </button>
                </div>

                <div className="order-actions-right">
                  <button type="button" className="btn-order-action primary">
                    <RefreshCw size={14} />
                    <span>Buy Again</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
