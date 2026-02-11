"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface HorizontalProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  };
  badge?: "new" | "exclusive";
}

export default function HorizontalProductCard({
  product,
  badge,
}: HorizontalProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="group h-full">
      <div
        className="
          relative h-full rounded-2xl overflow-hidden bg-white
          transition-all duration-300 ease-out
          lg:shadow-sm lg:hover:shadow-xl lg:hover:-translate-y-1
        "
      >
        {/* BADGE */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`
                text-[11px] font-semibold uppercase tracking-wide
                px-3 py-1 rounded-full
                ${
                  badge === "new"
                    ? "bg-emerald-600 text-white"
                    : "bg-black text-white"
                }
              `}
            >
              {badge === "new" ? "New" : "Exclusive"}
            </span>
          </div>
        )}

        {/* WISHLIST */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted((v) => !v);
          }}
          className="
            absolute top-3 right-3 z-10
            p-2 rounded-full bg-white/90 backdrop-blur
            hover:bg-white transition
          "
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4 w-4 ${
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* IMAGE */}
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 lg:group-hover:scale-105"
            />

            {/* QUICK VIEW – DESKTOP ONLY */}
            <div
              className="
                pointer-events-none absolute inset-0 hidden lg:flex
                items-center justify-center bg-black/30
                opacity-0 transition-opacity duration-300
                lg:group-hover:opacity-100
              "
            >
              <span className="pointer-events-auto bg-white px-5 py-2 rounded-full text-sm font-medium shadow-md">
                Quick View
              </span>
            </div>
          </div>
        </Link>

        {/* CONTENT */}
        <div className="p-4 space-y-3">
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* PRICE + CART */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // addToCart later
              }}
              className="
                p-2 rounded-full border border-primary/30
                text-primary hover:bg-primary hover:text-white
                transition
              "
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>

          {/* MOBILE CTA */}
          <div className="lg:hidden pt-1">
            <span className="inline-block text-xs font-medium text-primary border border-primary/30 px-3 py-1 rounded-full">
              Shop Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
