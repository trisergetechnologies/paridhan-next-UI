/**
 * Normalize API base: trim, strip trailing slash, append /api/v1 if only a host/origin was given.
 */
export function normalizeApiBaseUrl(raw: string | undefined | null): string {
  if (raw == null || !String(raw).trim()) return "";
  const u = String(raw).trim().replace(/\/$/, "");
  if (/\/api\/v\d+$/i.test(u)) return u;
  return `${u}/api/v1`;
}

/**
 * Browser: prefer NEXT_PUBLIC_API_URL (normalized), else same-origin `/api/v1` (Next.js rewrite → backend).
 */
export function getBrowserApiBase(): string {
  const fromEnv = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/v1`;
  }
  return "";
}

/**
 * Node / RSC / Route Handlers when env is unset: call backend directly (dev default matches next.config rewrite).
 */
export function getServerApiBase(): string {
  const fromEnv = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  if (fromEnv) return fromEnv;
  const proxy = (process.env.API_PROXY_TARGET || "http://127.0.0.1:4600").replace(/\/$/, "");
  return `${proxy}/api/v1`;
}
