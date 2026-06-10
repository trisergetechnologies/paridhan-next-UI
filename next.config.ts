import type { NextConfig } from "next";

function normalizeProxyTarget(raw: string): string {
  let value = raw.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(value)) {
    const isLocal =
      /^localhost(?::\d+)?$/i.test(value) || /^127\.0\.0\.1(?::\d+)?$/.test(value);
    value = `${isLocal ? "http" : "https"}://${value}`;
  }
  return value;
}

function resolveApiProxyOrigin(): string {
  const explicit = process.env.API_PROXY_TARGET?.trim();
  if (explicit) return normalizeProxyTarget(explicit);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiUrl) {
    let normalized = apiUrl.replace(/\/$/, "");
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }
    normalized = normalized.replace(/\/api\/v\d+$/i, "");
    return normalizeProxyTarget(normalized);
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api.paridhanemporium.com";
  }

  return normalizeProxyTarget(process.env.BACKEND_URL || "http://127.0.0.1:4600");
}

const apiProxyTarget = resolveApiProxyOrigin();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
