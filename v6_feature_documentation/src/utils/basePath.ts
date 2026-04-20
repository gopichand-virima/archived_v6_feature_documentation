/**
 * Base path detection (GitHub Pages /v6_feature_documentation)
 *
 * Keep this logic centralized to avoid drift between routing, content fetch,
 * and asset resolution.
 */
export function getBasePath(): string {
  // SSR / build-time: default to base path in production builds
  if (typeof window === 'undefined') {
    return import.meta.env.PROD ? '/v6_feature_documentation' : '';
  }

  const { hostname, pathname } = window.location;

  // GitHub Pages host — the site is served from the artifact root (i.e. root '/').
  // GitHub may redirect virima-products.github.io/v6_feature_documentation/ to a
  // random subdomain at path '/', so we return '' to match the actual serving path.
  if (hostname === 'github.io' || hostname.endsWith('.github.io')) {
    return '';
  }

  // Local testing where base path is explicitly present in the URL
  if (
    pathname === '/v6_feature_documentation' ||
    pathname === '/v6_feature_documentation/' ||
    pathname.startsWith('/v6_feature_documentation/')
  ) {
    return '/v6_feature_documentation';
  }

  // Production builds served from root (Docker preview, etc.)
  if (import.meta.env.PROD) {
    return '';
  }

  return '';
}


