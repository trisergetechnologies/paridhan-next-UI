"use client";

import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch";
import { getBrowserApiBase } from "@/lib/publicApiBase";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

export function CancelOrderDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `${getBrowserApiBase()}/customer/order/${orderId}/cancel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: reason.trim() || undefined }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(json.message || "Could not cancel order");
        return;
      }
      onOpenChange(false);
      onSuccess();
    } catch {
      setError("Could not cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">Cancel order</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Within 24 hours of placement, before dispatch. Refunds take 5–7 business days.
            </p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <textarea
          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
        />
        {error ? <p className="text-sm text-destructive mb-3">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Keep order
          </Button>
          <Button variant="destructive" onClick={() => void handleCancel()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm cancellation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
