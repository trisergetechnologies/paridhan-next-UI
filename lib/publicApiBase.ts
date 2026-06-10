import { ensureUrlProtocolForProxy, normalizeApiBaseUrl } from "@/lib/apiUrl";
import {
  getConfiguredApiBase,
  getProductionApiBaseFallback,
  isProductionStoreHost,
} from "@/lib/siteConfig";

export { normalizeApiBaseUrl } from "@/lib/apiUrl";

/**
 * Browser: env → production host fallback → same-origin /api/v1 rewrite.
 */
export function getBrowserApiBase(): string {
  const fromEnv = getConfiguredApiBase();
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    if (isProductionStoreHost(window.location.hostname)) {
      return getProductionApiBaseFallback();
    }
    return `${window.location.origin}/api/v1`;
  }

  return "";
}

/** Full absolute API base for browser redirects (OAuth, external navigation). */
export function getAbsoluteBrowserApiBase(): string {
  const base = getBrowserApiBase();
  if (!base) return "";
  if (/^https?:\/\//i.test(base)) return base;
  if (typeof window !== "undefined") {
    return `${window.location.origin}${base.startsWith("/") ? base : `/${base}`}`;
  }
  return base;
}

/**
 * Node / middleware / RSC when env is unset.
 */
export function getServerApiBase(): string {
  const fromEnv = getConfiguredApiBase();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    return getProductionApiBaseFallback();
  }

  const proxy = ensureUrlProtocolForProxy(
    process.env.API_PROXY_TARGET || process.env.BACKEND_URL || "http://127.0.0.1:4600",
  );
  if (/\/api\/v\d+$/i.test(proxy)) return proxy;
  return `${proxy}/api/v1`;
}
