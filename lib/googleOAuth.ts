import { getAbsoluteBrowserApiBase } from "@/lib/publicApiBase";

export function getGoogleOAuthStartUrl(options?: { returnTo?: string }) {
  const base = getAbsoluteBrowserApiBase();
  if (!base) {
    throw new Error("API URL is not configured (set NEXT_PUBLIC_API_URL)");
  }
  const params = new URLSearchParams({
    client: "storefront",
    returnTo: options?.returnTo || "/shop",
  });
  return `${base}/auth/google?${params.toString()}`;
}

export function startGoogleOAuth(options?: { returnTo?: string }) {
  window.location.href = getGoogleOAuthStartUrl(options);
}
