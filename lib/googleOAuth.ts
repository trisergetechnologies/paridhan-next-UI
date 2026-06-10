import { getBrowserApiBase } from "@/lib/publicApiBase";

export function getGoogleOAuthStartUrl(options?: { returnTo?: string }) {
  const base = getBrowserApiBase();
  const params = new URLSearchParams({
    client: "storefront",
    returnTo: options?.returnTo || "/shop",
  });
  return `${base}/auth/google?${params.toString()}`;
}

export function startGoogleOAuth(options?: { returnTo?: string }) {
  window.location.href = getGoogleOAuthStartUrl(options);
}
