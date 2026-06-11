"use client";

import ProductDetailInfoTabs from "@/components/product/ProductDetailInfoTabs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductNotFound from "@/components/product/ProductNotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cartLineId } from "@/lib/cartLineId";
import { toWishlistSnapshot } from "@/lib/wishlistSnapshot";
import { estimatedDeliveryLabel, lookupPincode } from "@/lib/pincodeLookup";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, Heart, MapPin, Minus, Plus, Settings2, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VariantDto = {
  publicId: string;
  attributes?: { name: string; value: string }[];
  sku?: string | null;
  price: number;
  mrp?: number | null;
  stock: number;
  effectiveImages?: { url?: string; alt?: string }[];
};

/** API payload for `/public/products/single/:id` (fields used on this page). */
type ProductDetailPayload = {
  publicId: string;
  slug: string;
  name: string;
  description?: string;
  price?: number;
  mrp?: number | null;
  stock?: number;
  defaultVariantPublicId?: string;
  fabric?: string;
  color?: string;
  blouseIncluded?: boolean;
  length?: string;
  occasion?: string;
  pattern?: string;
  fit?: string;
  texture?: string;
  washCare?: string;
  ironing?: string;
  storage?: string;
  discountPercentage?: number;
  categories?: { name?: string }[];
  images?: { url?: string }[];
  variants?: VariantDto[];
};

function variantOptionLabel(v: VariantDto) {
  if (v.attributes?.length) {
    return v.attributes.map((a) => a.value).join(" · ");
  }
  return v.publicId;
}

