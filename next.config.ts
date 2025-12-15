import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'gift_fundraiser';

const nextConfig: NextConfig = {
  output: 'export',

  // On GitHub Pages, the site is served under /repo-name/
  // In development, no basePath is needed
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Ignore ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_URL: isProd
      ? 'https://jb-oh.github.io/gift_fundraiser'
      : 'http://localhost:3000',
  },
} as any;

export default nextConfig;
