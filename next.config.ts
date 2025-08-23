import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.8.1.2", "http://localhost:3000"],
};

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
