import React from 'react';
import './AnnouncementBar.css';

interface AnnouncementBarProps {
  message: string;
  linkText?: string;
  href?: string;
  onClose?: () => void;
  className?: string;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ 
  message, 
  linkText, 
  href, 
  onClose,
  className = '' 
}) => {
  return (
    <div className={`announcement-bar ${className}`}>
      <div className="announcement-content">
        <span className="announcement-message">{message}</span>
        {linkText && href && (
          <a href={href} className="announcement-link">{linkText}</a>
        )}
      </div>
      {onClose && (
        <button className="announcement-close" onClick={onClose} aria-label="Close announcement">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default AnnouncementBar;
