import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kape_muna_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrderCode, setActiveOrderCode] = useState(() => {
    try {
      return localStorage.getItem('kape_muna_active_order') || 'KM-108';
    } catch {
      return 'KM-108';
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kape_muna_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage error saving cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (activeOrderCode) {
        localStorage.setItem('kape_muna_active_order', activeOrderCode);
      }
    } catch (e) {
      console.warn('LocalStorage error saving order code:', e);
    }
  }, [activeOrderCode]);

  const addToCart = (newItem) => {
    setCartItems((prev) => {
      // Create signature for same item with exact same customizations
      const signature = `${newItem.menu_item_id}-${newItem.selected_size}-${newItem.selected_sweetness}-${newItem.selected_milk}-${newItem.selected_shots}-${newItem.special_notes || ''}`;

      const existingIndex = prev.findIndex((item) => item.signature === signature);

      if (existingIndex > -1) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          line_total: current.unit_price * newQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...newItem,
          cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          signature,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              line_total: item.unit_price * newQty,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, it) => acc + (it.line_total || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        activeOrderCode,
        setActiveOrderCode,
        isCartOpen,
        setIsCartOpen,
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
