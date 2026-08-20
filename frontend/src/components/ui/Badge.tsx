import React from 'react';
import './Badge.css';

interface BadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, icon, variant = 'primary', className = '' }) => {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {label}
    </span>
  );
};

export default Badge;
