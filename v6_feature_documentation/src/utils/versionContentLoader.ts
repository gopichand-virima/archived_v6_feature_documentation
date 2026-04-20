/**
 * Version-Specific Content Loading Architecture
 * 
 * Handles independent content loading for different versions (NG, 6.1, 6.1.1, 5.13)
 * Each version has its own loading strategy and content resolution
 */


/**
 * Version-specific content configuration
 */
interface VersionConfig {
  version: string;
  versionPath: string;
  contentBasePath: string;
  hasTOC: boolean;
  contentStrategy: 'toc-driven' | 'path-based' | 'hybrid';
}

/**
 * Content loading result
 */
export interface ContentLoadResult {
  content: string | null;
  filePath: string | null;
  error: string | null;
  loadedFrom: 'toc' | 'direct' | 'fallback';
}

/**
 * Version configurations
 */
const VERSION_CONFIGS: Record<string, VersionConfig> = {
  'NextGen': {
    version: 'NextGen',
    versionPath: 'NG',
    contentBasePath: '/content',
    hasTOC: true,
    contentStrategy: 'toc-driven',
  },
  '6.1': {
    version: '6.1',
    versionPath: '6_1',
    contentBasePath: '/content',
    hasTOC: true,
    contentStrategy: 'toc-driven',
  },
  '6.1.1': {
    version: '6.1.1',
    versionPath: '6_1_1',
    contentBasePath: '/content',
    hasTOC: true,
    contentStrategy: 'toc-driven',
  },
  '5.13': {
    version: '5.13',
    versionPath: '5_13',
    contentBasePath: '/content',
    hasTOC: true,
    contentStrategy: 'toc-driven',
  },
};

/**
 * Gets version configuration
 */
export function getVersionConfig(version: string): VersionConfig | null {
  return VERSION_CONFIGS[version] || null;
}

/**
 * Resolves content path for a specific version
 * Uses TOC-driven approach for versions with index.md
 */
export async function resolveContentPath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  const config = getVersionConfig(version);
  if (!config) return null;

  // For TOC-driven versions, use the TOC resolver
  if (config.contentStrategy === 'toc-driven' && config.hasTOC) {
    const { resolveFilePath } = await import('./tocParser');
    const { loadTocForVersion } = await import('./tocLoader');
    
    try {
      const toc = await loadTocForVersion(version);
      return resolveFilePath(toc, moduleId, sectionId, pageId);
    } catch (error) {
      console.error(`Failed to resolve path from TOC for ${version}:`, error);
      return null;
    }
  }

  // Fallback to path-based resolution
  return constructDirectPath(config, moduleId, sectionId, pageId);
}

/**
 * Constructs direct file path without TOC
 */
function constructDirectPath(
  config: VersionConfig,
  moduleId: string,
  sectionId: string,
  pageId: string
): string {
  const versionPath = config.versionPath;
  
  // Try common patterns
  const patterns = [
    `${config.contentBasePath}/${versionPath}/${moduleId}/${sectionId}/${pageId}.md`,
    `${config.contentBasePath}/${versionPath}/${moduleId}/${pageId}.md`,
    `${config.contentBasePath}/${moduleId}/${sectionId}/${pageId}-${versionPath}.md`,
    `${config.contentBasePath}/${moduleId}/${sectionId}/${pageId}.md`,
  ];

  // Return first pattern as default
  return patterns[0];
}

/**
 * Loads content for a specific version
 */
export async function loadVersionContent(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<ContentLoadResult> {
  const config = getVersionConfig(version);
  
  if (!config) {
    return {
      content: null,
      filePath: null,
      error: `Unknown version: ${version}`,
      loadedFrom: 'fallback',
    };
  }

  try {
    // Resolve the file path
    const filePath = await resolveContentPath(version, moduleId, sectionId, pageId);
    
    if (!filePath) {
      return {
        content: null,
        filePath: null,
        error: 'Could not resolve content path',
        loadedFrom: 'fallback',
      };
    }

    // Load the content
    // In a real implementation, this would use dynamic imports or fetch
    // For now, we return the path for the caller to load
    return {
      content: null, // To be loaded by caller
      filePath,
      error: null,
      loadedFrom: config.contentStrategy === 'toc-driven' ? 'toc' : 'direct',
    };
  } catch (error) {
    return {
      content: null,
      filePath: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      loadedFrom: 'fallback',
    };
  }
}

/**
 * NextGen-specific content loader
 */
export async function loadNextGenContent(
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<ContentLoadResult> {
  return loadVersionContent('NextGen', moduleId, sectionId, pageId);
}

/**
 * Version 6.1-specific content loader
 */
export async function load61Content(
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<ContentLoadResult> {
  return loadVersionContent('6.1', moduleId, sectionId, pageId);
}

/**
 * Version 6.1.1-specific content loader
 */
export async function load611Content(
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<ContentLoadResult> {
  return loadVersionContent('6.1.1', moduleId, sectionId, pageId);
}

/**
 * Version 5.13-specific content loader
 */
export async function load513Content(
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<ContentLoadResult> {
  return loadVersionContent('5.13', moduleId, sectionId, pageId);
}

/**
 * Get all available versions
 */
export function getAvailableVersions(): VersionConfig[] {
  return Object.values(VERSION_CONFIGS);
}

/**
 * Check if version uses TOC-driven architecture
 */
export function isVersionTOCDriven(version: string): boolean {
  const config = getVersionConfig(version);
  return config ? config.hasTOC && config.contentStrategy === 'toc-driven' : false;
}

/**
 * Get content base path for version
 */
export function getVersionContentBasePath(version: string): string | null {
  const config = getVersionConfig(version);
  return config ? `${config.contentBasePath}/${config.versionPath}` : null;
}

/**
 * Validate version exists
 */
export function isValidVersion(version: string): boolean {
  return version in VERSION_CONFIGS;
}

/**
 * Get version display name
 */
export function getVersionDisplayName(version: string): string {
  return version;
}

/**
 * Map version path to display name
 */
export function pathToVersionDisplay(path: string): string {
  const entry = Object.values(VERSION_CONFIGS).find(c => c.versionPath === path);
  return entry ? entry.version : path;
}
