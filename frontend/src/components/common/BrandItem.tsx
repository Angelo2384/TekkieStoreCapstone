import React from 'react';
import './BrandItem.css';

interface BrandItemProps {
  name: string;
  logoUrl?: string;
  className?: string;
}

const BrandItem: React.FC<BrandItemProps> = ({ name, logoUrl, className = '' }) => {
  return (
    <div className={`brand-item ${className}`}>
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="brand-logo" />
      ) : (
        <span className="brand-name">{name}</span>
      )}
    </div>
  );
};

export default BrandItem;
