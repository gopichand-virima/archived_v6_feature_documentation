/**
 * React Hook for TOC-Driven Navigation
 * 
 * This hook provides access to the TOC structure and navigation functions
 * for any component in the application.
 */

import { useState, useEffect } from 'react';
import { loadTocForVersion, getNavigationForModule } from './tocLoader';
import { TocStructure, TocModule, TocPage } from './tocParser';

export interface UseTocResult {
  structure: TocStructure | null;
  loading: boolean;
  error: string | null;
  modules: TocModule[];
  getModuleNavigation: (moduleId: string) => Promise<TocModule | null>;
}

/**
 * Hook to load and use TOC structure for a specific version
 */
export function useToc(version: string): UseTocResult {
  const [structure, setStructure] = useState<TocStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStructure() {
      try {
        setLoading(true);
        setError(null);
        console.log(`📖 useToc: Loading TOC for version "${version}"...`);
        const toc = await loadTocForVersion(version);
        
        console.log(`📖 useToc: TOC loaded for "${version}":`, {
          modulesCount: toc.modules.length,
          moduleIds: toc.modules.map(m => m.id),
          hasValidationErrors: toc.validationErrors.length > 0,
          validationErrors: toc.validationErrors,
        });
        
        if (mounted) {
          setStructure(toc);
          setLoading(false);
          
          if (toc.modules.length === 0) {
            console.warn(`⚠️ useToc: No modules found in TOC for version "${version}"`);
          } else {
            console.log(`✅ useToc: Successfully loaded ${toc.modules.length} modules`);
          }
        }
      } catch (err) {
        console.error(`❌ useToc: Error loading TOC for "${version}":`, err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load TOC');
          setLoading(false);
        }
      }
    }

    loadStructure();

    return () => {
      mounted = false;
    };
  }, [version]);

  const getModuleNavigation = async (moduleId: string): Promise<TocModule | null> => {
    return await getNavigationForModule(version, moduleId);
  };

  return {
    structure,
    loading,
    error,
    modules: structure?.modules || [],
    getModuleNavigation,
  };
}

/**
 * Hook to get navigation for a specific module
 */
export function useModuleNavigation(version: string, moduleId: string) {
  const [module, setModule] = useState<TocModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadModule() {
      try {
        setLoading(true);
        setError(null);
        const nav = await getNavigationForModule(version, moduleId);
        
        if (mounted) {
          setModule(nav);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load module navigation');
          setLoading(false);
        }
      }
    }

    loadModule();

    return () => {
      mounted = false;
    };
  }, [version, moduleId]);

  return {
    module,
    sections: module?.sections || [],
    loading,
    error,
  };
}

/**
 * Hook to find a specific page in the TOC structure
 */
export function useTocPage(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
) {
  const [page, setPage] = useState<TocPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function findPage() {
      try {
        setLoading(true);
        const structure = await loadTocForVersion(version);
        const module = structure.modules.find(m => m.id === moduleId);
        
        if (!module) {
          if (mounted) setLoading(false);
          return;
        }

        const section = module.sections.find(s => s.id === sectionId);
        if (!section) {
          if (mounted) setLoading(false);
          return;
        }

        const findInPages = (pages: TocPage[]): TocPage | null => {
          for (const p of pages) {
            if (p.id === pageId) return p;
            if (p.subPages) {
              const found = findInPages(p.subPages);
              if (found) return found;
            }
          }
          return null;
        };

        const foundPage = findInPages(section.pages);
        
        if (mounted) {
          setPage(foundPage);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    findPage();

    return () => {
      mounted = false;
    };
  }, [version, moduleId, sectionId, pageId]);

  return {
    page,
    loading,
  };
}