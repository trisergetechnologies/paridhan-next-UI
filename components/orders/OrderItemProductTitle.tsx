"use client";

import {
  getOrderItemProductHref,
  type OrderLineProductLinkInput,
} from "@/lib/orderItemProductLink";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = OrderLineProductLinkInput & {
  name: string;
  className?: string;
  linkClassName?: string;
  /** When false, omits "· Qty N" (e.g. order detail shows quantity separately). */
  showQuantityInTitle?: boolean;
};

export function OrderItemProductTitle({
  name,
  quantity,
  productId,
  productSlug,
  productPublicId,
  className,
  linkClassName,
  showQuantityInTitle = true,
}: Props) {
  const href = getOrderItemProductHref({
    productId,
    productSlug,
    productPublicId,
    quantity,
  });

  return (
    <p className={cn("font-medium text-foreground line-clamp-2", className)}>
      {href ? (
        <Link
          href={href}
          className={cn(
            "rounded-sm hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            linkClassName
          )}
        >
          {name}
        </Link>
      ) : (
        name
      )}
      {showQuantityInTitle && quantity != null ? (
        <span className="font-normal text-muted-foreground">
          {" "}
          · Qty {quantity}
        </span>
      ) : null}
    </p>
  );
}
