"use client";

import ProductCard from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useWishlist, type WishlistProduct } from "@/context/WishlistContext";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";

function mapToCardProduct(p: WishlistProduct) {
  return {
    publicId: p.publicId,
    slug: p.slug,
    name: p.name,
    price: p.price,
    fromPrice: p.fromPrice,
    toPrice: p.toPrice,
    defaultVariantPublicId: p.defaultVariantPublicId ?? null,
    description: p.description,
    categoryLabel: p.categories?.[0]?.name,
    variantOptions: p.variantOptions,
    image: p.images?.[0]?.url || "",
    images: p.images,
    isFeatured: p.isFeatured,
  };
}

export default function WishlistPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { items, loading, error, refreshWishlist, count } = useWishlist();

  if (isAuthLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Heart className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Sign in to view your wishlist
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your saved favourites are available on any device when you&apos;re
          logged in.
        </p>
        <Button
          className="mt-6"
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
            )
          }
        >
          Sign in
        </Button>
        <p className="mt-4">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to shop
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-[60vh]">
      <div className="border-b border-border/80 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-2">
                Your collection
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Wishlist
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Pieces you love, saved in one place. Open any item for full
                details, options, and checkout.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Continue shopping</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                type="button"
                onClick={() => void refreshWishlist()}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-10 md:py-12">
        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card px-8 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Nothing saved yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tap the heart on any product to add it here. Your wishlist stays
              private to your account.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/">Explore the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {count} {count === 1 ? "item" : "items"}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.publicId} product={mapToCardProduct(p)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
