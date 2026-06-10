import { normalizeApiBaseUrl } from "@/lib/apiUrl";

/** Storefront hostnames that should call the production API subdomain directly. */
export function isProductionStoreHost(hostname: string): boolean {
  const configured = (process.env.NEXT_PUBLIC_STORE_HOSTNAMES || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  const defaults = ["paridhanemporium.com", "www.paridhanemporium.com"];
  const hosts = configured.length ? configured : defaults;
  return hosts.includes(hostname.toLowerCase());
}

/** API base used when NEXT_PUBLIC_API_URL is unset on the live storefront. */
export function getProductionApiBaseFallback(): string {
  const fromOrigin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim();
  if (fromOrigin) return normalizeApiBaseUrl(fromOrigin);
  return "https://api.paridhanemporium.com/api/v1";
}

export function getConfiguredApiBase(): string {
  return normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}
