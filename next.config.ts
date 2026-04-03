import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "kuned-nbd4.vercel.app",
      },
      {
        protocol: "https",
        hostname: "kuned.vercel.app", // ✅ added this
      },
    ],
    domains: ["cashfreelogo.cashfree.com"],
  },
};

export default nextConfig;