import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { PRODUCTS, type Product } from '../data/products';

export interface CartItem {
  id: string;
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

export interface UserAddress {
  street: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shoeSize: number;
  gender: string;
  birthDate: string;
  memberTier: string;
  memberPoints: number;
  joinedYear: number;
  address: UserAddress;
}

export interface OrderItemPreview {
  product: Product;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface UserOrder {
  id: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  total: number;
  itemsCount: number;
  trackingNumber: string;
  deliveryAddress: string;
  items: OrderItemPreview[];
}

interface PromoResult {
  success: boolean;
  message: string;
}

interface ShopContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, size?: number, color?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  promoCode: string;
  discountPercentage: number;
  discountAmount: number;
  applyPromoCode: (code: string) => PromoResult;
  removePromoCode: () => void;
  subtotal: number;
  shipping: number;
  freeShippingThreshold: number;
  tax: number;
  total: number;
  wishlist: Set<number>;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  // Auth & Profile
  user: UserProfile;
  orders: UserOrder[];
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updateAddress: (updatedAddress: Partial<UserAddress>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEY_CART = 'tekkies_cart_v1';
const STORAGE_KEY_WISHLIST = 'tekkies_wishlist_v1';
const STORAGE_KEY_PROMO = 'tekkies_promo_v1';
const STORAGE_KEY_USER = 'tekkies_user_v1';
const STORAGE_KEY_AUTH = 'tekkies_auth_v1';

const FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING_FEE = 150;

// Valid Promo Codes
const VALID_PROMOS: Record<string, number> = {
  TEKKIE20: 20, // 20% discount
  WELCOME10: 10, // 10% discount
  AIRMAX: 15, // 15% discount
};

const DEFAULT_USER_PROFILE: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+27 82 555 1234',
  shoeSize: 9,
  gender: 'Male',
  birthDate: '14 March 1996',
  memberTier: 'ELITE VIP MEMBER',
  memberPoints: 2450,
  joinedYear: 2024,
  address: {
    street: '123 Bree Street',
    apartment: 'Suite 402, The Obsidian Tower',
    city: 'Cape Town',
    province: 'Western Cape',
    postalCode: '8001',
    country: 'South Africa',
    instructions: 'Leave with security / concierge at main entrance during office hours.'
  }
};

const DEFAULT_ORDERS: UserOrder[] = [
  {
    id: '#TS-849201',
    date: '22 August 2026',
    status: 'Delivered',
    total: 6198,
    itemsCount: 3,
    trackingNumber: 'RAM-ZA-8920194',
    deliveryAddress: '123 Bree Street, Suite 402, Cape Town, 8001',
    items: [
      {
        product: PRODUCTS[0] || {
          id: 1,
          name: "Air Max Elite 'Obsidian Orange'",
          brand: 'NIKE',
          price: 3499,
          image: '/Air Force 1 orange & white.png',
          images: ['/Air Force 1 orange & white.png'],
          description: 'Streetwear sneaker',
          rating: 4.9,
          reviewCount: 128,
          colors: [{ name: 'Orange', hex: '#ff4500' }],
          sizes: [9],
          category: 'Unisex'
        },
        size: 9,
        color: 'Orange',
        quantity: 1,
        price: 3499
      },
      {
        product: PRODUCTS[1] || {
          id: 2,
          name: 'Speedform Pro V2',
          brand: 'UNDER ARMOUR',
          price: 2699,
          image: '/Nike Free 4.0 Flyknit.png',
          images: ['/Nike Free 4.0 Flyknit.png'],
          description: 'High performance',
          rating: 4.8,
          reviewCount: 94,
          colors: [{ name: 'Black', hex: '#111111' }],
          sizes: [8],
          category: 'Men'
        },
        size: 8,
        color: 'Black',
        quantity: 1,
        price: 2699
      }
    ]
  },
  {
    id: '#TS-793140',
    date: '15 July 2026',
    status: 'Delivered',
    total: 3199,
    itemsCount: 1,
    trackingNumber: 'RAM-ZA-7931402',
    deliveryAddress: '123 Bree Street, Suite 402, Cape Town, 8001',
    items: [
      {
        product: PRODUCTS[2] || PRODUCTS[0],
        size: 9,
        color: 'Black',
        quantity: 1,
        price: 3199
      }
    ]
  }
];

const getInitialCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
  }

