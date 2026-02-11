"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

export default function AuthModal({
  open,
  onClose,
  mode,
  onModeChange,
}: AuthModalProps) {
  /* -----------------------
     LOCK SCROLL
  ------------------------ */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* -----------------------
     ESC TO CLOSE
  ------------------------ */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* -----------------------
     AUTH SUCCESS HANDLER
  ------------------------ */
  const handleAuthSuccess = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            className={cn(
              "fixed z-50 bg-background shadow-2xl w-full",
              "md:max-w-md md:rounded-2xl md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "bottom-0 rounded-t-2xl md:bottom-auto"
            )}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">
                {mode === "signin" ? "Sign In" : "Create Account"}
              </h2>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition"
                aria-label="Close authentication modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-6">
              <p className="text-sm text-muted-foreground mb-6">
                {mode === "signin"
                  ? "Welcome back. Please sign in to continue."
                  : "Join Paridhan Emporium for a refined shopping experience."}
              </p>

              {/* FORMS */}
              {mode === "signin" ? (
                <SignInForm onSuccess={handleAuthSuccess} />
              ) : (
                <SignUpForm onSuccess={handleAuthSuccess} />
              )}

              {/* MODE SWITCH */}
              <div className="mt-6 text-center text-sm">
                {mode === "signin" ? (
                  <>
                    New user?{" "}
                    <button
                      className="text-primary font-medium hover:underline"
                      onClick={() => onModeChange("signup")}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      className="text-primary font-medium hover:underline"
                      onClick={() => onModeChange("signin")}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
