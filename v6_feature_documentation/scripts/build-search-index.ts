/**
 * build-search-index.ts
 *
 * Generates public/search-index.json from the master TOC (index.md).
 * Covers ALL pages referenced in the TOC (~370+ entries) — not just
 * the small set previously indexed from navigationData.ts.
 *
 * Run via: pnpm build-search-index
 * Integrated into: pnpm prebuild (runs after build-doc-graph)
 *
 * Output: public/search-index.json
 * Format: SearchIndexEntry[]
 *
 * Token-efficiency contract:
 *   - Only structural metadata is stored (title, headings, excerpt, breadcrumb)
 *   - Full page bodies are NOT included — loaded on demand at runtime
 *   - search-index.json is loaded lazily by the search UI on first search
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import * as crypto from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchIndexEntry {
  /** Unique path-derived ID (used as React key and for deduplication). */
  id: string;
  /** Label-slugified ID for in-app navigation (matches doc-graph navId and useDocGraphNav page.id). */
  navId: string;
  title: string;
  module: string;
  moduleLabel: string;
  section: string;
  sectionLabel: string;
  filePath: string;        // /content/6_1/...
  headings: string[];      // H2/H3 headings
  headingIds: string[];    // slugified heading IDs (for anchor links)
  excerpt: string;         // first 280 chars of body text (falls back to title if empty)
  breadcrumb: string;      // "Module > Section > Page"
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const REPO_ROOT    = process.cwd();
const CONTENT_ROOT = join(REPO_ROOT, 'src', 'pages', 'content', '6_1');
const TOC_FILE     = join(CONTENT_ROOT, 'index.md');
const PUBLIC_DIR   = join(REPO_ROOT, 'public');
const OUTPUT_FILE  = join(PUBLIC_DIR, 'search-index.json');

// ─── TOC Parser (mirrors build-doc-graph logic) ───────────────────────────────

