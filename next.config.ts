import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  /* config options here */
    output:"export",
    basePath: isExport ? '/ValinomCluinataWeb' : '',
    assetPrefix: isExport ? '/ValinomCluinataWeb/' : '',
    trailingSlash: true,
};

export default nextConfig;
