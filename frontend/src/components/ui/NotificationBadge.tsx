import React from 'react';
import './NotificationBadge.css';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, maxCount = 99, className = '' }) => {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  return (
    <span className={`notification-badge ${className}`}>
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
