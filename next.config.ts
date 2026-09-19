import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['async_hooks'],
  turbopack: {},
  webpack: (config, { isServer, nextRuntime }) => {
    if (isServer && nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'async_hooks': 'node:async_hooks'
      };
    }
    return config;
  },
};

export default nextConfig;
