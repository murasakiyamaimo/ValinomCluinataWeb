import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
    trailingSlash: true,
    transpilePackages: ['framer-motion'],
};

export default nextConfig;
