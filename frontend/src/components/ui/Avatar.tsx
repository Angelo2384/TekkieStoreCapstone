import React from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  alt: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, initials, size = 'md', className = '' }) => {
  return (
    <div className={`avatar avatar--${size} ${className}`} aria-label={alt}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <span className="avatar-initials">{initials || alt.charAt(0)}</span>
      )}
    </div>
  );
};

export default Avatar;
