"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: { url: string }[];
  slug: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/public/products?page=${page}&limit=${12}`
        // {
        //   params: {
        //     page,
        //     limit: 12,
        //   },
        // }
      );

      const { items, pagination } = res.data.data;

      setProducts((prev) => [...prev, ...items]);
      setHasMore(page < pagination.totalPages);
      setPage((p) => p + 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchProducts();
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [observerRef.current, hasMore]);

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.url || "",
              }}
            />
          ))
        ) : !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : null}
      </div>

      {/* OBSERVER */}
      {hasMore && (
        <div ref={observerRef} className="h-10 flex justify-center items-center">
          {loading && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}
    </>
  );
}
