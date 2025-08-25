import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ❌ TypeScript xatolarini build paytida e’tiborsiz qoldiradi
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❌ ESLint xatolarini build paytida e’tiborsiz qoldiradi
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
