"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const GUEST_WISHLIST_KEY = "wishlist";

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
  toggleWishlist: (publicId: string, snapshot?: WishlistProduct) => Promise<boolean>;
  wishlistBusyId: string | null;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

function loadGuestWishlist(): WishlistProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function minimalSnapshot(publicId: string): WishlistProduct {
  return {
    publicId,
    slug: publicId,
    name: "",
    price: 0,
    images: [],
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistBusyId, setWishlistBusyId] = useState<string | null>(null);
  const [guestHydrated, setGuestHydrated] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `${getBrowserApiBase()}/user/wishlist`,
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

  const mergeGuestWishlistAndFetch = useCallback(async () => {
    const saved = loadGuestWishlist();
    if (saved.length > 0) {
      try {
        for (const item of saved) {
          const res = await authFetch(
            `${getBrowserApiBase()}/user/wishlist/add`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: item.publicId }),
            }
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok || !json.success) {
            const msg = String(json.message || "").toLowerCase();
            if (!msg.includes("already")) {
              setError(json.message || "Failed to merge wishlist item");
            }
          }
        }
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      } catch {
        setError("Failed to merge wishlist");
      }
    }
    await refreshWishlist();
  }, [refreshWishlist]);

  useEffect(() => {
    if (isAuthenticated) {
      setGuestHydrated(false);
      void mergeGuestWishlistAndFetch();
    } else {
      setItems(loadGuestWishlist());
      setError(null);
      setLoading(false);
      setGuestHydrated(true);
    }
  }, [isAuthenticated, mergeGuestWishlistAndFetch]);

  useEffect(() => {
    if (!isAuthenticated && guestHydrated) {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated, guestHydrated]);

  const publicIdSet = useMemo(
    () => new Set(items.map((p) => p.publicId)),
    [items]
  );

  const isWishlisted = useCallback(
    (publicId: string) => publicIdSet.has(publicId),
    [publicIdSet]
  );

  const toggleWishlist = useCallback(
    async (publicId: string, snapshot?: WishlistProduct): Promise<boolean> => {
      if (!publicId?.trim()) return false;

      setWishlistBusyId(publicId);

      try {
        if (!isAuthenticated) {
          const listed = publicIdSet.has(publicId);
          if (listed) {
            setItems((prev) => prev.filter((p) => p.publicId !== publicId));
            showToast("Removed from wishlist", "info");
          } else {
            const entry = snapshot ?? minimalSnapshot(publicId);
            setItems((prev) => {
              if (prev.some((p) => p.publicId === publicId)) return prev;
              return [...prev, entry];
            });
            showToast("Added to wishlist", "success");
          }
          return true;
        }

        const listed = publicIdSet.has(publicId);
        if (listed) {
          const res = await authFetch(
            `${getBrowserApiBase()}/user/wishlist/remove/${encodeURIComponent(publicId)}`,
            { method: "DELETE" }
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok || !json.success) {
            showToast(json.message || "Could not remove from wishlist", "error");
            return false;
          }
          showToast("Removed from wishlist", "info");
        } else {
          const res = await authFetch(
            `${getBrowserApiBase()}/user/wishlist/add`,
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
          showToast("Added to wishlist", "success");
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
    [isAuthenticated, publicIdSet, refreshWishlist, showToast]
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
