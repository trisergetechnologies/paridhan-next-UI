"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { isValidIndianPhone } from "@/lib/indianStates";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  saving?: boolean;
  onSave: (phone: string) => Promise<void>;
  onSkip: () => void;
};

export default function AddMobileModal({ open, saving = false, onSave, onSkip }: Props) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setPhone("");
    setError("");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidIndianPhone(phone)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    try {
      await onSave(phone.replace(/\D/g, "").slice(-10));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save mobile number");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={cn(
              "fixed z-[60] bg-background shadow-2xl w-full",
              "md:max-w-md md:rounded-2xl md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "bottom-0 rounded-t-2xl md:bottom-auto",
            )}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">Add mobile number</h2>
              <button
                type="button"
                onClick={onSkip}
                className="p-2 rounded-full hover:bg-muted transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <p className="text-sm text-muted-foreground">
                We use your mobile number for order updates and delivery coordination.
              </p>

              <div className="space-y-1.5">
                <label htmlFor="auth-phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Mobile number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground h-11">
                    +91
                  </span>
                  <Input
                    id="auth-phone"
                    inputMode="numeric"
                    autoFocus
                    maxLength={10}
                    placeholder="10-digit mobile"
                    className="rounded-l-none h-11"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save & continue"}
              </Button>

              <button
                type="button"
                onClick={onSkip}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition"
              >
                Skip for now
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
