/**
 * MDX Content Bundle
 * 
 * This file dynamically imports all MDX files and makes them available
 * as raw text content. This is necessary because Figma Make doesn't
 * serve raw files via fetch() - they're wrapped in HTML.
 * 
 * The content is loaded lazily on-demand to avoid loading everything at once.
 */

import { getMDXFromManifest, getAllMDXPaths, getMDXCount, mdxExists } from './mdxManifest';

// Cache for loaded MDX content
const mdxContentCache = new Map<string, string>();

// Log manifest stats on initialization
console.log(`📦 [MDX Bundle] Initialized with ${getMDXCount()} MDX files in manifest`);

/**
 * Gets MDX content for a given file path
 * Returns the raw MDX content as a string
 */
export async function getMDXContent(filePath: string): Promise<string | null> {
  console.log(`📖 [MDX Bundle] Getting content for: ${filePath}`);
  
  // Check cache first
  if (mdxContentCache.has(filePath)) {
    console.log(`✅ [MDX Bundle] Cache hit for: ${filePath}`);
    return mdxContentCache.get(filePath)!;
  }
  
  // Try to load the content
  try {
    // For now, try a direct dynamic import with ?raw suffix
    // This works in Vite-based environments
    const content = await loadRawMDX(filePath);
    
    if (content) {
      mdxContentCache.set(filePath, content);
      console.log(`✅ [MDX Bundle] Loaded and cached: ${filePath} (${content.length} chars)`);
      return content;
    }
  } catch (error) {
    console.error(`❌ [MDX Bundle] Failed to load ${filePath}:`, error);
  }
  
  return null;
}

/**
 * Attempts to load raw MDX content using the manifest
 */
async function loadRawMDX(filePath: string): Promise<string | null> {
  console.log(`📖 [MDX Bundle] Loading from manifest: ${filePath}`);
  
  // Check if file exists in manifest first
  if (!mdxExists(filePath)) {
    console.warn(`⚠️ [MDX Bundle] File not in manifest: ${filePath}`);
    console.log(`📋 [MDX Bundle] Total files in manifest: ${getMDXCount()}`);
    
    // List some available paths for debugging
    const allPaths = getAllMDXPaths();
    const fileName = filePath.split('/').pop() || '';
    const similarPaths = allPaths.filter(p => p.endsWith(fileName));
    
    if (similarPaths.length > 0) {
      console.log(`💡 [MDX Bundle] Files with similar names:`, similarPaths);
    } else {
      console.log(`📋 [MDX Bundle] Sample available paths:`, allPaths.slice(0, 10));
    }
    
    return null;
  }
  
  try {
    // Load from manifest
    const content = await getMDXFromManifest(filePath);
    
    if (content) {
      console.log(`✅ [MDX Bundle] Loaded from manifest (${content.length} chars)`);
      return content;
    } else {
      console.error(`❌ [MDX Bundle] Manifest returned null for ${filePath}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ [MDX Bundle] Error loading from manifest:`, error);
    return null;
  }
}

/**
 * Preloads a list of MDX files
 */
export async function preloadMDXContent(filePaths: string[]): Promise<void> {
  console.log(`⚡ [MDX Bundle] Preloading ${filePaths.length} MDX files...`);
  
  const promises = filePaths.map(async (path) => {
    try {
      await getMDXContent(path);
    } catch (error) {
      console.warn(`⚠️ [MDX Bundle] Failed to preload ${path}`);
    }
  });
  
  await Promise.all(promises);
  console.log(`✅ [MDX Bundle] Preload complete`);
}

/**
 * Clears the MDX content cache
 */
export function clearMDXCache(): void {
  mdxContentCache.clear();
  console.log(`🗑️ [MDX Bundle] Cache cleared`);
}

/**
 * Gets cache statistics
 */
export function getMDXCacheStats(): { size: number; files: string[] } {
  return {
    size: mdxContentCache.size,
    files: Array.from(mdxContentCache.keys()),
  };
}
