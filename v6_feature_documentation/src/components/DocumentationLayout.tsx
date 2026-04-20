import { ReactNode, useState, useEffect, MutableRefObject } from "react";
import { useTheme } from "../lib/theme/theme-provider";
import { LoginDialog } from "./LoginDialog";
import { ResizableSidebar } from "./ResizableSidebar";
import { DocumentationHeader } from "./DocumentationHeader";
import { NavigationMenu } from "./NavigationMenu";
import { Footer } from "./Footer";
import { useDocGraphNav } from "../utils/useDocGraphNav";

interface DocumentationLayoutProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  selectedModule: string;
  onModuleChange: (module: string) => void;
  selectedSection: string;
  onSectionChange: (section: string) => void;
  selectedPage: string;
  onPageChange: (page: string) => void;
  onHomeClick: () => void;
  children: ReactNode;
  isHomePage?: boolean;
  versionDropdownTriggerRef?: MutableRefObject<(() => void) | null>;
  contentContainerRef?: MutableRefObject<HTMLDivElement | null>;
  onSearchDialogOpen?: () => void;
}

export function DocumentationLayout({
  selectedVersion,
  onVersionChange,
  selectedModule,
  onModuleChange,
  selectedSection,
  onSectionChange,
  selectedPage,
  onPageChange,
  onHomeClick,
  children,
  isHomePage = false,
  versionDropdownTriggerRef,
  contentContainerRef,
  onSearchDialogOpen,
}: DocumentationLayoutProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const surfaceBg = isDark ? '#000000' : '#ffffff';
  const borderColor = isDark ? '#1a1a1a' : 'rgba(0,0,0,0.06)';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([selectedSection])
  );
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [expandedSubPages, setExpandedSubPages] = useState<Set<string>>(
    new Set()
  );
  const [versionDropdownOpen, setVersionDropdownOpen] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(288); // 72 * 4 = 288px (w-72)

  // Doc-graph-driven navigation — replaces useToc + hardcoded navigationData.ts
  // Release Notes is accessed via the header link, not the module dropdown
  const { modules: rawModules, sections: graphSections, loading: navLoading } = useDocGraphNav(selectedVersion, selectedModule);
  const modules = rawModules.filter((m) => m.id !== 'release-notes');

  // Versions list — currently only 6.1 is active.
  // Extend ACTIVE_VERSIONS in build-doc-graph.ts when new versions go live.
  const versions = ['6.1'];

  console.log('DocumentationLayout modules:', {
    graphModules: modules,
    selectedModule,
    navLoading,
  });

  // Sync expandedSections when selectedSection changes (URL navigation, back/forward, deep links)
  useEffect(() => {
    if (selectedSection && selectedSection.trim() !== '') {
      setExpandedSections(prev => new Set([...prev, selectedSection]));
    }
  }, [selectedSection]);

  // Set up the trigger function for opening the version dropdown
  useEffect(() => {
    if (versionDropdownTriggerRef) {
      versionDropdownTriggerRef.current = () => {
        setVersionDropdownOpen(true);
      };
    }
  }, [versionDropdownTriggerRef]);

  const showSidebar = !!selectedModule;

  // Sections come from the doc graph (graphSections) — no hardcoded fallback needed.
  const sections = graphSections;

  // Only log when a module is actually selected (not empty string)
  if (selectedModule && selectedModule.trim() !== '') {
    console.log('📚 DocumentationLayout Navigation Data:', {
      selectedModule,
      selectedSection,
      selectedPage,
      sectionsCount: sections.length,
      navLoading,
    });
  }

  // Sync expandedPages when selectedPage changes — expand parent if a sub-page is deep-linked
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!selectedPage || !sections.length) return;
    for (const section of sections) {
      if (!section.pages) continue;
      for (const page of section.pages as any[]) {
        if (page.subPages && page.subPages.some((sp: any) => sp.id === selectedPage)) {
          setExpandedPages(prev => new Set([...prev, page.id]));
          return;
        }
      }
    }
  }, [selectedPage, sections]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================================
  // TOC EXPAND/COLLAPSE HELPER FUNCTIONS
  // ============================================================
  // These functions power the comprehensive expand/collapse system
  // that provides global, branch, and node-level controls for the TOC.
  // See NavigationMenu.tsx for full architecture documentation.
  // ============================================================

  // Helper function: Get all expandable section IDs
  const getAllExpandableSectionIds = (): string[] => {
    return sections.map(section => section.id);
  };

  // Helper function: Get all expandable page IDs from all sections
  const getAllExpandablePageIds = (): string[] => {
    const pageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        section.pages.forEach((page: any) => {
          if (page.subPages && page.subPages.length > 0) {
            pageIds.push(page.id);
          }
        });
      }
    });
    return pageIds;
  };

  // Helper function: Get all expandable subPage IDs from all sections
  const getAllExpandableSubPageIds = (): string[] => {
    const subPageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        section.pages.forEach((page: any) => {
          if (page.subPages && Array.isArray(page.subPages)) {
            page.subPages.forEach((subPage: any) => {
              if (subPage.subPages && subPage.subPages.length > 0) {
                subPageIds.push(subPage.id);
              }
            });
          }
        });
      }
    });
    return subPageIds;
  };

  // Helper function: Get descendant page IDs for a given section
  const getDescendantPageIds = (sectionId: string): string[] => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.pages) return [];
    
    const pageIds: string[] = [];
    section.pages.forEach((page: any) => {
      if (page.subPages && page.subPages.length > 0) {
        pageIds.push(page.id);
      }
    });
    return pageIds;
  };

  // Helper function: Get descendant subPage IDs for a given page
  const getDescendantSubPageIds = (pageId: string): string[] => {
    const subPageIds: string[] = [];
    sections.forEach(section => {
      if (section.pages && Array.isArray(section.pages)) {
        const page = section.pages.find((p: any) => p.id === pageId) as any;
        if (page && page.subPages && Array.isArray(page.subPages)) {
          page.subPages.forEach((subPage: any) => {
            if (subPage.subPages && subPage.subPages.length > 0) {
              subPageIds.push(subPage.id);
            }
          });
        }
      }
    });
    return subPageIds;
  };

  // Expand All: Opens all expandable nodes at all levels
  const expandAll = () => {
    const allSectionIds = getAllExpandableSectionIds();
    const allPageIds = getAllExpandablePageIds();
    const allSubPageIds = getAllExpandableSubPageIds();
    
    setExpandedSections(new Set(allSectionIds));
    setExpandedPages(new Set(allPageIds));
    setExpandedSubPages(new Set(allSubPageIds));
  };

  // Collapse All: Closes all expandable nodes at all levels
  const collapseAll = () => {
    setExpandedSections(new Set());
    setExpandedPages(new Set());
    setExpandedSubPages(new Set());
  };

  // Expand Branch: Opens a section and all its descendants
  const expandBranch = (sectionId: string) => {
    setExpandedSections(prev => new Set([...prev, sectionId]));
    
    const descendantPageIds = getDescendantPageIds(sectionId);
    setExpandedPages(prev => new Set([...prev, ...descendantPageIds]));
    
    // Also expand all subPages within those pages
    const allSubPageIds: string[] = [];
    descendantPageIds.forEach(pageId => {
      const subPageIds = getDescendantSubPageIds(pageId);
      allSubPageIds.push(...subPageIds);
    });
    setExpandedSubPages(prev => new Set([...prev, ...allSubPageIds]));
  };

  // Collapse Branch: Closes a section and all its descendants
  const collapseBranch = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
    
    const descendantPageIds = getDescendantPageIds(sectionId);
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      descendantPageIds.forEach(id => newSet.delete(id));
      return newSet;
    });
    
    // Also collapse all subPages within those pages
    const allSubPageIds: string[] = [];
    descendantPageIds.forEach(pageId => {
      const subPageIds = getDescendantSubPageIds(pageId);
      allSubPageIds.push(...subPageIds);
    });
    setExpandedSubPages(prev => {
      const newSet = new Set(prev);
      allSubPageIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const toggleSubPage = (subPageId: string) => {
    setExpandedSubPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subPageId)) {
        newSet.delete(subPageId);
      } else {
        newSet.add(subPageId);
      }
      return newSet;
    });
  };

  // Keyboard shortcuts for TOC expand/collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+E or Cmd+Shift+E to expand all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        expandAll();
      }
      // Ctrl+Shift+C or Cmd+Shift+C to collapse all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        collapseAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sections]); // Re-attach when sections change

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header — sticky top-0 z-50 is set inside DocumentationHeader */}
      <DocumentationHeader
        showSidebar={showSidebar}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onHomeClick={onHomeClick}
        isHomePage={isHomePage}
        selectedVersion={selectedVersion}
        onVersionChange={onVersionChange}
        versions={versions}
        versionDropdownOpen={versionDropdownOpen}
        onVersionDropdownOpenChange={setVersionDropdownOpen}
        onSearchDialogOpen={() => {
          if (onSearchDialogOpen) {
            onSearchDialogOpen();
          }
        }}
        onLoginDialogOpen={() => setLoginDialogOpen(true)}
        onReleaseNotesClick={() => onModuleChange('release-notes')}
        onDocumentationClick={() => {
          // Scroll smoothly to the modules grid below the hero section
          window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }}
        selectedModule={selectedModule}
      />

      {/*
       * Document-scroll shell — body scrolls, sidebar + TOC use position:sticky
       * ─────────────────────────────────────────────────────────────────────
       * min-h-screen root + no overflow-hidden: body scrolls naturally.
       * Footer renders full-width below both sidebar and main.
       *
       * LEFT rail: position:sticky + self-start + viewport-height.
       *   Sticks below header, scrolls independently via overflow-y:auto.
       *   Un-sticks when its containing block (this flex row) ends.
       *
       * RIGHT TOC: position:sticky top:calc(header + 1.5rem).
       *   Sticks relative to viewport. Un-sticks when article ends.
       * ─────────────────────────────────────────────────────────────────────
       */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Resizable Sidebar
                ──────────────────────────────────────────────────────────────
                The <aside> uses .docs-left-rail (globals.css) which is:
                  position: sticky
                  top: var(--header-h)
                  height: calc(100vh - var(--header-h))
                  overflow-y: auto
                This pins the rail below the sticky header as the page scrolls.
                ────────────────────────────────────────────────────────────── */}
            <ResizableSidebar
              initialWidth={leftSidebarWidth}
              onResize={setLeftSidebarWidth}
              minWidth={200}
              maxWidth={500}
              side="left"
            >
              <aside
                className="docs-left-rail border-r"
                style={{ background: surfaceBg, borderColor }}
              >
                <NavigationMenu
                  modules={modules}
                  selectedModule={selectedModule}
                  onModuleChange={onModuleChange}
                  sections={sections}
                  selectedSection={selectedSection}
                  onSectionChange={onSectionChange}
                  selectedPage={selectedPage}
                  onPageChange={onPageChange}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  expandedPages={expandedPages}
                  togglePage={togglePage}
                  expandedSubPages={expandedSubPages}
                  toggleSubPage={toggleSubPage}
                  onExpandAll={expandAll}
                  onCollapseAll={collapseAll}
                  onExpandBranch={expandBranch}
                  onCollapseBranch={collapseBranch}
                  onClose={() => setSidebarOpen(false)}
                />
              </aside>
            </ResizableSidebar>

            {/* Mobile Sidebar — fixed overlay, independent of scroll model */}
            <aside
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:hidden fixed inset-y-0 left-0 z-40 w-72 border-r shadow-xl transition-transform duration-300 overflow-y-auto`}
              style={{ background: surfaceBg, borderColor }}
            >
              <NavigationMenu
                modules={modules}
                selectedModule={selectedModule}
                onModuleChange={onModuleChange}
                sections={sections}
                selectedSection={selectedSection}
                onSectionChange={onSectionChange}
                selectedPage={selectedPage}
                onPageChange={onPageChange}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                expandedPages={expandedPages}
                togglePage={togglePage}
                expandedSubPages={expandedSubPages}
                toggleSubPage={toggleSubPage}
                onExpandAll={expandAll}
                onCollapseAll={collapseAll}
                onExpandBranch={expandBranch}
                onCollapseBranch={collapseBranch}
                onClose={() => setSidebarOpen(false)}
              />
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </>
        )}

        {/* Main content pane — document-scroll: body scrolls, not main */}
        <main
          className="flex-1 min-w-0"
          ref={contentContainerRef}
        >
          {children}
        </main>
      </div>

      {/* Footer — outside sidebar/main row, full-width below both */}
      <Footer />

      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </div>
  );
}