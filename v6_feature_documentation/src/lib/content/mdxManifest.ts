/**
 * MDX Content Manifest
 * 
 * This file provides access to all MDX files as raw text.
 * Since import.meta.glob is not available, we use explicit imports.
 * 
 * NOTE: Static MDX imports are now handled in /lib/imports/*.ts files
 * This manifest is for dynamic loading fallback only.
 */

// Storage for registered MDX content
const mdxContentRegistry = new Map<string, string>();
const mdxModuleLoaders = new Map<string, () => Promise<any>>();

console.log('📦 [MDX Manifest] Initializing...');

/**
 * Register MDX content manually
 * This allows you to pre-register content if needed
 */
export function registerMDXContent(filePath: string, content: string): void {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  mdxContentRegistry.set(normalizedPath, content);
  console.log(`✅ [MDX Manifest] Registered: ${normalizedPath} (${content.length} chars)`);
}

/**
 * Register a module loader for lazy loading
 */
export function registerMDXLoader(filePath: string, loader: () => Promise<any>): void {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  mdxModuleLoaders.set(normalizedPath, loader);
}

/**
 * Gets MDX content from the manifest
 * Attempts multiple strategies to load the content
 */
export async function getMDXFromManifest(filePath: string): Promise<string | null> {
  console.log(`🔍 [MDX Manifest] Looking for: ${filePath}`);
  
  // Normalize the path
  let normalizedPath = filePath;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  // Check if already registered
  if (mdxContentRegistry.has(normalizedPath)) {
    const content = mdxContentRegistry.get(normalizedPath)!;
    console.log(`✅ [MDX Manifest] Found in registry (${content.length} chars)`);
    return content;
  }
  
  // Check if we have a loader registered
  if (mdxModuleLoaders.has(normalizedPath)) {
    try {
      const loader = mdxModuleLoaders.get(normalizedPath)!;
      const module = await loader();
      const content = typeof module === 'string' ? module : module.default;
      
      if (typeof content === 'string') {
        mdxContentRegistry.set(normalizedPath, content);
        console.log(`✅ [MDX Manifest] Loaded via loader (${content.length} chars)`);
        return content;
      }
    } catch (error) {
      console.error(`❌ [MDX Manifest] Loader failed:`, error);
    }
  }
  
  // Try dynamic import with ?raw
  try {
    console.log(`🔄 [MDX Manifest] Attempting dynamic import: ${normalizedPath}?raw`);
    
    // Try various import strategies
    const importStrategies = [
      () => import(/* @vite-ignore */ `${normalizedPath}?raw`),
      () => import(/* @vite-ignore */ normalizedPath),
    ];
    
    for (const strategy of importStrategies) {
      try {
        const module = await strategy();
        let content = null;
        
        // Try to extract content from module
        if (typeof module === 'string') {
          content = module;
        } else if (module.default && typeof module.default === 'string') {
          content = module.default;
        } else if (module.default && typeof module.default === 'object' && module.default.content) {
          content = module.default.content;
        }
        
        if (content && typeof content === 'string') {
          mdxContentRegistry.set(normalizedPath, content);
          console.log(`✅ [MDX Manifest] Loaded via dynamic import (${content.length} chars)`);
          return content;
        }
      } catch (err) {
        // Try next strategy
        continue;
      }
    }
  } catch (error) {
    console.error(`❌ [MDX Manifest] Dynamic import failed:`, error);
  }
  
  console.warn(`⚠️ [MDX Manifest] File not found: ${normalizedPath}`);
  console.log(`📊 [MDX Manifest] Registry size: ${mdxContentRegistry.size}`);
  console.log(`📊 [MDX Manifest] Loaders size: ${mdxModuleLoaders.size}`);
  
  return null;
}

/**
 * Gets all available MDX file paths
 */
export function getAllMDXPaths(): string[] {
  return Array.from(new Set([
    ...mdxContentRegistry.keys(),
    ...mdxModuleLoaders.keys(),
  ]));
}

/**
 * Gets the count of MDX files in the manifest
 */
export function getMDXCount(): number {
  return getAllMDXPaths().length;
}

/**
 * Checks if a file exists in the manifest
 */
export function mdxExists(filePath: string): boolean {
  let normalizedPath = filePath;
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  return mdxContentRegistry.has(normalizedPath) || mdxModuleLoaders.has(normalizedPath);
}

/**
 * Get registry stats
 */
export function getManifestStats() {
  return {
    registered: mdxContentRegistry.size,
    loaders: mdxModuleLoaders.size,
    total: getMDXCount(),
    samplePaths: getAllMDXPaths().slice(0, 10),
  };
}
