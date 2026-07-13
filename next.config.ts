import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript dan ESLint harus enabled untuk production
  typescript: {
    ignoreBuildErrors: false, // Enable type checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
