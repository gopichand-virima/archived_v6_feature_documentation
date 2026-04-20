/**
 * Doc Graph Runtime Client
 *
 * Loads public/doc-graph.json (copied to dist/ by Vite) ONCE per session, caches it, and exposes
 * pure-function accessors for navigation, breadcrumbs, search, and
 * progressive disclosure.
 *
 * Token-efficiency contract:
 *   L0  — graph metadata only (~100 tokens, loaded at boot)
 *   L1  — section page list   (~200–500 tokens, loaded on sidebar expand)
 *   L2  — full page content   (~1–5K tokens, loaded on page navigate)
 *
 * No page body is ever loaded by this module — only structural metadata.
 */

import { getBasePath } from './basePath';

// ─── Re-export types ──────────────────────────────────────────────────────────

export interface DocNode {
  id: string;       // path-derived unique ID (e.g. "admin-6-1-users-user-management-6-1")
  navId: string;    // label-slugified ID compatible with tocParser (e.g. "user-management")
  filePath: string;
  title: string;
  module: string;
  moduleLabel: string;
  section: string;
  sectionLabel: string;
  breadcrumbs: string[];
  headings: string[];
  imageRefs: string[];
  internalLinks: string[];
  contentHash: string;
  wordCount: number;
  orderIndex: number;
}

export interface DocEdge {
  source: string;
  target: string;
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

// ─── Internal indexes (populated once after load) ─────────────────────────────

let graphCache: DocGraph | null = null;
let nodeById:         Map<string, DocNode>   | null = null;
let nodeByFilePath:   Map<string, DocNode>   | null = null;
let nodesByModule:    Map<string, DocNode[]> | null = null;
let nodesBySection:   Map<string, DocNode[]> | null = null; // key: `${module}::${section}`
let edgesBySource:    Map<string, DocEdge[]> | null = null;

let loadPromise: Promise<DocGraph> | null = null;

function buildIndexes(graph: DocGraph): void {
  nodeById       = new Map(graph.nodes.map(n => [n.id, n]));
  nodeByFilePath = new Map(graph.nodes.map(n => [n.filePath, n]));

  nodesByModule  = new Map();
  nodesBySection = new Map();
  edgesBySource  = new Map();

  for (const node of graph.nodes) {
    // Module index
    const mList = nodesByModule!.get(node.module) ?? [];
    mList.push(node);
    nodesByModule!.set(node.module, mList);

    // Section index (scoped to module)
    const sk = `${node.module}::${node.section}`;
    const sList = nodesBySection!.get(sk) ?? [];
    sList.push(node);
    nodesBySection!.set(sk, sList);
  }

  for (const edge of graph.edges) {
    const eList = edgesBySource!.get(edge.source) ?? [];
    eList.push(edge);
    edgesBySource!.set(edge.source, eList);
  }
}

// ─── Load / cache ─────────────────────────────────────────────────────────────

/**
 * Load and cache the doc graph. Safe to call multiple times — returns
 * the cached instance after the first load.
 */
export async function loadDocGraph(): Promise<DocGraph> {
  if (graphCache) return graphCache;

  // Deduplicate concurrent calls
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const basePath = getBasePath();
    const url      = `${basePath}/doc-graph.json`;

    console.log(`📦 [docGraph] Loading ${url}`);

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`[docGraph] Failed to fetch doc-graph.json: HTTP ${resp.status}`);
    }

    const graph = (await resp.json()) as DocGraph;
    buildIndexes(graph);
    graphCache  = graph;
    loadPromise = null;

    console.log(
      `✅ [docGraph] Loaded: ${graph.stats.modules} modules, ` +
      `${graph.stats.sections} sections, ${graph.stats.pages} pages`
    );

    return graph;
  })();

  return loadPromise;
}

/** Clear the cached graph (useful for hot-reload in dev). */
export function clearDocGraphCache(): void {
  graphCache    = null;
  nodeById      = null;
  nodeByFilePath= null;
  nodesByModule = null;
  nodesBySection= null;
  edgesBySource = null;
  loadPromise   = null;
  console.log('🧹 [docGraph] Cache cleared');
}

// ─── L0: Graph metadata ───────────────────────────────────────────────────────

/**
 * L0 — Return graph stats without loading any page content.
 * Cost: ~0 tokens (uses cached graph).
 */
export async function getGraphStats(): Promise<DocGraphStats | null> {
  const graph = await loadDocGraph().catch(() => null);
  return graph?.stats ?? null;
}

/**
 * Return the distinct module IDs and labels from the graph.
 */
export async function getModuleList(): Promise<Array<{ id: string; label: string }>> {
  const graph = await loadDocGraph();
  const seen  = new Map<string, string>();
  for (const n of graph.nodes) seen.set(n.module, n.moduleLabel);
  return [...seen.entries()].map(([id, label]) => ({ id, label }));
}

// ─── L1: Section page lists ───────────────────────────────────────────────────

