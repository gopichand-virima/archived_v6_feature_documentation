/**
 * React hook for hierarchical navigation
 * 
 * Automatically reads TOC hierarchy and provides navigation data
 * NO MANUAL UPDATES NEEDED - just edit index.md files!
 */

import { useEffect, useState } from 'react';
import {
  loadHierarchicalToc,
  loadSectionPages,
  type HierarchicalModule,
  type HierarchicalSection,
  type HierarchicalPage,
} from './hierarchicalTocLoader';

/**
 * Hook to get modules for a version
 */
export function useModules(version: string) {
  const [modules, setModules] = useState<HierarchicalModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const toc = await loadHierarchicalToc(version);
        if (isMounted) {
          setModules(toc.modules);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [version]);

  return { modules, loading, error };
}

/**
 * Hook to get sections for a module
 */
export function useSections(version: string, moduleId: string) {
  const [sections, setSections] = useState<HierarchicalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const toc = await loadHierarchicalToc(version);
        const module = toc.modules.find((m) => m.id === moduleId);
        
        if (isMounted) {
          setSections(module?.sections || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [version, moduleId]);

  return { sections, loading, error };
}

/**
 * Hook to get pages for a section
 */
export function usePages(version: string, moduleId: string, sectionId: string) {
  const [pages, setPages] = useState<HierarchicalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const loadedPages = await loadSectionPages(version, moduleId, sectionId);
        
        if (isMounted) {
          setPages(loadedPages);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [version, moduleId, sectionId]);

  return { pages, loading, error };
}

/**
 * Hook to get complete navigation structure
 */
export function useNavigationStructure(version: string) {
  const [structure, setStructure] = useState<{
    modules: HierarchicalModule[];
    version: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const toc = await loadHierarchicalToc(version);
        
        if (isMounted) {
          setStructure({
            modules: toc.modules,
            version: toc.version,
          });
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [version]);

  return { structure, loading, error };
}

/**
 * Hook to get breadcrumb data
 */
export function useBreadcrumbs(
  version: string,
  moduleId?: string,
  sectionId?: string,
  pageId?: string
) {
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ label: string; type: string; id: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const toc = await loadHierarchicalToc(version);
        const items: Array<{ label: string; type: string; id: string }> = [
          { label: 'Home', type: 'home', id: 'home' },
          { label: version, type: 'version', id: version },
        ];

        if (moduleId) {
          const module = toc.modules.find((m) => m.id === moduleId);
          if (module) {
            items.push({ label: module.label, type: 'module', id: module.id });

            if (sectionId) {
              const section = module.sections.find((s) => s.id === sectionId);
              if (section) {
                items.push({ label: section.label, type: 'section', id: section.id });

                if (pageId) {
                  const pages = await loadSectionPages(version, moduleId, sectionId);
                  
                  // Find page recursively
                  const findPage = (pages: HierarchicalPage[]): HierarchicalPage | null => {
                    for (const page of pages) {
                      if (page.id === pageId) return page;
                      if (page.subPages) {
                        const found = findPage(page.subPages);
                        if (found) return found;
                      }
                    }
                    return null;
                  };

                  const page = findPage(pages);
                  if (page) {
                    items.push({ label: page.label, type: 'page', id: page.id });
                  }
                }
              }
            }
          }
        }

        if (isMounted) {
          setBreadcrumbs(items);
        }
      } catch (err) {
        console.error('Failed to load breadcrumbs:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [version, moduleId, sectionId, pageId]);

  return { breadcrumbs, loading };
}
