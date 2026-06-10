"use client";

import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed">("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage("Missing order reference. Please check your orders page.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await authFetch(`${getBrowserApiBase()}/customer/order/verify-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const json = await res.json();
        if (cancelled) return;

        const paymentStatus = json?.data?.paymentStatus;
        if (json.success && paymentStatus === "paid") {
          setStatus("paid");
          setMessage("Payment successful! Your saree order is confirmed.");
          window.dispatchEvent(new Event("paridhan:cart-refresh"));
        } else if (paymentStatus === "pending") {
          setStatus("pending");
          setMessage("Payment is still processing. We will update your order shortly.");
        } else {
          setStatus("failed");
          setMessage(
            json.message ||
              "Payment could not be confirmed. Your cart is unchanged — you can try again."
          );
          window.dispatchEvent(new Event("paridhan:cart-refresh"));
        }
      } catch {
        if (!cancelled) {
          setStatus("failed");
          setMessage("Could not verify payment. Please check your orders or contact support.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="container mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        {status === "loading" && "Processing payment"}
        {status === "paid" && "Thank you!"}
        {status === "pending" && "Almost there"}
        {status === "failed" && "Payment issue"}
      </h1>
      <p className="mt-4 text-muted-foreground">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/orders">View my orders</Link>
        </Button>
        {status === "failed" ? (
          <Button variant="outline" asChild>
            <Link href="/cart">Back to cart</Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
          Verifying payment…
        </div>
      }
    >
      <PaymentReturnContent />
    </Suspense>
  );
}
