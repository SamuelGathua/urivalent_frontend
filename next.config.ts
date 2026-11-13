import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 82, 85, 90, 95],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/feed",
        destination: "/feeds",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.urivalent.tech";
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
