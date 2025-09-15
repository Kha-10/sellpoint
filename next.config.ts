import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/stores/:path*",
        destination: "https://sellpoint.nexoradigital.site/stores/:path*",
      },
    ];
  },
};

export default nextConfig;
