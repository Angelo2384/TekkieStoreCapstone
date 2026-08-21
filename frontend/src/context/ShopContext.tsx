import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  id: string;
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

interface ShopContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, size?: number, color?: string) => void;
  wishlist: Set<number>;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(3); // Initial boutique cart badge count
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const addToCart = (product: Product, size?: number, color?: string) => {
    const selectedSize = size || product.defaultSize || product.sizes[0];
    const selectedColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size: selectedSize,
          color: selectedColor,
          quantity: 1
        }
      ];
    });

    setCartCount(prev => prev + 1);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const isWishlisted = (productId: number) => wishlist.has(productId);

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        wishlist,
        toggleWishlist,
        isWishlisted
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
