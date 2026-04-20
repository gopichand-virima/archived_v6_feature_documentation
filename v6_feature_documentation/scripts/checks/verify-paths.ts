#!/usr/bin/env tsx
/**
 * verify-paths.ts
 *
 * Path contract validator for v6_feature_documentation.
 *
 * Enforces the canonical path conventions documented in CLAUDE.md:
 *   - PRD source path: C:\github\v6_prds\src\pages\6_1\ (NO v-prefix)
 *   - Generated docs:  src/pages/content/6_1\  (NOT src/content\ or src/pages\)
 *   - Build output:    dist\  (NOT build\)
 *   - Package manager: pnpm  (NOT npm or yarn)
 *
 * Scans source files for legacy path references and structural violations
 * that are hard to catch at runtime but break the build pipeline.
 *
 * Usage:
 *   pnpm check:paths
 *   tsx scripts/checks/verify-paths.ts
 *
 * Exit codes:
 *   0 = all checks passed (or only warnings)
 *   1 = one or more ERROR findings
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')

type Severity = 'ERROR' | 'WARN' | 'OK'

interface Finding {
  name: string
  severity: Severity
  file: string
  message: string
  line?: number
}

const findings: Finding[] = []

function addFinding(
  name: string,
  severity: Severity,
  file: string,
  message: string,
  line?: number,
): void {
  findings.push({ name, severity, file, message, line })
  const icon = severity === 'OK' ? '✅' : severity === 'WARN' ? '⚠️ ' : '❌'
  const loc = line != null ? `:${line}` : ''
  console.log(`${icon} [${name}] ${file}${loc}: ${message}`)
}

function pass(name: string, file: string): void {
  addFinding(name, 'OK', file, 'OK')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Scan a single file for a regex pattern and return all matching line numbers.
 */
function scanFile(filePath: string, pattern: RegExp): { line: number; text: string }[] {
  if (!fs.existsSync(filePath)) return []
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  const hits: { line: number; text: string }[] = []
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      hits.push({ line: i + 1, text: lines[i].trim() })
    }
  }
  return hits
}

/**
 * Walk a directory recursively and collect all files matching the given
 * extension list. Skips node_modules, .git, dist, build.
 */
function walkFiles(
  dir: string,
  exts: string[],
  results: string[] = [],
): string[] {
  if (!fs.existsSync(dir)) return results
  const skip = new Set(['node_modules', '.git', 'dist', 'build', '.pnpm-store'])
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(full, exts, results)
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      results.push(full)
    }
  }
  return results
}

// ─── Check 1: No legacy v6_1 path references ─────────────────────────────────
//
// The correct PRD source path is 6_1 (no v-prefix). The legacy v6_1 must never
// appear in imports, path strings, or workflow files that reference the actual
// source directory. We exclude docs/archive and note-style comments.

function checkLegacyV6_1Paths(): void {
  console.log('\n--- Check 1: Legacy v6_1 path references (must be 6_1) ---')

  // Files to scan: TypeScript source, workflows, CLAUDE.md, memory JSON.
  // Exclude this script itself (it contains the pattern as regex literals in comments
  // and error messages).
  const thisScript = path.resolve(__filename)

  const targets = [
    ...walkFiles(path.join(ROOT, 'src'), ['.ts', '.tsx']),
    ...walkFiles(path.join(ROOT, 'scripts'), ['.ts']).filter(
      f => f !== thisScript,
    ),
    ...walkFiles(path.join(ROOT, '.github', 'workflows'), ['.yml', '.yaml']),
    path.join(ROOT, 'CLAUDE.md'),
    path.join(ROOT, 'docs', 'memory', 'repo-memory.json'),
  ]

  // Pattern: v6_1/ appearing in a path context (not in a quoted comment or
  // "no v-prefix" clarification). We look for the literal string /v6_1/ or
  // \v6_1\ to catch real path usage. A bare word "v6_1" in normal prose is
  // less dangerous, but we flag it as WARN for manual review.
  const pathPattern = /[/\\]v6_1[/\\]/g
  const barePattern = /\bv6_1\b/g

  let anyError = false
  let anyWarn = false

  for (const file of targets) {
    if (!fs.existsSync(file)) continue

    // Skip archive docs — they may legitimately document the old path
    if (file.includes('docs' + path.sep + 'archive')) continue

    const pathHits = scanFile(file, pathPattern)
    const rel = path.relative(ROOT, file)

    for (const hit of pathHits) {
      addFinding('legacy-v6_1-path', 'ERROR', rel, `Contains /v6_1/ path — must be /6_1/ (line: "${hit.text}")`, hit.line)
      anyError = true
    }

    // If no slash-delimited hits, check bare word WARN
    if (pathHits.length === 0) {
      const bareHits = scanFile(file, barePattern)
      for (const hit of bareHits) {
        // Allow references in WARN-level prose (e.g., "no v6_1 prefix") — these
        // are documentation about the rule, not actual path usage.
        const lower = hit.text.toLowerCase()
        const isExplanatory =
          lower.includes('no v') ||
          lower.includes('without v') ||
          lower.includes('not v6_1') ||
          lower.includes('v6_1 → 6_1') ||
          lower.includes('v6_1 maps') ||
          lower.includes('strip') ||
          lower.includes('defensive') ||
          lower.includes('// v6_1') ||
          lower.includes('# v6_1')
        if (!isExplanatory) {
          addFinding('legacy-v6_1-bare', 'WARN', rel, `Contains bare "v6_1" reference — verify this is not a path (line: "${hit.text}")`, hit.line)
          anyWarn = true
        }
      }
    }
  }

  if (!anyError && !anyWarn) {
    pass('legacy-v6_1-path', 'all source files')
  }
}

