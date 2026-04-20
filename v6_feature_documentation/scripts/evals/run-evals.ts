#!/usr/bin/env tsx
/**
 * run-evals.ts
 * Execute documentation quality evals and report findings.
 *
 * Usage:
 *   tsx scripts/evals/run-evals.ts               # all suites
 *   tsx scripts/evals/run-evals.ts --suite=coverage
 *   tsx scripts/evals/run-evals.ts --suite=structure
 *   tsx scripts/evals/run-evals.ts --suite=compliance
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const PAGES_DIR = path.join(ROOT, 'src', 'pages')
const PRD_DIR = path.join('C:', 'github', 'v6_prds', 'src', 'pages')

type Severity = 'RED' | 'AMBER' | 'GREEN'

interface EvalFinding {
  severity: Severity
  suite: string
  file: string
  message: string
}

const findings: EvalFinding[] = []

function addFinding(severity: Severity, suite: string, file: string, message: string): void {
  findings.push({ severity, suite, file, message })
}

// ─── Suite: structure ──────────────────────────────────────────────────────

function evalStructure(): void {
  console.log('Running eval: structure...')

  if (!fs.existsSync(PAGES_DIR)) {
    addFinding('RED', 'structure', 'src/pages', 'src/pages directory does not exist')
    return
  }

  if (!fs.existsSync(PRD_DIR)) {
    addFinding('AMBER', 'structure', PRD_DIR, 'PRD source directory not found at C:\\github\\v6_prds — skipping parity check')
    return
  }

  function walkPrd(dir: string, rel: string): void {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const slug = entry.name
      const prdFolder = path.join(dir, slug)
      const relFolder = path.posix.join(rel, slug)
      const prdFile = path.join(prdFolder, `${slug}.md`)

      if (fs.existsSync(prdFile)) {
        const generatedFile = path.join(PAGES_DIR, rel, slug, `${slug}.md`)
        if (!fs.existsSync(generatedFile)) {
          addFinding('AMBER', 'structure', generatedFile, `Missing generated doc for PRD: ${relFolder}/${slug}.md`)
        }
      }
      walkPrd(prdFolder, relFolder)
    }
  }

  walkPrd(PRD_DIR, '')
}

// ─── Suite: coverage ──────────────────────────────────────────────────────

function evalCoverage(): void {
  console.log('Running eval: coverage...')

  if (!fs.existsSync(PAGES_DIR)) return

  function walk(dir: string): void {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith('.md')) {
        // Skip index files (TOC only), summary files, and non-content files
        const isSkippable =
          entry.name === 'index.md' ||
          entry.name.startsWith('_') ||
          entry.name.includes('SUMMARY') ||
          entry.name.includes('REGISTRY') ||
          entry.name.includes('README')
        if (isSkippable) continue

        const content = fs.readFileSync(full, 'utf-8').toLowerCase()
        const rel = path.relative(ROOT, full)

        const hasAdd = content.includes('add') || content.includes('create') || content.includes('new ')
        const hasEdit = content.includes('edit') || content.includes('update') || content.includes('modif')
        const hasDelete = content.includes('delete') || content.includes('remov')

        if (!hasAdd) addFinding('AMBER', 'coverage', rel, 'No add/create section detected')
        if (!hasEdit) addFinding('AMBER', 'coverage', rel, 'No edit/update section detected')
        if (!hasDelete) addFinding('AMBER', 'coverage', rel, 'No delete/remove section detected')
      }
    }
  }

  walk(PAGES_DIR)
}

// ─── Suite: nav-integrity ─────────────────────────────────────────────────

function evalNavIntegrity(): void {
  console.log('Running eval: nav-integrity...')

  const contentDir = path.join(ROOT, 'src', 'pages', 'content')
  if (!fs.existsSync(contentDir)) {
    addFinding('RED', 'nav-integrity', 'src/pages/content', 'src/pages/content directory does not exist')
    return
  }

  // Walk version directories only (e.g. 6_1, 6_1_1, 5_13, NG).
  // Exclude non-version dirs: testing/, _archive/, any dir starting with _.
  const NON_VERSION_DIRS = new Set(['testing', 'archive', '_archive'])
  const versions = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !NON_VERSION_DIRS.has(e.name) && !e.name.startsWith('_'))
    .map(e => e.name)

  if (versions.length === 0) {
    addFinding('AMBER', 'nav-integrity', 'src/pages/content', 'No version directories found under src/pages/content/')
    return
  }

  for (const version of versions) {
    const versionDir = path.join(contentDir, version)
    const moduleDirs = fs.readdirSync(versionDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)

    for (const module of moduleDirs) {
      const moduleDir = path.join(versionDir, module)
      const rel = `src/pages/content/${version}/${module}`

      // Rule 1: Every module must have an index.md
      const indexFile = path.join(moduleDir, 'index.md')
      if (!fs.existsSync(indexFile)) {
        addFinding('AMBER', 'nav-integrity', `${rel}/index.md`, `Module "${module}" is missing index.md — run the generation pipeline or pnpm sync-toc`)
        continue
      }

      // Rule 2: Parse index.md and verify all → relative paths resolve to real files
      const indexContent = fs.readFileSync(indexFile, 'utf-8')
      // Match lines like: - Some Label → admin/credentials/credentials-admin-guide.md
      const arrowPattern = /→\s+(\S+\.md)/g
      let match: RegExpExecArray | null
      while ((match = arrowPattern.exec(indexContent)) !== null) {
        const relPath = match[1]
        // Path is relative to the version root (e.g. src/pages/content/6_1/)
        const absPath = path.join(versionDir, relPath)
        if (!fs.existsSync(absPath)) {
          addFinding(
            'AMBER',
            'nav-integrity',
            `${rel}/index.md`,
            `Stale nav entry: "${relPath}" does not exist — regenerate or remove this entry`,
          )
        }
      }

      // Rule 3: Every feature subdirectory should have at least one .md file
      const featureDirs = fs.readdirSync(moduleDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)

      for (const feature of featureDirs) {
        const featureDir = path.join(moduleDir, feature)
        const mdFiles = fs.readdirSync(featureDir).filter(f => f.endsWith('.md') && !f.startsWith('.'))
        if (mdFiles.length === 0) {
          addFinding(
            'AMBER',
            'nav-integrity',
            `src/pages/content/${version}/${module}/${feature}`,
            `Feature directory "${feature}" has no .md docs — run generation pipeline for this PRD`,
          )
        }
      }
    }
  }
}

// ─── Suite: compliance ────────────────────────────────────────────────────

function evalCompliance(): void {
  console.log('Running eval: compliance...')

  // pnpm: lockfile must exist
  if (!fs.existsSync(path.join(ROOT, 'pnpm-lock.yaml'))) {
    addFinding('RED', 'compliance', 'pnpm-lock.yaml', 'pnpm lockfile missing — run pnpm install')
  }

  // npm: lockfile must NOT exist
  if (fs.existsSync(path.join(ROOT, 'package-lock.json'))) {
    addFinding('RED', 'compliance', 'package-lock.json', 'npm lockfile found — delete it, use pnpm-lock.yaml only')
  }

  // packageManager field
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')) as Record<string, unknown>
    const pm = pkg['packageManager'] as string | undefined
    if (!pm?.startsWith('pnpm')) {
      addFinding('RED', 'compliance', 'package.json', `packageManager field must start with "pnpm", got: ${pm ?? 'undefined'}`)
    }
  } catch {
    addFinding('RED', 'compliance', 'package.json', 'Could not parse package.json')
  }

  // Forbidden root JS files
  const forbiddenJs = ['check-env.js', 'verify-security.js', 'verify-setup.js']
  for (const f of forbiddenJs) {
    if (fs.existsSync(path.join(ROOT, f))) {
      addFinding('RED', 'compliance', f, `Forbidden root JS file — must be TypeScript in scripts/checks/`)
    }
  }

  // AMBER structural checks
  if (!fs.existsSync(path.join(ROOT, 'CLAUDE.md'))) {
    addFinding('AMBER', 'compliance', 'CLAUDE.md', 'CLAUDE.md not found — create authoritative repo guide')
  }

  if (!fs.existsSync(path.join(ROOT, '.claude', 'commands'))) {
    addFinding('AMBER', 'compliance', '.claude/commands', '.claude/commands/ directory missing')
  }

  if (!fs.existsSync(path.join(ROOT, 'scripts', 'checks'))) {
    addFinding('AMBER', 'compliance', 'scripts/checks', 'scripts/checks/ directory missing')
  }
}

// ─── Runner ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const suiteArg = args.find(a => a.startsWith('--suite='))?.split('=')[1]

if (!suiteArg || suiteArg === 'structure') evalStructure()
if (!suiteArg || suiteArg === 'coverage') evalCoverage()
if (!suiteArg || suiteArg === 'compliance') evalCompliance()
if (!suiteArg || suiteArg === 'nav-integrity') evalNavIntegrity()

// ─── Report ───────────────────────────────────────────────────────────────

const red = findings.filter(f => f.severity === 'RED')
const amber = findings.filter(f => f.severity === 'AMBER')
const total = findings.length

console.log(`\n${'='.repeat(60)}`)
console.log(`Eval results: ${total} findings (${red.length} RED, ${amber.length} AMBER)`)
console.log('='.repeat(60))

if (amber.length > 0) {
  console.log(`\n⚠️  AMBER (${amber.length}):`)
  for (const f of amber) {
    console.log(`   [${f.suite}] ${f.file}: ${f.message}`)
  }
}

if (red.length > 0) {
  console.log(`\n❌ RED (${red.length}) — must fix before release:`)
  for (const f of red) {
    console.log(`   [${f.suite}] ${f.file}: ${f.message}`)
  }
  console.log()
  process.exit(1)
}

if (total === 0) {
  console.log('\n✅ GREEN — All evals passed.\n')
} else {
  console.log('\n✅ GREEN (with AMBER warnings) — No RED findings.\n')
}

process.exit(0)
