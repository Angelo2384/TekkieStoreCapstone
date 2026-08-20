import React from 'react';
import './IconButton.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Required for accessibility
}

const IconButton: React.FC<IconButtonProps> = ({ icon, className = '', ...rest }) => {
  return (
    <button className={`icon-btn ${className}`} {...rest}>
      {icon}
    </button>
  );
};

export default IconButton;
