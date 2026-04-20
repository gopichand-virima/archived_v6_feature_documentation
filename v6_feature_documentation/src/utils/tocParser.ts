/**
 * Parses the index.md file and generates the complete TOC structure
 */
export function parseTocFile(content: string, version: string): TocStructure {
  console.log(`🔧 [TOC Parser] parseTocFile called for version: ${version}, content length: ${content.length}`);
  console.log(`🔧 [TOC Parser] First 500 chars of content:`, content.substring(0, 500));
  
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const lines = content.split(/\r?\n/);
  console.log(`🔧 [TOC Parser] Split into ${lines.length} lines`);
  console.log(`🔧 [TOC Parser] Sample lines (first 10):`, lines.slice(0, 10));
  console.log(`🔧 [TOC Parser] Line 22 (should be ## Application Overview):`, lines[22]);
  console.log(`🔧 [TOC Parser] Line 22 char codes:`, lines[22] ? Array.from(lines[22]).map(c => c.charCodeAt(0)) : 'undefined');
  console.log(`🔧 [TOC Parser] Looking for lines with "## "...`);
  const moduleLines = lines.filter(l => l.trim().startsWith('## '));
  console.log(`🔧 [TOC Parser] Found ${moduleLines.length} lines starting with "## ":`, moduleLines);
  
  const modules: TocModule[] = [];
  const missingFiles: string[] = [];
  const validationErrors: string[] = [];

  let currentModule: TocModule | null = null;
  let currentSection: TocSection | null = null;
  let indentStack: { level: number; pages: TocPage[] }[] = [];
  
  let moduleCount = 0;
  let sectionCount = 0;
  let pageCount = 0;
  
  // Special handling: "Getting Started", "Application Overview", and "Dashboards" 
  // are sections under "My Dashboard" module, not separate modules
  const myDashboardSectionNames = ['Getting Started', 'Application Overview', 'Dashboards'];
  let myDashboardModule: TocModule | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed || trimmed.startsWith('>')) {
      continue;
    }

    // Module detection (## Module Name)
    if (trimmed.startsWith('## ') && !trimmed.includes('---')) {
      const moduleName = trimmed.substring(3).trim();
      const moduleId = convertToId(moduleName);
      
      // Check if this is a My Dashboard section (not a separate module)
      if (myDashboardSectionNames.includes(moduleName)) {
        // Ensure My Dashboard module exists
        if (!myDashboardModule) {
          myDashboardModule = {
            id: 'my-dashboard',
            label: 'My Dashboard',
            sections: [],
          };
          modules.push(myDashboardModule);
          moduleCount++;
          console.log(`  📁 [TOC Parser] Created My Dashboard module`);
        }
        
        // Treat this as a section under My Dashboard
        currentModule = myDashboardModule;
        const sectionId = convertToId(moduleName);
        
        sectionCount++;
        console.log(`    📂 [TOC Parser] My Dashboard Section ${sectionCount}: "${moduleName}" -> ID: "${sectionId}"`);
        
        currentSection = {
          id: sectionId,
          title: moduleName,
          label: moduleName,
          pages: [],
        };
        currentModule.sections.push(currentSection);
        indentStack = [];
        continue;
      }
      
      // Regular module
      moduleCount++;
      console.log(`  📁 [TOC Parser] Module ${moduleCount}: "${moduleName}" -> ID: "${moduleId}"`);
      
      currentModule = {
        id: moduleId,
        label: moduleName,
        sections: [],
      };
      modules.push(currentModule);
      currentSection = null;
      indentStack = [];
      continue;
    }

    // Skip horizontal rules
    if (trimmed === '---') continue;

    // Section detection (### Section Name or #### Subsection Name)
    if (trimmed.startsWith('###')) {
      const sectionName = trimmed.replace(/^#+\s+/, '').trim();
      const sectionId = convertToId(sectionName);
      
      sectionCount++;
      console.log(`    📂 Section ${sectionCount}: "${sectionName}" -> ID: "${sectionId}"`);
      
      if (currentModule) {
        currentSection = {
          id: sectionId,
          title: sectionName,
          label: sectionName,
          pages: [],
        };
        currentModule.sections.push(currentSection);
        indentStack = [];
      }
      continue;
    }

    // Page detection (- Page Name → /path/to/file.md OR - Page Name without path)
    if (trimmed.startsWith('- ')) {
      // Check if it has a file path (→) or is a parent container
      const matchWithPath = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      const matchWithoutPath = trimmed.match(/^-\s+(.+)$/);

      // Auto-create a synthetic section for modules that list pages directly
      // without a ### Section header (e.g. Vulnerability Management, Self-Service,
      // Risk Register, Reports). Use the module ID as the section ID so that
      // tocPathResolver can find pages via the all-sections fallback search.
      if ((matchWithPath || matchWithoutPath) && currentModule && !currentSection) {
        sectionCount++;
        currentSection = {
          id: currentModule.id,
          title: currentModule.label,
          label: currentModule.label,
          pages: [],
        };
        currentModule.sections.push(currentSection);
        indentStack = [];
        console.log(`    📂 [TOC Parser] Auto-section ${sectionCount}: "${currentModule.label}" -> ID: "${currentModule.id}"`);
      }

      if ((matchWithPath || matchWithoutPath) && currentSection) {
        const pageName = matchWithPath ? matchWithPath[1].trim() : (matchWithoutPath ? matchWithoutPath[1].trim() : '');
        if (!pageName) continue;
        const pageId = convertToId(pageName);

        // Determine indentation level
        const indent = line.search(/\S/);
        const currentLevel = Math.floor(indent / 2);

        // Create page object (with or without file path)
        const page: TocPage = {
          id: pageId,
          label: pageName,
        };

        // If it has a file path, add it
        if (matchWithPath) {
          let filePath = matchWithPath[2].trim();
          // Remove leading and trailing backticks
          if (filePath.startsWith('`') && filePath.endsWith('`')) {
            filePath = filePath.slice(1, -1);
          }
          page.filePath = filePath;
          pageCount++;
        }
        // If no file path, it's a parent container (still count it for structure)
        else {
          pageCount++;
        }

        // Handle nested pages
        if (currentLevel > 0 && indentStack.length > 0) {
          // Find the parent at the correct level
          while (indentStack.length > 0 && indentStack[indentStack.length - 1].level >= currentLevel) {
            indentStack.pop();
          }

          if (indentStack.length > 0) {
            const parent = indentStack[indentStack.length - 1];
            const lastPage = parent.pages[parent.pages.length - 1];
            if (lastPage) {
              if (!lastPage.subPages) {
                lastPage.subPages = [];
              }
              lastPage.subPages.push(page);
              indentStack.push({ level: currentLevel, pages: lastPage.subPages });
            }
          }
        } else {
          // Top-level page in this section
          currentSection.pages.push(page);
          indentStack = [{ level: currentLevel, pages: currentSection.pages }];
        }
      }
    }
  }

  // Validation: Check if files exist (this will be done at runtime)
  // For now, we'll just return the structure

  console.log(`🔧 [TOC Parser] parseTocFile complete for ${version}:`, {
    totalModules: moduleCount,
    totalSections: sectionCount,
    totalPages: pageCount,
    modulesInStructure: modules.length,
  });
  
  if (modules.length === 0) {
    console.error(`❌ [TOC Parser] ERROR: No modules were parsed for version ${version}!`);
    console.error(`❌ [TOC Parser] Module detection details:`, {
      moduleCount,
      totalLines: lines.length,
      linesWithDoubleHash: lines.filter(l => l.trim().startsWith('## ')).length,
    });
    console.log(`📄 [TOC Parser] First 500 chars of content:`, content.substring(0, 500));
    console.log(`📄 [TOC Parser] Lines that start with ##:`, lines.filter(l => l.trim().startsWith('## ')).slice(0, 10));
  }

  return {
    version,
    modules,
    missingFiles,
    validationErrors,
  };
}

