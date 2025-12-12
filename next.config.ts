import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'gift_fundraiser';

const nextConfig: NextConfig = {
  output: 'export',
  // On GitHub Pages, the site is served under /repo-name/
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as any;

export default nextConfig;
