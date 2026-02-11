"use client";

import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/tokenHelper";
import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */

interface CartItem {
  id: number; // frontend expects number
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

/* ================= HELPERS ================= */

// Backend → Frontend mapper
const mapBackendCart = (backendCart: any): CartItem[] => {
  if (!backendCart?.items) return [];

  return backendCart.items.map((item: any) => ({
    id: Number(item.product), // ObjectId → number-compatible key
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  }));
};

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromBackend();
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated]);

  /* ================= PERSIST LOCAL CART ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  /* ================= BACKEND FETCH ================= */
  const fetchCartFromBackend = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        setCart(mapBackendCart(json.data));
      }
    } catch (error) {
      console.error("Fetch cart failed:", error);
    }
  };

  /* ================= ADD ================= */
  const addToCart = async (item: CartItem) => {
    if (!isAuthenticated) {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      return;
    }

    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.id,
          quantity: 1,
        }),
      });

      fetchCartFromBackend();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  /* ================= REMOVE ================= */
  const removeFromCart = async (id: number) => {
    if (!isAuthenticated) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    try {
      const token = await getToken();
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartFromBackend();
    } catch (error) {
      console.error("Remove from cart failed:", error);
    }
  };

  /* ================= CLEAR ================= */
  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      localStorage.removeItem("cart");
      return;
    }

    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]);
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (id: number, quantity: number) => {
    if (!isAuthenticated) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
      return;
    }

    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });

      fetchCartFromBackend();
    } catch (error) {
      console.error("Update quantity failed:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
