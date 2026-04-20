import { useState, useEffect } from "react";
import { AlertTriangle, ArrowRight, Calendar, Clock } from "lucide-react";
import { TableOfContents } from "./TableOfContents";
import { MDXContent } from "./MDXContent";
import { ContentNotAvailable } from "./ContentNotAvailable";
import { resolveMDXPathFromTOC } from "../utils/tocPathResolver";
import {
  buildBreadcrumbPath,
  type BreadcrumbItem as HierarchicalBreadcrumbItem
} from "../utils/hierarchicalTocLoader";

interface DocumentationContentProps {
  version: string;
  module: string;
  section: string;
  page: string;
  onHomeClick?: () => void;
  onModuleClick?: () => void;
  onVersionClick?: () => void;
  onSectionPageNavigate?: (section: string, page: string) => void;
}

const moduleNames: Record<string, string> = {
  admin: "Admin",
  "my-dashboard": "My Dashboard",
  cmdb: "CMDB",
  "discovery-scan": "Discovery Scan",
  itsm: "ITSM",
  "vulnerability-management": "Vulnerability Management",
  itam: "ITAM",
  "self-service": "Self Service",
  "program-project-management":
    "Program and Project Management",
  "risk-register": "Risk Register",
  reports: "Reports",
  "release-notes": "Release Notes",
  support: "Support",
};

