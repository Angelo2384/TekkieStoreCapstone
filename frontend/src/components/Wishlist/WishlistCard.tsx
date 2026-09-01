import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { ShoeProduct } from '../../types/catalogue';
import { formatPrice } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import './WishlistCard.css';

interface WishlistCardProps {
  product: ShoeProduct;
  onQuickAdd?: (product: ShoeProduct) => void;
  onClick?: (product: ShoeProduct) => void;
}

export const WishlistCard: React.FC<WishlistCardProps> = ({
  product,
  onQuickAdd,
  onClick,
}) => {
  const { removeFromWishlist } = useWishlist();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div
      className="wishlist-product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${product.brand} ${product.name}`}
    >
      <div className="wishlist-card-image-container">
        {/* Product Tag / Badge */}
        {product.tag && (
          <span className={`wishlist-card-tag ${product.tag === 'JUST DROPPED' ? 'tag-orange' : ''}`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist Active Heart Button */}
        <button
          className="wishlist-card-heart-btn active"
          onClick={handleRemove}
          aria-label={`Remove ${product.name} from wishlist`}
          title="Remove from wishlist"
          type="button"
        >
          <Heart
            size={18}
            className="wishlist-card-heart-icon"
            fill="var(--brand-orange)"
            color="var(--brand-orange)"
          />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={`${product.brand} ${product.name} in ${product.colour}`}
          className="wishlist-card-image"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/trending_shoe_1_1788049696433.jpg';
          }}
        />

        {/* Quick Add Button */}
        <button
          className={`wishlist-card-add-btn ${addedFeedback ? 'added' : ''}`}
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          type="button"
        >
          {addedFeedback ? (
            <span className="wishlist-btn-feedback">
              <Check size={16} /> Added
            </span>
          ) : (
            'Quick Add'
          )}
        </button>
      </div>

      <div className="wishlist-card-info">
        <div className="wishlist-card-meta-row">
          <span className="wishlist-card-brand">{product.brand}</span>
          <span className="wishlist-card-category-pill">{product.category}</span>
        </div>
        <h3 className="wishlist-card-name">{product.name}</h3>
        <p className="wishlist-card-colour-text">{product.colour}</p>
        <span className="wishlist-card-price">{formatPrice(product.price)}</span>
      </div>
    </div>
  );
};
