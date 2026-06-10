"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/lib/authFetch";
import { launchCashfreeCheckout } from "@/lib/cashfreeCheckout";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Heart,
  Shield,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TRUST_FEATURES: {
  label: string;
  Icon: LucideIcon;
  iconClass: string;
  bgClass: string;
}[] = [
  {
    label: "Secure checkout",
    Icon: Shield,
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-500/10",
  },
  {
    label: "Fast delivery",
    Icon: Truck,
    iconClass: "text-sky-600",
    bgClass: "bg-sky-500/10",
  },
  {
    label: "Customer support",
    Icon: Heart,
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
];

interface Address {
  slug: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

type OrderPlacementResponse = {
  success: boolean;
  message?: string;
  data?: {
    order?: { _id: string };
    payment?: {
      provider: string;
      paymentSessionId: string;
      mode?: "sandbox" | "production";
    };
  };
};

export default function OrderSummary() {
  const { cart, pricing, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = isAuthenticated ? pricing.taxAmount : Math.round(subtotal * 0.05);
  const shipping = isAuthenticated
    ? pricing.deliveryCharge
    : subtotal >= 999
      ? 0
      : 80;
  const total = isAuthenticated ? pricing.grandTotal : subtotal + tax + shipping;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAddresses = async () => {
      try {
        const res = await authFetch(`${getBrowserApiBase()}/customer/address`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          setAddressError(json.message || "Failed to fetch addresses");
          return;
        }
        const items = json.data.items || [];
        setAddresses(items);
        setAddressError(null);
        const defaultAddress = items.find((addr: Address & { isDefault?: boolean }) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.slug);
        } else if (items.length > 0) {
          setSelectedAddress(items[0].slug);
        }
      } catch (error) {
        console.error("Address fetch failed:", error);
        setAddressError("Address service unavailable");
      }
    };

    void fetchAddresses();
    void refreshCart();
  }, [isAuthenticated, refreshCart]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;

    try {
      setPlacingOrder(true);

      const res = await authFetch(
        `${getBrowserApiBase()}/customer/order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressSlug: selectedAddress,
            paymentMethod: "online",
          }),
        }
      );
      const json = (await res.json()) as OrderPlacementResponse;
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Could not start checkout");
        showToast(json.message || "Could not start checkout", "error");
        await refreshCart();
        return;
      }

      const payment = json.data?.payment;
      if (payment?.paymentSessionId) {
        showToast("Redirecting to secure payment…", "success");
        await launchCashfreeCheckout(
          payment.paymentSessionId,
          payment.mode === "production" ? "production" : "sandbox"
        );
        return;
      }

      showToast("Payment session missing. Please try again.", "error");
      await refreshCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      showToast("Something went wrong. Please try again.", "error");
      await refreshCart();
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Subtotal ({itemCount} items)
            </span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">₹{tax}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              ₹{total}
            </span>
          </div>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground pt-2">
            Sign in to complete your order.
          </p>
        )}

        {isAuthenticated && (
          <>
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Delivery Address</p>
              {addressError && (
                <p className="text-sm text-red-600">{addressError}</p>
              )}
              {addresses.length === 0 ? (
                <Link href="/account?tab=addresses" className="text-sm text-primary underline">
                  No address found. Add address in account page.
                </Link>
              ) : null}
              <select
                value={selectedAddress || ""}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-2.5 text-sm shadow-sm"
              >
                {addresses.map((addr) => (
                  <option key={addr.slug} value={addr.slug}>
                    {addr.fullName}, {addr.city} — {addr.postalCode}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">Prepaid only</p>
                  <p className="text-xs text-muted-foreground">
                    Pay securely via Cashfree — UPI, cards & net banking
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <Button
          size="lg"
          className="w-full"
          disabled={isAuthenticated ? placingOrder || !selectedAddress || itemCount === 0 : false}
          onClick={() => {
            if (!isAuthenticated) {
              window.dispatchEvent(
                new CustomEvent("open-auth-modal", { detail: { mode: "signin" } })
              );
              return;
            }
            void handlePlaceOrder();
          }}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isAuthenticated
            ? placingOrder
              ? "Starting payment…"
              : "Pay securely"
            : "Sign in to checkout"}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Your cart is kept until payment succeeds. By paying you agree to our{" "}
          <Link href="/policy/terms-conditions" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/policy/return-policy" className="text-primary hover:underline">
            Return Policy
          </Link>
          .
        </p>

        <div className="grid grid-cols-3 gap-2 border-t pt-4 sm:gap-3">
          {TRUST_FEATURES.map(({ label, Icon, iconClass, bgClass }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center gap-2 text-center"
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-2xl sm:size-12",
                  bgClass
                )}
                aria-hidden
              >
                <Icon
                  className={cn("size-6 sm:size-7", iconClass)}
                  strokeWidth={2.25}
                />
              </span>
              <span className="text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
