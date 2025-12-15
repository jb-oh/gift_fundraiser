/**
 * Environment configuration utility
 * Handles environment-specific settings for development and production
 */

export const ENV = {
  // Environment type
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Base URL configuration
  get baseUrl(): string {
    // If NEXT_PUBLIC_BASE_URL is set, use it (highest priority)
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Production: GitHub Pages URL
    if (this.isProduction) {
      return 'https://jb-oh.github.io/gift_fundraiser';
    }

    // Development: localhost
    return 'http://localhost:3000';
  },

  // Repository name for GitHub Pages
  repoName: 'gift_fundraiser',

  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    isConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
} as const;

/**
 * Get the full URL for a given path
 * @param path - The path to append to the base URL (should start with /)
 * @returns The complete URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = ENV.baseUrl;
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get the base path for routing (used by Next.js)
 * @returns The base path or empty string for root
 */
export function getBasePath(): string {
  return ENV.isProduction ? `/${ENV.repoName}` : '';
}
