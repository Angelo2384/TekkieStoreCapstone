import React from 'react';
import BrandItem from './BrandItem';
import './BrandShowcase.css';

interface BrandShowcaseProps {
  brands: Array<{ id: string; name: string; logoUrl?: string }>;
  className?: string;
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({ brands, className = '' }) => {
  return (
    <div className={`brand-showcase ${className}`}>
      {brands.map(brand => (
        <BrandItem key={brand.id} name={brand.name} logoUrl={brand.logoUrl} />
      ))}
    </div>
  );
};

export default BrandShowcase;
