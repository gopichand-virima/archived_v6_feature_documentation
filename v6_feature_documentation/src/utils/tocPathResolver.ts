/**
 * TOC-Driven MDX Path Resolver
 * 
 * This resolver uses the TOC structure from index.md files
 * to resolve file paths, replacing the hardcoded mdxPathResolver.
 */

import { loadTocForVersion } from './tocLoader';
import { resolveFilePath } from './tocParser';

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
}

/**
 * Maps navigation module IDs to TOC module IDs (fallback only)
 * Handles cases where navigation uses different IDs than TOC
 * This is used as a fallback when direct module ID lookup fails
 */
function mapModuleIdToTOC(navModuleId: string, sectionId?: string): string {
  // Special handling for My Dashboard module
  // In navigation, "my-dashboard" has sections like "getting-started", "application-overview", "dashboards"
  // In TOC, these are separate top-level modules
  if (navModuleId === 'my-dashboard' && sectionId) {
    const sectionToModuleMap: Record<string, string> = {
      'getting-started': 'getting-started',
      'application-overview': 'application-overview',
      'dashboards': 'dashboards',
    };
    const mappedModule = sectionToModuleMap[sectionId];
    if (mappedModule) {
      return mappedModule;
    }
  }
  
  const moduleMap: Record<string, string> = {
    'admin': 'admin',
    'my-dashboard': 'dashboards', // Default fallback for my-dashboard
    'application-overview': 'application-overview',
    'cmdb': 'cmdb',
    'discovery-scan': 'discovery-scan',
    'itsm': 'itsm',
    'itam': 'itam',
    'vulnerability-management': 'vulnerability-management',
    'self-service': 'self-service',
    'program-project-management': 'program-project-management',
    'risk-register': 'risk-register',
    'reports': 'reports',
  };
  
  return moduleMap[navModuleId] || navModuleId;
}

/**
 * Resolve the path to the MDX file using TOC structure
 * This is the new TOC-driven approach
 * Matches the working implementation from alternate-feature-docsite
 */
export async function resolveMDXPathFromTOC({
  version,
  module,
  section,
  page,
}: PathResolverParams): Promise<string | null> {
  try {
    console.log('resolveMDXPathFromTOC called with:', { version, module, section, page });
    
    // Handle case where only module is specified (empty section and page)
    // This happens when navigating to a module without a specific page.
    // Return null — the UI will show the module navigation; the old
    // /content/versions/<version>/<module>/index.md path no longer exists.
    if (module && !section && !page) {
      console.log('ℹ️ Module-only navigation — no specific page selected, returning null');
      return null;
    }
    
    // Load the TOC structure for this version
    const structure = await loadTocForVersion(version);
    
    console.log('TOC structure loaded:', {
      version: structure.version,
      modulesCount: structure.modules.length,
      moduleIds: structure.modules.map(m => m.id),
      navModuleId: module,
      navSectionId: section,
    });
    
    // Slug alias map — handles old URLs after page renames so bookmarks don't break
    const PAGE_SLUG_ALIASES: Record<string, string> = {
      'itsm-itam': 'itsm-and-itam',
    };
    const resolvedPage = PAGE_SLUG_ALIASES[page] ?? page;

    // FIRST: Try direct module ID (matching working implementation)
    // The working version uses module ID directly without mapping
    let filePath = resolveFilePath(structure, module, section, resolvedPage);
    
    if (filePath) {
      console.log('✅ TOC resolved path (direct):', filePath);
      return filePath;
    }
    
    console.warn('⚠️ Direct resolution failed. Attempting mapped module ID...');
    
    // FALLBACK: Try mapped module ID if direct lookup failed
    const tocModuleId = mapModuleIdToTOC(module, section);
    if (tocModuleId !== module) {
      filePath = resolveFilePath(structure, tocModuleId, section, resolvedPage);
      if (filePath) {
        console.log('✅ TOC resolved path (mapped):', filePath);
        return filePath;
      }
    }
    
    console.warn('⚠️ Primary resolution failed. Attempting fallback resolution...');
    
    // FALLBACK: Try to find the page in ANY section of the module
    // This handles cases where navigation uses wrong section IDs
    // First try with direct module ID
    let targetModule = structure.modules.find(m => m.id === module);
    
    // If not found, try with mapped module ID
    if (!targetModule && tocModuleId !== module) {
      targetModule = structure.modules.find(m => m.id === tocModuleId);
    }
    
    if (targetModule) {
      console.log('Found module:', targetModule.id, 'with', targetModule.sections.length, 'sections');
      
      for (const sec of targetModule.sections) {
        console.log('Checking section:', sec.id, 'for page:', resolvedPage);

        const findPageInSection = (pages: any[], targetPageId: string): string | null => {
          for (const p of pages) {
            if (p.id === targetPageId) {
              console.log('✅ FOUND page in section:', sec.id, '- File:', p.filePath);
              return p.filePath;
            }
            if (p.subPages) {
              const found = findPageInSection(p.subPages, targetPageId);
              if (found) return found;
            }
          }
          return null;
        };

        const foundPath = findPageInSection(sec.pages, resolvedPage);
        if (foundPath) {
          console.log('✅ Fallback resolution successful! Path:', foundPath);
          return foundPath;
        }
      }
    } else {
      console.error('❌ Module not found in TOC:', module, '(tried mapped:', tocModuleId, ')');
      console.log('Available modules:', structure.modules.map(m => m.id));
    }
    
    console.error('❌ No file path found in TOC for:', { module, section, page });
    return null;
  } catch (error) {
    console.error('❌ Error resolving MDX path from TOC:', error);
    return null;
  }
}

/**
 * Synchronous version that attempts to use cached TOC data
 * Falls back to null if TOC is not loaded
 */
export function resolveMDXPathFromTOCSync(_params: PathResolverParams): string | null {
  // This will be implemented if we need synchronous resolution
  // For now, components should use the async version
  console.warn('Synchronous TOC path resolution not yet implemented');
  return null;
}