// ─── Check 2: No src/content/ directory (must be src/pages/content/) ─────────

function checkNoSrcContentDir(): void {
  console.log('\n--- Check 2: No src/content/ directory (must be src/pages/content/) ---')

  const wrongDir = path.join(ROOT, 'src', 'content')
  if (fs.existsSync(wrongDir)) {
    addFinding(
      'wrong-content-dir',
      'ERROR',
      'src/content',
      'src/content/ exists — this is the legacy path. Content must live at src/pages/content/',
    )
  } else {
    pass('wrong-content-dir', 'src/')
  }

  // Also scan source imports for any 'from "*/src/content/' pattern
  const importPattern = /from ['"]([^'"]*\/src\/content\/[^'"]*)['"]/g
  const targets = walkFiles(path.join(ROOT, 'src'), ['.ts', '.tsx'])
  let anyHit = false
  for (const file of targets) {
    const hits = scanFile(file, importPattern)
    const rel = path.relative(ROOT, file)
    for (const hit of hits) {
      addFinding('wrong-content-import', 'ERROR', rel, `Import from src/content/ — must be src/pages/content/ (line: "${hit.text}")`, hit.line)
      anyHit = true
    }
  }
  if (!anyHit) {
    pass('wrong-content-import', 'all imports')
  }
}

// ─── Check 3: Build output must be dist/ not build/ ──────────────────────────

