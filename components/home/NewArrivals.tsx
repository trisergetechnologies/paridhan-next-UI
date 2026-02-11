"use client";

import HorizontalProductCard from "./HorizontalProductCard";
import products from "@/data/products.json";

/* ---------------- TYPES ---------------- */

type RawProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

type ProductWithSlug = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

/* ---------------- HELPERS ---------------- */

const generateSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

/* ---------------- COMPONENT ---------------- */

export default function NewArrivals() {
  const normalizedProducts: ProductWithSlug[] = (products as RawProduct[]).map(
    (product) => ({
      id: String(product.id),
      slug: generateSlug(product.name),
      name: product.name,
      price: product.price,
      image: product.image,
    })
  );

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold">New Arrivals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked silks, freshly added to our collection
          </p>
        </div>

        {/* HORIZONTAL SCROLLER */}
        <div
          className="
            flex
            gap-4               /* reduced gap */
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-4

            no-scrollbar

            -mx-4
            px-4

            lg:mx-0
            lg:px-0
          "
        >
          {normalizedProducts.map((product, index) => (
            <div
              key={product.id}
              className="
      snap-center shrink-0
      w-[92%] sm:w-[70%] md:w-[45%] lg:w-[25%]
    "
            >
              <HorizontalProductCard
                product={product}
                badge={
                  index === 0 ? "new" : index === 1 ? "exclusive" : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
