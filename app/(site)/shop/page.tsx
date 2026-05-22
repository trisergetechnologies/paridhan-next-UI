"use client";

import ProductList from "@/components/home/ProductList";
import { motion, useReducedMotion } from "framer-motion";
import { Suspense } from "react";

function ShopGridFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="min-w-0">
            <div className="aspect-4/5 w-full animate-pulse rounded-xl bg-muted shadow-sm" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted/90" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopPageHeader() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="border-b border-border/80 bg-background/90 backdrop-blur-sm"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-12">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Shop
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Shop the collection
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Discover sarees and festive wear curated for every occasion — search,
          filter, and find your perfect piece.
        </p>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-[60vh] overflow-x-hidden bg-muted/25">
      <ShopPageHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <Suspense fallback={<ShopGridFallback />}>
          <ProductList variant="page" />
        </Suspense>
      </div>
    </div>
  );
}
