"use client";

import { dedupeByPublicId } from "@/lib/dedupeByPublicId";
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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products?page=1&limit=10`
        );
        const items = dedupeByPublicId(res.data?.data?.items || []) as ListProduct[];
        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
        setProducts([]);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section id="new-arrivals" className="scroll-mt-24 py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold font-serif">
            New Arrivals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked silks, freshly added to our collection
          </p>
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
              className="snap-center shrink-0 w-[min(100%,280px)] sm:w-[260px] md:w-[272px] lg:w-[280px]"
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
                  sectionBadge:
                    index === 0 ? "new" : index === 1 ? "exclusive" : undefined,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
