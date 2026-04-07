"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cartLineId } from "@/lib/cartLineId";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ProductCardVariantOption = {
  publicId: string;
  label: string;
  price: number;
  stock: number;
};

interface Product {
  publicId: string;
  slug: string;
  image: string;
  images?: { url?: string }[];
  name: string;
  price: number;
  fromPrice?: number;
  toPrice?: number;
  defaultVariantPublicId?: string | null;
  description?: string;
  categoryLabel?: string;
  variantOptions?: ProductCardVariantOption[];
  /** Show corner badge (e.g. featured collection) */
  isFeatured?: boolean;
  /** Optional ribbon for curated sections (e.g. New Arrivals strip) */
  sectionBadge?: "new" | "exclusive";
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const {
    isWishlisted,
    toggleWishlist,
    wishlistBusyId,
  } = useWishlist();

  const variantOpts = product.variantOptions ?? [];
  const hasVariants = variantOpts.length > 0;
  const defaultVid =
    product.defaultVariantPublicId ?? variantOpts[0]?.publicId ?? "";
  const defaultOption =
    variantOpts.find((v) => v.publicId === defaultVid) ?? variantOpts[0];
  const displayPrice =
    defaultOption?.price ?? product.fromPrice ?? product.price;
  const defaultStock = hasVariants ? (defaultOption?.stock ?? 0) : undefined;

