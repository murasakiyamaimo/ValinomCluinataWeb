import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  /* config options here */
    output:"export",
    basePath: isExport ? '/murasakiyamaimo.github.io' : '',
    assetPrefix: isExport ? '/murasakiyamaimo.github.io/' : '',
    trailingSlash: true,
};

export default nextConfig;
