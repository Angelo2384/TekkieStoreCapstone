import React from 'react';
import { getOrderStatusConfig } from '../../../services/orderService';

interface OrderStatusBadgeProps {
  status?: string;
  className?: string;
  showDot?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = '',
  showDot = true,
}) => {
  const config = getOrderStatusConfig(status);

  return (
    <span className={`order-status-badge ${config.badgeClass} ${className}`}>
      {showDot && <span className="status-badge-dot" aria-hidden="true" />}
      <span className="status-badge-label">{config.label}</span>
    </span>
  );
};
