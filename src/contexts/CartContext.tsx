import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem } from '@/lib/mockData';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number; // percentage or fixed amount
  type: 'percentage' | 'fixed';
  minOrder?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Available coupons (in a real app, this would come from the backend)
  const availableCoupons: Coupon[] = [
    { code: 'SAVE10', discount: 10, type: 'percentage', minOrder: 20 },
    { code: 'SAVE20', discount: 20, type: 'percentage', minOrder: 50 },
    { code: 'FLAT5', discount: 5, type: 'fixed', minOrder: 15 },
    { code: 'WELCOME15', discount: 15, type: 'percentage', minOrder: 30 },
    { code: 'FREESHIP', discount: 3.99, type: 'fixed', minOrder: 25 },
  ];

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.item.id === item.id);

      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prev, { item, quantity }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return false; // Invalid coupon code
    }

    const subtotal = getTotalPrice();
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return false; // Minimum order not met
    }

    setAppliedCoupon(coupon);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getDiscountAmount = (): number => {
    if (!appliedCoupon) return 0;

    const subtotal = getTotalPrice();
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  const getFinalTotal = (): number => {
    const subtotal = getTotalPrice();
    const deliveryFee = 3.99;
    const tax = subtotal * 0.08;
    const discount = getDiscountAmount();
    return subtotal + deliveryFee + tax - discount;
  };

  const value: CartContextType = {
    cartItems,
    appliedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
