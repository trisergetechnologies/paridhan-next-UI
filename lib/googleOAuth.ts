import { resolveAuthReturnTo, saveAuthReturnTo } from "@/lib/authReturnTo";
import { getAbsoluteBrowserApiBase } from "@/lib/publicApiBase";

export function getGoogleOAuthStartUrl(options?: { returnTo?: string }) {
  const base = getAbsoluteBrowserApiBase();
  if (!base) {
    throw new Error("API URL is not configured (set NEXT_PUBLIC_API_URL)");
  }
  const returnTo = resolveAuthReturnTo(options?.returnTo);
  const params = new URLSearchParams({
    client: "storefront",
    returnTo,
  });
  return `${base}/auth/google?${params.toString()}`;
}

export function startGoogleOAuth(options?: { returnTo?: string }) {
  const returnTo = resolveAuthReturnTo(options?.returnTo);
  saveAuthReturnTo(returnTo);
  window.location.href = getGoogleOAuthStartUrl({ returnTo });
}
