/**
 * Unified TOC Loader
 * 
 * This module provides a unified interface that works with both:
 * - Old centralized TOC system (tocLoader.ts)
 * - New hierarchical TOC system (hierarchicalTocLoader.ts)
 * 
 * During migration, it automatically detects which system to use.
 * After migration, you can switch to using hierarchicalTocLoader directly.
 */

import { loadTocForVersion } from './tocLoader';
import { type TocStructure, type TocModule, type TocSection, type TocPage } from './tocParser';
import {
  loadHierarchicalToc,
  loadSectionPages,
  resolveHierarchicalFilePath,
  type HierarchicalTocStructure,
  type HierarchicalPage,
} from './hierarchicalTocLoader';

// Configuration: Which versions use hierarchical system?
const HIERARCHICAL_VERSIONS = new Set<string>([
  // Add versions as you migrate them
  // '6.1',  // Uncomment when 6.1 is fully migrated
  // 'NextGen',
]);

/**
 * Detects if a version uses hierarchical system
 */
function usesHierarchicalSystem(version: string): boolean {
  return HIERARCHICAL_VERSIONS.has(version);
}

/**
 * Unified structure that works with both systems
 */
export interface UnifiedModule {
  id: string;
  label: string;
  sections: UnifiedSection[];
}

export interface UnifiedSection {
  id: string;
  title: string;
  label: string;
  pages: UnifiedPage[];
}

export interface UnifiedPage {
  id: string;
  label: string;
  filePath?: string;
  subPages?: UnifiedPage[];
}

export interface UnifiedTocStructure {
  version: string;
  modules: UnifiedModule[];
  system: 'centralized' | 'hierarchical';
}

/**
 * Converts centralized TOC to unified format
 */
function convertCentralizedToUnified(toc: TocStructure): UnifiedTocStructure {
  return {
    version: toc.version,
    system: 'centralized',
    modules: toc.modules.map((module: TocModule) => ({
      id: module.id,
      label: module.label,
      sections: module.sections.map((section: TocSection) => ({
        id: section.id,
        title: section.title,
        label: section.label,
        pages: section.pages.map((page: TocPage) => convertPageToUnified(page)),
      })),
    })),
  };
}

/**
 * Converts hierarchical TOC to unified format
 */
function convertHierarchicalToUnified(toc: HierarchicalTocStructure): UnifiedTocStructure {
  return {
    version: toc.version,
    system: 'hierarchical',
    modules: toc.modules.map(module => ({
      id: module.id,
      label: module.label,
      sections: module.sections.map(section => ({
        id: section.id,
        title: section.title,
        label: section.label,
        pages: section.pages.map(page => convertHierarchicalPageToUnified(page)),
      })),
    })),
  };
}

/**
 * Converts page from centralized format
 */
function convertPageToUnified(page: any): UnifiedPage {
  return {
    id: page.id,
    label: page.label,
    filePath: page.filePath,
    subPages: page.subPages?.map((p: any) => convertPageToUnified(p)),
  };
}

/**
 * Converts page from hierarchical format
 */
function convertHierarchicalPageToUnified(page: HierarchicalPage): UnifiedPage {
  return {
    id: page.id,
    label: page.label,
    filePath: page.filePath,
    subPages: page.subPages?.map(p => convertHierarchicalPageToUnified(p)),
  };
}

/**
 * Loads TOC using appropriate system
 */
export async function loadUnifiedToc(version: string): Promise<UnifiedTocStructure> {
  console.log(`📚 Loading unified TOC for ${version}...`);
  
  if (usesHierarchicalSystem(version)) {
    console.log(`  Using hierarchical system for ${version}`);
    try {
      const toc = await loadHierarchicalToc(version);
      return convertHierarchicalToUnified(toc);
    } catch (error) {
      console.warn(`  Hierarchical system failed, falling back to centralized for ${version}`, error);
      const toc = await loadTocForVersion(version);
      return convertCentralizedToUnified(toc);
    }
  } else {
    console.log(`  Using centralized system for ${version}`);
    const toc = await loadTocForVersion(version);
    return convertCentralizedToUnified(toc);
  }
}

/**
 * Resolves file path using appropriate system
 */
export async function resolveUnifiedFilePath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): Promise<string | null> {
  console.log(`🔍 Resolving file path: ${version}/${moduleId}/${sectionId}/${pageId}`);
  
  if (usesHierarchicalSystem(version)) {
    try {
      return await resolveHierarchicalFilePath(version, moduleId, sectionId, pageId);
    } catch (error) {
      console.warn(`  Hierarchical resolution failed, trying centralized`, error);
      // Fallback to centralized
      const toc = await loadTocForVersion(version);
      const module = toc.modules.find(m => m.id === moduleId);
      if (!module) return null;
      
      const section = module.sections.find(s => s.id === sectionId);
      if (!section) return null;
      
      const findPage = (pages: any[]): any | null => {
        for (const page of pages) {
          if (page.id === pageId) return page;
          if (page.subPages) {
            const found = findPage(page.subPages);
            if (found) return found;
          }
        }
        return null;
      };
      
      const page = findPage(section.pages);
      return page?.filePath || null;
    }
  } else {
    const toc = await loadTocForVersion(version);
    const module = toc.modules.find(m => m.id === moduleId);
    if (!module) return null;
    
    const section = module.sections.find(s => s.id === sectionId);
    if (!section) return null;
    
    const findPage = (pages: any[]): any | null => {
      for (const page of pages) {
        if (page.id === pageId) return page;
        if (page.subPages) {
          const found = findPage(page.subPages);
          if (found) return found;
        }
      }
      return null;
    };
    
    const page = findPage(section.pages);
    return page?.filePath || null;
  }
}

