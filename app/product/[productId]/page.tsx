"use client";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductNotFound from "@/components/product/ProductNotFound";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { cartLineId } from "@/lib/cartLineId";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, Minus, Plus, Settings2, ShoppingCart, Star } from "lucide-react";
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
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/public/products/single/${productId}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const variants: VariantDto[] = product?.variants ?? [];
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

    await addToCart({
      id: hasVariants
        ? cartLineId(product.publicId, selectedVariant?.publicId)
        : cartLineId(product.publicId),
      productId: product.publicId,
      variantPublicId: selectedVariant?.publicId,
      name: product.name,
      price: unitPrice,
      image: img,
      quantity: qty,
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
        <div className="lg:sticky lg:top-24">
          <ProductImageGallery
            images={galleryImages}
            productName={product.name}
            showControls
          />
        </div>

        <div className="space-y-6 md:space-y-8">
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
              <p className="text-sm font-semibold uppercase tracking-wide text-primary/90 mb-1">
                {firstCategory}
              </p>
            ) : null}
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            {tagline ? (
              <p className="mt-2 text-base text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">Customer favourite</span>
          </div>

          <div id="product-details" className="scroll-mt-28">
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed whitespace-pre-line">
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
            </div>
            <p className="text-[11px] text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
          </div>

          {hasVariants ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Choose your option</p>
              <div className="flex flex-wrap gap-2">
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
                        "flex min-w-[5.5rem] max-w-[11rem] flex-col rounded-xl border px-3 py-2.5 text-left transition shadow-sm",
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

          <p className="text-xs text-muted-foreground">
            {stockAvailable < 1
              ? "Currently out of stock"
              : `${stockAvailable} available for this selection`}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="space-y-2">
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

            <div className="flex flex-1 flex-col sm:flex-row gap-3 sm:items-stretch">
              <Button
                size="lg"
                className={cn(
                  "flex-1 h-12 text-base font-semibold shadow-md",
                  justAdded && "bg-green-600 hover:bg-green-600"
                )}
                disabled={stockAvailable < 1 || isAdding}
                onClick={() => {
                  if (!isAuthenticated) {
                    window.dispatchEvent(
                      new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
                    );
                    return;
                  }
                  void handleAddToCart();
                }}
              >
                {justAdded ? (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 sm:min-w-[140px] border-primary/30 font-semibold"
                onClick={() => {
                  if (!isAuthenticated) {
                    window.dispatchEvent(
                      new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
                    );
                    return;
                  }
                  router.push("/cart");
                }}
              >
                Buy now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