function checkBuildOutputDir(): void {
  console.log('\n--- Check 3: Build output directory (must be dist/, not build/) ---')

  // Only flag build/ if it is git-tracked (a local untracked/gitignored
  // build artifact is harmless — it just means someone ran an old build command).
  let buildTracked = false
  try {
    const out = execSync('git ls-files build/', { cwd: ROOT, encoding: 'utf-8' }).trim()
    buildTracked = out.length > 0
  } catch {
    // git not available — fall back to filesystem check
    buildTracked = fs.existsSync(path.join(ROOT, 'build'))
  }

  if (buildTracked) {
    addFinding(
      'wrong-build-dir',
      'ERROR',
      'build/',
      'build/ is tracked by git — Vite builds to dist/, not build/. Run: git rm -r --cached build/ && echo build/ >> .gitignore',
    )
  } else {
    pass('no-build-dir', 'build/')
  }

  // Check vite.config.ts doesn't override outDir to 'build'
  const viteConfig = path.join(ROOT, 'vite.config.ts')
  if (fs.existsSync(viteConfig)) {
    const hits = scanFile(viteConfig, /outDir.*['"]build['"]/g)
    const rel = path.relative(ROOT, viteConfig)
    if (hits.length > 0) {
      addFinding('vite-wrong-outdir', 'ERROR', rel, 'vite.config.ts sets outDir to "build" — must be "dist" (or unset, defaulting to dist)')
    } else {
      pass('vite-outdir', rel)
    }
  }

  // Scan CI workflows for 'build/' references in artifact paths
  const workflowDir = path.join(ROOT, '.github', 'workflows')
  const workflows = walkFiles(workflowDir, ['.yml', '.yaml'])
  let anyHit = false
  for (const file of workflows) {
    const hits = scanFile(file, /path:\s*build\//g)
    const rel = path.relative(ROOT, file)
    for (const hit of hits) {
      addFinding('workflow-build-path', 'ERROR', rel, `Workflow references build/ as artifact path — must be dist/ (line: "${hit.text}")`, hit.line)
      anyHit = true
    }
  }
  if (!anyHit) {
    pass('workflow-build-path', '.github/workflows/')
  }
}

// ─── Check 4: dist/ is in .gitignore ─────────────────────────────────────────

function checkDistIgnored(): void {
  console.log('\n--- Check 4: dist/ must be gitignored ---')

  const gitignore = path.join(ROOT, '.gitignore')
  if (!fs.existsSync(gitignore)) {
    addFinding('gitignore-missing', 'ERROR', '.gitignore', '.gitignore does not exist')
    return
  }

  const content = fs.readFileSync(gitignore, 'utf-8')
  const lines = content.split('\n').map(l => l.trim())
  const hasDist = lines.some(l => l === 'dist' || l === 'dist/' || l === '/dist' || l === '/dist/')
  if (!hasDist) {
    addFinding('dist-not-ignored', 'ERROR', '.gitignore', 'dist/ is not in .gitignore — build output must never be committed')
  } else {
    pass('dist-ignored', '.gitignore')
  }
}

// ─── Check 5: No npm / yarn lockfiles ────────────────────────────────────────

function checkNoNpmYarnLockfiles(): void {
  console.log('\n--- Check 5: No npm/yarn lockfiles (pnpm only) ---')

  const banned = ['package-lock.json', 'yarn.lock', 'npm-shrinkwrap.json']
  let anyFound = false
  for (const f of banned) {
    if (fs.existsSync(path.join(ROOT, f))) {
      addFinding('npm-yarn-lockfile', 'ERROR', f, `${f} found — this project uses pnpm exclusively. Delete it.`)
      anyFound = true
    }
  }
  if (!anyFound) {
    pass('no-npm-yarn-lockfiles', 'root')
  }
}

// ─── Check 6: No legacy generate-v6feature-docs.yml workflow references ───────
//
// The auto-generation workflow was intentionally deleted as part of the
// migration to manually curated content. This check verifies that no
// remaining workflow files incorrectly reference src/content/ (legacy path).

function checkWorkflowOutputPaths(): void {
  console.log('\n--- Check 6: Workflow files must not reference legacy src/content/ path ---')

  const workflowDir = path.join(ROOT, '.github', 'workflows')
  const workflows = walkFiles(workflowDir, ['.yml', '.yaml'])

  let anyHit = false
  for (const file of workflows) {
    const legacyHits = scanFile(file, /src\/content\//g)
    const rel = path.relative(ROOT, file)
    for (const hit of legacyHits) {
      // Exclude matches inside comments that are explaining the old path
      if (!hit.text.trim().startsWith('#')) {
        addFinding('workflow-legacy-content-path', 'ERROR', rel, `Workflow references src/content/ — must be src/pages/content/ (line: "${hit.text}")`, hit.line)
        anyHit = true
      }
    }
  }

  if (!anyHit) {
    pass('workflow-output-paths', '.github/workflows/')
  }
}

// ─── Check 7: public/doc-graph.json was built ────────────────────────────────
//
// public/doc-graph.json is generated by pnpm build-doc-graph (runs as prebuild).
// It lives in public/ so Vite copies it to dist/ during the build step.
// It will be absent only if the prebuild step was skipped. This is a WARN
// because the file is not committed to git — it is an expected build artifact.

function checkDocGraph(): void {
  console.log('\n--- Check 7: public/doc-graph.json (built by prebuild) ---')

  const docGraphPath = path.join(ROOT, 'public', 'doc-graph.json')
  if (fs.existsSync(docGraphPath)) {
    pass('doc-graph-exists', 'public/doc-graph.json')
  } else {
    addFinding('doc-graph-missing', 'WARN', 'public/doc-graph.json', 'public/doc-graph.json not found — run pnpm build-doc-graph to generate')
  }
}

// ─── Check 8: public/search-index.json exists ────────────────────────────────
//
// public/search-index.json is generated by pnpm build-search-index.
// It covers all 359 TOC-referenced pages and is required for site search.

function checkSearchIndex(): void {
  console.log('\n--- Check 8: public/search-index.json ---')

  const searchIndexPath = path.join(ROOT, 'public', 'search-index.json')
  if (fs.existsSync(searchIndexPath)) {
    pass('search-index-exists', 'public/search-index.json')
  } else {
    addFinding('search-index-missing', 'WARN', 'public/search-index.json', 'public/search-index.json not found — run pnpm build-search-index')
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function printSummary(): void {
  const errors = findings.filter(f => f.severity === 'ERROR')
  const warnings = findings.filter(f => f.severity === 'WARN')
  const ok = findings.filter(f => f.severity === 'OK')

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Path contract: ${ok.length} OK, ${warnings.length} warnings, ${errors.length} errors`)

  if (warnings.length > 0) {
    console.log('\nWarnings (investigate manually):')
    for (const w of warnings) {
      const loc = w.line != null ? `:${w.line}` : ''
      console.log(`  ⚠️  [${w.name}] ${w.file}${loc}: ${w.message}`)
    }
  }

  if (errors.length > 0) {
    console.log('\nErrors (must fix — these break the build pipeline):')
    for (const e of errors) {
      const loc = e.line != null ? `:${e.line}` : ''
      console.log(`  ❌ [${e.name}] ${e.file}${loc}: ${e.message}`)
    }
    console.log()
    process.exit(1)
  }

  console.log('\nPath contract check passed.')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('Virima Documentation — Path Contract Validator')
console.log(`Root: ${ROOT}`)

checkLegacyV6_1Paths()
checkNoSrcContentDir()
checkBuildOutputDir()
checkDistIgnored()
checkNoNpmYarnLockfiles()
checkWorkflowOutputPaths()
checkDocGraph()
checkSearchIndex()
printSummary()
