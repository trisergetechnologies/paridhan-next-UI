type CashfreeMode = "sandbox" | "production";

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal";
  }) => Promise<void>;
};

declare global {
  interface Window {
    Cashfree?: (config: { mode: CashfreeMode }) => CashfreeInstance;
  }
}

const SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js";

let scriptPromise: Promise<void> | null = null;

function loadCashfreeScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cashfree checkout is only available in the browser"));
  }
  if (window.Cashfree) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function launchCashfreeCheckout(
  paymentSessionId: string,
  mode: CashfreeMode = "sandbox"
) {
  await loadCashfreeScript();
  if (!window.Cashfree) {
    throw new Error("Cashfree SDK failed to initialize");
  }
  const cashfree = window.Cashfree({ mode });
  await cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}
