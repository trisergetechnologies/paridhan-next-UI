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
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { CreditCard, Heart, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */

interface Address {
  slug: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

/* ================= COMPONENT ================= */

export default function OrderSummary() {
  const { cart, pricing } = useCart();
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

  /* ---------- FETCH ADDRESSES ---------- */
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

    fetchAddresses();
  }, [isAuthenticated]);

  /* ---------- PLACE ORDER ---------- */
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
            paymentMethod: "cod",
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAddressError(json.message || "Order placement failed");
        showToast(json.message || "Order placement failed", "error");
        return;
      }
      showToast("Order placed successfully", "success");

      window.location.href = "/orders";
    } catch (error) {
      console.error("Order failed:", error);
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
        {/* TOTALS */}
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

        {/* ADDRESS SELECTION */}
        {isAuthenticated && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium">Delivery Address</p>
            {addressError && (
              <p className="text-sm text-red-600">{addressError}</p>
            )}
            {addresses.length === 0 ? (
              <Link href="/account" className="text-sm text-primary underline">
                No address found. Add address in account page.
              </Link>
            ) : null}
            <select
              value={selectedAddress || ""}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full border rounded-md p-2 text-sm"
            >
              {addresses.map((addr) => (
                <option key={addr.slug} value={addr.slug}>
                  {addr.fullName}, {addr.city}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CHECKOUT */}
        <Button
          size="lg"
          className="w-full"
          disabled={!isAuthenticated || placingOrder}
          onClick={handlePlaceOrder}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {placingOrder ? "Placing Order..." : "Proceed to Checkout"}
        </Button>

        {/* TRUST */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            Secure checkout
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-blue-500" />
            Fast delivery
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            Customer support
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
