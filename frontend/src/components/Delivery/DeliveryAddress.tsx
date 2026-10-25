import React from 'react';
import { MapPin, Phone, Building, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Order, useOrder } from '../../context/OrderContext';
import { BackendDeliveryDetailsResponse } from '../../services/deliveryService';
import './DeliveryAddress.css';

interface DeliveryAddressProps {
  order?: Order | null;
  deliveryData?: BackendDeliveryDetailsResponse | null;
}

export const DeliveryAddress: React.FC<DeliveryAddressProps> = ({ order, deliveryData }) => {
  const { user } = useAuth();
  const { activeOrder } = useOrder();
  const targetOrder = order || activeOrder;
  
  const recipientName =
    deliveryData?.fullName ||
    targetOrder?.shippingAddress?.recipientName ||
    (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '') ||
    'Recipient';

  const recipientPhone =
    deliveryData?.phone ||
    user?.phone ||
    'Contact on delivery';

  const address = deliveryData?.address || targetOrder?.shippingAddress;
  const streetLine = address && (address.streetNumber || address.streetName)
    ? `${address.streetNumber || ''} ${address.streetName || ''}`.trim()
    : 'Address details pending';
  const suburbLine = address && (address.suburb || address.city)
    ? [address.suburb, address.city].filter(Boolean).join(', ')
    : '';
  const postalLine = address && (address.postalCode || address.province)
    ? [address.postalCode, address.province, 'South Africa'].filter(Boolean).join(', ')
    : 'South Africa';

  return (
    <div className="delivery-address-card">
      <div className="delivery-card-header">
        <div className="delivery-card-icon-wrap">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="delivery-card-title">Delivery Address</h3>
          <p className="delivery-card-subtitle">Destination location for doorstep parcel drop-off.</p>
        </div>
      </div>

      <div className="address-details-body">
        <div className="recipient-row">
          <span className="recipient-name">{recipientName}</span>
          <span className="address-badge">Primary Residential</span>
        </div>

        <div className="address-lines">
          <p className="street-line">{streetLine}</p>
          {suburbLine && <p className="suburb-line">{suburbLine}</p>}
          <p className="postal-line">{postalLine}</p>
        </div>

        <div className="address-meta-list">
          <div className="address-meta-item">
            <Phone size={15} className="meta-icon" />
            <span className="meta-label">Contact Number:</span>
            <span className="meta-value">{recipientPhone}</span>
          </div>

          <div className="address-meta-item">
            <Building size={15} className="meta-icon" />
            <span className="meta-label">Delivery Type:</span>
            <span className="meta-value">Direct Doorstep Delivery</span>
          </div>
        </div>

        <div className="delivery-instructions-box">
          <Info size={16} className="instructions-icon" />
          <div className="instructions-content">
            <span className="instructions-label">Courier Note & Instructions:</span>
            <p className="instructions-text">
              Direct doorstep courier delivery. Please ensure someone is available at the destination address to receive or sign for parcel handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
