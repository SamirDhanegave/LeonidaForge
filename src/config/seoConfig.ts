/**
 * Centralized SEO & Site Configuration for Leonida Forge.
 * 
 * Provides unified base URL resolution, canonical URL generation,
 * metadata fallbacks, and structured data utilities.
 */

export const SITE_NAME = 'Leonida Forge';
export const SITE_TAGLINE = 'GTA VI Tools, Trackers & Calculators';
export const DEFAULT_FALLBACK_DOMAIN = 'https://leonidaforge.com';

/**
 * Resolves the configured production site URL from VITE_SITE_URL.
 * Gracefully falls back to browser origin during local preview, or default fallback domain.
 */
export function getSiteUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Graceful browser fallback for local preview or dev server
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    // If running on localhost or cloud dev container, use origin unless empty
    if (origin && !origin.startsWith('null') && !origin.startsWith('file:')) {
      return origin.replace(/\/+$/, '');
    }
  }

  return DEFAULT_FALLBACK_DOMAIN;
}

/**
 * Generates an absolute, clean canonical URL for a given path.
 * Enforces:
 * - No trailing slashes (except root '/')
 * - Leading slash
 * - Removal of query parameters & hashes
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getSiteUrl();
  if (!path || path === '/' || path === '') {
    return `${baseUrl}/`;
  }

  // Strip query strings and hash anchors from canonical URL
  const cleanPath = path.split('?')[0].split('#')[0];
  const formattedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const trimmedPath = formattedPath.replace(/\/+$/, '');

  return `${baseUrl}${trimmedPath}`;
}

/**
 * Default OG & Social Share image URL
 */
export function getDefaultOgImageUrl(): string {
  return `${getSiteUrl()}/og-image.png`;
}
