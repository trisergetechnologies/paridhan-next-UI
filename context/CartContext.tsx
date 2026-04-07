"use client";

import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { cartLineId, parseCartLineId } from "@/lib/cartLineId";
import { useToast } from "./ToastContext";
import React, { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */

export interface CartItem {
  id: string;
  productId: string;
  variantPublicId?: string;
  variantLabel?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  cartError: string | null;
  pricing: {
    itemsTotal: number;
    taxAmount: number;
    deliveryCharge: number;
    grandTotal: number;
  };
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

/* ================= HELPERS ================= */

const mapBackendCart = (backendCart: any): CartItem[] => {
  if (!backendCart?.items) return [];

  return backendCart.items.map((item: any) => {
    const productId = String(item.productId ?? "");
    const variantPublicId = item.variantPublicId
      ? String(item.variantPublicId)
      : undefined;
    return {
      id: cartLineId(productId, variantPublicId),
      productId,
      variantPublicId,
      variantLabel: item.variantLabel,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    };
  });
};

/* ================= PROVIDER ================= */

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartError, setCartError] = useState<string | null>(null);
  const [pricing, setPricing] = useState({
    itemsTotal: 0,
    taxAmount: 0,
    deliveryCharge: 0,
    grandTotal: 0,
  });

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCartAndFetch();
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated, user?.activeRole]);

  /* ================= PERSIST LOCAL CART ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  /* ================= BACKEND FETCH ================= */
  const fetchCartFromBackend = async () => {
    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`);
      if (!res.ok) {
        setCartError(`Failed to fetch cart (${res.status})`);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setCartError(null);
        setCart(mapBackendCart(json.data));
        setPricing({
          itemsTotal: json.data.itemsTotal || 0,
          taxAmount: json.data.taxAmount || 0,
          deliveryCharge: json.data.deliveryCharge || 0,
          grandTotal: json.data.grandTotal || 0,
        });
      } else {
        setCartError(json.message || "Failed to fetch cart");
      }
    } catch (error) {
      console.error("Fetch cart failed:", error);
      setCartError("Unable to fetch cart due to network/service issue");
    }
  };

  const mergeGuestCartAndFetch = async () => {
    if (user?.activeRole && user.activeRole !== "customer") {
      setCart([]);
      setPricing({ itemsTotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });
      return;
    }
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        for (const item of items) {
          const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: item.productId,
              quantity: Math.max(1, item.quantity),
              ...(item.variantPublicId
                ? { variantPublicId: item.variantPublicId }
                : {}),
            }),
          });
          if (!res.ok) {
            setCartError(`Failed to merge guest cart item (${res.status})`);
          }
        }
        localStorage.removeItem("cart");
      } catch {
        setCartError("Failed to merge guest cart");
      }
    }
    await fetchCartFromBackend();
  };

  /* ================= ADD ================= */
  const addToCart = async (item: CartItem) => {
    const productId = item.productId || parseCartLineId(item.id).productId;
    const lineId = cartLineId(productId, item.variantPublicId);

    if (!isAuthenticated) {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === lineId);
        if (existing) {
          return prev.map((i) =>
            i.id === lineId
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        }
        return [
          ...prev,
          {
            ...item,
            id: lineId,
            productId,
            quantity: item.quantity || 1,
          },
        ];
      });
      return;
    }
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: item.quantity ?? 1,
          ...(item.variantPublicId
            ? { variantPublicId: item.variantPublicId }
            : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCartError(json.message || `Add to cart failed (${res.status})`);
        showToast(json.message || "Add to cart failed", "error");
        return;
      }
      setCartError(null);
      showToast("Added to cart", "success");

      fetchCartFromBackend();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  /* ================= REMOVE ================= */
  const removeFromCart = async (id: string) => {
    if (!isAuthenticated) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    const { productId, variantPublicId } = parseCartLineId(id);
    const qs = variantPublicId
      ? `?variantPublicId=${encodeURIComponent(variantPublicId)}`
      : "";

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/cart/${encodeURIComponent(productId)}${qs}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCartError(json.message || `Remove failed (${res.status})`);
        showToast(json.message || "Remove failed", "error");
        return;
      }
      setCartError(null);
      showToast("Removed from cart", "info");

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
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCartError(json.message || `Clear cart failed (${res.status})`);
        showToast(json.message || "Clear cart failed", "error");
        return;
      }
      setCartError(null);
      showToast("Cart cleared", "info");
      await fetchCartFromBackend();
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (id: string, quantity: number) => {
    const { productId, variantPublicId } = parseCartLineId(id);

    if (!isAuthenticated) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      );
      return;
    }
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          ...(variantPublicId ? { variantPublicId } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCartError(json.message || `Update quantity failed (${res.status})`);
        showToast(json.message || "Update quantity failed", "error");
        return;
      }
      setCartError(null);
      showToast("Quantity updated", "success");

      fetchCartFromBackend();
    } catch (error) {
      console.error("Update quantity failed:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, cartError, pricing, addToCart, removeFromCart, clearCart, updateQuantity }}
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
