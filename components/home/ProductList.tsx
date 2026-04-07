"use client";

import { Button } from "@/components/ui/button";
import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
import axios from "axios";
import { ChevronDown } from "lucide-react";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [inStock, setInStock] = useState(false);

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

    try {
      const currentPage = pageRef.current;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/products`, {
        params: {
          page: currentPage,
          limit: 12,
          q: search || undefined,
          sort,
          inStock: inStock ? "true" : undefined,
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
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [search, sort, inStock]);

  useEffect(() => {
    setProducts([]);
    pageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    inFlightRef.current = false;
    void fetchProducts();
  }, [search, sort, inStock, fetchProducts]);

  const loadMore = () => {
    if (inFlightRef.current || !hasMoreRef.current || products.length === 0) return;
    void fetchProducts();
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="border rounded-md px-3 py-2 w-full sm:min-w-[200px] sm:flex-1 sm:max-w-md"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-md px-3 py-2 w-full sm:w-auto shrink-0"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <label className="flex items-center gap-2 text-sm shrink-0 py-1">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In stock only
        </label>
      </div>
      <div className="grid max-w-7xl mx-auto grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {products.length > 0 ? (
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
        ) : loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      {hasMore && products.length > 0 && (
        <div className="max-w-7xl mx-auto flex justify-center pt-10 pb-4">
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
                className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
                aria-hidden
              />
            ) : (
              <>
                Load More
                <ChevronDown className="size-5 opacity-80" aria-hidden />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}