/**
 * L1 — Return all nodes for a module, sorted by section then orderIndex.
 * Cost: metadata only, no body content.
 */
export async function getModuleNodes(moduleId: string): Promise<DocNode[]> {
  await loadDocGraph();
  return (nodesByModule?.get(moduleId) ?? [])
    .slice()
    .sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.orderIndex - b.orderIndex;
    });
}

/**
 * L1 — Return all nodes for a specific section within a module.
 */
export async function getSectionNodes(moduleId: string, sectionId: string): Promise<DocNode[]> {
  await loadDocGraph();
  const key = `${moduleId}::${sectionId}`;
  return (nodesBySection?.get(key) ?? [])
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Return distinct sections for a module as `{ id, label }` pairs.
 */
export async function getModuleSections(
  moduleId: string
): Promise<Array<{ id: string; label: string }>> {
  const nodes = await getModuleNodes(moduleId);
  const seen  = new Map<string, string>();
  for (const n of nodes) seen.set(n.section, n.sectionLabel);
  return [...seen.entries()].map(([id, label]) => ({ id, label }));
}

// ─── L2 helpers (navigation) ─────────────────────────────────────────────────

/**
 * Look up a node by its ID.
 */
export async function getNodeById(id: string): Promise<DocNode | null> {
  await loadDocGraph();
  return nodeById?.get(id) ?? null;
}

/**
 * Look up a node by its content file path.
 */
export async function getNodeByFilePath(filePath: string): Promise<DocNode | null> {
  await loadDocGraph();
  return nodeByFilePath?.get(filePath) ?? null;
}

/**
 * Return breadcrumb trail for a page node.
 * Derived deterministically from the TOC hierarchy — never from frontmatter.
 */
export async function getBreadcrumbs(nodeId: string): Promise<string[]> {
  const node = await getNodeById(nodeId);
  return node?.breadcrumbs ?? [];
}

/**
 * Return the next page in section order (NEXT edge).
 */
export async function getNextNode(nodeId: string): Promise<DocNode | null> {
  await loadDocGraph();
  const nextEdge = (edgesBySource?.get(nodeId) ?? []).find(e => e.kind === 'NEXT');
  return nextEdge ? (nodeById?.get(nextEdge.target) ?? null) : null;
}

/**
 * Return the previous page in section order (PREV edge).
 */
export async function getPrevNode(nodeId: string): Promise<DocNode | null> {
  await loadDocGraph();
  const prevEdge = (edgesBySource?.get(nodeId) ?? []).find(e => e.kind === 'PREV');
  return prevEdge ? (nodeById?.get(prevEdge.target) ?? null) : null;
}

/**
 * Return pages that link TO the given node (bounded to MAX_RELATED).
 * Useful for "See also" sections.
 */
export async function getRelatedNodes(nodeId: string, maxResults = 10): Promise<DocNode[]> {
  const graph = await loadDocGraph();
  const related: DocNode[] = [];

  for (const edge of graph.edges) {
    if (edge.kind === 'LINKS_TO' && edge.target === nodeId) {
      const n = nodeById?.get(edge.source);
      if (n) related.push(n);
      if (related.length >= maxResults) break;
    }
  }

  return related;
}

// ─── Search support ───────────────────────────────────────────────────────────

/**
 * Simple in-graph keyword search across titles and headings.
 * For full-text search (including excerpts), use the search-index.json instead.
 *
 * Returns nodes sorted by relevance (title match > heading match).
 */
export async function searchNodes(
  query: string,
  maxResults = 20
): Promise<Array<{ node: DocNode; score: number }>> {
  const graph = await loadDocGraph();
  const q     = query.toLowerCase().trim();
  if (!q) return [];

  const results: Array<{ node: DocNode; score: number }> = [];

  for (const node of graph.nodes) {
    let score = 0;

    // Exact title match
    if (node.title.toLowerCase() === q)           score += 100;
    // Title contains query
    else if (node.title.toLowerCase().includes(q)) score += 50;

    // Heading match
    for (const h of node.headings) {
      if (h.toLowerCase().includes(q)) score += 10;
    }

    // Module/section match
    if (node.moduleLabel.toLowerCase().includes(q)) score += 5;
    if (node.sectionLabel.toLowerCase().includes(q)) score += 5;

    if (score > 0) results.push({ node, score });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

// ─── Incremental update helper (for watch mode) ───────────────────────────────

/**
 * Invalidate a single node in the cache by file path.
 * The next call to loadDocGraph() will re-fetch the graph.
 * In production, the graph is rebuilt at CI time; this is for dev watch mode.
 */
export function invalidateNode(filePath: string): void {
  if (!graphCache) return;
  const existing = nodeByFilePath?.get(filePath);
  if (existing) {
    console.log(`♻️  [docGraph] Invalidated: ${filePath}`);
    clearDocGraphCache();
  }
}
