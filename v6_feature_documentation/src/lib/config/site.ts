/**
 * site.ts — Canonical site configuration
 *
 * Single source of truth for site-wide constants used in SEO, structured data,
 * sitemap generation, and discoverability artifacts.
 *
 * Production URL: https://virima-products.github.io/v6_feature_documentation
 */

export const SITE_URL = 'https://virima-products.github.io/v6_feature_documentation';
export const SITE_NAME = 'Virima Documentation';
export const SITE_DESCRIPTION =
  'Official documentation for the Virima V6 IT management platform — covering ITSM, CMDB, Discovery, ITAM, and Vulnerability Management.';
export const SITE_ORG_URL = 'https://virima.com';
export const SITE_SUPPORT_URL = 'https://support.virima.com';

/** Canonical page URL for a given path relative to the site root. */
export function canonicalUrl(path: string): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `${SITE_URL}/${clean}` : SITE_URL;
}
