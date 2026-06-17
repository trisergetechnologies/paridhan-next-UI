"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import {
  normalizeOrderStatus,
  orderPipelineIndex,
  orderStatusBadgeClass,
  orderStatusLabel,
  ORDER_TIMELINE_STEPS,
  paymentMethodLabel,
  paymentStatusLabel,
  returnStatusLabel,
} from "@/lib/orderDisplay";
import { cn } from "@/lib/utils";
import { OrderItemProductTitle } from "@/components/orders/OrderItemProductTitle";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { ReturnOrderDialog } from "@/components/orders/ReturnOrderDialog";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  HelpCircle,
  Loader2,
  Package,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrderDetailPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<{
    cancel?: { eligible: boolean; reason?: string };
    return?: { eligible: boolean; reason?: string };
  } | null>(null);
  const [returns, setReturns] = useState<any[]>([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId || !isAuthenticated) {
      setOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `${getBrowserApiBase()}/customer/order/${orderId}`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success || !json.data) {
        setError(json.message || "Order not found");
        setOrder(null);
        return;
      }
      setOrder(json.data);

      const [eligRes, returnsRes] = await Promise.all([
        authFetch(`${getBrowserApiBase()}/customer/order/${orderId}/eligibility`),
        authFetch(`${getBrowserApiBase()}/customer/returns?limit=20`),
      ]);
      const eligJson = await eligRes.json().catch(() => ({}));
      if (eligJson.success && eligJson.data) {
        setEligibility(eligJson.data);
      }
      const returnsJson = await returnsRes.json().catch(() => ({}));
      if (returnsJson.success && returnsJson.data?.items) {
        setReturns(
          returnsJson.data.items.filter(
            (r: any) => String(r.order?._id || r.order) === String(orderId)
          )
        );
      }
    } catch {
      setError("Could not load this order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, orderId]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Sign in to view this order.</p>
        <Button
          type="button"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
            )
          }
        >
          Sign in
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-16 text-center space-y-4">
        <p className="text-destructive">{error || "Order not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const status = normalizeOrderStatus(order.orderStatus ?? order.status);
  const currentStep = orderPipelineIndex(status);

  return (
    <div className="min-h-[60vh] bg-muted/20">
      <div className="border-b border-border/80 bg-background/90">
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-1" />
              All orders
            </Link>
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary mb-1">
                Order detail
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                {order.orderNumber}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex w-fit items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide",
                orderStatusBadgeClass(status)
              )}
            >
              {orderStatusLabel(status)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10 space-y-8 md:space-y-10">
        <section className="flex flex-wrap gap-3">
          {eligibility?.cancel?.eligible ? (
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel order
            </Button>
          ) : null}
          {eligibility?.return?.eligible ? (
            <Button size="sm" variant="outline" className="border-primary/30" onClick={() => setReturnOpen(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Request return
            </Button>
          ) : null}
          <Button size="sm" variant="outline" className="border-primary/30">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <Button size="sm" variant="ghost">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </section>

        {actionMessage ? (
          <p className="text-sm text-primary rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            {actionMessage}
          </p>
        ) : null}

        {returns.length > 0 ? (
          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-semibold text-foreground">Return requests</h2>
            {returns.map((ret) => (
              <div
                key={ret._id}
                className="rounded-xl border border-border/60 p-4 text-sm space-y-1"
              >
                <p className="font-medium">{ret.returnNumber}</p>
                <p className="text-muted-foreground">{ret.reason}</p>
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">{returnStatusLabel(ret.status)}</span>
                </p>
                {ret.shipping?.reverseAwb ? (
                  <p className="text-muted-foreground">Return AWB: {ret.shipping.reverseAwb}</p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold mb-6 text-foreground">
            Fulfillment status
          </h2>

          {status === "cancelled" ? (
            <p className="text-sm text-muted-foreground">
              This order has been cancelled.
              {order.paymentStatus === "refund_pending"
                ? " Your refund will be processed within 5–7 business days."
                : order.paymentStatus === "refunded"
                  ? " Refund has been processed."
                  : null}
            </p>
          ) : (
            <div className="space-y-2">
              {ORDER_TIMELINE_STEPS.map((step, i) => {
                const done = currentStep >= i;
                const isCurrent = currentStep === i;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {done ? (
                        <CheckCircle
                          className={cn(
                            "h-6 w-6 shrink-0",
                            isCurrent ? "text-primary" : "text-emerald-600"
                          )}
                        />
                      ) : (
                        <Clock className="h-6 w-6 shrink-0 text-muted-foreground/60" />
                      )}
                      {i < ORDER_TIMELINE_STEPS.length - 1 ? (
                        <div
                          className={cn(
                            "w-px flex-1 min-h-[12px] mt-2",
                            done ? "bg-primary/35" : "bg-border"
                          )}
                        />
                      ) : null}
                    </div>
                    <div
                      className={cn(
                        "pb-6",
                        i === ORDER_TIMELINE_STEPS.length - 1 && "pb-0"
                      )}
                    >
                      <p
                        className={cn(
                          "font-medium",
                          done ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Items in this order
          </h2>

          <div className="divide-y divide-border/60">
            {(order.items ?? []).map((item: any, index: number) => (
              <div
                key={`${item.productId ?? "item"}-${index}`}
                className="flex gap-4 py-5 first:pt-0"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                  {item.image?.trim() ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <OrderItemProductTitle
                    name={item.name}
                    quantity={item.quantity}
                    productId={
                      item.productId != null
                        ? String(item.productId)
                        : undefined
                    }
                    productSlug={item.productSlug}
                    productPublicId={item.productPublicId}
                    showQuantityInTitle={false}
                    className="leading-snug line-clamp-none"
                  />
                  {item.variantLabel ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.variantLabel}
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground mt-2">
                    Quantity {item.quantity}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold tabular-nums text-foreground">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">per unit</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold mb-4 text-foreground">
              Delivery address
            </h2>
            <p className="font-medium text-foreground">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Phone: {order.shippingAddress?.phone}
            </p>
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-3">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Payment
            </h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="tabular-nums">
                ₹{Number(order.itemsTotal).toLocaleString("en-IN")}
              </span>
            </div>
            {Number(order.taxAmount) > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="tabular-nums">
                  ₹{Number(order.taxAmount).toLocaleString("en-IN")}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="tabular-nums">
                ₹{Number(order.deliveryCharge).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="border-t border-border/80 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span className="tabular-nums text-primary">
                ₹{Number(order.grandTotal).toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              {paymentMethodLabel(order.paymentMethod)}
              {order.paymentStatus ? (
                <span> · {paymentStatusLabel(order.paymentStatus)}</span>
              ) : null}
            </p>
            {order.shipping?.awb ? (
              <p className="text-sm text-muted-foreground">
                Tracking:{" "}
                {order.shipping.trackingUrl ? (
                  <a
                    href={order.shipping.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {order.shipping.awb}
                  </a>
                ) : (
                  order.shipping.awb
                )}
                {order.shipping.courierName ? ` (${order.shipping.courierName})` : ""}
              </p>
            ) : null}
          </section>
        </div>
      </div>

      <CancelOrderDialog
        orderId={String(orderId)}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={() => {
          setActionMessage("Order cancelled successfully.");
          void fetchOrder();
        }}
      />
      <ReturnOrderDialog
        orderId={String(orderId)}
        open={returnOpen}
        onOpenChange={setReturnOpen}
        onSuccess={() => {
          setActionMessage("Return request submitted. We will review it shortly.");
          void fetchOrder();
        }}
      />
    </div>
  );
}
