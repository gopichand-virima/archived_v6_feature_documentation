/**
 * Content Loader — fetch-based, token-efficient
 *
 * Architecture:
 *  - Single strategy: direct fetch of .md files served from /content/
 *  - Content is cached per session (Map<filePath, content>)
 *  - YAML frontmatter is stripped before returning
 *  - Falls back to registry for legacy placeholder content only
 *
 * All 14 dead static MDX import maps have been removed.
 * The fetch strategy is the only active path.
 */

import {
  loadHierarchicalToc,
  loadSectionPages,
  type HierarchicalPage,
} from '../../utils/hierarchicalTocLoader';
import { getMDXContent } from './mdxContentBundle';
import { getRegisteredContent, isContentRegistered } from './mdxContentRegistry';
import { getBasePath } from '../../utils/basePath';

// Current version — only 6.1 active
let currentVersion = '6_1';

// ─── Version management ───────────────────────────────────────────────────────

export function setVersion(version: string): void {
  const validVersions = ['6_1'];
  if (!validVersions.includes(version)) {
    console.error(`❌ Invalid version: ${version}. Valid: ${validVersions.join(', ')}`);
    return;
  }
  const prev = currentVersion;
  currentVersion = version;
  console.log(`🔄 [Content Loader] Version: ${prev} → ${currentVersion}`);
  clearContentCache();
}

export function getCurrentVersion(): string {
  return currentVersion;
}

console.log(`📦 [Content Loader] Initialised. Version: ${currentVersion}`);

// ─── Session cache ────────────────────────────────────────────────────────────

const contentCache = new Map<string, string>();

// ─── HTML extraction (fallback for certain hosting environments) ──────────────

function extractMarkdownFromHTML(html: string): string | null {
  // Try <pre> tag first (most common wrapper)
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch?.[1]) {
    const decoded = decodeHTMLEntities(preMatch[1]);
    if (decoded.trim().length > 20) return decoded.trim();
  }

  // Try nested <pre><code>
  const nestedMatch = html.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
  if (nestedMatch?.[1]) {
    const decoded = decodeHTMLEntities(nestedMatch[1]);
    if (decoded.trim().length > 20) return decoded.trim();
  }

  // DOMParser body text as last resort
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style').forEach(el => el.remove());
  const text = doc.body?.textContent?.trim() ?? '';
  if (text.length > 50) return text;

  return null;
}

function decodeHTMLEntities(text: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Normalise a path to an absolute /content/… URL.
 * Pipeline-generated entries store relative paths like "admin/ad_config/file.md".
 * TOC entries store absolute paths like "/content/6_1/admin_6_1/…/file.md".
 */
function normalisePath(rawPath: string): string {
  let p = rawPath.trim();

  // Strip backtick wrappers (defensive)
  if (p.startsWith('`') && p.endsWith('`')) p = p.slice(1, -1);

  // Already absolute content path
  if (p.startsWith('/content/') || p.startsWith('content/')) return p;

  // Relative path from pipeline index.md entries → make absolute
  if (!p.startsWith('/') && !p.startsWith('http')) {
    return `/content/${currentVersion}/${p}`;
  }

  return p;
}

// ─── Fetch strategy ───────────────────────────────────────────────────────────

async function fetchContent(filePath: string): Promise<string> {
  const cleanPath = normalisePath(filePath);

  console.log(`📥 [fetchContent] ${cleanPath}`);

  const basePath = getBasePath();
  const fullURL = basePath ? `${basePath}${cleanPath}` : cleanPath;

  // Primary: direct HTTP fetch
  try {
    const response = await fetch(fullURL);

    if (response.ok) {
      const text = await response.text();

      // Some hosting environments wrap files in HTML — extract the raw content
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        const extracted = extractMarkdownFromHTML(text);
        if (extracted) {
          console.log(`✅ [fetchContent] HTML-extracted (${extracted.length} chars)`);
          return extracted;
        }
        console.error(`❌ [fetchContent] HTML extraction failed for ${fullURL}`);
      } else if (text.trim().length > 0) {
        console.log(`✅ [fetchContent] Fetched (${text.length} chars)`);
        return text;
      }
    } else {
      console.warn(`⚠️ [fetchContent] HTTP ${response.status} for ${fullURL}`);
    }
  } catch (err) {
    console.warn(`⚠️ [fetchContent] Fetch error:`, err);
  }

  // Fallback A: MDX content bundle (compiled assets)
  try {
    const bundled = await getMDXContent(cleanPath);
    if (bundled) {
      console.log(`✅ [fetchContent] From bundle (${bundled.length} chars)`);
      return bundled;
    }
  } catch {
    // bundle miss is expected for most files
  }

  // Fallback B: Legacy registry (placeholder content only)
  if (isContentRegistered(cleanPath)) {
    const registered = getRegisteredContent(cleanPath);
    if (registered) {
      console.warn(`⚠️ [fetchContent] Registry placeholder for ${cleanPath}`);
      return registered;
    }
  }

  throw new Error(`Content not found: ${cleanPath}`);
}