export default function Product() {
  const { productId } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist, wishlistBusyId } = useWishlist();

  const [product, setProduct] = useState<ProductDetailPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinChecking, setPinChecking] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    serviceable: boolean;
    city?: string;
    state?: string;
    message: string;
    eta?: string;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    axios
      .get(`${getBrowserApiBase()}/public/products/single/${productId}`)
      .then((res) => setProduct(res.data.data as ProductDetailPayload))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const variants = useMemo(
    () => (product?.variants ?? []) as VariantDto[],
    [product?.variants]
  );
  const hasVariants = variants.length > 0;

  useEffect(() => {
    if (!product) return;
    const v = (product.variants ?? []) as VariantDto[];
    const def = product.defaultVariantPublicId || v[0]?.publicId || "";
    setSelectedVariantId(def);
    setQuantity(1);
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return variants.find((v) => v.publicId === selectedVariantId) || variants[0] || null;
  }, [hasVariants, variants, selectedVariantId]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (selectedVariant?.effectiveImages?.length) {
      return selectedVariant.effectiveImages;
    }
    return product.images || [];
  }, [product, selectedVariant]);

  const unitPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayMrp = selectedVariant?.mrp ?? product?.mrp ?? null;
  const showMrpStrike =
    displayMrp != null && Number(displayMrp) > Number(unitPrice);
  const discountPct =
    showMrpStrike && displayMrp
      ? Math.round(((Number(displayMrp) - Number(unitPrice)) / Number(displayMrp)) * 100)
      : product?.discountPercentage && product.discountPercentage > 0
        ? Math.round(product.discountPercentage)
        : 0;
  const stockAvailable = selectedVariant?.stock ?? product?.stock ?? 0;

  useEffect(() => {
    setQuantity((q) => Math.min(q, Math.max(1, stockAvailable || 1)));
  }, [stockAvailable, selectedVariantId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return <ProductNotFound />;

  const handleAddToCart = async () => {
    if (stockAvailable < 1) return;
    setIsAdding(true);

    const qty = Math.min(quantity, stockAvailable, 50);
    const img =
      galleryImages[0]?.url ||
      product.images?.[0]?.url ||
      "";

    const maxQuantity = Math.min(50, Math.max(0, stockAvailable));

    await addToCart({
      id: hasVariants
        ? cartLineId(product.publicId, selectedVariant?.publicId)
        : cartLineId(product.publicId),
      productId: product.publicId,
      productSlug: product.slug,
      variantPublicId: selectedVariant?.publicId,
      name: product.name,
      price: unitPrice,
      image: img,
      quantity: qty,
      maxQuantity,
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const maxQty = Math.min(50, Math.max(1, stockAvailable));

  /** Shown under the title: root-level `fabric` and `color` from the product in MongoDB (seed / admin). */
  const taglineParts = [product.fabric, product.color].filter(Boolean);
  const tagline =
    taglineParts.length > 0 ? taglineParts.join(" · ") : null;

  const firstCategory = product.categories?.[0]?.name;
  const liked = isWishlisted(product.publicId);
  const wishBusy = wishlistBusyId === product.publicId;

  const handleWishlistToggle = () => {
    void toggleWishlist(
      product.publicId,
      toWishlistSnapshot({
        publicId: product.publicId,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: unitPrice,
        mrp: displayMrp,
        defaultVariantPublicId:
          selectedVariant?.publicId ?? product.defaultVariantPublicId,
        images: galleryImages.length ? galleryImages : product.images,
        categories: product.categories?.map((c) => ({ name: c.name })),
        variantOptions: hasVariants
          ? variants.map((v) => ({
              publicId: v.publicId,
              label: variantOptionLabel(v),
              price: v.price,
              stock: v.stock,
            }))
          : undefined,
      })
    );
  };

  return (
    <div className="container mx-auto min-w-0 max-w-full overflow-x-hidden px-4 py-8 md:py-12">
      <div className="grid min-w-0 max-w-full gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        <div className="min-w-0 max-w-full lg:sticky lg:top-24">
          <ProductImageGallery
            images={galleryImages}
            productName={product.name}
            showControls
          />
        </div>

        <div className="min-w-0 max-w-full space-y-6 md:space-y-8">
          <div className="flex justify-end border-b border-border/60 pb-3">
            <a
              href="#product-details"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Settings2 className="h-3.5 w-3.5" aria-hidden />
              Details
            </a>
          </div>

          <div>
            {firstCategory ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/90">
                {firstCategory}
              </p>
            ) : null}
            <div className="flex items-start justify-between gap-3 sm:items-center">
              <h1 className="min-w-0 flex-1 break-words font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={handleWishlistToggle}
                disabled={wishBusy}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/95 text-muted-foreground shadow-sm backdrop-blur-sm sm:h-8 sm:w-8",
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
            </div>
            {tagline ? (
              <p className="mt-1 break-words text-base text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          <div className="-mt-2 flex flex-wrap items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">Customer favourite</span>
          </div>

          <div id="product-details" className="scroll-mt-28">
            <p className="max-w-full break-words text-sm leading-relaxed text-foreground/90 whitespace-pre-line md:text-base">
              {product.description}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
                ₹{Math.round(unitPrice).toLocaleString("en-IN")}
              </span>
              {showMrpStrike ? (
                <span className="text-lg text-muted-foreground line-through tabular-nums">
                  ₹{Math.round(Number(displayMrp)).toLocaleString("en-IN")}
                </span>
              ) : null}
              {discountPct > 0 ? (
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-sm font-semibold text-emerald-700">
                  {discountPct}% OFF
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
          </div>

          <div className="max-w-full rounded-xl border border-border/60 bg-muted/30 p-4 shadow-sm md:p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground sm:text-base">Check Delivery Available</h2>
            <form
              className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const pin = pinInput.replace(/\D/g, "").slice(0, 6);
                if (pin.length !== 6) {
                  setDeliveryResult({
                    serviceable: false,
                    message: "Please enter a valid 6-digit PIN code.",
                  });
                  return;
                }
                setPinChecking(true);
                setDeliveryResult(null);
                const result = await lookupPincode(pin);
                setPinChecking(false);
                if (result.success && result.data?.serviceable) {
                  setDeliveryResult({
                    serviceable: true,
                    city: result.data.city,
                    state: result.data.state,
                    message: `Delivery available to ${result.data.city}, ${result.data.state}`,
                    eta: estimatedDeliveryLabel(),
                  });
                } else {
                  setDeliveryResult({
                    serviceable: false,
                    message: result.message || "Delivery not available to this PIN yet.",
                  });
                }
              }}
            >
              <label htmlFor="delivery-pin" className="sr-only">
                Area PIN code for delivery check
              </label>
              <Input
                id="delivery-pin"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (deliveryResult) setDeliveryResult(null);
                }}
                placeholder="Enter 6-digit PIN code"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                className="min-h-10 min-w-0 flex-1 bg-background"
              />
              <Button
                type="submit"
                variant="default"
                className="h-10 shrink-0 sm:min-w-22"
                disabled={pinChecking}
              >
                {pinChecking ? "Checking…" : "Check"}
              </Button>
            </form>
            {deliveryResult ? (
              <div
                className={cn(
                  "mt-3 rounded-lg border px-3 py-2.5 text-sm",
                  deliveryResult.serviceable
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-900"
                )}
              >
                <p className="font-medium">{deliveryResult.message}</p>
                {deliveryResult.serviceable && deliveryResult.eta ? (
                  <p className="mt-1 text-xs opacity-90">{deliveryResult.eta}</p>
                ) : null}
              </div>
            ) : null}
            {deliveryResult?.serviceable ? (
              <Link
                href="/account?tab=addresses"
                className="mt-3 inline-flex max-w-full min-w-0 items-center gap-2 break-words text-sm font-medium text-primary hover:underline"
              >
                <MapPin className="size-4 shrink-0" aria-hidden />
                Save address for faster checkout
              </Link>
            ) : null}
          </div>

          {/**stock quantity and cart, buy option */}

          <p className="text-xs text-muted-foreground">
            {stockAvailable < 1
              ? "Currently out of stock"
              : `${stockAvailable} available for this selection`}
          </p>

          <div className="flex min-w-0 max-w-full flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="min-w-0 shrink-0 space-y-2">
              <label htmlFor="qty" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-0 rounded-lg border border-border bg-background overflow-hidden w-fit">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none shrink-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="qty"
                  readOnly
                  value={quantity}
                  className="h-10 w-14 border-0 rounded-none text-center font-semibold tabular-nums px-0 focus-visible:ring-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none shrink-0"
                  onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                  disabled={quantity >= maxQty}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex min-w-0 w-full flex-col gap-3 sm:flex-row sm:items-stretch">
              <Button
                size="lg"
                className={cn(
                  "h-12 min-w-0 w-full justify-center px-4 text-base font-semibold shadow-md sm:min-h-12 sm:flex-1 sm:px-10",
                  justAdded && "bg-green-600 hover:bg-green-600"
                )}
                disabled={stockAvailable < 1 || isAdding}
                onClick={() => void handleAddToCart()}
              >
                {justAdded ? (
                  <>
                    <Check className="h-5 w-5 shrink-0" aria-hidden /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden /> Add to cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 min-w-0 w-full justify-center px-4 font-semibold border-primary/30 sm:w-auto sm:min-w-36 sm:flex-1 sm:px-10"
                onClick={async () => {
                  await handleAddToCart();
                  router.push("/cart");
                }}
              >
                Buy now
              </Button>
            </div>
          </div>

          {/*variety section */}
          {hasVariants ? (
            <div className="min-w-0 max-w-full space-y-3">
              <p className="text-sm font-semibold text-foreground">Choose your option</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {variants.map((v) => {
                  const active = v.publicId === selectedVariant?.publicId;
                  const label = variantOptionLabel(v);
                  return (
                    <button
                      key={v.publicId}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(v.publicId);
                        setQuantity(1);
                      }}
                      className={cn(
                        "flex min-w-0 w-full flex-col rounded-xl border px-3 py-2.5 text-left transition shadow-sm",
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/35"
                          : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-xs font-medium text-foreground line-clamp-2 leading-snug">
                        {label}
                      </span>
                      <span className="mt-1 text-xs font-semibold text-primary tabular-nums">
                        ₹{Math.round(v.price).toLocaleString("en-IN")}
                      </span>
                      <span className="mt-0.5 text-[10px] text-muted-foreground tabular-nums">
                        {v.stock < 1 ? "Out of stock" : `${v.stock} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <ProductDetailInfoTabs
            fabric={product.fabric}
            color={product.color}
            blouseIncluded={product.blouseIncluded}
            length={product.length}
            occasion={product.occasion}
            pattern={product.pattern}
            fit={product.fit}
            texture={product.texture}
            washCare={product.washCare}
            ironing={product.ironing}
            storage={product.storage}
          />
        </div>
      </div>
    </div>
  );
}