interface TocPage { label: string; filePath: string; subPages?: TocPage[] }
interface TocSection { id: string; label: string; pages: TocPage[] }
interface TocModule  { id: string; label: string; sections: TocSection[] }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[&/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTOC(tocContent: string): TocModule[] {
  const lines   = tocContent.split('\n');
  const modules: TocModule[] = [];
  let currentModule:  TocModule  | null = null;
  let currentSection: TocSection | null = null;
  let myDashboard:    TocModule  | null = null;

  const myDashboardSections = new Set(['Getting Started', 'Application Overview', 'Dashboards']);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('>') || trimmed === '---') continue;

    if (trimmed.startsWith('## ') && !trimmed.includes('---')) {
      const label = trimmed.slice(3).trim();
      if (myDashboardSections.has(label)) {
        if (!myDashboard) {
          myDashboard = { id: 'my-dashboard', label: 'My Dashboard', sections: [] };
          modules.push(myDashboard);
        }
        currentModule  = myDashboard;
        currentSection = { id: slugify(label), label, pages: [] };
        currentModule.sections.push(currentSection);
        continue;
      }
      currentModule  = { id: slugify(label), label, sections: [] };
      currentSection = null;
      modules.push(currentModule);
      continue;
    }

    if (trimmed.startsWith('###') && currentModule) {
      const label    = trimmed.replace(/^#+\s+/, '').trim();
      currentSection = { id: slugify(label), label, pages: [] };
      currentModule.sections.push(currentSection);
      continue;
    }

    if (trimmed.startsWith('- ') && trimmed.includes('→') && currentModule) {
      const m = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (!m) continue;
      const label   = m[1].trim();
      const rawPath = m[2].trim().replace(/`/g, '');
      const page: TocPage = { label, filePath: rawPath };

      // Auto-create a synthetic section for modules with no ### headers
      // (e.g. Vulnerability Management, Self-Service, Risk Register, Reports).
      if (!currentSection) {
        currentSection = { id: currentModule.id, label: currentModule.label, pages: [] };
        currentModule.sections.push(currentSection);
      }

      const indent = line.search(/\S/);
      if (indent >= 2 && currentSection.pages.length > 0) {
        const parent = currentSection.pages[currentSection.pages.length - 1];
        if (!parent.subPages) parent.subPages = [];
        parent.subPages.push(page);
      } else {
        currentSection.pages.push(page);
      }
    }
  }

  return modules;
}

// ─── Markdown utilities ───────────────────────────────────────────────────────

function stripFrontmatter(content: string): string {
  const m = content.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n|$)/);
  return m ? content.slice(m[0].length) : content;
}

function extractTitle(content: string, fallback: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1]!.trim() : fallback;
}

function generateSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractHeadings(content: string): { texts: string[]; ids: string[] } {
  const matches = [...content.matchAll(/^#{2,3}\s+(.+)$/gm)];
  const texts   = matches.map(m => m[1]!.trim()).slice(0, 10);
  return { texts, ids: texts.map(generateSlug) };
}

function extractExcerpt(content: string, maxLen = 280): string {
  return content
    .replace(/^#{1,6}\s+.+$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[*_~>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLen);
}

// ─── Page collector ───────────────────────────────────────────────────────────

interface PageEntry {
  label: string;
  filePath: string;
  module: TocModule;
  section: TocSection;
  breadcrumbs: string[];
}

function collectPages(
  pages: TocPage[],
  mod: TocModule,
  sec: TocSection,
  parentCrumbs: string[],
  out: PageEntry[]
): void {
  for (const p of pages) {
    const crumbs = [...parentCrumbs, p.label];
    out.push({ label: p.label, filePath: p.filePath, module: mod, section: sec, breadcrumbs: crumbs });
    if (p.subPages?.length) collectPages(p.subPages, mod, sec, crumbs, out);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function buildIndex(): void {
  console.log('🔍 Building search index from master TOC…\n');

  if (!existsSync(TOC_FILE)) {
    console.error(`❌ TOC file not found: ${TOC_FILE}`);
    process.exit(1);
  }

  const tocContent = readFileSync(TOC_FILE, 'utf-8');
  const modules    = parseTOC(tocContent);
  console.log(`📋 TOC modules: ${modules.length}`);

  // Collect all TOC page entries
  const pageEntries: PageEntry[] = [];
  for (const mod of modules) {
    for (const sec of mod.sections) {
      collectPages(sec.pages, mod, sec, [mod.label, sec.label], pageEntries);
    }
  }
  console.log(`📄 TOC pages: ${pageEntries.length}`);

  const index: SearchIndexEntry[] = [];
  const seenFilePaths = new Set<string>(); // guards against same file appearing multiple times in TOC
  let   skipped = 0;
  let   indexed = 0;

  for (const entry of pageEntries) {
    // Resolve absolute path from /content/6_1/... URL
    const relPath  = entry.filePath.replace(/^\/content\/6_1\//, '');
    const absPath  = join(CONTENT_ROOT, relPath);

    // Skip duplicate file paths (same page referenced from multiple TOC sections)
    if (seenFilePaths.has(entry.filePath)) {
      skipped++;
      continue;
    }
    seenFilePaths.add(entry.filePath);

    if (!existsSync(absPath)) {
      console.warn(`  ⚠️ Not found: ${relPath}`);
      skipped++;
      continue;
    }

    const raw     = readFileSync(absPath, 'utf-8');
    const body    = stripFrontmatter(raw);
    const title   = extractTitle(body, entry.label);
    const { texts: headings, ids: headingIds } = extractHeadings(body);
    // Excerpt falls back to title when no extractable body text exists
    // (e.g. pages that contain only images, tables, or very short content)
    const rawExcerpt = extractExcerpt(body);
    const excerpt    = rawExcerpt || title;

    // Path-based unique ID — prevents duplicate IDs from same-name pages across modules
    // (e.g. every module has an "Overview" page; slugify("Overview") = "overview" for all)
    const pathSlug = relPath
      .replace(/\.md$/, '')
      .replace(/[/_.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const entryId = pathSlug || `page-${indexed}`;
    // navId = label-slug for in-app navigation (matches useDocGraphNav page.id)
    const navId = slugify(entry.label) || entryId;

    index.push({
      id:           entryId,
      navId,
      title,
      module:       entry.module.id,
      moduleLabel:  entry.module.label,
      section:      entry.section.id,
      sectionLabel: entry.section.label,
      filePath:     entry.filePath,
      headings,
      headingIds,
      excerpt,
      breadcrumb:   entry.breadcrumbs.join(' > '),
    });

    indexed++;
  }

  // Write output
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), 'utf-8');

  const sizeKB = (Buffer.byteLength(JSON.stringify(index), 'utf-8') / 1024).toFixed(1);

  console.log(`\n📊 Search Index Summary`);
  console.log(`═══════════════════════════════`);
  console.log(`  Entries indexed : ${index.length}`);
  console.log(`  Entries skipped : ${skipped}`);
  console.log(`  Output          : ${OUTPUT_FILE}  (${sizeKB} KB)`);
  console.log(`\n✅ Done.`);
}

buildIndex();
