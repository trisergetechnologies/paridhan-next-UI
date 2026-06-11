"use client";

import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { cartLineId, parseCartLineId } from "@/lib/cartLineId";
import { useToast } from "./ToastContext";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const MAX_LINE_ORDER = 50;

function mergeMaxQuantity(
  a: number | undefined,
  b: number | undefined
): number | undefined {
  const ca = a != null ? Math.min(MAX_LINE_ORDER, Math.max(0, a)) : undefined;
  const cb = b != null ? Math.min(MAX_LINE_ORDER, Math.max(0, b)) : undefined;
  if (ca == null) return cb;
  if (cb == null) return ca;
  return Math.min(ca, cb);
}

/* ================= TYPES ================= */

export interface CartItem {
  id: string;
  productId: string;
  /** URL segment for `/product/[slug]`; cart APIs still use `productId` (publicId). */
  productSlug?: string;
  /** Upper bound for line qty: min(50, stock). From API or set when adding as guest. */
  maxQuantity?: number;
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
  refreshCart: () => Promise<void>;
  mergeGuestCart: (opts?: { activeRole?: string | null }) => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

/* ================= HELPERS ================= */

type BackendCartItem = {
  productId?: string | null;
  productSlug?: string | null;
  maxQuantity?: number | null;
  variantPublicId?: string | null;
  variantLabel?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type BackendCartPayload = {
  items?: BackendCartItem[];
};

const mapBackendCart = (backendCart: BackendCartPayload | null | undefined): CartItem[] => {
  if (!backendCart?.items) return [];

  return backendCart.items.map((item) => {
    const productId = String(item.productId ?? "");
    const variantPublicId = item.variantPublicId
      ? String(item.variantPublicId)
      : undefined;
    const productSlug =
      item.productSlug != null && String(item.productSlug).trim()
        ? String(item.productSlug).trim()
        : undefined;
    const maxQuantity =
      item.maxQuantity != null && Number.isFinite(Number(item.maxQuantity))
        ? Math.min(
            MAX_LINE_ORDER,
            Math.max(0, Math.floor(Number(item.maxQuantity)))
          )
        : undefined;
    return {
      id: cartLineId(productId, variantPublicId),
      productId,
      productSlug,
      maxQuantity,
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
  const cartRef = useRef<CartItem[]>([]);
  cartRef.current = cart;
  const mergingGuestRef = useRef(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [pricing, setPricing] = useState({
    itemsTotal: 0,
    taxAmount: 0,
    deliveryCharge: 0,
    grandTotal: 0,
  });

  /* ================= PERSIST LOCAL CART ================= */
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  /* ================= BACKEND FETCH ================= */
  const fetchCartFromBackend = useCallback(async () => {
    try {
      const res = await authFetch(`${getBrowserApiBase()}/customer/cart`);
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
  }, []);

  useEffect(() => {
    const onRefresh = () => {
      if (isAuthenticated && user?.activeRole === "customer") {
        void fetchCartFromBackend();
      }
    };
    window.addEventListener("paridhan:cart-refresh", onRefresh);
    return () => window.removeEventListener("paridhan:cart-refresh", onRefresh);
  }, [isAuthenticated, user?.activeRole, fetchCartFromBackend]);

  const mergeGuestCart = useCallback(async (opts?: { activeRole?: string | null }) => {
    if (mergingGuestRef.current) return;

    const activeRole = opts?.activeRole ?? user?.activeRole;
    if (activeRole && activeRole !== "customer") {
      setCart([]);
      setPricing({ itemsTotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (!savedCart) return;

    mergingGuestRef.current = true;
    try {
      const items: CartItem[] = JSON.parse(savedCart);
      for (const item of items) {
        const res = await authFetch(`${getBrowserApiBase()}/customer/cart`, {
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
      setCartError(null);
    } catch {
      setCartError("Failed to merge guest cart");
    } finally {
      mergingGuestRef.current = false;
    }
  }, [user?.activeRole]);

  const mergeGuestCartAndFetch = useCallback(async () => {
    await mergeGuestCart();
    await fetchCartFromBackend();
  }, [mergeGuestCart, fetchCartFromBackend]);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (isAuthenticated) {
      void mergeGuestCartAndFetch();
    } else {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch {
          localStorage.removeItem("cart");
        }
      }
    }
  }, [isAuthenticated, user?.activeRole, mergeGuestCartAndFetch]);

  /* ================= ADD ================= */
  const addToCart = async (item: CartItem) => {
    const productId = item.productId || parseCartLineId(item.id).productId;
    const lineId = cartLineId(productId, item.variantPublicId);

    if (!isAuthenticated) {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === lineId);
        if (existing) {
          return prev.map((i) => {
            if (i.id !== lineId) return i;
            const cap = mergeMaxQuantity(i.maxQuantity, item.maxQuantity);
            const upper = Math.min(
              MAX_LINE_ORDER,
              cap != null ? cap : MAX_LINE_ORDER
            );
            const mergedQty = i.quantity + (item.quantity || 1);
            return {
              ...i,
              quantity: Math.min(mergedQty, Math.max(upper, 1)),
              productSlug: item.productSlug ?? i.productSlug,
              maxQuantity: cap ?? i.maxQuantity ?? item.maxQuantity,
            };
          });
        }
        return [
          ...prev,
          {
            ...item,
            id: lineId,
            productId,
            productSlug: item.productSlug,
            maxQuantity: item.maxQuantity,
            quantity: item.quantity || 1,
          },
        ];
      });
      showToast("Added to cart", "success");
      return;
    }
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    try {
      const res = await authFetch(`${getBrowserApiBase()}/customer/cart`, {
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
        await fetchCartFromBackend();
        return;
      }
      setCartError(null);
      showToast("Added to cart", "success");

      fetchCartFromBackend();
    } catch (error) {
      console.error("Add to cart failed:", error);
      await fetchCartFromBackend();
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
        `${getBrowserApiBase()}/customer/cart/${encodeURIComponent(productId)}${qs}`,
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
      const res = await authFetch(`${getBrowserApiBase()}/customer/cart`, {
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
        prev.map((item) => {
          if (item.id !== id) return item;
          const cap =
            item.maxQuantity != null
              ? Math.min(MAX_LINE_ORDER, Math.max(0, item.maxQuantity))
              : MAX_LINE_ORDER;
          const upper = Math.max(cap, 1);
          const next = Math.max(1, Math.min(Math.floor(quantity), upper));
          return { ...item, quantity: next };
        })
      );
      return;
    }
    if (user?.activeRole !== "customer") {
      setCartError("Cart is available only in customer mode");
      return;
    }

    const line = cartRef.current.find((i) => i.id === id);
    const cap =
      line?.maxQuantity != null
        ? Math.min(MAX_LINE_ORDER, Math.max(0, line.maxQuantity))
        : MAX_LINE_ORDER;
    const upper = Math.max(cap, 1);
    const target = Math.max(1, Math.min(Math.floor(quantity), upper));

    try {
      const res = await authFetch(`${getBrowserApiBase()}/customer/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: target,
          setQuantity: true,
          ...(variantPublicId ? { variantPublicId } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setCartError(json.message || `Update quantity failed (${res.status})`);
        showToast(json.message || "Update quantity failed", "error");
        await fetchCartFromBackend();
        return;
      }
      setCartError(null);
      showToast("Quantity updated", "success");

      fetchCartFromBackend();
    } catch (error) {
      console.error("Update quantity failed:", error);
      await fetchCartFromBackend();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartError,
        pricing,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        refreshCart: fetchCartFromBackend,
        mergeGuestCart,
      }}
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
