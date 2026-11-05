import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'novastore_cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed reading cart from localStorage', err);
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed saving cart to localStorage', err);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) return false;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const qty = Math.min(product.stock, Math.max(1, quantity));
        return [...prev, { ...product, quantity: qty }];
      }
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock ?? 99;
          const cappedQty = Math.min(maxStock, quantity);
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setPromoDiscountRate(0);
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE10') {
      setPromoCode('SAVE10');
      setPromoDiscountRate(0.10);
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'SUPER20') {
      setPromoCode('SUPER20');
      setPromoDiscountRate(0.20);
      return { success: true, message: '20% discount applied!' };
    } else if (clean === 'FREESHIP') {
      setPromoCode('FREESHIP');
      setPromoDiscountRate(0.01); // indicator
      return { success: true, message: 'Free express shipping applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try SAVE10 or SUPER20' };
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoDiscountRate(0);
  };

  // Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (promoDiscountRate > 0 && promoCode !== 'FREESHIP') {
    discountAmount = subtotal * promoDiscountRate;
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% sales tax

  let shipping = 0;
  if (cart.length > 0) {
    if (promoCode === 'FREESHIP' || subtotal >= 100) {
      shipping = 0;
    } else {
      shipping = 9.99;
    }
  }

  const grandTotal = Math.max(0, taxableAmount + tax + shipping);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        promoCode,
        applyPromo,
        removePromo,
        tax,
        shipping,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