/**
 * Loads section pages (with lazy loading for hierarchical)
 */
export async function loadUnifiedSectionPages(
  version: string,
  moduleId: string,
  sectionId: string
): Promise<UnifiedPage[]> {
  console.log(`📄 Loading section pages: ${version}/${moduleId}/${sectionId}`);
  
  if (usesHierarchicalSystem(version)) {
    try {
      const pages = await loadSectionPages(version, moduleId, sectionId);
      return pages.map(p => convertHierarchicalPageToUnified(p));
    } catch (error) {
      console.warn(`  Hierarchical load failed, using centralized`, error);
      // Fallback
      const toc = await loadTocForVersion(version);
      const module = toc.modules.find(m => m.id === moduleId);
      if (!module) return [];
      
      const section = module.sections.find(s => s.id === sectionId);
      return section ? section.pages.map(p => convertPageToUnified(p)) : [];
    }
  } else {
    const toc = await loadTocForVersion(version);
    const module = toc.modules.find(m => m.id === moduleId);
    if (!module) return [];
    
    const section = module.sections.find(s => s.id === sectionId);
    return section ? section.pages.map(p => convertPageToUnified(p)) : [];
  }
}

/**
 * Gets all modules for a version
 */
export async function getUnifiedModules(version: string): Promise<UnifiedModule[]> {
  const toc = await loadUnifiedToc(version);
  return toc.modules;
}

/**
 * Gets all sections for a module
 */
export async function getUnifiedSections(
  version: string,
  moduleId: string
): Promise<UnifiedSection[]> {
  const toc = await loadUnifiedToc(version);
  const module = toc.modules.find(m => m.id === moduleId);
  return module ? module.sections : [];
}

/**
 * Enables hierarchical system for a version
 * Call this after migrating a version
 */
export function enableHierarchicalForVersion(version: string): void {
  HIERARCHICAL_VERSIONS.add(version);
  console.log(`✅ Hierarchical system enabled for ${version}`);
}

/**
 * Disables hierarchical system for a version
 * (Rollback if needed)
 */
export function disableHierarchicalForVersion(version: string): void {
  HIERARCHICAL_VERSIONS.delete(version);
  console.log(`⚠️ Hierarchical system disabled for ${version}`);
}

/**
 * Gets current system configuration
 */
export function getSystemStatus(): {
  hierarchicalVersions: string[];
  centralizedVersions: string[];
} {
  const allVersions = ['5.13', '6.1', '6.1.1', 'NextGen'];
  const hierarchical = allVersions.filter(v => usesHierarchicalSystem(v));
  const centralized = allVersions.filter(v => !usesHierarchicalSystem(v));
  
  return {
    hierarchicalVersions: hierarchical,
    centralizedVersions: centralized,
  };
}

/**
 * Migration helper: Tests if hierarchical system works for a version
 */
export async function testHierarchicalSystem(version: string): Promise<{
  success: boolean;
  error?: string;
  modules?: number;
  sections?: number;
}> {
  console.log(`🧪 Testing hierarchical system for ${version}...`);
  
  try {
    const toc = await loadHierarchicalToc(version);
    const moduleCount = toc.modules.length;
    const sectionCount = toc.modules.reduce((sum, m) => sum + m.sections.length, 0);
    
    console.log(`✅ Test passed: ${moduleCount} modules, ${sectionCount} sections`);
    
    return {
      success: true,
      modules: moduleCount,
      sections: sectionCount,
    };
  } catch (error) {
    console.error(`❌ Test failed for ${version}:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Migration helper: Compares centralized vs hierarchical output
 */
export async function compareSystems(version: string): Promise<{
  centralized: { modules: number; sections: number; pages: number };
  hierarchical: { modules: number; sections: number; pages: number };
  match: boolean;
}> {
  console.log(`🔄 Comparing systems for ${version}...`);
  
  // Load from centralized
  const centralizedToc = await loadTocForVersion(version);
  const centralizedModules = centralizedToc.modules.length;
  const centralizedSections = centralizedToc.modules.reduce(
    (sum, m) => sum + m.sections.length,
    0
  );
  const centralizedPages = centralizedToc.modules.reduce(
    (sum, m) => sum + m.sections.reduce((s, sec) => s + sec.pages.length, 0),
    0
  );
  
  // Load from hierarchical
  const hierarchicalToc = await loadHierarchicalToc(version);
  const hierarchicalModules = hierarchicalToc.modules.length;
  const hierarchicalSections = hierarchicalToc.modules.reduce(
    (sum, m) => sum + m.sections.length,
    0
  );
  const hierarchicalPages = hierarchicalToc.modules.reduce(
    (sum, m) => sum + m.sections.reduce((s, sec) => s + sec.pages.length, 0),
    0
  );
  
  const match =
    centralizedModules === hierarchicalModules &&
    centralizedSections === hierarchicalSections &&
    centralizedPages === hierarchicalPages;
  
  console.log('📊 Comparison results:', {
    centralized: { centralizedModules, centralizedSections, centralizedPages },
    hierarchical: { hierarchicalModules, hierarchicalSections, hierarchicalPages },
    match,
  });
  
  return {
    centralized: {
      modules: centralizedModules,
      sections: centralizedSections,
      pages: centralizedPages,
    },
    hierarchical: {
      modules: hierarchicalModules,
      sections: hierarchicalSections,
      pages: hierarchicalPages,
    },
    match,
  };
}
