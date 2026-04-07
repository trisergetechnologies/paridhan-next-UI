"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

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
  defaultVariantPublicId?: string | null;
  description?: string;
  variantOptions?: VariantOption[];
  categories?: { name?: string; slug?: string }[];
  images: { url: string }[];
  isFeatured?: boolean;
}

export default function ProductList() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category")?.trim() || "";

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
        const seen = new Set(prev.flatMap((p) => [p.publicId, p.slug].filter(Boolean) as string[]));
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
    void fetchProducts();
  }, [search, sort, inStock, categoryId, fetchProducts]);

  const loadMore = () => {
    if (inFlightRef.current || !hasMoreRef.current || products.length === 0) return;
    void fetchProducts();
  };

  const showEmpty = !loading && !fetchError && products.length === 0;
  const hasFilters = Boolean(search.trim() || inStock || categoryId);

  return (
    <>
      <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border px-3 py-2 sm:min-w-[200px] sm:max-w-md sm:flex-1"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full shrink-0 rounded-md border px-3 py-2 sm:w-auto"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <label className="flex shrink-0 items-center gap-2 py-1 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock only
        </label>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.publicId}
              product={{
                publicId: product.publicId,
                slug: product.slug,
                name: product.name,
                price: product.price,
                fromPrice: product.fromPrice,
                toPrice: product.toPrice,
                defaultVariantPublicId: product.defaultVariantPublicId,
                description: product.description,
                categoryLabel: product.categories?.[0]?.name,
                variantOptions: product.variantOptions,
                image: product.images?.[0]?.url || "",
                images: product.images,
                isFeatured: product.isFeatured,
              }}
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
