/**
 * useDocGraphNav — Doc-Graph-Driven Navigation Hook
 *
 * Replaces the dual useToc + navigationData.ts approach with a single
 * source: the build-time doc-graph.json.
 *
 * Progressive disclosure:
 *   Mount        → L0: load all modules (getModuleList)
 *   Module change → L1: load sections + pages for selected module
 *
 * Page IDs emitted (navId) are label-slugified exactly like tocParser.convertToId,
 * so they are directly compatible with resolveMDXPathFromTOC without any mapping.
 */

import { useState, useEffect } from 'react';
import { getModuleList, getModuleSections, getSectionNodes } from './docGraph';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavPage {
  /** Label-slugified ID — compatible with tocPathResolver / resolveMDXPathFromTOC. */
  id: string;
  label: string;
}

export interface NavSection {
  id: string;
  /** `title` field for compatibility with NavigationMenu which reads section.title. */
  title: string;
  label: string;
  pages: NavPage[];
}

export interface NavModule {
  id: string;
  label: string;
}

export interface UseDocGraphNavResult {
  modules: NavModule[];
  sections: NavSection[];
  loading: boolean;
  error: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns nav-ready modules and sections derived from the doc graph.
 *
 * @param version        UI version string (e.g. "6.1") — used to re-trigger
 *                       on version change once multi-version is active.
 * @param selectedModule Current module ID (e.g. "admin").
 */
export function useDocGraphNav(
  version: string,
  selectedModule: string,
): UseDocGraphNavResult {
  const [modules,  setModules]  = useState<NavModule[]>([]);
  const [sections, setSections] = useState<NavSection[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // ── L0: Load module list once per version ─────────────────────────────────
  useEffect(() => {
    let mounted = true;

    getModuleList()
      .then(mods => {
        if (mounted) {
          setModules(mods);
          setLoading(false);
          console.log(`✅ [useDocGraphNav] ${mods.length} modules loaded`);
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[useDocGraphNav] Failed to load modules:', msg);
        if (mounted) {
          setError(msg);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [version]);

  // ── L1: Load sections + pages for the selected module ─────────────────────
  useEffect(() => {
    if (!selectedModule) {
      setSections([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        // Get ordered section list for this module
        const sectionList = await getModuleSections(selectedModule);

        // For each section, resolve its page nodes
        const populated: NavSection[] = await Promise.all(
          sectionList.map(async sec => {
            const nodes = await getSectionNodes(selectedModule, sec.id);

            const pages: NavPage[] = nodes.map(node => ({
              // navId is the tocParser-compatible slug (slugify of TOC label)
              id:    node.navId,
              label: node.title,
            }));

            return {
              id:    sec.id,
              title: sec.label,   // NavigationMenu reads section.title
              label: sec.label,
              pages,
            };
          }),
        );

        if (mounted) {
          setSections(populated);
          console.log(
            `✅ [useDocGraphNav] ${populated.length} sections loaded for module "${selectedModule}"`,
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[useDocGraphNav] Failed to load sections:', msg);
        if (mounted) setError(msg);
      }
    })();

    return () => { mounted = false; };
  }, [selectedModule, version]);

  return { modules, sections, loading, error };
}
