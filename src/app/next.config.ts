import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Also allow http, for more flexibility
      }
    ],
  },
};

export default nextConfig;
