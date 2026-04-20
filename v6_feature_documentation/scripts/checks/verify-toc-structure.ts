#!/usr/bin/env tsx
/**
 * verify-toc-structure.ts
 *
 * Validates that the master TOC (src/pages/content/6_1/index.md) is consistent
 * with the actual files on disk and derived build artifacts.
 *
 * Checks:
 *   1. Every TOC path entry resolves to an existing .md file
 *   2. public/doc-graph.json exists and has expected stats (pages ≥ 300)
 *   3. public/search-index.json exists and has entries ≥ 300
 *   4. navigationData.ts exists and is non-empty
 *   5. No .mdx files remain under src/pages/content/6_1/
 *
 * Usage:
 *   pnpm tsx scripts/checks/verify-toc-structure.ts
 *   pnpm check:toc
 *
 * Exit codes:
 *   0 = all checks passed (or only warnings)
 *   1 = one or more ERROR findings
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const CONTENT_ROOT = path.join(ROOT, 'src', 'pages', 'content', '6_1')
const TOC_FILE = path.join(CONTENT_ROOT, 'index.md')

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = 'ERROR' | 'WARN' | 'OK'

interface Finding {
  name: string
  severity: Severity
  file: string
  message: string
  line?: number
}

const findings: Finding[] = []

function add(name: string, severity: Severity, file: string, message: string, line?: number): void {
  findings.push({ name, severity, file, message, line })
  const icon = severity === 'OK' ? '✅' : severity === 'WARN' ? '⚠️ ' : '❌'
  const loc = line != null ? `:${line}` : ''
  console.log(`${icon} [${name}] ${file}${loc}: ${message}`)
}

function pass(name: string, file: string, detail = 'OK'): void {
  add(name, 'OK', file, detail)
}

// ─── Check 1: Master TOC exists ───────────────────────────────────────────────

console.log('\n--- Check 1: Master TOC exists ---')
if (!fs.existsSync(TOC_FILE)) {
  add('toc-missing', 'ERROR', 'src/pages/content/6_1/index.md', 'Master TOC not found — this is the single source of truth for navigation')
  process.exit(1)
} else {
  pass('toc-exists', 'src/pages/content/6_1/index.md')
}

// ─── Check 2: TOC path entries resolve to files ───────────────────────────────

console.log('\n--- Check 2: TOC path entries resolve to .md files ---')

const tocContent = fs.readFileSync(TOC_FILE, 'utf-8')
const tocLines = tocContent.split('\n')

let missingFiles = 0
let resolvedFiles = 0

for (let i = 0; i < tocLines.length; i++) {
  const line = tocLines[i] ?? ''
  const trimmed = line.trim()

  // Match: - Label → /content/6_1/path/to/file.md
  const m = trimmed.match(/^-\s+.+?\s+→\s+(.+)$/)
  if (!m) continue

  const rawPath = (m[1] ?? '').trim().replace(/`/g, '')

  // Only check absolute /content/6_1/... paths
  if (!rawPath.startsWith('/content/6_1/')) continue

  // Resolve to absolute path
  const relPath = rawPath.replace(/^\/content\/6_1\//, '')
  const absPath = path.join(CONTENT_ROOT, relPath)

  if (!fs.existsSync(absPath)) {
    add('toc-file-missing', 'WARN', rawPath, `Referenced in TOC but file not found on disk`, i + 1)
    missingFiles++
  } else {
    resolvedFiles++
  }
}

if (missingFiles === 0) {
  pass('toc-all-files-present', 'index.md', `All ${resolvedFiles} TOC file references resolved`)
} else {
  console.log(`  ℹ️  ${resolvedFiles} resolved, ${missingFiles} missing`)
  if (missingFiles > 10) {
    add('toc-too-many-missing', 'ERROR', 'index.md', `${missingFiles} missing files is above the 10-file threshold — investigate before deploying`)
  }
}

// ─── Check 3: No .mdx files remain ───────────────────────────────────────────

console.log('\n--- Check 3: No .mdx files under src/pages/content/6_1/ ---')

function countMdxFiles(dir: string): string[] {
  const mdxFiles: string[] = []
  if (!fs.existsSync(dir)) return mdxFiles
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      mdxFiles.push(...countMdxFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      mdxFiles.push(fullPath)
    }
  }
  return mdxFiles
}

const mdxFiles = countMdxFiles(CONTENT_ROOT)
if (mdxFiles.length === 0) {
  pass('no-mdx-files', 'src/pages/content/6_1/', 'Zero .mdx files — migration complete')
} else {
  for (const f of mdxFiles.slice(0, 5)) {
    add('mdx-file-found', 'ERROR', path.relative(ROOT, f), 'Unconverted .mdx file found — run rename-mdx-to-md script')
  }
  if (mdxFiles.length > 5) {
    add('mdx-files-count', 'ERROR', 'src/pages/content/6_1/', `${mdxFiles.length} total .mdx files remain — run pnpm tsx scripts/rename-mdx-to-md.ts`)
  }
}

// ─── Check 4: public/doc-graph.json exists and is valid ────────────────────────

console.log('\n--- Check 4: public/doc-graph.json exists and is valid ---')

// doc-graph lives in public/ so Vite can copy it to dist/ during the build step.
// (Vite cleans dist/ before building; public/ persists.)
const docGraphPath = path.join(ROOT, 'public', 'doc-graph.json')
if (!fs.existsSync(docGraphPath)) {
  add('doc-graph-missing', 'WARN', 'public/doc-graph.json', 'Not found — run pnpm build-doc-graph (or pnpm build) to generate')
} else {
  try {
    const graph = JSON.parse(fs.readFileSync(docGraphPath, 'utf-8')) as {
      stats?: { pages?: number; modules?: number; sections?: number; edges?: number }
    }
    const stats = graph.stats
    if (!stats) {
      add('doc-graph-no-stats', 'ERROR', 'public/doc-graph.json', 'Missing stats object — file may be malformed')
    } else {
      const pages = stats.pages ?? 0
      const modules = stats.modules ?? 0
      const edges = stats.edges ?? 0
      if (pages < 360) {
        add('doc-graph-low-pages', 'ERROR', 'public/doc-graph.json', `pages=${pages} is below minimum threshold of 360 — rebuild required`)
      } else {
        pass('doc-graph-valid', 'public/doc-graph.json', `modules=${modules}, pages=${pages}, edges=${edges}`)
      }
    }
  } catch {
    add('doc-graph-parse-error', 'ERROR', 'public/doc-graph.json', 'Failed to parse as JSON — file may be corrupted')
  }
}

// ─── Check 5: public/search-index.json exists and has entries ────────────────

console.log('\n--- Check 5: public/search-index.json exists and has entries ---')

const searchIndexPath = path.join(ROOT, 'public', 'search-index.json')
if (!fs.existsSync(searchIndexPath)) {
  add('search-index-missing', 'WARN', 'public/search-index.json', 'Not found — run pnpm build-search-index to generate')
} else {
  try {
    const entries = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8')) as unknown[]
    if (!Array.isArray(entries)) {
      add('search-index-not-array', 'ERROR', 'public/search-index.json', 'Expected an array — file may be malformed')
    } else if (entries.length < 360) {
      add('search-index-low-entries', 'ERROR', 'public/search-index.json', `${entries.length} entries is below minimum threshold of 360 — rebuild required`)
    } else {
      pass('search-index-valid', 'public/search-index.json', `${entries.length} entries`)
    }
  } catch {
    add('search-index-parse-error', 'ERROR', 'public/search-index.json', 'Failed to parse as JSON — file may be corrupted')
  }
}

// ─── Check 6: navigationData.ts is non-empty and has correct modules ─────────

console.log('\n--- Check 6: navigationData.ts exists and has modules ---')

const navDataPath = path.join(ROOT, 'src', 'data', 'navigationData.ts')
if (!fs.existsSync(navDataPath)) {
  add('nav-data-missing', 'ERROR', 'src/data/navigationData.ts', 'Not found — run pnpm sync-toc to generate')
} else {
  const navContent = fs.readFileSync(navDataPath, 'utf-8')
  const moduleMatches = navContent.match(/\{ id: "[^"]+", label: "[^"]+" \}/g) ?? []
  if (moduleMatches.length < 5) {
    add('nav-data-too-few-modules', 'ERROR', 'src/data/navigationData.ts',
      `Only ${moduleMatches.length} modules found — expected ≥ 5. Run pnpm sync-toc to regenerate.`)
  } else {
    // Check for known bogus module IDs in the modules array only.
    // These IDs appear as top-level module entries when sync-toc accidentally reads per-module
    // index.md stubs instead of the master TOC.
    // Pattern: `{ id: "dashboard"` — the leading `{` only appears in the modules array,
    // not in the nested section/page data where the pattern is `    id: "dashboard",`.
    const bogusMods = ['overview', 'dashboard', 'run-a-scan', 'recent-scans']
    const hasBogusMods = bogusMods.some(m => navContent.includes(`{ id: "${m}"`))
    if (hasBogusMods) {
      add('nav-data-bogus-modules', 'ERROR', 'src/data/navigationData.ts',
        'Contains Discovery Scan sub-sections as top-level modules. Delete discovery_6_1/index.md stubs and run pnpm sync-toc.')
    } else {
      pass('nav-data-valid', 'src/data/navigationData.ts', `${moduleMatches.length} modules`)
    }
  }
}

// ─── Check 7: doc-graph node ID uniqueness (graph integrity for future integration) ───

console.log('\n--- Check 7: doc-graph node ID uniqueness ---')

if (fs.existsSync(docGraphPath)) {
  try {
    const graph = JSON.parse(fs.readFileSync(docGraphPath, 'utf-8')) as {
      nodes?: Array<{ id: string; filePath: string }>
    }
    const nodes = graph.nodes ?? []
    const idCounts = new Map<string, number>()
    for (const n of nodes) idCounts.set(n.id, (idCounts.get(n.id) ?? 0) + 1)
    const dupeIds = [...idCounts.entries()].filter(([, count]) => count > 1)
    if (dupeIds.length === 0) {
      pass('doc-graph-unique-ids', 'public/doc-graph.json', `All ${nodes.length} node IDs are unique`)
    } else {
      add(
        'doc-graph-duplicate-ids',
        'WARN',
        'public/doc-graph.json',
        `${dupeIds.length} duplicate node IDs detected (e.g. ${dupeIds.slice(0, 3).map(([id]) => `"${id}"`).join(', ')}). ` +
        `Node IDs must be unique before docGraph.ts integration. Fix: use path-based IDs in build-doc-graph.ts`
      )
    }
  } catch {
    // parse error already reported in check 4
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

const errors = findings.filter(f => f.severity === 'ERROR')
const warnings = findings.filter(f => f.severity === 'WARN')
const oks = findings.filter(f => f.severity === 'OK')

console.log(`\n${'═'.repeat(60)}`)
console.log(`TOC structure check: ${oks.length} OK, ${warnings.length} warnings, ${errors.length} errors\n`)

if (warnings.length > 0) {
  console.log('Warnings (investigate manually):')
  for (const w of warnings) {
    console.log(`  ⚠️  [${w.name}] ${w.file}: ${w.message}`)
  }
}

if (errors.length > 0) {
  console.log('\nErrors (must fix):')
  for (const e of errors) {
    console.log(`  ❌ [${e.name}] ${e.file}: ${e.message}`)
  }
  console.log('\nTOC structure check FAILED.')
  process.exit(1)
}

console.log('TOC structure check passed.')
process.exit(0)
