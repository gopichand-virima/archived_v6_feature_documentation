/**
 * Browser History Management Utility
 * 
 * Handles URL updates and browser back/forward button navigation
 * for the documentation site.
 */

import { getBasePath } from './basePath';

export interface NavigationState {
  version?: string;
  module?: string;
  section?: string;
  page?: string;
  specialPage?: 'compatibility-matrix' | 'product-support-policies' | 'knowledge-base' | 'virima-tech-central' | 'glossary';
}

export { getBasePath };

/**
 * Generate URL path from navigation state
 */
export function generateUrl(state: NavigationState): string {
  const basePath = getBasePath();
  
  // Special pages (homepage resources)
  if (state.specialPage) {
    return `${basePath}/${state.specialPage}`;
  }
  
  // Homepage
  if (!state.module) {
    return basePath || '/';
  }
  
  // Build path: /basePath/version/module/section/page
  const parts: string[] = [];
  
  if (state.version) {
    parts.push(state.version);
  }
  
  if (state.module) {
    parts.push(state.module);
  }
  
  if (state.section) {
    parts.push(state.section);
  }
  
  if (state.page) {
    parts.push(state.page);
  }
  
  const path = parts.length > 0 ? `/${parts.join('/')}` : '';
  return `${basePath}${path}`;
}

/**
 * Parse URL path into navigation state
 */
export function parseUrl(pathname: string): NavigationState {
  const basePath = getBasePath();
  
  // Remove base path from pathname
  let path = pathname;
  if (basePath && pathname.startsWith(basePath)) {
    path = pathname.slice(basePath.length);
  }
  
  // Remove leading/trailing slashes and split
  const parts = path.split('/').filter(Boolean);
  
  // Special pages (homepage resources)
  const specialPages = ['compatibility-matrix', 'product-support-policies', 'knowledge-base', 'virima-tech-central', 'glossary'];
  if (parts.length === 1 && specialPages.includes(parts[0])) {
    return {
      specialPage: parts[0] as NavigationState['specialPage'],
    };
  }
  
  // Homepage
  if (parts.length === 0) {
    return {};
  }
  
  // Parse: /version/module/section/page
  const state: NavigationState = {};
  
  if (parts.length >= 1) {
    state.version = parts[0];
  }
  
  if (parts.length >= 2) {
    state.module = parts[1];
  }
  
  if (parts.length >= 3) {
    state.section = parts[2];
  }
  
  if (parts.length >= 4) {
    state.page = parts[3];
  }
  
  return state;
}

/**
 * Update browser URL without page reload
 */
export function updateUrl(state: NavigationState, replace: boolean = false): void {
  const url = generateUrl(state);
  const fullUrl = `${window.location.origin}${url}`;
  
  if (replace) {
    window.history.replaceState(state, '', fullUrl);
  } else {
    window.history.pushState(state, '', fullUrl);
  }
  
  console.log(`🔗 [Browser History] ${replace ? 'Replaced' : 'Pushed'} URL:`, url, state);
}

/**
 * Get current navigation state from URL
 */
export function getCurrentState(): NavigationState {
  return parseUrl(window.location.pathname);
}

