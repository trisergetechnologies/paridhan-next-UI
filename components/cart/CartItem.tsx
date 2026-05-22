"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, type CartItem as CartLine } from "@/context/CartContext";
import { parseCartLineId } from "@/lib/cartLineId";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  item: CartLine;
  isLast: boolean;
}

export default function CartItem({ item, isLast }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();

  const MAX_LINE = 50;
  const effectiveMax =
    item.maxQuantity != null
      ? Math.min(MAX_LINE, Math.max(0, item.maxQuantity))
      : MAX_LINE;
  const canDecrease = item.quantity > 1;
  const canIncrease = item.quantity < effectiveMax;

  const publicIdForFallback =
    (item.productId && item.productId.trim()) ||
    parseCartLineId(item.id).productId;
  const pathSegment =
    (item.productSlug && item.productSlug.trim()) || publicIdForFallback;
  const productHref = pathSegment
    ? `/product/${encodeURIComponent(pathSegment)}`
    : null;

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative w-100px h-100px">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="100px"
            className="rounded-lg object-cover bg-muted"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="line-clamp-2 text-base font-semibold text-foreground">
                {productHref ? (
                  <Link
                    href={productHref}
                    className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </h2>
              {item.variantLabel ? (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {item.variantLabel}
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground mt-1">
                ₹{item.price.toFixed(2)} each
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFromCart(item.id)}
              className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center border border-border rounded-lg">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!canDecrease) return;
                  updateQuantity(item.id, item.quantity - 1);
                }}
                disabled={!canDecrease}
                className="h-8 w-8 rounded-r-none"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-4 py-2 min-w-50px text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!canIncrease) return;
                  updateQuantity(item.id, item.quantity + 1);
                }}
                disabled={!canIncrease}
                className="h-8 w-8 rounded-l-none"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isLast && <Separator className="mt-4" />}
    </div>
  );
}
