"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Product, getVariantStockQuantity } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: {
    memory?: string;
    color?: string;
    size?: string;
  };
  price: number; // Price at time of adding to cart
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    selectedVariants?: { memory?: string; color?: string; size?: string },
    price?: number
  ) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Helper function to create a unique key for product + variant combination
export function getCartItemKey(productId: string, variants?: { memory?: string; color?: string; size?: string }): string {
  if (!variants || (!variants.memory && !variants.color && !variants.size)) {
    return productId;
  }
  const variantStr = JSON.stringify(variants);
  return `${productId}__${variantStr}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    product: Product,
    quantity: number,
    selectedVariants?: { memory?: string; color?: string; size?: string },
    price?: number
  ) => {
    setCartItems((prevItems) => {
      const available = Math.max(0, product.quantity ?? 0);
      if (available === 0) {
        return prevItems;
      }
      const itemKey = getCartItemKey(product.id, selectedVariants);
      const existingItem = prevItems.find(
        (item) => getCartItemKey(item.product.id, item.selectedVariants) === itemKey
      );

      const availableForVariant = getVariantStockQuantity(product, selectedVariants);
      const existingQuantity = existingItem?.quantity ?? 0;
      const remaining = Math.max(0, availableForVariant - existingQuantity);

      if (existingItem) {
        if (remaining <= 0) {
          return prevItems;
        }
        return prevItems.map((item) =>
          getCartItemKey(item.product.id, item.selectedVariants) === itemKey
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, availableForVariant),
              }
            : item
        );
      }

      const initialQuantity = Math.min(quantity, remaining);
      if (initialQuantity <= 0) {
        return prevItems;
      }

      return [
        ...prevItems,
        {
          product,
          quantity: initialQuantity,
          selectedVariants,
          price: price ?? product.price,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, variantKey?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const itemKey = getCartItemKey(item.product.id, item.selectedVariants);
        const targetKey = variantKey ?? productId;
        return itemKey !== targetKey;
      })
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantKey?: string) => {
    setCartItems((prevItems) =>
      prevItems.flatMap((item) => {
        const itemKey = getCartItemKey(item.product.id, item.selectedVariants);
        const targetKey = variantKey ?? productId;
        if (itemKey !== targetKey) {
          return item;
        }

        const available = Math.max(0, getVariantStockQuantity(item.product, item.selectedVariants));
        const nextQuantity = Math.min(Math.max(1, quantity), available);
        if (available === 0) {
          return [];
        }
        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
