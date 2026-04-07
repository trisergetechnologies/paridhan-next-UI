"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import {
  normalizeOrderStatus,
  orderPipelineIndex,
  orderStatusBadgeClass,
  orderStatusShortLabel,
  paymentMethodLabel,
} from "@/lib/orderDisplay";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type OrderItem = {
  name: string;
  image?: string;
  quantity: number;
  price?: number;
  variantLabel?: string;
};

type ShippingSnapshot = {
  fullName?: string;
  city?: string;
  state?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  grandTotal: number;
  itemsTotal?: number;
  deliveryCharge?: number;
  taxAmount?: number;
  /** Backend field */
  orderStatus?: string;
  /** Legacy / wrong field — still checked for safety */
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items: OrderItem[];
  shippingAddress?: ShippingSnapshot;
};

function formatOrderWhen(iso: string) {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  } catch {
    return { date: "—", time: "" };
  }
}

export default function OrdersPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customer/order?page=1&limit=20`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(json.message || "Could not load orders");
        setOrders([]);
        return;
      }
      setOrders(Array.isArray(json.data?.items) ? json.data.items : []);
    } catch {
      setError("Something went wrong. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Sign in to see your orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track deliveries, view past purchases, and reorder your favourites.
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
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-muted/25">
      <div className="border-b border-border/80 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary mb-2">
                Account
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                My orders
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Every order in one place — status, items, and where it&apos;s
                going. Open any order for the full breakdown.
              </p>
            </div>
            {orders.length > 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card px-4 py-3 text-sm shadow-sm">
                <Package className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-foreground tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {orders.length === 1 ? "order" : "orders"} shown
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
        {error ? (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-border/60 bg-card"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card px-8 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              When you place an order, it will show up here with tracking-style
              updates and all your items in one view.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-5 md:space-y-6">
            {orders.map((order) => {
              const rawStatus = order.orderStatus ?? order.status;
              const status = normalizeOrderStatus(rawStatus);
              const { date, time } = formatOrderWhen(order.createdAt);
              const items = order.items ?? [];
              const preview = items.slice(0, 3);
              const extra = Math.max(0, items.length - preview.length);
              const ship = order.shippingAddress;
              const shipLine =
                ship?.city && ship?.state
                  ? `${ship.city}, ${ship.state}`
                  : ship?.city || ship?.state || null;

              return (
                <li key={order._id}>
                  <article
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm",
                      "transition-all duration-300 hover:border-primary/25 hover:shadow-md"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 bg-primary/80",
                        status === "delivered" && "bg-emerald-600",
                        status === "shipped" && "bg-sky-600",
                        status === "cancelled" && "bg-destructive"
                      )}
                      aria-hidden
                    />

                    <div className="pl-4 sm:pl-5">
                      <div className="flex flex-col gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 sm:pb-4">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {order.orderNumber}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                                orderStatusBadgeClass(status)
                              )}
                            >
                              {orderStatusShortLabel(status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Placed on{" "}
                            <span className="font-medium text-foreground">
                              {date}
                            </span>
                            {time ? (
                              <>
                                {" "}
                                <span className="text-muted-foreground/80">
                                  · {time}
                                </span>
                              </>
                            ) : null}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paymentMethodLabel(order.paymentMethod)}
                            {order.paymentStatus ? (
                              <>
                                {" "}
                                ·{" "}
                                <span className="capitalize">
                                  {order.paymentStatus}
                                </span>
                              </>
                            ) : null}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Total
                          </p>
                          <p className="text-xl font-semibold tabular-nums text-primary">
                            ₹
                            {Number(order.grandTotal).toLocaleString("en-IN")}
                          </p>
                          <button
                            type="button"
                            onClick={() => router.push(`/orders/${order._id}`)}
                            className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:underline"
                          >
                            View order
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5 sm:pt-4">
                        <div className="flex shrink-0 gap-2">
                          {preview.map((item, idx) => (
                            <div
                              key={`${order._id}-img-${idx}`}
                              className="relative h-16 w-14 overflow-hidden rounded-lg border border-border/60 bg-muted sm:h-[72px] sm:w-[60px]"
                            >
                              {item.image?.trim() ? (
                                <Image
                                  src={item.image}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="60px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                  <Package className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          ))}
                          {extra > 0 ? (
                            <div className="flex h-16 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs font-semibold text-muted-foreground sm:h-[72px] sm:w-[60px]">
                              +{extra}
                            </div>
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1 space-y-2">
                          {items.slice(0, 2).map((item, idx) => (
                            <div
                              key={`${order._id}-line-${idx}`}
                              className="text-sm"
                            >
                              <p className="font-medium text-foreground line-clamp-2">
                                {item.name}
                                <span className="font-normal text-muted-foreground">
                                  {" "}
                                  · Qty {item.quantity}
                                </span>
                              </p>
                              {item.variantLabel ? (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {item.variantLabel}
                                </p>
                              ) : null}
                            </div>
                          ))}
                          {items.length > 2 ? (
                            <p className="text-xs text-muted-foreground">
                              +{items.length - 2} more{" "}
                              {items.length - 2 === 1 ? "item" : "items"}
                            </p>
                          ) : null}

                          {shipLine || ship?.fullName ? (
                            <div className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                              <span>
                                {ship?.fullName ? (
                                  <>
                                    <span className="font-medium text-foreground/90">
                                      {ship.fullName}
                                    </span>
                                    {shipLine ? " · " : ""}
                                  </>
                                ) : null}
                                {shipLine}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {status !== "cancelled" ? (
                          <div className="hidden w-36 shrink-0 sm:block">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Progress
                            </p>
                            <div className="flex gap-1">
                              {[
                                "placed",
                                "confirmed",
                                "packed",
                                "shipped",
                                "delivered",
                              ].map((step, i) => {
                                const current = orderPipelineIndex(status);
                                const done = i <= current;
                                return (
                                  <div
                                    key={step}
                                    className={cn(
                                      "h-1.5 flex-1 rounded-full transition-colors",
                                      done
                                        ? "bg-primary"
                                        : "bg-muted-foreground/20"
                                    )}
                                    title={step}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
