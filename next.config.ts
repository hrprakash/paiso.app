import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


    // reactStrictMode: false,

 images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.28',
        port: '8001',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'nepalstock.com.np',
        pathname: '/api/nots/security/fetchFiles/**',
      },
      
    ],
  },

  
    allowedDevOrigins: [
    'http://192.168.1.28:8000',
    'http://192.168.1.28:8001',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://bizpro.com.np/api',
    'https://warehouse.bizpro.com.np'
  ],
};

export default nextConfig;