  const [slideErrors, setSlideErrors] = useState<Record<number, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const imageUrls = useMemo(() => {
    const fromList = (product.images ?? [])
      .map((i) => i?.url?.trim())
      .filter((u): u is string => Boolean(u));
    if (fromList.length > 0) return fromList;
    const one = product.image?.trim();
    return one ? [one] : [];
  }, [product.images, product.image]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollToSlide = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const i = Math.max(0, Math.min(index, imageUrls.length - 1));
      el.scrollTo({ left: i * w, behavior: "smooth" });
      setActiveSlide(i);
    },
    [imageUrls.length]
  );

  const onScrollGallery = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || imageUrls.length < 2) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setActiveSlide(Math.min(idx, imageUrls.length - 1));
  }, [imageUrls.length]);

  const imageUrlsKey = imageUrls.join("|");
  useEffect(() => {
    setActiveSlide(0);
    setSlideErrors({});
    const el = scrollerRef.current;
    if (el) el.scrollLeft = 0;
  }, [product.publicId, imageUrlsKey]);

  const cartImageUrl = imageUrls[activeSlide] ?? imageUrls[0] ?? product.image;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
      );
      return;
    }

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 200));

    const vid = hasVariants ? defaultVid : undefined;
    if (hasVariants && !vid) {
      setIsAdding(false);
      return;
    }

    addToCart({
      id: cartLineId(product.publicId, vid),
      productId: product.publicId,
      variantPublicId: vid,
      name: product.name,
      price: displayPrice,
      image: cartImageUrl,
      quantity: 1,
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
      );
      return;
    }

    void toggleWishlist(product.publicId);
  };

  const liked = isWishlisted(product.publicId);
  const wishBusy = wishlistBusyId === product.publicId;

  const multiImage = imageUrls.length > 1;

  const openProduct = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
      );
    }
  };

  return (
    <div
      className={cn(
        "group/lux relative flex flex-col overflow-hidden rounded border border-border/80 bg-card text-card-foreground shadow-sm",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
      )}
    >
      {/* Image — fixed visual height like luxury retail tiles */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-muted sm:h-[220px] md:h-[240px]">
        {/* Bottom gradient overlay on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-background/85",
            "opacity-0 transition-opacity duration-300 group-hover/lux:opacity-100"
          )}
          aria-hidden
        />

        {product.sectionBadge ? (
          <div
            className={cn(
              "absolute left-3 top-3 z-[3] px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest",
              product.sectionBadge === "new"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background"
            )}
          >
            {product.sectionBadge === "new" ? "New" : "Exclusive"}
          </div>
        ) : null}

        {product.isFeatured ? (
          <div className="absolute right-3 top-3 z-[3] bg-primary px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary-foreground">
            Featured
          </div>
        ) : null}

        {imageUrls.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        ) : (
          <>
            <div
              ref={scrollerRef}
              onScroll={onScrollGallery}
              className={cn(
                "flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth",
                "scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              )}
            >
              {imageUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative h-full min-w-full shrink-0 snap-center snap-always"
                >
                  {!slideErrors[idx] ? (
                    <Image
                      src={url}
                      alt={`${product.name} — ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover/lux:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onError={() =>
                        setSlideErrors((prev) => ({ ...prev, [idx]: true }))
                      }
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground px-2 text-center">
                      Image unavailable
                    </div>
                  )}
                </div>
              ))}
            </div>

            {multiImage ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToSlide(activeSlide - 1);
                  }}
                  className={cn(
                    "absolute left-2 top-1/2 z-[2] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full",
                    "border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm",
                    "transition hover:border-primary hover:bg-primary hover:text-primary-foreground",
                    activeSlide <= 0 && "pointer-events-none opacity-25"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToSlide(activeSlide + 1);
                  }}
                  className={cn(
                    "absolute right-2 top-1/2 z-[2] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full",
                    "border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm",
                    "transition hover:border-primary hover:bg-primary hover:text-primary-foreground",
                    activeSlide >= imageUrls.length - 1 &&
                      "pointer-events-none opacity-25"
                  )}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <div
                  className="absolute bottom-2 left-1/2 z-[2] flex -translate-x-1/2 gap-1 rounded-full border border-border/60 bg-background/85 px-2 py-1 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {imageUrls.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Image ${i + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToSlide(i);
                      }}
                      className={cn(
                        "h-1 rounded-full transition-all",
                        i === activeSlide
                          ? "w-4 bg-primary"
                          : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                      )}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>

      {/* Info block — luxury retail spacing */}
      <div className="relative flex flex-1 flex-col p-4 pt-3.5">
        <Link
          href={`/product/${product.slug}`}
          onClick={openProduct}
          className={cn(
            "font-serif block text-lg font-normal leading-snug tracking-wide text-foreground line-clamp-2",
            "transition-colors hover:text-primary"
          )}
        >
          {product.name}
        </Link>

        {product.categoryLabel ? (
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
            {product.categoryLabel}
          </p>
        ) : null}

        <p className="mt-2 text-base font-light tabular-nums text-muted-foreground">
          ₹{Math.round(displayPrice).toLocaleString("en-IN")}
          {!hasVariants &&
            product.toPrice != null &&
            product.fromPrice != null &&
            product.toPrice !== product.fromPrice && (
              <span className="ml-1.5 text-xs text-muted-foreground/80">
                ({Math.round(product.fromPrice).toLocaleString("en-IN")} –{" "}
                {Math.round(product.toPrice).toLocaleString("en-IN")})
              </span>
            )}
        </p>

        {hasVariants ? (
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Options available
          </p>
        ) : null}

        {hasVariants && defaultStock != null && (
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {defaultStock < 1 ? "Unavailable" : `${defaultStock} in stock`}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3.5">
          <Link
            href={`/product/${product.slug}`}
            onClick={openProduct}
            className={cn(
              "group/vd relative bg-transparent p-0 text-left text-xs font-medium uppercase tracking-[0.15em] text-foreground",
              "transition-colors hover:text-primary"
            )}
          >
            View details
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-px w-0 bg-primary transition-[width] duration-300 ease-out",
                "group-hover/vd:w-full"
              )}
              aria-hidden
            />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishBusy}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition",
                "hover:scale-110 hover:text-primary disabled:pointer-events-none disabled:opacity-50",
                liked && "text-primary"
              )}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishBusy ? (
                <span className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart
                  className={cn("h-[18px] w-[18px]", liked && "fill-current")}
                />
              )}
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                isAdding ||
                (hasVariants && (!defaultVid || (defaultOption?.stock ?? 0) < 1))
              }
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition",
                "hover:border-primary hover:bg-primary hover:text-primary-foreground",
                justAdded && "border-green-600 bg-green-600 text-white hover:bg-green-600",
                (hasVariants &&
                  (!defaultVid || (defaultOption?.stock ?? 0) < 1)) &&
                  "pointer-events-none opacity-35"
              )}
              aria-label="Add to cart"
            >
              {isAdding ? (
                <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : justAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-[17px] w-[17px]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
