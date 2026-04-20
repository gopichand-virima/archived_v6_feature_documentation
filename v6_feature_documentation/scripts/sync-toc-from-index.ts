#!/usr/bin/env node
/**
 * TOC Sync Script - Single Source of Truth
 *
 * This script automatically updates all dependent files when index.md is modified.
 *
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.md
 *
 * Updates:
 * 1. src/data/navigationData.ts - Navigation structure
 * 2. src/utils/indexContentMap.ts - Static TOC content map
 *
 * Usage:
 *   npm run sync-toc              # Sync all versions
 *   npm run sync-toc -- 6_1       # Sync specific version
 *   npm run watch-toc             # Watch for changes and auto-sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Version configurations
interface VersionConfig {
  name: string;
  dir: string;
}

const VERSIONS: Record<string, VersionConfig> = {
  '6_1': { name: '6.1', dir: '6_1' },
  '6_1_1': { name: '6.1.1', dir: '6_1_1' },
  '5_13': { name: '5.13', dir: '5_13' },
  'NG': { name: 'NextGen', dir: 'NG' }
};

// Module ID to variable name mapping
const MODULE_VAR_MAP: Record<string, string> = {
  'my-dashboard': 'myDashboardSections',
  'admin': 'adminSections',
  'cmdb': 'cmdbSections',
  'discovery-scan': 'discoveryScanSections',
  'itsm': 'itsmSections',
  'itam': 'itamSections',
  'vulnerability-management': 'vulnerabilityManagementSections',
  'self-service': 'selfServiceSections',
  'program-project-management': 'programProjectManagementSections',
  'programproject-management': 'programProjectManagementSections', // Handle case where hyphen is removed
  'risk-register': 'riskRegisterSections',
  'reports': 'reportsSections',
  'release-notes': 'releaseNotesSections',
  'support': 'supportSections'
};

interface PageItem {
  id: string;
  label: string;
  path: string;
  subPages?: PageItem[];
}

interface SubSection {
  id: string;
  title: string;
  label: string;
  pages: PageItem[];
}

interface Section {
  id: string;
  title: string;
  label: string;
  pages: PageItem[];
  subSections?: SubSection[];
}

interface Module {
  id: string;
  title: string;
  label: string;
  sections: Section[];
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get indentation level from line
 */
function getIndentLevel(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? Math.floor((match[1]?.length ?? 0) / 2) : 0;
}

/**
 * Parse index.md file into structured data
 */
function parseIndexMDX(content: string, _versionCode: string): Module[] {
  const lines = content.split('\n');
  const modules: Module[] = [];
  let currentModule: Module | null = null;
  let currentSection: Section | null = null;
  let currentSubSection: SubSection | null = null;
  const pageStack: PageItem[] = []; // Stack for nested pages

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // Skip empty lines, frontmatter, and comments
    if (!trimmed || trimmed.startsWith('---') || trimmed.startsWith('>') || trimmed.startsWith('#')) {
      // Handle headers
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '').trim();
        const id = toKebabCase(title);

        currentModule = {
          id,
          title,
          label: title,
          sections: []
        };
        modules.push(currentModule);
        currentSection = null;
        currentSubSection = null;
        pageStack.length = 0;
        continue;
      }

      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '').trim();
        const id = toKebabCase(title);

        currentSection = {
          id,
          title,
          label: title,
          pages: []
        };

        if (currentModule) {
          currentModule.sections.push(currentSection);
        }
        currentSubSection = null;
        pageStack.length = 0;
        continue;
      }

      if (trimmed.startsWith('#### ')) {
        const title = trimmed.replace('#### ', '').trim();
        const id = toKebabCase(title);

        currentSubSection = {
          id,
          title,
          label: title,
          pages: []
        };

        if (currentSection) {
          if (!currentSection.subSections) {
            currentSection.subSections = [];
          }
          currentSection.subSections.push(currentSubSection);
        }
        pageStack.length = 0;
        continue;
      }

      continue;
    }

    // Parse list items (pages)
    if (trimmed.startsWith('- ')) {
      const match = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (!match) continue;

      const pageTitle = (match[1] ?? '').trim();
      const pagePath = (match[2] ?? '').trim();
      const indent = getIndentLevel(line);

      const pageItem: PageItem = {
        id: toKebabCase(pageTitle),
        label: pageTitle,
        path: pagePath
      };

      // Determine nesting level
      if (indent === 0) {
        // Top-level page
        if (currentSubSection) {
          currentSubSection.pages.push(pageItem);
        } else if (currentSection) {
          currentSection.pages.push(pageItem);
        }
        pageStack[0] = pageItem;
        pageStack.length = 1;
      } else {
        // Nested page
        const parent = pageStack[indent - 1];
        if (parent) {
          if (!parent.subPages) {
            parent.subPages = [];
          }
          parent.subPages.push(pageItem);
          pageStack[indent] = pageItem;
          pageStack.length = indent + 1;
        }
      }
    }
  }

  return modules;
}

