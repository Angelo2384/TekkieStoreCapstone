import React from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
  showIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', showIcon = true }) => {
  return (
    <div className={`logo ${className}`}>
      {showIcon && (
        <span className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <polygon points="6 2 18 2 23 12 18 22 6 22 1 12" />
          </svg>
        </span>
      )}
      <span className="logo-text">Tekkies Store</span>
    </div>
  );
};

export default Logo;


