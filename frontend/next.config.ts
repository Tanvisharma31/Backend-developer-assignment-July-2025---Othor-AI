import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development' 
            ? 'http://localhost:8000/api/v1/:path*' 
            : '/api/:path*',
      },
    ];
  },
  // Enable static exports for deployment
  output: 'standalone',
  // Optional: Add base path if needed
  // basePath: '/dashboard',
};

export default nextConfig;
