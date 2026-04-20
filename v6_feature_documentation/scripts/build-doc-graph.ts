/**
 * Build-time Doc Graph Builder
 *
 * Parses index.md (master TOC) + all .md content files and outputs
 * public/doc-graph.json — a compact structural index that drives:
 *
 *   - Sidebar navigation (no page content fetch at boot)
 *   - Breadcrumbs (deterministic from TOC hierarchy)
 *   - Next / Prev navigation within sections
 *   - Related-page discovery (bounded 2-hop traversal)
 *   - Progressive disclosure (L0 → L1 → L2)
 *
 * Inspired by code-review-graph's metadata-first, incremental-update pattern.
 *
 * Usage:
 *   pnpm tsx --tsconfig scripts/tsconfig.json scripts/build-doc-graph.ts
 *   pnpm tsx --tsconfig scripts/tsconfig.json scripts/build-doc-graph.ts --incremental
 *
 * Output: public/doc-graph.json  (~50–120 KB for ~1,000 pages)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ─── Configuration ────────────────────────────────────────────────────────────

const REPO_ROOT    = process.cwd();
const CONTENT_ROOT = path.join(REPO_ROOT, 'src', 'pages', 'content', '6_1');
const TOC_FILE     = path.join(CONTENT_ROOT, 'index.md');
// Output to public/ so Vite copies it into dist/ during the build step.
// (Vite cleans dist/ before building, so writing directly to dist/ in prebuild
//  gets deleted.  The search-index.json uses the same public/ approach.)
const PUBLIC_DIR   = path.join(REPO_ROOT, 'public');
const OUTPUT_FILE  = path.join(PUBLIC_DIR, 'doc-graph.json');

// Active versions — extend this array when 6.1.1, 5.13, or NG content is ready.
// Currently only 6.1 is published; the graph builder uses the first entry.
const ACTIVE_VERSIONS = [
  { label: '6.1', path: '6_1' },
  // { label: '6.1.1', path: '6_1_1' },   // TODO: enable when content is ready
  // { label: '5.13',  path: '5_13'  },   // TODO: enable when content is ready
] as const;

const VERSION      = ACTIVE_VERSIONS[0].label;
const VERSION_PATH = ACTIVE_VERSIONS[0].path;

// Incremental: bounded link expansion to avoid runaway traversal
const MAX_LINK_HOPS   = 2;
const MAX_RELATED     = 100;
// Batch size for parallel parsing
const PARSE_BATCH     = 100;

const INCREMENTAL = process.argv.includes('--incremental');

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DocNode {
  id: string;                  // path-derived unique ID (e.g. "admin-6-1-users-user-management-6-1")
  navId: string;               // label-slugified ID compatible with tocParser (e.g. "user-management")
  filePath: string;            // /content/6_1/... (absolute content path)
  title: string;               // from H1 or first heading
  module: string;              // parent module ID
  moduleLabel: string;         // human-readable module label
  section: string;             // parent section ID
  sectionLabel: string;        // human-readable section label
  breadcrumbs: string[];       // ['Home', 'Module', 'Section', 'Page']
  headings: string[];          // H2/H3 headings for anchor links and search
  imageRefs: string[];         // image paths referenced in this file
  internalLinks: string[];     // /content/... paths linked from this file
  contentHash: string;         // SHA-256 of file content (incremental updates)
  wordCount: number;
  orderIndex: number;          // position within its section (for Next/Prev)
}

export interface DocEdge {
  source: string;              // source node ID
  target: string;              // target node ID
  kind: 'LINKS_TO' | 'CONTAINS' | 'PARENT_OF' | 'SIBLING' | 'NEXT' | 'PREV';
}

export interface DocGraphStats {
  modules: number;
  sections: number;
  pages: number;
  edges: number;
  builtAt: string;
}

export interface DocGraph {
  version: string;
  builtAt: string;
  stats: DocGraphStats;
  nodes: DocNode[];
  edges: DocEdge[];
}

// ─── TOC Parser ───────────────────────────────────────────────────────────────

interface TocPage {
  label: string;
  filePath: string;  // /content/6_1/...
  subPages?: TocPage[];
}

interface TocSection {
  id: string;
  label: string;
  pages: TocPage[];
}

interface TocModule {
  id: string;
  label: string;
  sections: TocSection[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[&/]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parse the master TOC (index.md) into a structured hierarchy.
 * Format: ## Module → ### Section → - Label → `/content/...`
 */
