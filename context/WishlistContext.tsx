"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/lib/authFetch";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Matches backend `toPublicProductList` shape returned from GET /user/wishlist */
export type WishlistProduct = {
  publicId: string;
  slug: string;
  name: string;
  price: number;
  fromPrice?: number;
  toPrice?: number;
  description?: string;
  mrp?: number;
  variantOptions?: {
    publicId: string;
    label: string;
    price: number;
    stock: number;
  }[];
  defaultVariantPublicId?: string | null;
  images: { url?: string }[];
  categories?: { name?: string; slug?: string }[];
  isFeatured?: boolean;
  isActive?: boolean;
};

type WishlistContextValue = {
  items: WishlistProduct[];
  loading: boolean;
  error: string | null;
  count: number;
  refreshWishlist: () => Promise<void>;
  isWishlisted: (publicId: string) => boolean;
  /** Add or remove; returns true on success */
  toggleWishlist: (publicId: string) => Promise<boolean>;
  wishlistBusyId: string | null;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistBusyId, setWishlistBusyId] = useState<string | null>(null);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/wishlist`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(json.message || "Could not load wishlist");
        setItems([]);
        return;
      }
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError("Network error loading wishlist");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const publicIdSet = useMemo(
    () => new Set(items.map((p) => p.publicId)),
    [items]
  );

  const isWishlisted = useCallback(
    (publicId: string) => publicIdSet.has(publicId),
    [publicIdSet]
  );

  const toggleWishlist = useCallback(
    async (publicId: string): Promise<boolean> => {
      if (!publicId?.trim()) return false;

      setWishlistBusyId(publicId);
      try {
        const listed = publicIdSet.has(publicId);
        if (listed) {
          const res = await authFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/remove/${encodeURIComponent(publicId)}`,
            { method: "DELETE" }
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok || !json.success) {
            showToast(json.message || "Could not remove from wishlist", "error");
            return false;
          }
        } else {
          const res = await authFetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/wishlist/add`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: publicId }),
            }
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok || !json.success) {
            showToast(json.message || "Could not add to wishlist", "error");
            return false;
          }
        }
        await refreshWishlist();
        return true;
      } catch {
        showToast("Wishlist request failed", "error");
        return false;
      } finally {
        setWishlistBusyId(null);
      }
    },
    [publicIdSet, refreshWishlist, showToast]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      loading,
      error,
      count: items.length,
      refreshWishlist,
      isWishlisted,
      toggleWishlist,
      wishlistBusyId,
    }),
    [
      items,
      loading,
      error,
      refreshWishlist,
      isWishlisted,
      toggleWishlist,
      wishlistBusyId,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
