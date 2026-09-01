import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import './WishlistEmpty.css';

export const WishlistEmpty: React.FC = () => {
  return (
    <div className="wishlist-empty-container">
      <div className="wishlist-empty-card">
        <div className="wishlist-empty-icon-wrapper">
          <Heart size={48} strokeWidth={1.5} className="wishlist-empty-icon" />
        </div>
        <h2 className="wishlist-empty-title">YOUR WISHLIST IS EMPTY</h2>
        <p className="wishlist-empty-subtitle">
          Explore our catalogue and tap the heart icon on any pair you love to save it for later.
        </p>
        <Link to="/catalogue" className="wishlist-empty-btn">
          <span>EXPLORE CATALOGUE</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
