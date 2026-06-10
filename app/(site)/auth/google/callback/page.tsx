"use client";

import { useAuth } from "@/context/AuthContext";
import { markPhonePromptAfterAuth, userNeedsPhone } from "@/lib/authPhonePrompt";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEFAULT_AFTER_LOGIN = "/shop";

function resolveReturnPath(returnTo: string | null) {
  if (!returnTo || returnTo === "/" || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return DEFAULT_AFTER_LOGIN;
  }
  return returnTo;
}

export default function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [message, setMessage] = useState("Completing Google sign-in...");
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const error = searchParams.get("error");
    if (error) {
      const msg = decodeURIComponent(error);
      setMessage(msg);
      showToast(msg, "error");
      router.replace(DEFAULT_AFTER_LOGIN);
      return;
    }

    const returnTo = resolveReturnPath(searchParams.get("returnTo"));

    void (async () => {
      try {
        const profile = await refreshUser();
        showToast("Signed in with Google", "success");
        if (userNeedsPhone(profile?.phone)) {
          markPhonePromptAfterAuth();
        }
        router.replace(returnTo);
      } catch {
        setMessage("Sign-in completed but profile could not be loaded.");
        showToast("Could not load your profile", "error");
        router.replace(DEFAULT_AFTER_LOGIN);
      }
    })();
    // Intentionally run once — refreshUser is unstable and would retrigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-sm text-muted-foreground text-center">{message}</p>
    </div>
  );
}
