import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { useAuth } from './AuthContext';
import { router } from '../routes';
import cartService, { BackendCartItem } from '../services/cartService';

import { ShoeVariant, ShoeSize } from '../types/shoeVariant';

export interface CartItem {
  cartId: string; // Composite key: `${product.id}-${variantId || size}` (frontend line identity)
  cartItemId: string; // Persistent unique backend CartItem UUID
  product: ShoeProduct;
  size: string;
  quantity: number;
  addedAt: number;
  variantId?: string;
  sizeRegion?: string;
  colour?: string;
  variant?: ShoeVariant;
  shoeSize?: ShoeSize;
}

const parseShoeSize = (sizeStr?: string, defaultRegion = 'UK'): { sizeValue: number; sizeRegion: string } => {
  const fallbackRegion = defaultRegion || 'UK';
  if (!sizeStr) return { sizeValue: 0, sizeRegion: fallbackRegion };
  const match = sizeStr.match(/^(?:([A-Za-z]+)\s*)?([0-9]+(?:\.[0-9]+)?)/);
  if (match) {
    const region = match[1] || fallbackRegion;
    const val = parseFloat(match[2]);
    return { sizeValue: isNaN(val) ? 0 : val, sizeRegion: region || fallbackRegion };
  }
  return { sizeValue: 0, sizeRegion: fallbackRegion };
};



interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: ShoeProduct,
    size?: string,
    quantity?: number,
    variant?: ShoeVariant | { variantId?: string; sizeRegion?: string; colour?: string; size?: string }
  ) => Promise<boolean>;
  removeFromCart: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'tekkie_store_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive stable cart identifier for authenticated user
  const userCartId = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    return user.customerId || `cart_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }, [isAuthenticated, user]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // Ensure all items loaded from localStorage have a valid cartItemId
      return parsed.map((item: any) => ({
        ...item,
        cartItemId: item.cartItemId || crypto.randomUUID(),
      }));
    } catch (err) {
      console.error('Failed to load cart from localStorage', err);
      return [];
    }
  });

  // Keep localStorage in sync for instant UX and offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart to localStorage', err);
    }
  }, [cart]);

  const getEffectivePrice = (product: ShoeProduct): number => {
    return product.isOnSale && product.salePrice ? product.salePrice : product.price;
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + getEffectivePrice(item.product) * item.quantity, 0);
  }, [cart]);

  /**
   * Refreshes the cart from the backend using Axios.
   * Reads the user's cart and cart items from Spring Boot while preserving backend cartItemId UUIDs.
   */
  const refreshCart = useCallback(async () => {
    if (!userCartId) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Retrieve cart summary from backend
      await cartService.getCart(userCartId);

      // 2. Retrieve all cart items from backend
      const allItems = await cartService.getAllCartItems();

      // Synchronize local cart items with backend records
      setCart((prev) => {
        const updated: CartItem[] = [];

        for (const localItem of prev) {
          // Check if item exists in backend by cartItemId
          let backendItem = allItems.find((b) => b.cartItemId === localItem.cartItemId);

          // Backward compatibility: check if there's a legacy composite item ${userCartId}___${cartId}
          if (!backendItem) {
            const legacyBackendId = `${userCartId}___${localItem.cartId}`;
            backendItem = allItems.find((b) => b.cartItemId === legacyBackendId);
          }

          if (backendItem) {
            // Preserve backend cartItemId, sync quantity, and restore connected variant & shoe size
            const fallbackRegion = localItem.sizeRegion || 'UK';
            const restoredVariantId = backendItem.shoeVariant?.variantId || localItem.variantId;
            const restoredShoeSize = backendItem.shoeSize || localItem.shoeSize || parseShoeSize(localItem.size, fallbackRegion);
            const restoredRegion = backendItem.shoeSize?.sizeRegion || fallbackRegion;
            const restoredSize = backendItem.shoeSize
              ? `${restoredRegion} ${backendItem.shoeSize.sizeValue}`
              : localItem.size;

            updated.push({
              ...localItem,
              cartItemId: backendItem.cartItemId,
              quantity: backendItem.quantity,
              variantId: restoredVariantId,
              sizeRegion: restoredRegion,
              size: restoredSize,
              shoeSize: restoredShoeSize,
            });
          } else {
            // Keep local item with its existing cartItemId
            updated.push(localItem);
          }
        }

        return updated;
      });

      // Synchronize any local items missing on the backend
      for (const item of cart) {
        const exists = allItems.some(
          (b) => b.cartItemId === item.cartItemId || b.cartItemId === `${userCartId}___${item.cartId}`
        );
        if (!exists) {
          const price = getEffectivePrice(item.product);
          const fallbackRegion = item.sizeRegion || 'UK';
          const shoeSizeObj = (item.shoeSize && item.shoeSize.sizeRegion)
            ? { sizeValue: item.shoeSize.sizeValue, sizeRegion: item.shoeSize.sizeRegion || fallbackRegion }
            : (item.variant?.size
              ? { sizeValue: item.variant.size.sizeValue, sizeRegion: item.variant.size.sizeRegion || fallbackRegion }
              : parseShoeSize(item.size, fallbackRegion));

          await cartService.createCartItem({
            cartItemId: item.cartItemId,
            cart: { cartId: userCartId },
            shoe: { shoeId: item.product.id },
            shoeVariant: item.variantId ? { variantId: item.variantId } : null,
            shoeSize: shoeSizeObj,
            quantity: item.quantity,
            unitPrice: price,
            subTotal: price * item.quantity,
          });
        }
      }

      // Update backend cart total amount
      await cartService.updateCart({
        cartId: userCartId,
        totalAmount: cartTotal,
      });
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        router.navigate('/login');
      } else {
        setError('Unable to synchronize cart with the server. Local cart remains active.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userCartId, cart, cartTotal, logout]);

  // Synchronize cart on initial auth or user change
  useEffect(() => {
    if (isAuthenticated && userCartId) {
      refreshCart();
    }
  }, [isAuthenticated, userCartId, refreshCart]);

  /**
   * Adds an item to the cart.
   * REQUIREMENT: Unauthenticated users are immediately redirected to /login.
   */
  const addToCart = async (
    product: ShoeProduct,
    size?: string,
    quantity = 1,
    variant?: ShoeVariant | { variantId?: string; sizeRegion?: string; colour?: string; size?: string }
  ): Promise<boolean> => {
    // 1. Strict Authentication Check
    if (!isAuthenticated) {
      router.navigate('/login');
      return false;
    }

    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'UK 8');
    const variantId = variant && 'variantId' in variant ? variant.variantId : undefined;
    const cartId = variantId ? `${product.id}-${variantId}` : `${product.id}-${selectedSize}`;
    const unitPrice = getEffectivePrice(product);

    const existingIndex = cart.findIndex((item) => item.cartId === cartId);
    const isExisting = existingIndex > -1;

    // Distinguish cart line ID from backend cart item ID (UUID)
    let targetCartItemId: string;
    let newQuantity: number;

    if (isExisting) {
      // Reuse existing cartItemId UUID for quantity changes
      targetCartItemId = cart[existingIndex].cartItemId;
      newQuantity = cart[existingIndex].quantity + quantity;
    } else {
      // Generate collision-safe UUID for brand new CartItem
      targetCartItemId = crypto.randomUUID();
      newQuantity = quantity;
    }

    const selectedColour = (variant && 'colour' in variant && variant.colour) ? variant.colour : product.colour;
    const sizeRegion =
      (variant && 'size' in variant && variant.size && typeof variant.size === 'object' && variant.size.sizeRegion)
      || (variant && 'sizeRegion' in variant && variant.sizeRegion)
      || 'UK';

    const shoeSizeObj: ShoeSize =
      variant && 'size' in variant && variant.size
        ? typeof variant.size === 'object'
          ? { sizeValue: variant.size.sizeValue, sizeRegion: variant.size.sizeRegion || sizeRegion }
          : parseShoeSize(variant.size, sizeRegion)
        : parseShoeSize(selectedSize, sizeRegion);


    // 2. Update local state
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.cartId === cartId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: newQuantity,
          variantId: variantId || updated[idx].variantId,
          sizeRegion: sizeRegion || updated[idx].sizeRegion,
          colour: selectedColour || updated[idx].colour,
          shoeSize: shoeSizeObj || updated[idx].shoeSize,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartId,
          cartItemId: targetCartItemId,
          product: selectedColour && selectedColour !== product.colour ? { ...product, colour: selectedColour } : product,
          size: selectedSize,
          sizeRegion,
          colour: selectedColour,
          variantId,
          variant: variant && 'stockQuantity' in variant ? (variant as ShoeVariant) : undefined,
          shoeSize: shoeSizeObj,
          quantity: newQuantity,
          addedAt: Date.now(),
        },
      ];
    });

    // 3. Persist to Spring Boot backend via Axios
    if (userCartId) {
      try {
        const subTotal = unitPrice * newQuantity;

        const newTotal = cartTotal + unitPrice * quantity;
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });

        const backendPayload: BackendCartItem = {
          cartItemId: targetCartItemId,
          cart: { cartId: userCartId },
          shoe: { shoeId: product.id },
          shoeVariant: variantId ? { variantId } : null,
          shoeSize: shoeSizeObj,
          quantity: newQuantity,
          unitPrice,
          subTotal,
        };

        if (isExisting) {
          // EXISTING ITEM: Reuse UUID and POST /cartitem/update
          await cartService.updateCartItem(backendPayload);
        } else {
          // NEW ITEM: Persist newly generated UUID and POST /cartitem/create
          await cartService.createCartItem(backendPayload);
        }
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
          return false;
        }
        console.warn('[CartContext] Failed to persist add-to-cart to backend:', err);
      }
    }

    return true;
  };

  /**
   * Updates quantity for an existing cart item.
   */
  const updateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    const itemToUpdate = cart.find((item) => item.cartId === cartId);
    if (!itemToUpdate) return;

    const unitPrice = getEffectivePrice(itemToUpdate.product);

    // Update state
    setCart((prev) =>
      prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );

    // Update backend via Axios with existing cartItemId UUID
    if (userCartId && itemToUpdate.cartItemId) {
      try {
        const subTotal = unitPrice * quantity;
        const fallbackRegion = itemToUpdate.sizeRegion || 'UK';
        const shoeSizeObj = (itemToUpdate.shoeSize && itemToUpdate.shoeSize.sizeRegion)
          ? { sizeValue: itemToUpdate.shoeSize.sizeValue, sizeRegion: itemToUpdate.shoeSize.sizeRegion || fallbackRegion }
          : (itemToUpdate.variant?.size
            ? { sizeValue: itemToUpdate.variant.size.sizeValue, sizeRegion: itemToUpdate.variant.size.sizeRegion || fallbackRegion }
            : parseShoeSize(itemToUpdate.size, fallbackRegion));

        await cartService.updateCartItem({
          cartItemId: itemToUpdate.cartItemId,
          cart: { cartId: userCartId },
          shoe: { shoeId: itemToUpdate.product.id },
          shoeVariant: itemToUpdate.variantId ? { variantId: itemToUpdate.variantId } : null,
          shoeSize: shoeSizeObj,
          quantity,
          unitPrice,
          subTotal,
        });

        // Recalculate totals
        const newTotal = cart.reduce((acc, curr) => {
          const price = getEffectivePrice(curr.product);
          const q = curr.cartId === cartId ? quantity : curr.quantity;
          return acc + price * q;
        }, 0);

        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to update quantity on backend:', err);
        }
      }
    }
  };

  /**
   * Removes an item from the cart.
   */
  const removeFromCart = async (cartId: string) => {
    const itemToRemove = cart.find((item) => item.cartId === cartId);

    // Update state
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));

    // Delete on backend via Axios using real backend cartItemId UUID
    if (userCartId && itemToRemove?.cartItemId) {
      try {
        await cartService.deleteCartItem(itemToRemove.cartItemId);

        const newTotal = cart
          .filter((item) => item.cartId !== cartId)
          .reduce((acc, curr) => acc + getEffectivePrice(curr.product) * curr.quantity, 0);

        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: newTotal,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to delete cart item on backend:', err);
        }
      }
    }
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = async () => {
    const prevCart = [...cart];
    setCart([]);

    if (userCartId) {
      try {
        for (const item of prevCart) {
          if (item.cartItemId) {
            await cartService.deleteCartItem(item.cartItemId);
          }
        }
        await cartService.updateCart({
          cartId: userCartId,
          totalAmount: 0,
        });
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          logout();
          router.navigate('/login');
        } else {
          console.warn('[CartContext] Failed to clear cart on backend:', err);
        }
      }
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    cartCount,
    cartTotal,
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