// ─── Frontmatter stripper ─────────────────────────────────────────────────────

function stripFrontmatter(content: string): string {
  if (!content?.trim()) return content;

  const trimmed = content.trimStart();

  // Standard YAML frontmatter: --- … ---
  const standardMatch = trimmed.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n|$)/);
  if (standardMatch) return trimmed.replace(standardMatch[0], '').trim();

  // Malformed frontmatter (only opening ---)
  const malformedMatch = trimmed.match(/^---\s*\r?\n([\s\S]{0,500}?)(?=\r?\n\r?\n|$)/);
  if (
    malformedMatch?.[1] &&
    (malformedMatch[1].includes('title:') || malformedMatch[1].includes('description:'))
  ) {
    return trimmed.replace(malformedMatch[0], '').trim();
  }

  return content;
}

// ─── TOC discovery ────────────────────────────────────────────────────────────

function extractFilePaths(pages: HierarchicalPage[]): string[] {
  const paths: string[] = [];
  for (const page of pages) {
    if (page.filePath) paths.push(page.filePath);
    if (page.subPages) paths.push(...extractFilePaths(page.subPages));
  }
  return paths;
}

async function discoverContentFiles(version: string): Promise<string[]> {
  console.log(`📂 Discovering content files for ${version}…`);
  try {
    const toc = await loadHierarchicalToc(version);
    const paths: string[] = [];
    for (const module of toc.modules) {
      for (const section of module.sections) {
        const pages = await loadSectionPages(version, module.id, section.id);
        paths.push(...extractFilePaths(pages));
      }
    }
    console.log(`✅ Discovered ${paths.length} files`);
    return paths;
  } catch (err) {
    console.error(`❌ Discovery failed for ${version}:`, err);
    return [];
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Load content for a file path. Strips frontmatter. Cached per session.
 */
export async function getContent(filePath: string): Promise<string | null> {
  console.log(`🔍 getContent: ${filePath}`);

  if (contentCache.has(filePath)) {
    return stripFrontmatter(contentCache.get(filePath)!);
  }

  try {
    const raw = await fetchContent(filePath);
    const cleaned = stripFrontmatter(raw);
    contentCache.set(filePath, cleaned);
    return cleaned;
  } catch (err) {
    console.error(`❌ getContent failed for ${filePath}:`, err);
    return null;
  }
}

/**
 * Check whether a content file is reachable (HEAD request).
 */
export async function hasContent(filePath: string): Promise<boolean> {
  if (contentCache.has(filePath)) return true;
  try {
    const basePath = getBasePath();
    const cleanPath = normalisePath(filePath);
    const url = basePath ? `${basePath}${cleanPath}` : cleanPath;
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Return all file paths for a version, discovered from the TOC hierarchy.
 */
export async function getAvailablePaths(version: string): Promise<string[]> {
  try {
    return await discoverContentFiles(version);
  } catch {
    return [];
  }
}

/**
 * Preload up to maxFiles pages for a version into the session cache.
 */
export async function preloadContent(version: string, maxFiles = 50): Promise<void> {
  const paths = (await discoverContentFiles(version)).slice(0, maxFiles);
  await Promise.all(
    paths.map(async p => {
      try { await getContent(p); } catch { /* skip on error */ }
    })
  );
  console.log(`⚡ Preloaded ${paths.length} files for ${version}`);
}

/** Clear the session content cache. */
export function clearContentCache(): void {
  contentCache.clear();
  console.log('🧹 Content cache cleared');
}

/** Return cache statistics. */
export function getCacheStats(): { size: number; paths: string[] } {
  return { size: contentCache.size, paths: [...contentCache.keys()] };
}

/**
 * Validate that all TOC-listed content files resolve.
 */
export async function validateContent(
  version: string
): Promise<{ total: number; valid: number; invalid: string[] }> {
  const paths = await discoverContentFiles(version);
  const invalid: string[] = [];
  for (const p of paths) {
    if (!(await hasContent(p))) invalid.push(p);
  }
  return { total: paths.length, valid: paths.length - invalid.length, invalid };
}

/**
 * Synchronous cache-only accessor (async getContent preferred).
 */
export function getContentSync(filePath: string): string | null {
  if (contentCache.has(filePath)) return contentCache.get(filePath)!;
  console.warn(`⚠️ getContentSync: cache miss for ${filePath}. Use getContent() (async).`);
  return null;
}
