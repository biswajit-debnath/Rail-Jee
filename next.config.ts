import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to enable API routes
  // API routes require a Node.js server and cannot work with static export
  reactStrictMode: false, // Disable to prevent double API calls in development
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
