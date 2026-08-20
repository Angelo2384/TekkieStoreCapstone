import React from 'react';
import './Logo.css';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`logo ${className}`}>
      <span className="logo-text">TEKKIE</span>
      <span className="logo-accent">STORE</span>
    </div>
  );
};

export default Logo;
