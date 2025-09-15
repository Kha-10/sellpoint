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
        destination: "https://admin-sellpoint.vercel.app/stores/:path*",
      },
      {
        source: "/sign-in",
        destination: "https://admin-sellpoint.vercel.app/sign-in",
      },
    ];
  },
};

export default nextConfig;