function parseTOC(tocContent: string): TocModule[] {
  const lines = tocContent.split('\n');
  const modules: TocModule[] = [];

  let currentModule: TocModule | null = null;
  let currentSection: TocSection | null = null;
  let myDashboard: TocModule | null = null;

  const myDashboardSections = new Set(['Getting Started', 'Application Overview', 'Dashboards']);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('>') || trimmed === '---') continue;

    // ## Module
    if (trimmed.startsWith('## ') && !trimmed.includes('---')) {
      const label = trimmed.slice(3).trim();

      if (myDashboardSections.has(label)) {
        // Collapse into My Dashboard super-module
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

    // ### Section
    if (trimmed.startsWith('###') && currentModule) {
      const label = trimmed.replace(/^#+\s+/, '').trim();
      currentSection = { id: slugify(label), label, pages: [] };
      currentModule.sections.push(currentSection);
      continue;
    }

    // - Label → path
    if (trimmed.startsWith('- ') && trimmed.includes('→') && currentModule) {
      const m = trimmed.match(/^-\s+(.+?)\s+→\s+(.+)$/);
      if (!m) continue;

      const label = m[1].trim();
      const rawPath = m[2].trim().replace(/`/g, '');

      const page: TocPage = { label, filePath: rawPath };

      // Auto-create a synthetic section for modules with no ### headers
      // (e.g. Vulnerability Management, Self-Service, Risk Register, Reports).
      if (!currentSection) {
        currentSection = { id: currentModule.id, label: currentModule.label, pages: [] };
        currentModule.sections.push(currentSection);
      }

      // Check indentation for nested pages (2-space indent = sub-page)
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

// ─── Content Parser ───────────────────────────────────────────────────────────

/**
 * Parse a single .md file for metadata. Does NOT load the full body.
 */
function parseContentFile(absolutePath: string): {
  title: string;
  headings: string[];
  imageRefs: string[];
  internalLinks: string[];
  wordCount: number;
  contentHash: string;
} {
  const raw   = fs.readFileSync(absolutePath, 'utf-8');
  const hash  = crypto.createHash('sha256').update(raw).digest('hex');

  // Strip YAML frontmatter
  let content = raw;
  const fmMatch = raw.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(\r?\n|$)/);
  if (fmMatch) content = raw.slice(fmMatch[0].length);

  const lines = content.split('\n');

  let title = '';
  const headings: string[] = [];
  const imageRefs: string[] = [];
  const internalLinks: string[] = [];

  for (const line of lines) {
    // Title from first H1
    if (!title && line.startsWith('# ')) {
      title = line.slice(2).trim();
      continue;
    }

    // H2/H3 headings
    if (line.startsWith('## ') || line.startsWith('### ')) {
      headings.push(line.replace(/^#+\s+/, '').trim());
      continue;
    }

    // Image references: ![alt](path)
    const imgMatches = line.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g);
    for (const m of imgMatches) {
      const src = m[1].split(' ')[0]; // strip title
      if (!src.startsWith('http')) imageRefs.push(src);
    }

    // Internal .md links: [text](/content/... or relative path)
    const linkMatches = line.matchAll(/\[[^\]]*\]\(([^)]+\.md[^)]*)\)/g);
    for (const m of linkMatches) {
      const href = m[1].split(' ')[0];
      if (!href.startsWith('http')) internalLinks.push(href);
    }
  }

  // Word count (rough)
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return { title, headings, imageRefs, internalLinks, wordCount, contentHash: hash };
}

// ─── Graph Builder ────────────────────────────────────────────────────────────

/**
 * Build the full doc graph from the TOC and content files.
 * If --incremental, skip unchanged files using contentHash.
 */
async function buildGraph(previousGraph: DocGraph | null): Promise<DocGraph> {
  console.log(`\n🔨 Building doc graph (${INCREMENTAL ? 'incremental' : 'full'})…\n`);

  const prevNodeMap = new Map<string, DocNode>(
    (previousGraph?.nodes ?? []).map(n => [n.filePath, n])
  );

  const modules = parseTOC(fs.readFileSync(TOC_FILE, 'utf-8'));
  console.log(`📋 TOC parsed: ${modules.length} modules`);

  const nodes: DocNode[] = [];
  const edges: DocEdge[] = [];
  const nodeById = new Map<string, DocNode>();

  let totalPages = 0;
  let skipped    = 0;
  let parsed     = 0;

  // Collect all pages with their context
  interface PageEntry {
    filePath: string;
    label: string;
    module: TocModule;
    section: TocSection;
    breadcrumbs: string[];
    orderIndex: number;
  }

  const pageEntries: PageEntry[] = [];
  // Track seen file paths to de-duplicate TOC entries that reference the same file
  // from multiple sections (the first occurrence wins).
  const seenFilePaths = new Set<string>();

  function collectPages(
    pages: TocPage[],
    mod: TocModule,
    sec: TocSection,
    parentCrumbs: string[],
    orderStart: number
  ): number {
    let idx = orderStart;
    for (const p of pages) {
      // De-duplicate: skip files already added from a different TOC section.
      if (seenFilePaths.has(p.filePath)) {
        if (p.subPages?.length) idx = collectPages(p.subPages, mod, sec, [...parentCrumbs, p.label], idx);
        continue;
      }
      seenFilePaths.add(p.filePath);

      const crumbs = [...parentCrumbs, p.label];
      pageEntries.push({
        filePath: p.filePath,
        label: p.label,
        module: mod,
        section: sec,
        breadcrumbs: crumbs,
        orderIndex: idx++,
      });
      if (p.subPages?.length) {
        idx = collectPages(p.subPages, mod, sec, crumbs, idx);
      }
    }
    return idx;
  }

  for (const mod of modules) {
    for (const sec of mod.sections) {
      collectPages(sec.pages, mod, sec, ['Home', mod.label, sec.label], 0);
    }
  }

  console.log(`📄 Total TOC entries: ${pageEntries.length}`);

  // Parse content in batches
  for (let i = 0; i < pageEntries.length; i += PARSE_BATCH) {
    const batch = pageEntries.slice(i, i + PARSE_BATCH);

    await Promise.all(
      batch.map(async (entry) => {
        totalPages++;

        // Resolve absolute path from /content/6_1/...
        const relPath   = entry.filePath.replace(/^\/content\/6_1\//, '');
        const absPath   = path.join(CONTENT_ROOT, relPath);

        // Path-derived unique node ID — prevents collisions from same-label pages
        // (e.g. many pages named "Overview"). Strip prefix and extension, then slugify.
        const pathSlug  = relPath.replace(/\.md$/, '').replace(/[/_.]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const nodeId    = pathSlug || `page-${totalPages}`;

        // Navigation-compatible ID: same algorithm as tocParser.convertToId(label).
        // This is what gets stored in selectedPage and passed to resolveMDXPathFromTOC.
        const navId     = slugify(entry.label) || nodeId;

        // Incremental: skip if hash unchanged
        if (INCREMENTAL && prevNodeMap.has(entry.filePath)) {
          const prevNode = prevNodeMap.get(entry.filePath)!;
          if (fs.existsSync(absPath)) {
            const currentHash = crypto
              .createHash('sha256')
              .update(fs.readFileSync(absPath))
              .digest('hex');
            if (currentHash === prevNode.contentHash) {
              nodes.push(prevNode);
              nodeById.set(prevNode.id, prevNode);
              skipped++;
              return;
            }
          }
        }

        // Parse file
        let meta = {
          title: entry.label,
          headings: [] as string[],
          imageRefs: [] as string[],
          internalLinks: [] as string[],
          wordCount: 0,
          contentHash: '',
        };

        if (fs.existsSync(absPath)) {
          try {
            meta = parseContentFile(absPath);
            parsed++;
          } catch (err) {
            console.warn(`⚠️  Parse error: ${absPath}: ${(err as Error).message}`);
          }
        } else {
          console.warn(`⚠️  File not found: ${absPath}`);
        }

        const node: DocNode = {
          id: nodeId,
          navId,
          filePath: entry.filePath,
          title: meta.title || entry.label,
          module: entry.module.id,
          moduleLabel: entry.module.label,
          section: entry.section.id,
          sectionLabel: entry.section.label,
          breadcrumbs: entry.breadcrumbs,
          headings: meta.headings,
          imageRefs: meta.imageRefs,
          internalLinks: meta.internalLinks,
          contentHash: meta.contentHash,
          wordCount: meta.wordCount,
          orderIndex: entry.orderIndex,
        };

        nodes.push(node);
        nodeById.set(nodeId, node);
      })
    );
  }

  // ── Build edges ──────────────────────────────────────────────────────────────

  const filePathToNodeId = new Map<string, string>(
    nodes.map(n => [n.filePath, n.id])
  );

  // Group by module/section for containment and sibling/next/prev edges
  const sectionGroups = new Map<string, DocNode[]>();
  const moduleGroups  = new Map<string, DocNode[]>();

  for (const node of nodes) {
    const sk = `${node.module}::${node.section}`;
    if (!sectionGroups.has(sk)) sectionGroups.set(sk, []);
    sectionGroups.get(sk)!.push(node);

    if (!moduleGroups.has(node.module)) moduleGroups.set(node.module, []);
    moduleGroups.get(node.module)!.push(node);
  }

  // CONTAINS (module → section), PARENT_OF (section → page)
  const seenModules = new Set<string>();
  for (const node of nodes) {
    if (!seenModules.has(node.module)) {
      seenModules.add(node.module);
    }
    edges.push({ source: node.module, target: node.id, kind: 'CONTAINS' });
  }

  // NEXT / PREV within each section (ordered by orderIndex)
  for (const [, sectionNodes] of sectionGroups) {
    const sorted = [...sectionNodes].sort((a, b) => a.orderIndex - b.orderIndex);
    for (let i = 0; i < sorted.length - 1; i++) {
      edges.push({ source: sorted[i].id,     target: sorted[i + 1].id, kind: 'NEXT' });
      edges.push({ source: sorted[i + 1].id, target: sorted[i].id,     kind: 'PREV' });
    }
  }

  // LINKS_TO (from internalLinks in page content)
  for (const node of nodes) {
    for (const link of node.internalLinks) {
      const targetId = filePathToNodeId.get(link);
      if (targetId && targetId !== node.id) {
        edges.push({ source: node.id, target: targetId, kind: 'LINKS_TO' });
      }
    }
  }

  // ── Stats ────────────────────────────────────────────────────────────────────

  const stats: DocGraphStats = {
    modules: [...seenModules].length,
    sections: sectionGroups.size,
    pages: nodes.length,
    edges: edges.length,
    builtAt: new Date().toISOString(),
  };

  console.log(`\n📊 Graph stats:`);
  console.log(`   Modules  : ${stats.modules}`);
  console.log(`   Sections : ${stats.sections}`);
  console.log(`   Pages    : ${stats.pages}`);
  console.log(`   Edges    : ${stats.edges}`);
  if (INCREMENTAL) {
    console.log(`   Parsed   : ${parsed}  (skipped unchanged: ${skipped})`);
  }

  return {
    version: VERSION,
    builtAt: stats.builtAt,
    stats,
    nodes,
    edges,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async function main() {
  console.log('🔨 build-doc-graph');
  console.log('══════════════════════════════════════════');

  if (!fs.existsSync(TOC_FILE)) {
    console.error(`❌ TOC file not found: ${TOC_FILE}`);
    process.exit(1);
  }

  // Load previous graph for incremental mode
  let prevGraph: DocGraph | null = null;
  if (INCREMENTAL && fs.existsSync(OUTPUT_FILE)) {
    try {
      prevGraph = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8')) as DocGraph;
      console.log(`♻️  Incremental: loaded previous graph (${prevGraph.nodes.length} nodes)`);
    } catch {
      console.warn('⚠️  Could not load previous graph — doing full rebuild');
    }
  }

  const graph = await buildGraph(prevGraph);

  // Duplicate node ID check — fail the build if path-based IDs collide
  const seenIds = new Map<string, string>();
  let dupCount = 0;
  for (const node of graph.nodes) {
    if (seenIds.has(node.id)) {
      console.error(`❌ Duplicate node ID "${node.id}": ${seenIds.get(node.id)} vs ${node.filePath}`);
      dupCount++;
    } else {
      seenIds.set(node.id, node.filePath);
    }
  }
  if (dupCount > 0) {
    console.error(`\n❌ ${dupCount} duplicate node IDs detected. Fix path collisions in the TOC.\n`);
    process.exit(1);
  }

  // Write output (public/ is created by Vite's dev server / always exists, but guard anyway)
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const json = JSON.stringify(graph, null, 2);
  fs.writeFileSync(OUTPUT_FILE, json, 'utf-8');

  const sizeKB = (Buffer.byteLength(json, 'utf-8') / 1024).toFixed(1);
  console.log(`\n✅ Written: ${OUTPUT_FILE}  (${sizeKB} KB)`);
  console.log('');
})();