  // Initial boutique seed items if none found
  const p1 = PRODUCTS[0];
  const p2 = PRODUCTS[1];
  const initialItems: CartItem[] = [];

  if (p1) {
    initialItems.push({
      id: `${p1.id}-9-Orange`,
      product: p1,
      size: 9,
      color: 'Orange',
      quantity: 1,
    });
  }

  if (p2) {
    initialItems.push({
      id: `${p2.id}-8-Black`,
      product: p2,
      size: 8,
      color: 'Black',
      quantity: 2,
    });
  }

  return initialItems;
};

const getInitialWishlist = (): Set<number> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to load wishlist from localStorage', e);
  }
  return new Set();
};

const getInitialUser = (): UserProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user profile from localStorage', e);
  }
  return DEFAULT_USER_PROFILE;
};

const getInitialAuth = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load auth status from localStorage', e);
  }
  return true; // Default authenticated for demonstration of profile
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const [wishlist, setWishlist] = useState<Set<number>>(getInitialWishlist);
  const [user, setUser] = useState<UserProfile>(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuth);
  const [orders] = useState<UserOrder[]>(DEFAULT_ORDERS);

  const [promoCode, setPromoCode] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PROMO) || '';
    } catch {
      return '';
    }
  });

  // Save Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Save Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(Array.from(wishlist)));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Save User to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  // Save Auth to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
  }, [isAuthenticated]);

  // Save Promo Code to localStorage
  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem(STORAGE_KEY_PROMO, promoCode);
      } else {
        localStorage.removeItem(STORAGE_KEY_PROMO);
      }
    } catch (e) {
      console.error('Failed to save promo code to localStorage', e);
    }
  }, [promoCode]);

  // Cart total count
  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Subtotal in ZAR
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  // Discount Calculation
  const discountPercentage = useMemo(() => {
    const upper = promoCode.trim().toUpperCase();
    return VALID_PROMOS[upper] || 0;
  }, [promoCode]);

  const discountAmount = useMemo(() => {
    if (discountPercentage > 0 && subtotal > 0) {
      return (subtotal * discountPercentage) / 100;
    }
    return 0;
  }, [subtotal, discountPercentage]);

  // Shipping Calculation: Free above threshold or if cart is empty
  const shipping = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [cartItems.length, subtotal]);

  // Tax calculation (15% South African VAT included in price)
  const tax = useMemo(() => {
    if (subtotal === 0) return 0;
    const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
    return effectiveSubtotal * 0.15;
  }, [subtotal, discountAmount]);

  // Final Total
  const total = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    return discountedSubtotal + shipping;
  }, [cartItems.length, subtotal, discountAmount, shipping]);

  // Add To Cart
  const addToCart = (product: Product, size?: number, color?: string, quantity: number = 1) => {
    const selectedSize = size || product.defaultSize || product.sizes[0] || 9;
    const selectedColor = color || (product.colors[0] ? product.colors[0].name : 'Default');
    const itemId = `${product.id}-${selectedSize}-${selectedColor}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          size: selectedSize,
          color: selectedColor,
          quantity: Math.max(1, quantity)
        }
      ];
    });
  };

  // Update Quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  // Remove From Cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
  };

  // Apply Promo Code
  const applyPromoCode = (code: string): PromoResult => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a voucher code.' };
    }
    if (VALID_PROMOS[cleanCode]) {
      setPromoCode(cleanCode);
      return {
        success: true,
        message: `Voucher "${cleanCode}" applied! You saved ${VALID_PROMOS[cleanCode]}%.`
      };
    }
    return {
      success: false,
      message: `Invalid voucher code "${cleanCode}". Try "TEKKIE20".`
    };
  };

  // Remove Promo Code
  const removePromoCode = () => {
    setPromoCode('');
  };

  // Wishlist Toggle
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

  // Auth Functions
  const login = (email?: string) => {
    if (email && email.trim()) {
      setUser(prev => ({ ...prev, email: email.trim() }));
    }
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const updateAddress = (updatedAddress: Partial<UserAddress>) => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ...updatedAddress
      }
    }));
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        promoCode,
        discountPercentage,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        subtotal,
        shipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        tax,
        total,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        orders,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        updateAddress
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
