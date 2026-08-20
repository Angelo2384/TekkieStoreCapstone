import React from 'react';
import './FloatingInfoBadge.css';

interface FloatingInfoBadgeProps {
  icon?: React.ReactNode;
  label: string;
  mainText: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const FloatingInfoBadge: React.FC<FloatingInfoBadgeProps> = ({ 
  icon, 
  label, 
  mainText, 
  position = 'top-left',
  className = '' 
}) => {
  return (
    <div className={`floating-info-badge floating-info-badge--${position} ${className}`}>
      {icon && <div className="floating-info-icon">{icon}</div>}
      <div className="floating-info-content">
        <span className="floating-info-label">{label}</span>
        <span className="floating-info-text">{mainText}</span>
      </div>
    </div>
  );
};

export default FloatingInfoBadge;