// Helper function to get section display name
function getSectionDisplayName(section: string): string {
  const sectionNames: Record<string, string> = {
    "getting-started": "Getting Started",
    "application-overview": "Application Overview",
    "online-help": "OnlineHelp",
    "api-integration": "API Integration",
    "compatibility-matrix": "Compatibility Matrix",
    "release-notes": "Release Notes",
    "manuals": "Manuals",
    "admin": "Admin",
    "cmdb": "CMDB",
    "discovery-scan": "Discovery Scan",
    "itsm": "ITSM",
    "vulnerability-management": "Vulnerability Management",
    "itam": "ITAM",
    "self-service": "Self Service",
    "program-project-management": "Program and Project Management",
    "risk-register": "Risk Register",
    "reports": "Reports",
    "support": "Support",
  };
  return sectionNames[section] || section
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DocumentationContent({
  version,
  module,
  section,
  page,
  onHomeClick,
  onModuleClick,
  onVersionClick,
  onSectionPageNavigate,
}: DocumentationContentProps) {
  const [mdxPath, setMdxPath] = useState<string | null>(null);
  const [loadingPath, setLoadingPath] = useState(true);
  const [_breadcrumbs, setBreadcrumbs] = useState<HierarchicalBreadcrumbItem[]>([]);
  const moduleName = moduleNames[module] || module;

  // Load MDX path and breadcrumbs from TOC when navigation changes
  useEffect(() => {
    let mounted = true;
    
    async function loadPathAndBreadcrumbs() {
      setLoadingPath(true);
      try {
        // Set version in contentLoader to ensure correct version context
        // Map display version to internal version code
        // Currently only 6.1 active. Other versions commented for future reference:
        const versionMap: Record<string, string> = {
          // 'NextGen': 'NG',   // TODO: Re-enable when NG content is ready
          // '6.1.1': '6_1_1',  // TODO: Re-enable when 6.1.1 content is ready
          '6.1': '6_1',
          // '5.13': '5_13',    // TODO: Re-enable when 5.13 content is ready
        };
        const internalVersion = versionMap[version] || version.replace(/\./g, '_').toUpperCase();
        const { setVersion } = await import('../lib/content/contentLoader');
        setVersion(internalVersion);
        console.log(`🔄 [DocumentationContent] Set contentLoader version to: ${internalVersion} (from route version: ${version})`);
        
        // Load both the MDX path and breadcrumbs
        // Match working implementation: use TOC resolution directly
        const [path, breadcrumbPath] = await Promise.all([
          resolveMDXPathFromTOC({ version, module, section, page }),
          buildBreadcrumbPath(version, module, section, page)
        ]);
        
        if (mounted) {
          setMdxPath(path);
          setBreadcrumbs(breadcrumbPath);
          setLoadingPath(false);
        }
      } catch (error) {
        console.error('❌ Error loading MDX path from TOC:', error);
        console.error('❌ Context:', { version, module, section, page });
        if (mounted) {
          setMdxPath(null);
          setBreadcrumbs([]);
          setLoadingPath(false);
        }
      }
    }
    
    loadPathAndBreadcrumbs();
    
    return () => {
      mounted = false;
    };
  }, [version, module, section, page]);


  const renderContent = () => {
    console.log('DocumentationContent - Rendering:', { version, module, section, page });
    console.log('DocumentationContent - MDX Path resolved from TOC:', mdxPath);
    
    // Show loading state while resolving path
    if (loadingPath) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-500">Loading...</div>
        </div>
      );
    }
    
    // If we have a valid MDX path from TOC, load it
    if (mdxPath) {
      return (
        <MDXContent
          filePath={mdxPath}
          version={version}
          module={module}
          moduleName={moduleName}
          section={section}
          sectionName={getSectionDisplayName(section)}
          page={page}
          pageName={page ? page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined}
          onHomeClick={onHomeClick}
          onVersionClick={onVersionClick}
          onModuleClick={onModuleClick}
        />
      );
    }

    // Module-level landing (no section/page selected) — clean prompt
    if (!section && !page) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select a topic from the sidebar
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Choose a section and page from the navigation menu on the left to view documentation for{' '}
            <span className="font-medium">{moduleName}</span>.
          </p>
        </div>
      );
    }

    // No MDX file found for a specific section/page — show diagnostics
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <ContentNotAvailable
          filePath={mdxPath || `Version: ${version}, Module: ${module}, Section: ${section}, Page: ${page}`}
          errorDetails={`MDX path resolution returned null. Tried TOC resolution and registry fallback. Check browser console for detailed logs.`}
          version={version}
          module={module}
          section={section}
          page={page}
        />
      </div>
    );
  };

  return (
    /*
     * PRD-style two-column reading layout
     * ─────────────────────────────────────────────────────────────────────────
     * The centered max-width container holds BOTH the article column and the
     * TOC rail as a unit, matching the .prd-layout pattern in prds_ng.
     *
     * This is the structural fix for the old layout where the TOC was a
     * separate flex sibling outside any constrained wrapper, causing it to
     * sit at the far-right viewport edge regardless of content width.
     *
     * Layout model (mirrors prds_ng tokens.css .prd-layout):
     *   outer w-full (fills <main>)
     *   └── flex gap-8 max-w-[1280px] mx-auto   ← both columns centered together
     *       ├── article flex-1 min-w-0           ← readable article width
     *       └── aside w-56 self-start sticky     ← TOC rail beside the article
     * ─────────────────────────────────────────────────────────────────────────
     */
    <div className="w-full">
      {/*
       * max-w-7xl = var(--container-7xl) = 80rem = 1280px in Tailwind v4
       * Using named container token (max-w-7xl) because max-w-[1280px] is not
       * in the pre-compiled src/index.css scan.
       */}
      <div className="flex gap-16 docs-outer-wrapper mx-auto w-full
                      px-4 sm:px-6 lg:px-8
                      pt-8 sm:pt-12 lg:pt-16 pb-24">

        {/* Article column — constrained reading width (matches prds_ng .prd-content max-width) */}
        <article className="flex-1 min-w-0 docs-article">
          {/* Actions Required alert banner — shown on all Release Notes pages except Actions Required itself */}
          {module === 'release-notes' && page !== 'actions-required' && (
            <div
              onClick={() => onSectionPageNavigate?.('release-notes', 'actions-required')}
              className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg
                         bg-amber-50 dark:bg-amber-950/30
                         border border-amber-200 dark:border-amber-800/50
                         cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/50
                         transition-colors group"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                User actions are required for this update
              </span>
              <ArrowRight className="h-4 w-4 ml-auto text-amber-500 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
          {renderContent()}
        </article>

        {/*
         * Right TOC rail
         * - Hidden below xl (1280 px) — too narrow for both columns below that
         *   xl:block is back-filled in globals.css (not in pre-compiled index.css)
         * - w-64 (256 px): pre-existing utility, matches original sidebar width
         * - self-start prevents flex stretch so sticky works correctly
         * - sticky top-20 pins the rail relative to <main>'s scroll context
         * - doc-toc-rail class (globals.css) adds max-height + overflow for long TOCs
         */}
        <aside
          className="hidden xl:block w-56 flex-shrink-0 self-start sticky
                     border-l border-slate-200/60 dark:border-[#1a1a1a] pl-6
                     doc-toc-rail"
        >
          {/* Page metadata */}
          <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-[#1a1a1a]">
            <div className="flex items-start gap-2 mb-3">
              <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Release Date</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">November 1, 2025</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Last Updated</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">November 10, 2025</div>
              </div>
            </div>
          </div>

          {/* TOC navigation */}
          <TableOfContents autoExtract={true} />
        </aside>

      </div>
    </div>
  );
}
