import React from 'react';
import { Package, Tag, Shield } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { Order } from '../../context/OrderContext';
import { useOrder } from '../../context/OrderContext';
import { ProductImage } from '../shared/ProductImage';
import './ShipmentItems.css';

interface ShipmentItem {
  id: string;
  brand: string;
  name: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  tag?: string;
}

interface ShipmentItemsProps {
  order?: Order | null;
}

export const ShipmentItems: React.FC<ShipmentItemsProps> = ({ order }) => {
  const { activeOrder } = useOrder();
  const targetOrder = order || activeOrder;

  if (!targetOrder || !targetOrder.items || targetOrder.items.length === 0) {
    return null;
  }

  const items: ShipmentItem[] = targetOrder.items.map((item, idx) => ({
    id: item.id || `order-item-${idx}`,
    brand: item.brand,
    name: item.name,
    colour: 'Original Authenticated',
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    image: item.image,
    tag: idx === 0 ? 'ORDER CONFIRMED' : undefined,
  }));

  const subtotal = targetOrder.subtotal;
  const shippingFee = targetOrder.shippingFee;
  const grandTotal = targetOrder.total;

  return (
    <div className="shipment-items-card">
      <div className="shipment-card-header">
        <div className="shipment-header-left">
          <div className="shipment-icon-wrap">
            <Package size={20} />
          </div>
          <div>
            <h3 className="shipment-card-title">Items in This Shipment</h3>
            <p className="shipment-card-subtitle">
              Verified footwear units packed and sealed in tamper-evident packaging.
            </p>
          </div>
        </div>

        <span className="shipment-count-pill">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} Enclosed
        </span>
      </div>

      <div className="shipment-items-list">
        {items.map((item) => (
          <div key={item.id} className="shipment-item-row">
            <div className="shipment-thumb-wrapper">
              {item.tag && (
                <span className="shipment-item-tag">{item.tag}</span>
              )}
              <ProductImage
                src={item.image}
                alt={`${item.brand} ${item.name}`}
                className="shipment-thumb-img"
              />
            </div>

            <div className="shipment-item-info">
              <span className="shipment-item-brand">{item.brand}</span>
              <h4 className="shipment-item-name">{item.name}</h4>
              <p className="shipment-item-colour">{item.colour}</p>
              
              <div className="shipment-specs-row">
                <span className="spec-pill">Size: {item.size}</span>
                <span className="spec-pill">Qty: {item.quantity}</span>
                <span className="spec-pill verified">
                  <Shield size={12} />
                  <span>Authenticity Verified</span>
                </span>
              </div>
            </div>

            <div className="shipment-item-price-col">
              <span className="price-label">Unit Price</span>
              <span className="item-unit-price">{formatPrice(item.price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="shipment-summary-box">
        <div className="summary-row">
          <span className="summary-label">Items Subtotal:</span>
          <span className="summary-val">{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">
            <Tag size={13} className="summary-icon" />
            <span>Express Courier Shipping:</span>
          </span>
          <span className={`summary-val ${shippingFee === 0 ? 'free-badge' : ''}`}>
            {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="summary-row total-row">
          <span className="total-label">Total Paid:</span>
          <span className="total-val">{formatPrice(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};
