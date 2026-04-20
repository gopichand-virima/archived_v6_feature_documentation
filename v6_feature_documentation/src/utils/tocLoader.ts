/**
 * TOC Loader - Loads and caches the Table of Contents from index.md files
 * 
 * This module is responsible for loading the master TOC files and providing
 * the navigation structure to the entire application.
 */

import { parseTocFile, TocStructure } from './tocParser';
import { getTOCContent } from './indexContentMap';
import { getBasePath } from './basePath';

// Cache for loaded TOC structures
// Cache version - increment this when parser logic changes to invalidate old cache
const CACHE_VERSION = 4;
const tocCache: Map<string, TocStructure> = new Map();

/**
 * Available versions
 */
export const VERSIONS = ['5.13', '6.1', '6.1.1', 'NextGen'] as const;
export type Version = typeof VERSIONS[number];

/**
 * Version mapping for file paths
 */
const VERSION_PATH_MAP: Record<string, string> = {
  '5.13': '5_13',
  '6.1': '6_1',
  '6.1.1': '6_1_1',
  'NextGen': 'NG',
};

/**
 * Loads raw content from index.md files
 * Uses the index content map which contains all TOC structures
 */
/**
 * Extracts MDX content from HTML wrapper (similar to contentLoader)
 */
function extractMDXFromHTML(html: string): string | null {
  // Method 1: Try <pre> tag
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (preMatch && preMatch[1]) {
    const decoded = decodeHTMLEntities(preMatch[1]);
    if (decoded.trim().length > 20 && decoded.includes('##')) {
      console.log(`  ✅ [TOC Loader] Method 1 (<pre>): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  // Method 2: Try nested <pre><code>
  const nestedMatch = html.match(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/i);
  if (nestedMatch && nestedMatch[1]) {
    const decoded = decodeHTMLEntities(nestedMatch[1]);
    if (decoded.trim().length > 20 && decoded.includes('##')) {
      console.log(`  ✅ [TOC Loader] Method 2 (nested): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  // Method 3: Try <code> tag
  const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/i);
  if (codeMatch && codeMatch[1]) {
    const decoded = decodeHTMLEntities(codeMatch[1]);
    if (decoded.trim().length > 20 && decoded.includes('##')) {
      console.log(`  ✅ [TOC Loader] Method 3 (<code>): Extracted ${decoded.length} chars`);
      return decoded.trim();
    }
  }
  
  return null;
}

/**
 * Decodes HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

async function loadIndexContent(versionPath: string): Promise<string> {
  console.log(`🔍 [TOC Loader] Loading TOC content for version path: ${versionPath}`);
  
  // Try to fetch actual index.md file first
  try {
    const basePath = getBasePath();
    const indexPath = `${basePath}/content/${versionPath}/index.md`;
    const response = await fetch(indexPath);
    
    if (response.ok) {
      let content = await response.text();
      console.log(`✅ [TOC Loader] Fetched response for ${versionPath}, length: ${content.length}`);
      
      // Check if we got HTML instead of MDX
      if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        console.log(`⚠️ [TOC Loader] Got HTML wrapper, extracting MDX...`);
        const extracted = extractMDXFromHTML(content);
        if (extracted) {
          console.log(`✅ [TOC Loader] Successfully extracted MDX from HTML, length: ${extracted.length}`);
          content = extracted;
        } else {
          console.warn(`⚠️ [TOC Loader] Could not extract MDX from HTML, falling back to content map`);
          // Fall through to content map fallback
        }
      }
      
      // Validate that we have valid MDX content (should contain ## for headings)
      if (content.includes('##') || content.trim().startsWith('#')) {
        console.log(`✅ [TOC Loader] Valid MDX content confirmed for ${versionPath}`);
        return content;
      } else {
        console.warn(`⚠️ [TOC Loader] Content doesn't look like MDX (no ## headings), falling back to content map`);
      }
    }
  } catch (error) {
    console.warn(`⚠️ [TOC Loader] Failed to fetch index.md for ${versionPath}, falling back to content map:`, error);
  }
  
  // Fallback to index content map
  const content = getTOCContent(versionPath);
  
  if (content && content.length > 0) {
    console.log(`✅ [TOC Loader] Loaded TOC content from map for ${versionPath}, length: ${content.length}`);
    return content;
  }
  
  // Final fallback
  console.warn(`⚠️ [TOC Loader] No content found in map for ${versionPath}, using minimal fallback`);
  return generateFallbackToc(versionPath);
}

/**
 * Generates a minimal fallback TOC when the file cannot be loaded
 */
function generateFallbackToc(versionPath: string): string {
  const versionDisplay = pathToVersionDisplay(versionPath);
  
  return `# Virima Documentation - ${versionDisplay}

> Master Table of Contents for ${versionDisplay}

---

## My Dashboard

### Getting Started
- System Overview → \`/content/${versionPath}/my-dashboard/system-icons.md\`

---

## CMDB

### Overview
- CMDB Overview → \`/content/${versionPath}/cmdb/overview.md\`

---

## Discovery Scan

### Overview
- Discovery Overview → \`/content/${versionPath}/discovery-scan/overview.md\`

---

## ITAM

### Overview
- ITAM Overview → \`/content/${versionPath}/itam/overview.md\`

---

## ITSM

### Overview
- ITSM Overview → \`/content/${versionPath}/itsm/overview.md\`

---

## Vulnerability Management

### Overview
- Vulnerability Overview → \`/content/${versionPath}/vulnerability-management/overview.md\`

---

## Program and Project Management

### Overview
- Program Overview → \`/content/${versionPath}/program-project-management/overview.md\`

---

## Reports

### Overview
- Reports Overview → \`/content/${versionPath}/reports/overview.md\`

---

## Risk Register

### Overview
- Risk Register Overview → \`/content/${versionPath}/risk-register/overview.md\`

---

## Self Service

### Overview
- Self Service Overview → \`/content/${versionPath}/self-service/overview.md\`
`;
}

/**
 * Converts version path to display name
 */
function pathToVersionDisplay(path: string): string {
  const mapping: Record<string, string> = {
    '5_13': 'Version 5.13',
    '6_1': 'Version 6.1',
    '6_1_1': 'Version 6.1.1',
    'NG': 'NextGen',
  };
  return mapping[path] || path;
}

/**
 * Loads the TOC for a specific version
 */
export async function loadTocForVersion(version: string): Promise<TocStructure> {
  // Create cache key with version number to invalidate on parser changes
  const cacheKey = `${version}_v${CACHE_VERSION}`;
  
  // Check cache first
  if (tocCache.has(cacheKey)) {
    console.log(`✅ TOC cache hit for version ${version} (cache v${CACHE_VERSION})`);
    return tocCache.get(cacheKey)!;
  }

  console.log(`🔄 Loading fresh TOC for version ${version} (cache v${CACHE_VERSION})...`);

  try {
    const versionPath = VERSION_PATH_MAP[version] || version;
    
    // Load the content
    const content = await loadIndexContent(versionPath);
    
    console.log(`TOC content loaded for ${version}, length: ${content.length} characters`);
    
    if (typeof content !== 'string' || content.length === 0) {
      throw new Error(`Invalid TOC content for ${version}`);
    }

    // Debug: Check content before parsing
    console.log('🔍 [TOC Loader] About to parse content...');
    console.log('🔍 [TOC Loader] Content type:', typeof content);
    console.log('🔍 [TOC Loader] Content length:', content.length);
    console.log('🔍 [TOC Loader] First char code:', content.charCodeAt(0));
    console.log('🔍 [TOC Loader] Has ## Application Overview:', content.includes('## Application Overview'));
    console.log('🔍 [TOC Loader] Content substring 0-100:', content.substring(0, 100));
    
    // Parse the TOC
    const structure = parseTocFile(content, version);
    
    console.log(`TOC parsed successfully for ${version}:`, {
      modulesCount: structure.modules.length,
      modules: structure.modules.map(m => m.id),
    });
    
    // Cache the result with versioned key
    tocCache.set(cacheKey, structure);
    console.log(`✅ Cached TOC for ${version} with key: ${cacheKey}`);
    
    return structure;
  } catch (error) {
    console.error(`Failed to load TOC for version ${version}:`, error);
    
    // Return empty structure as fallback
    return {
      version,
      modules: [],
      missingFiles: [],
      validationErrors: [`Failed to load index.md for version ${version}: ${error}`],
    };
  }
}

/**
 * Clears the TOC cache (useful for development/hot reload)
 */
export function clearTocCache(): void {
  tocCache.clear();
  console.log('🗑️ TOC cache cleared - next load will read fresh index.md files');
}

/**
 * Clears cache for a specific version
 */
export function clearTocCacheForVersion(version: string): void {
  // Clear all cache keys for this version (including versioned variants)
  const keysToDelete: string[] = [];
  for (const key of tocCache.keys()) {
    if (key.startsWith(version)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => tocCache.delete(key));
  console.log(`🗑️ TOC cache cleared for version ${version} (${keysToDelete.length} entries)`);
}

/**
 * Gets all available modules for a version
 */
export async function getModulesForVersion(version: string): Promise<Array<{ id: string; label: string }>> {
  const toc = await loadTocForVersion(version);
  return toc.modules.map(m => ({ id: m.id, label: m.label }));
}

/**
 * Gets all sections for a specific module
 */
export async function getSectionsForModule(
  version: string,
  moduleId: string
): Promise<Array<{ id: string; title: string; label: string }>> {
  const toc = await loadTocForVersion(version);
  const module = toc.modules.find(m => m.id === moduleId);
  
  if (!module) return [];
  
  return module.sections.map(s => ({
    id: s.id,
    title: s.title,
    label: s.label,
  }));
}

/**
 * Gets the complete navigation structure for a module
 */
export async function getNavigationForModule(
  version: string,
  moduleId: string
): Promise<TocStructure['modules'][0] | null> {
  const toc = await loadTocForVersion(version);
  return toc.modules.find(m => m.id === moduleId) || null;
}

/**
 * Converts version display name to file path format
 */
export function versionToPath(version: string): string {
  return VERSION_PATH_MAP[version] || version;
}

/**
 * Converts version file path to display name
 */
export function pathToVersion(path: string): string {
  const entry = Object.entries(VERSION_PATH_MAP).find(([_, v]) => v === path);
  return entry ? entry[0] : path;
}

/**
 * Checks if a version has a TOC file
 */
export async function hasVersionToc(version: string): Promise<boolean> {
  try {
    await loadTocForVersion(version);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the default landing page for a module
 */
export async function getDefaultPageForModule(
  version: string,
  moduleId: string
): Promise<{ sectionId: string; pageId: string } | null> {
  const toc = await loadTocForVersion(version);
  const module = toc.modules.find(m => m.id === moduleId);
  
  if (!module || module.sections.length === 0) return null;
  
  const firstSection = module.sections[0];
  if (firstSection.pages.length === 0) return null;
  
  return {
    sectionId: firstSection.id,
    pageId: firstSection.pages[0].id,
  };
}