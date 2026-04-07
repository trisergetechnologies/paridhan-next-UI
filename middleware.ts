import { normalizeApiBaseUrl } from "@/lib/publicApiBase";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const GATE_PATHS = ["/maintenance", "/coming-soon"];

/** Allow account (e.g. change password) even when the shop is maintenance / coming soon. */
const STOREFRONT_GATE_BYPASS_PREFIXES = ["/account"];

function isGatePath(pathname: string) {
  return GATE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function bypassesStorefrontGate(pathname: string) {
  return STOREFRONT_GATE_BYPASS_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function parseMode(json: unknown): "live" | "maintenance" | "coming_soon" {
  if (!json || typeof json !== "object") return "live";
  const mode = (json as { data?: { mode?: string } }).data?.mode;
  if (mode === "maintenance" || mode === "coming_soon") return mode;
  return "live";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isGatePath(pathname)) {
    return NextResponse.next();
  }

  if (bypassesStorefrontGate(pathname)) {
    return NextResponse.next();
  }

  const base =
    normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL) ||
    `${request.nextUrl.origin}/api/v1`;

  try {
    const res = await fetch(`${base}/public/storefront-mode`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.next();
    }
    const json: unknown = await res.json();
    const mode = parseMode(json);

    if (mode === "live") {
      return NextResponse.next();
    }
    if (mode === "maintenance") {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Skip /api/v1 (proxied to backend), static assets, and Next internals.
     */
    "/((?!api/v1|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