/**
 * Generate TypeScript section export
 *
 * Generates one array entry per ### section so the UI can render
 * each named section (e.g. "Getting Started", "Dashboards") independently.
 * If a module has no ### sections but has loose pages attached to the module
 * directly (via ## header only), a single section is emitted using the module
 * id/title so the UI always receives at least one entry.
 */
function generateSectionExport(varName: string, moduleData: Module): string {
  let sectionData: Array<{ id: string; title: string; label: string; pages: PageItem[] }>;

  if (moduleData.sections.length === 0) {
    // Module has no ### sub-sections — emit a single section entry
    sectionData = [{
      id: moduleData.id,
      title: moduleData.title,
      label: moduleData.label,
      pages: []
    }];
  } else {
    // One entry per ### section; flatten subSection pages into the parent section pages
    sectionData = moduleData.sections.map((s: Section) => {
      const pages = [...(s.pages ?? [])];
      if (s.subSections) {
        s.subSections.forEach((sub: SubSection) => {
          pages.push(...(sub.pages ?? []));
        });
      }
      return {
        id: s.id,
        title: s.title,
        label: s.label,
        pages
      };
    });
  }

  return `
// ${moduleData.title} sections
export const ${varName} = ${JSON.stringify(sectionData, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;
}

/**
 * Generate navigationData.ts
 */
function generateNavigationData(versionCode: string = '6_1'): void {
  console.log(`\n🚀 Generating navigationData.ts from index.md (${versionCode})...\n`);

  const version = VERSIONS[versionCode];
  if (!version) {
    console.error(`❌ Invalid version: ${versionCode}`);
    process.exit(1);
  }

  const versionContentDir = path.join(__dirname, `../src/pages/content/${version.dir}`);

  if (!fs.existsSync(versionContentDir)) {
    console.warn(`⚠️  Warning: ${versionContentDir} not found — skipping navigationData.ts generation`);
    return;
  }

  // Read the master TOC (single source of truth for all modules)
  const masterTocPath = path.join(versionContentDir, 'index.md');
  if (!fs.existsSync(masterTocPath)) {
    console.warn(`⚠️  Warning: master TOC not found at ${masterTocPath} — skipping navigationData.ts generation`);
    return;
  }

  const content = fs.readFileSync(masterTocPath, 'utf-8');
  const modules = parseIndexMDX(content, versionCode);

  console.log(`📋 Parsed ${modules.length} modules\n`);

  // Generate TypeScript file
  let output = `/**
 * AUTO-GENERATED from index.md — DO NOT EDIT MANUALLY
 *
 * ⚠️  IMPORTANT: This file is automatically generated!
 * To update navigation structure, edit: /content/${version.dir}/index.md
 * Then run: npm run sync-toc
 *
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.md files
 *
 * Generated: ${new Date().toISOString()}
 * Source: /content/${version.dir}/index.md
 */

// Module definitions
export const modules = [
`;

  // Generate module list from parsed modules
  modules.forEach((module: Module) => {
    output += `  { id: "${module.id}", label: "${module.title}" },\n`;
  });

  output += `];

// Version definitions — only 6.1 is active; other versions reserved for future use
export const versions = ["6.1"];
`;

  // Generate section exports
  modules.forEach((module: Module) => {
    const varName = MODULE_VAR_MAP[module.id];
    if (varName) {
      output += generateSectionExport(varName, module);
      console.log(`✅ Generated: ${varName} (${module.sections.length} sections)`);
    } else {
      console.log(`⚠️  Skipped: ${module.id} (no mapping defined)`);
    }
  });

  // Add helper function
  const caseStatements = modules
    .filter((m: Module) => MODULE_VAR_MAP[m.id] !== undefined)
    .map((m: Module) => `    case "${m.id}":\n      return ${MODULE_VAR_MAP[m.id]};`)
    .join('\n');

  output += `
// Helper function to get sections for a specific module
export function getSectionsForModule(moduleId: string) {
  switch (moduleId) {
${caseStatements}
    default:
      return [];
  }
}
`;

  // Write output
  const outputPath = path.join(__dirname, '../src/data/navigationData.ts');
  const backupDir = path.join(__dirname, '../.cache/toc-backups');
  const backupPath = path.join(backupDir, 'navigationData.backup.ts');

  // Create backup
  if (fs.existsSync(outputPath)) {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.copyFileSync(outputPath, backupPath);
    console.log(`\n💾 Backup created: ${backupPath}`);
  }

  fs.writeFileSync(outputPath, output);

  console.log(`\n✅ navigationData.ts generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Total modules: ${modules.length}`);
  console.log(`\n⚠️  REMEMBER: Always edit index.md, not navigationData.ts!\n`);
}

/**
 * Generate indexContentMap.ts
 */
function generateIndexContentMap(): void {
  console.log(`\n🚀 Generating indexContentMap.ts from all index.md files...\n`);

  let output = `/**
 * Index Content Map
 *
 * AUTO-GENERATED from index.md files — DO NOT EDIT MANUALLY
 *
 * This file contains all the index.md content as raw strings.
 * This is necessary because in the browser environment, we can't use fetch() to load local files.
 *
 * SINGLE SOURCE OF TRUTH: /content/<version>/index.md
 *
 * Generated: ${new Date().toISOString()}
 *
 * To update: Edit index.md files and run: npm run sync-toc
 */

`;

  // Generate TOC content for each version
  for (const [versionCode, version] of Object.entries(VERSIONS)) {
    const versionContentDir = path.join(__dirname, `../src/pages/content/${version.dir}`);
    const funcName = `getTOC${versionCode.replace(/_/g, '').replace(/^./, (c: string) => c.toUpperCase())}`;

    if (!fs.existsSync(versionContentDir)) {
      console.log(`⚠️  Skipping ${versionCode}: content dir not found — generating empty stub`);
      // Generate a stub function so the switch statement below compiles
      output += `function ${funcName}(): string {
  return "";
}

`;
      continue;
    }

    // Prefer the master TOC (single source of truth — preferred approach for 6_1 and all versions
    // that maintain a master index.md at the version content root).
    const masterTocPath = path.join(versionContentDir, 'index.md');
    if (fs.existsSync(masterTocPath)) {
      const content = fs.readFileSync(masterTocPath, 'utf-8');
      console.log(`✅ ${versionCode}: using master TOC (${masterTocPath})`);

      const escapedContent = content
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');

      output += `/**
 * Get TOC content for ${version.name}
 */
export function ${funcName}(): string {
  return \`${escapedContent}\`;
}

`;
      continue;
    }

    // Fall back to per-module index.md files (legacy approach for versions without a master TOC)
    const moduleIndexPaths: string[] = [];
    for (const entry of fs.readdirSync(versionContentDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const moduleIndexPath = path.join(versionContentDir, entry.name, 'index.md');
      if (fs.existsSync(moduleIndexPath)) {
        moduleIndexPaths.push(moduleIndexPath);
      }
    }

    moduleIndexPaths.sort(); // deterministic alphabetical order

    if (moduleIndexPaths.length === 0) {
      console.log(`⚠️  Skipping ${versionCode}: no master TOC or module index.md files found — generating empty stub`);
      output += `function ${funcName}(): string {
  return "";
}

`;
      continue;
    }

    // Concatenate all module index content into one string for this version
    const content = moduleIndexPaths
      .map(f => fs.readFileSync(f, 'utf-8'))
      .join('\n\n');

    // Escape the content for TypeScript string
    const escapedContent = content
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');

    output += `/**
 * Get TOC content for ${version.name}
 */
export function ${funcName}(): string {
  return \`${escapedContent}\`;
}

`;
  }

  // Add main function
  output += `/**
 * Get TOC content for a specific version
 */
export function getTOCContent(version: string): string {
  switch (version) {
`;

  for (const [versionCode, version] of Object.entries(VERSIONS)) {
    const funcName = `getTOC${versionCode.replace(/_/g, '').replace(/^./, (c: string) => c.toUpperCase())}`;
    output += `    case "${version.name}":
    case "${versionCode}":
      return ${funcName}();
`;
  }

  output += `    default:
      return getTOC61();
  }
}
`;

  // Write output
  const outputPath = path.join(__dirname, '../src/utils/indexContentMap.ts');
  const backupDir = path.join(__dirname, '../.cache/toc-backups');
  const backupPath = path.join(backupDir, 'indexContentMap.backup.ts');

  // Create backup
  if (fs.existsSync(outputPath)) {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.copyFileSync(outputPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);
  }

  fs.writeFileSync(outputPath, output);

  console.log(`\n✅ indexContentMap.ts generated successfully!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Versions processed: ${Object.keys(VERSIONS).length}\n`);
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2);
  const versionArg = args.find((arg: string) => !arg.startsWith('--'));
  const versionCode = versionArg ?? '6_1';

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TOC Sync Script - Single Source of Truth');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    // Generate navigationData.ts
    generateNavigationData(versionCode);

    // Generate indexContentMap.ts
    generateIndexContentMap();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ All files synced successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');
  } catch (error) {
    const err = error as Error;
    console.error('\n❌ Error syncing TOC:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { parseIndexMDX, generateNavigationData, generateIndexContentMap };
