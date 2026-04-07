"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type ListProduct = {
  publicId: string;
  slug: string;
  name: string;
  price: number;
  fromPrice?: number;
  toPrice?: number;
  defaultVariantPublicId?: string | null;
  description?: string;
  variantOptions?: {
    publicId: string;
    label: string;
    price: number;
    stock: number;
  }[];
  categories?: { name?: string; slug?: string }[];
  images: { url: string }[];
  isFeatured?: boolean;
};

export default function NewArrivals() {
  const [products, setProducts] = useState<ListProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await axios.get(`${getBrowserApiBase()}/public/products?page=1&limit=10`);
        const items = dedupeByPublicId(res.data?.data?.items || []) as ListProduct[];
        setProducts(items);
      } catch {
        setProducts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section id="new-arrivals" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted/70" />
          <div className="mt-8 flex gap-5 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[380px] w-[min(100%,280px)] shrink-0 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section id="new-arrivals" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold lg:text-3xl">New arrivals</h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest listings from our store</p>
          </div>
          <EmptyState
            title={error ? "Couldn’t load new arrivals" : "No products yet"}
            description={
              error
                ? "Something went wrong while loading this section. Please try refreshing the page."
                : "Once sellers add products to the catalog, they will show up here."
            }
          />
        </div>
      </section>
    );
  }

  return (
    <section id="new-arrivals" className="scroll-mt-24 py-14">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold lg:text-3xl">New arrivals</h2>
          <p className="mt-1 text-sm text-muted-foreground">Latest listings from our store</p>
        </div>

        <div
          className="
            flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
            no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0
          "
        >
          {products.map((product, index) => (
            <div
              key={product.publicId}
              className="w-[min(100%,280px)] shrink-0 snap-center sm:w-[260px] md:w-[272px] lg:w-[280px]"
            >
              <ProductCard
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
                  sectionBadge: index === 0 ? "new" : index === 1 ? "exclusive" : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
