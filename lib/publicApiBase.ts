function ensureUrlProtocol(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const isLocal =
    /^localhost(?::\d+)?(\/|$)/i.test(value) ||
    /^127\.0\.0\.1(?::\d+)?(\/|$)/.test(value);
  return `${isLocal ? "http" : "https"}://${value}`;
}

/**
 * Normalize API base: trim, ensure protocol, strip trailing slash,
 * append /api/v1 if only a host/origin was given.
 */
export function normalizeApiBaseUrl(raw: string | undefined | null): string {
  if (raw == null || !String(raw).trim()) return "";
  let u = String(raw).trim().replace(/\/$/, "");
  u = ensureUrlProtocol(u);
  if (/\/api\/v\d+$/i.test(u)) return u;
  return `${u}/api/v1`;
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
  const proxy = ensureUrlProtocol(
    (process.env.API_PROXY_TARGET || process.env.BACKEND_URL || "http://127.0.0.1:4600")
      .trim()
      .replace(/\/$/, ""),
  );
  if (/\/api\/v\d+$/i.test(proxy)) return proxy;
  return `${proxy}/api/v1`;
}
