'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Handles GitHub Pages SPA redirect
 *
 * When 404.html redirects to /?p=/path, this component:
 * 1. Reads the 'p' query parameter
 * 2. Navigates to the correct client-side route
 * 3. Cleans up the URL
 *
 * This enables client-side routing on static GitHub Pages
 */
export default function SpaRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check if we're being redirected from 404.html
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('p');

    if (redirectPath) {
      // Remove the ?p= parameter and navigate to the actual route
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());

      // Navigate to the intended route
      router.replace(redirectPath);
    }
  }, [router]);

  return null;
}
