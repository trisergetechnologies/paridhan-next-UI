"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cartLineId } from "@/lib/cartLineId";
import { toWishlistSnapshot } from "@/lib/wishlistSnapshot";
import {
  firstImageUrlFromListProduct,
  formatInr,
  resolveListProductPricing,
  type CatalogListProductPricingInput,
} from "@/lib/catalogListPricing";
import { cn } from "@/lib/utils";
import { Check, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type CatalogGridCardProduct = Omit<
  CatalogListProductPricingInput,
  "variantOptions"
> & {
  publicId: string;
  slug: string;
  name: string;
  images: { url?: string }[];
  variantOptions?: {
    publicId: string;
    label?: string;
    price: number;
    stock: number;
  }[];
};

export default function CatalogGridCard({ product }: { product: CatalogGridCardProduct }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, wishlistBusyId } = useWishlist();

  const variantOpts = product.variantOptions ?? [];
  const hasVariants = variantOpts.length > 0;
  const defaultVid =
    product.defaultVariantPublicId ?? variantOpts[0]?.publicId ?? "";
  const defaultOption =
    variantOpts.find((v) => v.publicId === defaultVid) ?? variantOpts[0];

  const [imageFailed, setImageFailed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const productHref = `/product/${product.slug}`;
  const imageUrl = useMemo(
    () => firstImageUrlFromListProduct(product.images),
    [product.images]
  );

  const { salePrice, mrpDisplay, discountPct } = useMemo(
    () => resolveListProductPricing(product),
    [product]
  );

  const cartImageUrl = imageUrl ?? "";

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist(
      product.publicId,
      toWishlistSnapshot({
        publicId: product.publicId,
        slug: product.slug,
        name: product.name,
        price: salePrice,
        fromPrice: product.fromPrice,
        toPrice: product.toPrice,
        mrp: product.mrp,
        defaultVariantPublicId: product.defaultVariantPublicId,
        images: product.images,
        variantOptions: product.variantOptions?.map((v) => ({
          publicId: v.publicId,
          label: v.label ?? "",
          price: v.price,
          stock: v.stock,
        })),
      })
    );
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = hasVariants ? defaultVid : undefined;
    if (hasVariants && !vid) return;

    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 200));

    const stockForLine = hasVariants
      ? Number(defaultOption?.stock) || 0
      : 50;
    const maxQuantity = Math.min(50, Math.max(0, stockForLine));

    addToCart({
      id: cartLineId(product.publicId, vid),
      productId: product.publicId,
      productSlug: product.slug,
      variantPublicId: vid,
      name: product.name,
      price: salePrice,
      image: cartImageUrl,
      quantity: 1,
      maxQuantity,
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const liked = isWishlisted(product.publicId);
  const wishBusy = wishlistBusyId === product.publicId;
  const cartDisabled =
    isAdding ||
    (hasVariants && (!defaultVid || (defaultOption?.stock ?? 0) < 1));

  return (
    <Link
      href={productHref}
      aria-label={`View product: ${product.name}`}
      prefetch={false}
      className={cn(
        "group/cg flex h-full min-h-0 w-full min-w-0 flex-col outline-none",
        "transition-[transform,opacity] duration-300 ease-out",
        "hover:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl"
      )}
    >
      <div
        className={cn(
          "relative w-full shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm",
          "aspect-4/5"
        )}
      >
        {imageUrl && !imageFailed ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover/cg:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageFailed(true)}
            draggable={false}
          />
        ) : (
          <div className="flex h-full min-h-[120px] items-center justify-center px-3 text-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div
          className="absolute right-2 top-2 z-10 flex gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishBusy}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/95 text-muted-foreground shadow-sm backdrop-blur-sm",
              "transition hover:scale-105 hover:text-primary disabled:pointer-events-none disabled:opacity-50",
              liked && "text-primary"
            )}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishBusy ? (
              <span className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            )}
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartDisabled}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-sm backdrop-blur-sm",
              "transition hover:border-primary hover:bg-primary hover:text-primary-foreground",
              justAdded && "border-green-600 bg-green-600 text-white hover:bg-green-600",
              cartDisabled && "pointer-events-none opacity-35"
            )}
            aria-label="Add to cart"
          >
            {isAdding ? (
              <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : justAdded ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="relative mt-3 flex flex-1 flex-col bg-background pt-0.5">
        <span
          aria-hidden
          className="line-clamp-2 font-sans text-sm font-bold uppercase leading-snug tracking-wide text-foreground"
        >
          {product.name}
        </span>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {mrpDisplay != null ? (
            <span className="text-sm tabular-nums text-muted-foreground line-through">
              {formatInr(mrpDisplay)}
            </span>
          ) : null}
          <span className="text-base font-semibold tabular-nums text-destructive">
            {formatInr(salePrice)}
          </span>
          {discountPct != null ? (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-destructive text-destructive-foreground"
              aria-hidden
            >
              -{discountPct}%
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