/**
 * Converts a display name to a URL-safe ID
 */
function convertToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates breadcrumb trail for a given page
 * Standard: Home > Version > Module > Section > Parent > Nested > Page
 * Only includes levels that actually exist
 */
export function generateBreadcrumbs(
  structure: TocStructure,
  moduleId: string,
  sectionId: string,
  pageId: string
): Array<BreadcrumbItem> {
  const breadcrumbs: Array<BreadcrumbItem> = [
    { label: 'Home', id: 'home', type: 'home' },
    { label: structure.version, id: structure.version, type: 'version' },
  ];

  const module = structure.modules.find(m => m.id === moduleId);
  if (!module) return breadcrumbs;

  breadcrumbs.push({ label: module.label, id: module.id, type: 'module' });

  const section = module.sections.find(s => s.id === sectionId);
  if (!section) return breadcrumbs;

  breadcrumbs.push({ label: section.label, id: section.id, type: 'section' });

  // Find the page and build the path to it (handling nested pages)
  const findPagePath = (pages: TocPage[], targetId: string, path: TocPage[] = []): TocPage[] | null => {
    for (const page of pages) {
      if (page.id === targetId) {
        return [...path, page];
      }
      if (page.subPages) {
        const found = findPagePath(page.subPages, targetId, [...path, page]);
        if (found) return found;
      }
    }
    return null;
  };

  const pagePath = findPagePath(section.pages, pageId);
  if (pagePath && pagePath.length > 0) {
    // Add all pages in the hierarchy
    // First page(s) are parents, last one is the current page
    pagePath.forEach((page, index) => {
      let type: BreadcrumbItem['type'] = 'page';
      
      if (pagePath.length === 1) {
        // Only one level - it's the page itself
        type = 'page';
      } else if (index === 0) {
        // First in multi-level hierarchy - it's a parent
        type = 'parent';
      } else if (index < pagePath.length - 1) {
        // Middle levels - nested
        type = 'nested';
      } else {
        // Last one - the actual page
        type = 'page';
      }
      
      breadcrumbs.push({ label: page.label, id: page.id, type });
    });
  }

  return breadcrumbs;
}

