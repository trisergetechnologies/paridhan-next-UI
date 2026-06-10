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

const apiProxyTarget = normalizeProxyTarget(
  process.env.API_PROXY_TARGET ||
    process.env.BACKEND_URL ||
    "http://127.0.0.1:4600",
);

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
