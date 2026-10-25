import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { orderService } from '../../services/orderService';

interface DeliveryDetailsCardProps {
  showActionLink?: boolean;
}

export const DeliveryDetailsCard: React.FC<DeliveryDetailsCardProps> = ({ showActionLink = false }) => {
  const { user } = useAuth();
  const { orders } = useOrder();
  // Whether there's anything to track; orders already loaded on the site enable the button straight away (null while checking)
  const [hasOrders, setHasOrders] = useState<boolean | null>(() =>
    orders.length > 0 ? true : user?.customerId ? null : false
  );

  useEffect(() => {
    if (!showActionLink || !user?.customerId) return;
    let isMounted = true;
    orderService
      .getOrdersByCustomerId(user.customerId)
      .then((data) => {
        if (isMounted) setHasOrders(data.length > 0);
      })
      .catch(() => {
        if (isMounted) setHasOrders(false);
      });
    return () => {
      isMounted = false;
    };
  }, [showActionLink, user?.customerId]);

  return (
    <div className="profile-card delivery-overview-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Delivery & Logistics</h2>
          <p className="profile-card-subtitle">
            Overview of standard dispatch schedules, courier partners, and tracking services.
          </p>
        </div>

        {showActionLink &&
          (hasOrders ? (
            <Link to="/delivery-details" className="btn-view-live-tracking" title="View live delivery and tracking details">
              View Live Tracking
            </Link>
          ) : (
            <button type="button" className="btn-view-live-tracking" disabled>
              {hasOrders === false ? 'No Deliveries Yet' : 'View Live Tracking'}
            </button>
          ))}
      </div>

      <div className="delivery-features-grid">
        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <Truck size={22} />
          </div>
          <h3 className="feature-title">Express Courier Network</h3>
          <p className="feature-desc">
            All footwear parcels are dispatched via premium insured express couriers with live SMS tracking.
          </p>
        </div>

        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <Clock size={22} />
          </div>
          <h3 className="feature-title">2 - 4 Business Days</h3>
          <p className="feature-desc">
            Main regional centers receive doorstep deliveries within 48-72 hours of dispatch verification.
          </p>
        </div>

        <div className="delivery-feature-box">
          <div className="feature-icon-wrap">
            <ShieldCheck size={22} />
          </div>
          <h3 className="feature-title">Signature Required</h3>
          <p className="feature-desc">
            Every shipment requires OTP or authorized signature confirmation upon drop-off for parcel safety.
          </p>
        </div>
      </div>
    </div>
  );
};