/**
 * Finds the next and previous pages for navigation
 */
export function findAdjacentPages(
  structure: TocStructure,
  moduleId: string,
  sectionId: string,
  pageId: string
): { prev: TocPage | null; next: TocPage | null } {
  const module = structure.modules.find(m => m.id === moduleId);
  if (!module) return { prev: null, next: null };

  const section = module.sections.find(s => s.id === sectionId);
  if (!section) return { prev: null, next: null };

  // Flatten all pages in order
  const flattenPages = (pages: TocPage[]): TocPage[] => {
    const result: TocPage[] = [];
    for (const page of pages) {
      result.push(page);
      if (page.subPages) {
        result.push(...flattenPages(page.subPages));
      }
    }
    return result;
  };

  const allPages = flattenPages(section.pages);
  const currentIndex = allPages.findIndex(p => p.id === pageId);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? allPages[currentIndex - 1] : null,
    next: currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null,
  };
}

/**
 * Validates that all referenced files exist
 */
export async function validateTocFiles(structure: TocStructure): Promise<string[]> {
  const missingFiles: string[] = [];

  const checkPages = (pages: TocPage[]) => {
    for (const page of pages) {
      // In a real implementation, we would check if the file exists
      // For now, we'll skip this validation
      if (page.subPages) {
        checkPages(page.subPages);
      }
    }
  };

  for (const module of structure.modules) {
    for (const section of module.sections) {
      checkPages(section.pages);
    }
  }

  return missingFiles;
}

/**
 * Generates URL path for a given page
 */
export function generatePageUrl(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
): string {
  return `/${version}/${moduleId}/${sectionId}/${pageId}`;
}

/**
 * Resolves MDX file path from TOC structure
 */
export function resolveFilePath(
  structure: TocStructure,
  moduleId: string,
  sectionId: string,
  pageId: string
): string | null {
  const module = structure.modules.find(m => m.id === moduleId);
  if (!module) return null;

  const section = module.sections.find(s => s.id === sectionId);
  if (!section) return null;

  const findPage = (pages: TocPage[], targetId: string): TocPage | null => {
    for (const page of pages) {
      if (page.id === targetId) return page;
      if (page.subPages) {
        const found = findPage(page.subPages, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const page = findPage(section.pages, pageId);
  return page?.filePath ?? null;
}

// Type definitions
export interface TocStructure {
  version: string;
  modules: TocModule[];
  missingFiles: string[];
  validationErrors: string[];
}

export interface TocModule {
  id: string;
  label: string;
  sections: TocSection[];
}

export interface TocSection {
  id: string;
  title: string;
  label: string;
  pages: TocPage[];
}

export interface TocPage {
  id: string;
  label: string;
  filePath?: string;
  subPages?: TocPage[];
}

export interface BreadcrumbItem {
  label: string;
  id: string;
  type: 'home' | 'version' | 'module' | 'section' | 'parent' | 'nested' | 'page';
}
