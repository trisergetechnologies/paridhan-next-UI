"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CatalogGridCard from "./CatalogGridCard";

type VariantOption = {
  publicId: string;
  label: string;
  price: number;
  stock: number;
};

interface Product {
  publicId: string;
  slug: string;
  name: string;
  price: number;
  fromPrice?: number;
  toPrice?: number;
  mrp?: number | null;
  defaultVariantPublicId?: string | null;
  description?: string;
  variantOptions?: VariantOption[];
  categories?: { name?: string; slug?: string }[];
  images: { url: string }[];
  isFeatured?: boolean;
}

export type ProductListVariant = "embedded" | "page";

type ProductListProps = {
  variant?: ProductListVariant;
};

const selectClassName = cn(
  "flex h-9 w-full shrink-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
  "transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  "disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
);

function ProductListToolbar({
  variant,
  search,
  sort,
  inStock,
  onSearchChange,
  onSortChange,
  onInStockChange,
}: {
  variant: ProductListVariant;
  search: string;
  sort: string;
  inStock: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onInStockChange: (checked: boolean) => void;
}) {
  const isPage = variant === "page";

  const fields = (
    <>
      {isPage ? (
        <div className="w-full space-y-2 sm:min-w-[200px] sm:max-w-md sm:flex-1">
          <label htmlFor="product-search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="product-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
          />
        </div>
      ) : (
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border px-3 py-2 sm:min-w-[200px] sm:max-w-md sm:flex-1"
        />
      )}

      {isPage ? (
        <div className="w-full space-y-2 sm:w-auto">
          <label htmlFor="product-sort" className="text-sm font-medium">
            Sort by
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClassName}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      ) : (
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full shrink-0 rounded-md border px-3 py-2 sm:w-auto"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      )}

      {isPage ? (
        <div className="flex items-end gap-2 py-1 sm:pb-0.5">
          <Checkbox
            id="product-in-stock"
            checked={inStock}
            onCheckedChange={(checked) => onInStockChange(checked === true)}
          />
          <label
            htmlFor="product-in-stock"
            className="cursor-pointer text-sm text-muted-foreground"
          >
            In stock only
          </label>
        </div>
      ) : (
        <label className="flex shrink-0 items-center gap-2 py-1 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
          />
          In stock only
        </label>
      )}
    </>
  );

  if (isPage) {
    return (
      <div className="mx-auto mb-6 max-w-7xl rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          {fields}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {fields}
    </div>
  );
}

function ProductGridCard({
  product,
  index,
  animate,
  reduceMotion,
}: {
  product: Product;
  index: number;
  animate: boolean;
  reduceMotion: boolean;
}) {
  const card = (
    <CatalogGridCard
      product={{
        publicId: product.publicId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        fromPrice: product.fromPrice,
        toPrice: product.toPrice,
        mrp: product.mrp,
        defaultVariantPublicId: product.defaultVariantPublicId,
        variantOptions: product.variantOptions,
        images: product.images,
      }}
    />
  );

  if (!animate || reduceMotion) {
    return <div className="min-w-0">{card}</div>;
  }

  return (
    <motion.div
      className="min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.04, 0.4),
      }}
    >
      {card}
    </motion.div>
  );
}

export default function ProductList({ variant = "embedded" }: ProductListProps) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category")?.trim() || "";
  const reduceMotion = useReducedMotion();
  const animateGrid = variant === "page";

  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [inStock, setInStock] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const inFlightRef = useRef(false);
  const displayedCountRef = useRef(0);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchProducts = useCallback(async () => {
    if (inFlightRef.current || !hasMoreRef.current) return;
    inFlightRef.current = true;
    setLoading(true);
    setFetchError(false);

    const currentPage = pageRef.current;
    try {
      const res = await axios.get(`${getBrowserApiBase()}/public/products`, {
        params: {
          page: currentPage,
          limit: 12,
          q: search || undefined,
          sort,
          inStock: inStock ? "true" : undefined,
          category: categoryId || undefined,
        },
      });

      const { items, pagination } = res.data.data;
      const batch = dedupeByPublicId(items as Product[]);

      setProducts((prev) => {
        const seen = new Set(
          prev.flatMap((p) => [p.publicId, p.slug].filter(Boolean) as string[])
        );
        const next = [...prev];
        for (const item of batch) {
          const keys = [item.publicId, item.slug].filter(Boolean) as string[];
          if (keys.some((k) => seen.has(k))) continue;
          keys.forEach((k) => seen.add(k));
          next.push(item);
        }
        return next;
      });

      const more = currentPage < pagination.totalPages;
      pageRef.current = currentPage + 1;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch {
      if (currentPage === 1) setFetchError(true);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [search, sort, inStock, categoryId]);

  useEffect(() => {
    setProducts([]);
    pageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    inFlightRef.current = false;
    displayedCountRef.current = 0;
    void fetchProducts();
  }, [search, sort, inStock, categoryId, fetchProducts]);

  const loadMore = () => {
    if (inFlightRef.current || !hasMoreRef.current || products.length === 0) return;
    displayedCountRef.current = products.length;
    void fetchProducts();
  };

  const showEmpty = !loading && !fetchError && products.length === 0;
  const hasFilters = Boolean(search.trim() || inStock || categoryId);
  const filterKey = `${search}-${sort}-${inStock}-${categoryId}`;

  return (
    <>
      <ProductListToolbar
        variant={variant}
        search={search}
        sort={sort}
        inStock={inStock}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onInStockChange={setInStock}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-4">
        {fetchError ? (
          <div className="col-span-full">
            <EmptyState
              title="We couldn’t load products"
              description="Please check your connection and try again. If the problem continues, try again later."
            />
          </div>
        ) : showEmpty ? (
          <div className="col-span-full">
            <EmptyState
              title={hasFilters ? "No products match your filters" : "No products to show yet"}
              description={
                hasFilters
                  ? "Try clearing search, turning off filters, or browsing all products."
                  : "When sellers publish listings, they will appear here."
              }
            />
          </div>
        ) : loading && products.length === 0 ? (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="min-w-0">
                <div className="aspect-4/5 w-full animate-pulse rounded-xl bg-muted shadow-sm" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted/90" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted/80" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="h-4 w-14 animate-pulse rounded bg-muted/70" />
                    <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          products.map((product, index) => (
            <ProductGridCard
              key={`${filterKey}-${product.publicId}`}
              product={product}
              index={
                animateGrid && index >= displayedCountRef.current
                  ? index - displayedCountRef.current
                  : index
              }
              animate={animateGrid}
              reduceMotion={reduceMotion ?? false}
            />
          ))
        )}
      </div>

      {hasMore && products.length > 0 && !fetchError && (
        <div className="mx-auto flex max-w-7xl justify-center pb-4 pt-10">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={loadMore}
            aria-busy={loading}
            aria-label={loading ? "Loading more products" : "Load more products"}
            className="min-w-[220px] border-primary/30 bg-background font-semibold tracking-wide shadow-sm hover:border-primary hover:bg-primary/5 hover:shadow-md"
          >
            {loading ? (
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
                aria-hidden
              />
            ) : (
              <>
                Load more
                <ChevronDown className="size-5 opacity-80" aria-hidden />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
