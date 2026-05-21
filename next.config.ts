import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || process.env.API_URL || "http://localhost:5001";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  // API is proxied to your external backend service.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // HSTS: only enable in production over HTTPS (uncomment and set max-age as needed)
          // { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // CSP: optional; tighten as needed for your scripts/styles (e.g. 'self', nonces)
          // { key: "Content-Security-Policy", value: "default-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
