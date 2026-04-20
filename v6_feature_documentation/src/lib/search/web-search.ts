/**
 * web-search.ts
 *
 * Isolated web search implementation for the "Search Web" tab.
 * Uses Serper API (Google Search wrapper) when VITE_SERPER_API_KEY is configured.
 *
 * This module is completely independent of the docs search index.
 * Web search state must never be shared with or leaked into docs search.
 */

export interface WebSearchResult {
  title: string;
  url: string;
  description: string;
  domain: string;
}

/**
 * Returns true if a Serper API key is configured.
 * Use this to decide whether to show the Search Web tab.
 */
export function isWebSearchAvailable(): boolean {
  const key = (import.meta.env.VITE_SERPER_API_KEY as string | undefined) ?? '';
  return key.length > 0;
}

/**
 * Search the web using Serper API.
 * Throws if not configured or if the request fails.
 */
export async function searchWeb(query: string): Promise<WebSearchResult[]> {
  const key = (import.meta.env.VITE_SERPER_API_KEY as string | undefined) ?? '';

  if (!key) {
    throw new Error(
      'Web search is not configured. Set VITE_SERPER_API_KEY in your environment to enable this feature.'
    );
  }

  const trimmed = query.trim();
  if (!trimmed) return [];

  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: trimmed, num: 10 }),
  });

  if (!response.ok) {
    throw new Error(
      `Web search request failed (HTTP ${response.status}: ${response.statusText})`
    );
  }

  const data = await response.json();

  return ((data.organic as unknown[]) ?? []).slice(0, 10).map((r: unknown) => {
    const result = r as Record<string, unknown>;
    const url = (result['link'] as string) ?? '';
    let domain = url;
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      // keep raw url as domain if parsing fails
    }
    return {
      title: (result['title'] as string) ?? '',
      url,
      description: (result['snippet'] as string) ?? '',
      domain,
    };
  });
}
