# Enterprise Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden v6_feature_documentation into an enterprise-grade documentation platform with pnpm, TypeScript-first policy, governed structure, Claude guidance, slash commands, plans/prompts/evals, and clean CI.

**Architecture:** Preserve the existing React+Vite+TypeScript website and PRD→feature-doc pipeline while adding governance layers (CLAUDE.md, .claude/commands/, docs/plans/, docs/prompts/, docs/evals/). Migrate package manager from npm to pnpm and convert the 4 root JavaScript files to TypeScript under scripts/checks/.

**Tech Stack:** React 18 + TypeScript 5.5 + Vite 6 + Tailwind 4 + pnpm + tsx (for scripts) + vitest (for tests) + eslint

---

## Phase 1 — pnpm Migration

### Task 1: Install pnpm and generate lockfile

**Files:**
- Delete: `package-lock.json`
- Delete: `scripts/package-lock.json`
- Create: `pnpm-lock.yaml` (auto-generated)
- Modify: `package.json`
- Modify: `scripts/package.json`
- Modify: `.gitignore`

**Step 1: Add packageManager field to root package.json**

Open `package.json` and add inside the root object (after `"name"`):
```json
"packageManager": "pnpm@9.15.0",
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=9.0.0"
},
```

**Step 2: Install pnpm globally (if not present)**

Run:
```bash
npm install -g pnpm@9
```
Expected: `added 1 package` or `pnpm@9.x.x already installed`

**Step 3: Generate pnpm lockfile from existing package-lock.json**

Run from `C:\github\v6_feature_documentation`:
```bash
pnpm import
```
Expected: Creates `pnpm-lock.yaml`, prints import summary. If `pnpm import` fails (no package-lock.json), run `pnpm install` directly.

**Step 4: Verify pnpm install works**

Run:
```bash
pnpm install
```
Expected: All packages installed, no errors. `node_modules/` populated.

**Step 5: Delete package-lock.json**

Run:
```bash
rm package-lock.json
```

**Step 6: Update .gitignore to track pnpm-lock.yaml**

Find the line in `.gitignore`:
```
package-lock.json
```
Replace with:
```
package-lock.json
# pnpm-lock.yaml is intentionally tracked (do not add here)
```
Also add:
```
# pnpm
.pnpm-store/
```

**Step 7: Repeat for scripts/package.json**

```bash
cd scripts && pnpm import && rm package-lock.json && cd ..
```

**Step 8: Commit**
```bash
git add package.json pnpm-lock.yaml scripts/pnpm-lock.yaml .gitignore
git rm package-lock.json scripts/package-lock.json
git commit -m "feat(tooling): migrate from npm to pnpm — add lockfile, packageManager field"
```

---

### Task 2: Update package.json scripts for pnpm + add missing scripts

**Files:**
- Modify: `package.json`

**Step 1: Replace the scripts section**

Current `scripts` in `package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "sync-toc": "node scripts/sync-toc-from-index.mjs",
  "watch-toc": "node scripts/watch-toc.mjs",
  "prebuild": "npm run sync-toc"
}
```

Replace with:
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -p src/tsconfig.json --noEmit && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -p src/tsconfig.json --noEmit",
  "lint": "eslint src --ext .ts,.tsx --max-warnings 0",
  "sync-toc": "node scripts/sync-toc-from-index.mjs",
  "watch-toc": "node scripts/watch-toc.mjs",
  "prebuild": "pnpm run sync-toc",
  "check:env": "tsx scripts/checks/check-env.ts",
  "check:setup": "tsx scripts/checks/verify-setup.ts",
  "check:security": "tsx scripts/checks/verify-security.ts",
  "validate": "pnpm run typecheck && pnpm run check:security && pnpm run check:setup",
  "docs:validate": "tsx scripts/evals/run-evals.ts --suite=docs",
  "docs:structure": "tsx scripts/evals/run-evals.ts --suite=structure",
  "docs:links": "tsx scripts/evals/run-evals.ts --suite=links",
  "eval": "tsx scripts/evals/run-evals.ts",
  "test": "vitest run scripts/__tests__"
},
```

**Step 2: Add missing devDependencies**

In the `devDependencies` section, add:
```json
"typescript": "^5.5.3",
"tsx": "^4.19.2",
"vitest": "^2.1.0",
"eslint": "^9.0.0",
"@typescript-eslint/eslint-plugin": "^8.0.0",
"@typescript-eslint/parser": "^8.0.0"
```

**Step 3: Verify build still works**

Run:
```bash
pnpm install
pnpm run typecheck
```
Expected: No TypeScript errors.

**Step 4: Commit**
```bash
git add package.json
git commit -m "feat(tooling): add preview, typecheck, lint, validate, eval scripts — pnpm-clean"
```

---

## Phase 2 — JavaScript → TypeScript Migration

### Task 3: Convert check-env.js → scripts/checks/check-env.ts

**Files:**
- Create: `scripts/checks/check-env.ts`
- Delete: `check-env.js` (root)

**Step 1: Create scripts/checks/ directory**
```bash
mkdir -p scripts/checks
```

**Step 2: Write check-env.ts**

Create `scripts/checks/check-env.ts`:
```typescript
#!/usr/bin/env tsx
/**
 * check-env.ts
 * Verifies .env.local is configured with required environment variables.
 * Run: pnpm check:env
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')
const ENV_PATH = path.join(ROOT, '.env.local')

const REQUIRED_VARS: string[] = [
  'VITE_OPENAI_API_KEY',
]

function maskSecret(value: string): string {
  if (value.length <= 20) return '***'
  return `${value.slice(0, 10)}...${value.slice(-10)}`
}

function checkEnv(): void {
  console.log('🔍 Checking environment configuration...\n')

  if (!fs.existsSync(ENV_PATH)) {
    console.error('❌ .env.local not found.')
    console.error('   Create it from .env.example or configure manually.\n')
    process.exit(1)
  }

  const raw = fs.readFileSync(ENV_PATH, 'utf-8')
  const lines = raw.split('\n').filter(l => l.trim() && !l.startsWith('#'))
  const env: Record<string, string> = {}
  for (const line of lines) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
    }
  }

  let allOk = true
  for (const varName of REQUIRED_VARS) {
    const value = env[varName]
    if (!value || value === 'your_key_here' || value === '') {
      console.error(`❌ ${varName} is missing or placeholder`)
      allOk = false
    } else {
      console.log(`✅ ${varName} = ${maskSecret(value)}`)
    }
  }

  if (!allOk) {
    console.error('\n❌ Environment check failed. Configure .env.local and retry.\n')
    process.exit(1)
  }

  console.log('\n✅ Environment configuration is valid.\n')
}

checkEnv()
```

**Step 3: Delete root JS file**
```bash
rm check-env.js
```

**Step 4: Test the new script**

Run:
```bash
pnpm check:env
```
Expected: Either `✅ Environment configuration is valid.` or a clear error if `.env.local` is missing.

**Step 5: Commit**
```bash
git add scripts/checks/check-env.ts
git rm check-env.js
git commit -m "refactor(checks): convert check-env.js to TypeScript in scripts/checks/"
```

---

### Task 4: Convert verify-security.js → scripts/checks/verify-security.ts

**Files:**
- Create: `scripts/checks/verify-security.ts`
- Delete: `verify-security.js` (root)

**Step 1: Write verify-security.ts**

Create `scripts/checks/verify-security.ts`:
```typescript
#!/usr/bin/env tsx
/**
 * verify-security.ts
 * Scans codebase for hardcoded API keys, validates security setup.
 * Run: pnpm check:security
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')

const SENSITIVE_PATTERNS: RegExp[] = [
  /sk-[a-zA-Z0-9]{20,}/,         // OpenAI API keys
  /AKIA[0-9A-Z]{16}/,            // AWS Access Key IDs
  /[0-9a-f]{32}/,                // Generic 32-char hex (loose — check context)
]

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.pnpm-store'])
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.env'])

interface ScanResult {
  file: string
  line: number
  pattern: string
  excerpt: string
}

function scanFile(filePath: string): ScanResult[] {
  const results: ScanResult[] = []
  const ext = path.extname(filePath)
  if (!SCAN_EXTENSIONS.has(ext)) return results

  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return results
  }

  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    // Skip .env.local references (those are expected to contain keys)
    if (filePath.endsWith('.env.local')) continue
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(line)) {
        results.push({
          file: path.relative(ROOT, filePath),
          line: i + 1,
          pattern: pattern.toString(),
          excerpt: line.trim().slice(0, 80),
        })
      }
    }
  }
  return results
}

function scanDirectory(dir: string): ScanResult[] {
  const results: ScanResult[] = []
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...scanDirectory(full))
    } else if (entry.isFile()) {
      results.push(...scanFile(full))
    }
  }
  return results
}

function verifyGitignore(): boolean {
  const gitignorePath = path.join(ROOT, '.gitignore')
  if (!fs.existsSync(gitignorePath)) {
    console.error('❌ .gitignore not found')
    return false
  }
  const content = fs.readFileSync(gitignorePath, 'utf-8')
  const required = ['.env.local', '.env.*.local']
  let ok = true
  for (const entry of required) {
    if (!content.includes(entry)) {
      console.error(`❌ .gitignore missing: ${entry}`)
      ok = false
    } else {
      console.log(`✅ .gitignore has: ${entry}`)
    }
  }
  return ok
}

function verifyEnvLocal(): boolean {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log('ℹ️  .env.local not found — skipping content check (optional for CI)')
    return true
  }
  const content = fs.readFileSync(envPath, 'utf-8')
  // Key must not be a placeholder
  if (content.includes('your_key_here') || content.includes('sk-PLACEHOLDER')) {
    console.error('❌ .env.local contains placeholder API key')
    return false
  }
  console.log('✅ .env.local exists and has no placeholder values')
  return true
}

function verifySearchConfig(): boolean {
  const configPath = path.join(ROOT, 'src/lib/search/config.ts')
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Search config not found: ${configPath}`)
    return false
  }
  const content = fs.readFileSync(configPath, 'utf-8')
  if (/sk-[a-zA-Z0-9]{20,}/.test(content)) {
    console.error('❌ Hardcoded API key detected in src/lib/search/config.ts')
    return false
  }
  console.log('✅ src/lib/search/config.ts exists and has no hardcoded keys')
  return true
}

function runSecurityChecks(): void {
  console.log('🔒 Running security verification...\n')
  let allOk = true

  console.log('--- Gitignore Check ---')
  if (!verifyGitignore()) allOk = false
  console.log()

  console.log('--- Environment File Check ---')
  if (!verifyEnvLocal()) allOk = false
  console.log()

  console.log('--- Config File Check ---')
  if (!verifySearchConfig()) allOk = false
  console.log()

  console.log('--- Source Code Scan ---')
  const findings = scanDirectory(ROOT)
  if (findings.length > 0) {
    console.error(`❌ Found ${findings.length} potential secrets in source code:`)
    for (const f of findings) {
      console.error(`   ${f.file}:${f.line} — ${f.excerpt}`)
    }
    allOk = false
  } else {
    console.log('✅ No hardcoded secrets detected in source')
  }

  console.log()
  if (!allOk) {
    console.error('❌ Security verification FAILED.\n')
    process.exit(1)
  }
  console.log('✅ Security verification passed.\n')
}

runSecurityChecks()
```

**Step 2: Delete root JS file**
```bash
rm verify-security.js
git rm verify-security.js
```

**Step 3: Test**
```bash
pnpm check:security
```
Expected: All checks pass or clear actionable errors.

**Step 4: Commit**
```bash
git add scripts/checks/verify-security.ts
git rm verify-security.js
git commit -m "refactor(checks): convert verify-security.js to TypeScript — fix path bugs"
```

---

### Task 5: Convert verify-setup.js → scripts/checks/verify-setup.ts

**Files:**
- Create: `scripts/checks/verify-setup.ts`
- Delete: `verify-setup.js` (root)

**Step 1: Write verify-setup.ts**

Create `scripts/checks/verify-setup.ts`:
```typescript
#!/usr/bin/env tsx
/**
 * verify-setup.ts
 * Validates project structure, dependencies, and configuration are correct.
 * Run: pnpm check:setup
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '../..')

interface CheckResult {
  name: string
  passed: boolean
  message: string
}

const results: CheckResult[] = []

function check(name: string, passed: boolean, message: string): void {
  results.push({ name, passed, message })
  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${name}: ${message}`)
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(ROOT, relPath))
}

function dirExists(relPath: string): boolean {
  const full = path.join(ROOT, relPath)
  return fs.existsSync(full) && fs.statSync(full).isDirectory()
}

function checkRequiredFiles(): void {
  console.log('\n--- Required Files ---')
  const required = [
    'package.json',
    'pnpm-lock.yaml',
    'vite.config.ts',
    'index.html',
    'src/tsconfig.json',
    '.gitignore',
    'CLAUDE.md',
  ]
  for (const f of required) {
    check(`File: ${f}`, fileExists(f), fileExists(f) ? 'present' : 'MISSING')
  }
}

function checkRequiredDirs(): void {
  console.log('\n--- Required Directories ---')
  const required = [
    'src/components',
    'src/content',
    'src/lib',
    'src/utils',
    'src/styles',
    'src/types',
    'scripts/checks',
    'scripts/evals',
    'docs/plans',
    'docs/prompts',
    'docs/evals',
    '.claude/commands',
    '.github/workflows',
  ]
  for (const d of required) {
    check(`Dir: ${d}`, dirExists(d), dirExists(d) ? 'present' : 'MISSING')
  }
}

function checkPackageJson(): void {
  console.log('\n--- package.json Validation ---')
  const pkgPath = path.join(ROOT, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    check('package.json', false, 'MISSING')
    return
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>

  // packageManager field
  const pm = pkg['packageManager'] as string | undefined
  check('packageManager field', typeof pm === 'string' && pm.startsWith('pnpm'), pm ?? 'missing — must be pnpm@x.x.x')

  // No npm lockfile
  check('No package-lock.json', !fileExists('package-lock.json'), fileExists('package-lock.json') ? 'FOUND — delete it' : 'absent (correct)')

  // Required scripts
  const scripts = (pkg['scripts'] ?? {}) as Record<string, string>
  const requiredScripts = ['dev', 'build', 'preview', 'typecheck', 'lint', 'validate', 'eval', 'check:env', 'check:setup', 'check:security']
  for (const s of requiredScripts) {
    check(`script: ${s}`, s in scripts, s in scripts ? scripts[s]! : 'MISSING')
  }

  // Required devDependencies
  const devDeps = (pkg['devDependencies'] ?? {}) as Record<string, string>
  const required = ['typescript', 'tsx', 'vite']
  for (const dep of required) {
    const inDeps = dep in devDeps || dep in ((pkg['dependencies'] ?? {}) as Record<string, string>)
    check(`devDep: ${dep}`, inDeps, inDeps ? 'present' : 'MISSING — add to devDependencies')
  }
}

function checkNoJsFiles(): void {
  console.log('\n--- TypeScript-Only Policy ---')
  const forbidden = [
    'check-env.js',
    'verify-security.js',
    'verify-setup.js',
  ]
  for (const f of forbidden) {
    check(`No root JS: ${f}`, !fileExists(f), fileExists(f) ? 'FOUND — must be converted to TypeScript' : 'absent (correct)')
  }
}

function checkGitHubWorkflows(): void {
  console.log('\n--- GitHub Workflows ---')
  const workflows = [
    '.github/workflows/generate-v6feature-docs.yml',
    '.github/workflows/ci.yml',
  ]
  for (const w of workflows) {
    check(`Workflow: ${w}`, fileExists(w), fileExists(w) ? 'present' : 'MISSING')
  }
}

function checkClaudeGuidance(): void {
  console.log('\n--- Claude Guidance ---')
  check('CLAUDE.md', fileExists('CLAUDE.md'), fileExists('CLAUDE.md') ? 'present' : 'MISSING — create root CLAUDE.md')

  const commands = [
    '.claude/commands/audit-docs.md',
    '.claude/commands/generate-feature-docs.md',
    '.claude/commands/validate-feature-docs.md',
    '.claude/commands/run-evals.md',
    '.claude/commands/preview-site.md',
    '.claude/commands/release-readiness.md',
  ]
  for (const cmd of commands) {
    check(`Command: ${cmd}`, fileExists(cmd), fileExists(cmd) ? 'present' : 'MISSING')
  }
}

function printSummary(): void {
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Setup verification: ${passed} passed, ${failed} failed`)
  if (failed > 0) {
    console.log('\nFailed checks:')
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.name}: ${r.message}`)
    })
    console.log()
    process.exit(1)
  }
  console.log('\n✅ Setup verification complete — all checks passed.\n')
}

console.log('🔧 Verifying project setup...')
checkRequiredFiles()
checkRequiredDirs()
checkPackageJson()
checkNoJsFiles()
checkGitHubWorkflows()
checkClaudeGuidance()
printSummary()
```

**Step 2: Delete root JS file**
```bash
rm verify-setup.js
```

**Step 3: Test**
```bash
pnpm check:setup
```
Expected: Some checks fail (those are the things we're about to create). Fix them systematically as we complete each task.

**Step 4: Commit**
```bash
git add scripts/checks/verify-setup.ts
git rm verify-setup.js
git commit -m "refactor(checks): convert verify-setup.js to TypeScript — align to pnpm+TS reality"
```

---

### Task 6: Assess .mjs scripts for TypeScript conversion

**Files:**
- `scripts/sync-imports-from-toc.mjs`
- `scripts/sync-toc-from-index.mjs`
- `scripts/watch-toc.mjs`
- `scripts/generate-mdx-imports.mjs`

**Step 1: Read each file and assess**

For each .mjs file, note:
- Does it use `import.meta.url` / `import.meta.dirname`? (ESM-only APIs — fine in TS with `"module": "ESNext"`)
- Does it use dynamic `import()`? (fine in TS)
- Does it use Node.js-specific patterns that require `"type": "module"` in package.json?

**Decision rule:**
- If the file uses only ESM imports and Node.js APIs → convert to `.ts` using `tsx --tsconfig scripts/tsconfig.json`
- If the file has complex ESM interop that would break type checking → keep as `.mjs` and document why

**Step 2: Attempt conversion for each file**

For each `.mjs` file:
1. Rename to `.ts`
2. Add explicit types to function parameters and return values
3. Replace `import.meta.dirname` with `path.dirname(fileURLToPath(import.meta.url))` where needed
4. Run `tsx scripts/sync-toc-from-index.ts` to verify it executes

**Step 3: Update package.json scripts to call `.ts` files via tsx**

```json
"sync-toc": "tsx scripts/sync-toc-from-index.ts",
"watch-toc": "tsx scripts/watch-toc.ts"
```

**Step 4: If conversion fails for any file, document in docs/decisions/**

Create `docs/decisions/2026-03-29-mjs-retained.md` listing:
- File name
- Reason TypeScript conversion was not completed
- What would be needed to convert it

---

## Phase 3 — Repository Structure

### Task 7: Create src/types/ with shared type definitions

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/content.ts`
- Create: `src/types/navigation.ts`

**Step 1: Create src/types/content.ts**

```typescript
/**
 * content.ts
 * Shared type definitions for the documentation content model.
 */

/** Supported documentation versions */
export type DocVersion = 'NG' | '6.1.1' | '6.1' | '5.13'

/** Display label → internal version code mapping */
export const VERSION_MAP: Record<string, DocVersion> = {
  NextGen: 'NG',
  '6.1.1': '6.1.1',
  '6.1': '6.1',
  '5.13': '5.13',
} as const

/** Module within a version */
export interface DocModule {
  id: string
  label: string
  icon?: string
}

/** A single documentation page */
export interface DocPage {
  id: string
  title: string
  path: string
  version: DocVersion
  module: string
  section?: string
}

/** Content loading result */
export interface ContentLoadResult {
  content: string | null
  source: 'static-import' | 'direct-fetch' | 'mdx-bundle' | 'server-fetch' | 'registry' | 'not-found'
  error?: string
}
```

**Step 2: Create src/types/navigation.ts**

```typescript
/**
 * navigation.ts
 * Shared type definitions for navigation and TOC structures.
 */

export interface TocEntry {
  id: string
  title: string
  level: number
  children?: TocEntry[]
}

export interface NavSection {
  id: string
  label: string
  pages: NavPage[]
}

export interface NavPage {
  id: string
  label: string
  path: string
  isActive?: boolean
}

export interface BreadcrumbItem {
  label: string
  path?: string
}
```

**Step 3: Create src/types/index.ts (barrel export)**

```typescript
export * from './content'
export * from './navigation'
```

**Step 4: Update tsconfig path aliases to include types**

In `src/tsconfig.json`, the `"@/*": ["./*"]` alias already covers `@/types/*`. Verify it works:

```typescript
// Example usage in a component:
import type { DocVersion } from '@/types'
```

**Step 5: Commit**

```bash
git add src/types/
git commit -m "feat(types): add centralized type definitions for content and navigation"
```

---

### Task 8: Move _ROLLBACK_RUNBOOK.md to docs/operations/

**Files:**
- Move: `_ROLLBACK_RUNBOOK.md` → `docs/operations/rollback-runbook.md`
- Modify: `README.md` (update reference)

**Step 1: Move file**
```bash
mv _ROLLBACK_RUNBOOK.md docs/operations/rollback-runbook.md
```

**Step 2: Search for references in README.md**
```bash
grep -n "ROLLBACK" README.md
```

**Step 3: Update README.md references**
Replace any `_ROLLBACK_RUNBOOK.md` reference with `docs/operations/rollback-runbook.md`.

**Step 4: Commit**
```bash
git add docs/operations/rollback-runbook.md README.md
git rm _ROLLBACK_RUNBOOK.md
git commit -m "refactor(docs): move rollback runbook to docs/operations/"
```

---

## Phase 4 — CLAUDE.md (Authoritative Repo Guide)

### Task 9: Create root CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

**Step 1: Write CLAUDE.md**

Create `CLAUDE.md` at the repo root:

```markdown
# CLAUDE.md — v6 Feature Documentation Platform

This is the authoritative operating guide for Claude agents and contributors working in this repository.

---

## Repo Purpose

This repository (`v6_feature_documentation`) is the source for the **Virima V6 Feature Documentation website** — a React+Vite single-page app that serves versioned product documentation generated from PRDs.

The documentation pipeline:
```
C:\github\v6_prds\src\pages\  (source PRDs — read-only reference)
        ↓  scripts/generate-feature-doc.ts
src/pages/  (generated MDX feature docs)
        ↓  Vite build
build/  (static site → GitHub Pages)
```

---

## Architectural Principles

1. **PRD mirroring is sacred.** The folder structure under `src/pages/` must mirror `v6_prds/src/pages/`. Never flatten or restructure it.
2. **TypeScript-only.** All source files in `src/`, `scripts/`, and root utilities must be `.ts` or `.tsx`. No `.js` files except where explicitly documented in `docs/decisions/`.
3. **pnpm is the package manager.** Use `pnpm` for all install, run, and CI commands. Never use `npm run` or `yarn`.
4. **Content is owned by the pipeline.** Files under `src/pages/` are generated. Do not hand-edit them. Edit the PRD source in `v6_prds/` instead.
5. **Validation gates must pass.** Before merging anything, `pnpm validate` and `pnpm eval` must pass clean.

---

## What Must Be Preserved

- Folder structure under `src/pages/` (mirrors PRD hierarchy)
- Add/edit/delete documentation coverage in every feature doc
- GitHub Actions pipeline in `.github/workflows/generate-v6feature-docs.yml`
- Validation gate logic (GREEN/AMBER/RED) in `scripts/validate-generation.ts`
- Multi-version content isolation (NG, 6.1.1, 6.1, 5.13)
- Static MDX import system in `src/lib/imports/`

---

## PRD-to-Feature-Doc Rules

- Source PRDs live in `C:\github\v6_prds\src\pages\` (read-only)
- Generated docs live in `src/pages/` (pipeline-owned, do not hand-edit)
- One `.md` file per PRD page, same slug as the PRD folder name
- Path convention: `src/pages/{module}/{feature_slug}/{feature_slug}.md`
- The pipeline script is `scripts/generate-feature-doc.ts`
- Manifests per PRD are stored as `.generation-manifest.json` alongside each doc

---

## Naming Conventions

- Feature slugs: `lowercase_underscore` (e.g., `incident_management`, `change_dashboard`)
- Component files: `PascalCase.tsx` (e.g., `DocumentationLayout.tsx`)
- Utility files: `camelCase.ts` (e.g., `tocLoader.ts`, `basePath.ts`)
- Script files: `kebab-case.ts` or `camelCase.ts` under `scripts/`
- Check scripts: `scripts/checks/` — one concern per file
- Eval scripts: `scripts/evals/` — named by eval suite

---

## Content Conventions

- Feature docs are GFM markdown (.md), not MDX (.mdx)
- No frontmatter in generated feature docs
- Every feature doc must cover: Overview, Add, Edit, Delete use cases
- Headings use sentence case (e.g., `## Managing incidents`, not `## Managing Incidents`)
- Internal links use relative paths
- No Confluence macro syntax in output docs

---

## Metadata / Manifest Expectations

Each generated file has a companion `.generation-manifest.json`:
```json
{
  "sourceFile": "relative/path/to/prd.md",
  "generatedAt": "ISO-8601",
  "model": "claude-sonnet-4-...",
  "contentHash": "sha256-...",
  "deliverables": ["overview", "add", "edit", "delete"]
}
```

---

## Allowed Automated Edits

Claude agents may:
- Generate or regenerate files under `src/pages/` via the pipeline script
- Add new MDX import entries to `src/lib/imports/`
- Update TOC files via `scripts/sync-toc-from-index.mjs`
- Run `pnpm validate` and fix reported issues
- Create new slash commands under `.claude/commands/`
- Update docs under `docs/`

Claude agents must NOT:
- Edit `scripts/generate-feature-doc.ts` without explicit human review
- Edit `scripts/validate-generation.ts` without explicit human review
- Change the Vite base path (`/FeatureDocsite/`)
- Delete or restructure `src/lib/imports/` without updating all references
- Commit to `main` directly without passing validation gate

---

## Expected Workflow

### Generate / update feature docs
```bash
pnpm tsx scripts/generate-feature-doc.ts --prd <path> --output src/pages/...
pnpm validate
pnpm build
```

### Local development
```bash
pnpm install
pnpm dev          # starts dev server on :3000
pnpm build        # typecheck + production build
pnpm preview      # serve the build locally
```

### Validation
```bash
pnpm typecheck       # TypeScript check only
pnpm validate        # typecheck + security + setup
pnpm eval            # documentation quality evals
pnpm check:security  # scan for hardcoded secrets
pnpm check:setup     # verify repo structure
pnpm check:env       # verify .env.local
```

---

## Local Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Serve build locally |
| `pnpm typecheck` | TypeScript type check |
| `pnpm lint` | ESLint check |
| `pnpm validate` | Full validation suite |
| `pnpm eval` | Run documentation evals |
| `pnpm check:env` | Check .env.local |
| `pnpm check:setup` | Verify repo structure |
| `pnpm check:security` | Scan for hardcoded secrets |
| `pnpm sync-toc` | Sync TOC from index files |
| `pnpm watch-toc` | Watch and auto-sync TOC |

---

## Package Manager: pnpm

**Always use pnpm.** Never use npm or yarn.

```bash
pnpm install          # install dependencies
pnpm add <pkg>        # add dependency
pnpm add -D <pkg>     # add devDependency
pnpm run <script>     # run script
```

The `packageManager` field in `package.json` is set to `pnpm@9.x.x`. The lockfile is `pnpm-lock.yaml`.

---

## TypeScript Policy

- All source files must be `.ts` or `.tsx`
- Strict mode is enabled (`strict: true` in all tsconfigs)
- No `any` unless documented with `// eslint-disable-next-line @typescript-eslint/no-explicit-any` and a justification comment
- Shared types live in `src/types/`
- Script types live in `scripts/` (each script's own types or shared in `scripts/path-mapping.ts`)
- Run `pnpm typecheck` before every commit

---

## Quality Gates

| Gate | Command | Failure action |
|------|---------|----------------|
| TypeScript | `pnpm typecheck` | Fix type errors |
| Security scan | `pnpm check:security` | Remove hardcoded secrets |
| Setup check | `pnpm check:setup` | Fix missing structure |
| Docs eval | `pnpm eval` | Fix flagged docs |
| Build | `pnpm build` | Fix build errors |
| Pipeline gate | validate-generation.ts | Create PR for review (AMBER/RED) |

---

## Review Expectations

- Feature doc PRs are auto-created by the pipeline (GREEN = auto-merge, AMBER/RED = human review)
- Structural changes require human review
- Changes to `scripts/generate-feature-doc.ts` or `scripts/validate-generation.ts` require senior review
- No force-pushes to `main`

---

## Rollback / Safety

See `docs/operations/rollback-runbook.md` for rollback procedures.

The pipeline validation gate (GREEN/AMBER/RED) prevents bad generations from merging to main automatically.

---

## Slash Commands

Use these Claude slash commands for common workflows:

| Command | Purpose |
|---------|---------|
| `/audit-docs` | Audit documentation coverage vs PRDs |
| `/generate-feature-docs` | Generate docs from PRD input |
| `/validate-feature-docs` | Run validation suite on feature docs |
| `/run-evals` | Execute documentation quality evals |
| `/preview-site` | Build and preview the site locally |
| `/release-readiness` | Full release readiness check |
```

**Step 2: Verify CLAUDE.md was created**
```bash
ls -la CLAUDE.md
```

**Step 3: Commit**
```bash
git add CLAUDE.md
git commit -m "docs: add authoritative CLAUDE.md repo guide for agents and contributors"
```

---

## Phase 5 — Slash Commands

### Task 10: Create .claude/commands/ slash commands

**Files:**
- Create: `.claude/commands/audit-docs.md`
- Create: `.claude/commands/generate-feature-docs.md`
- Create: `.claude/commands/validate-feature-docs.md`
- Create: `.claude/commands/run-evals.md`
- Create: `.claude/commands/preview-site.md`
- Create: `.claude/commands/release-readiness.md`

**Step 1: Create .claude/commands/ directory**
```bash
mkdir -p .claude/commands
```

**Step 2: Create audit-docs.md**

Create `.claude/commands/audit-docs.md`:
```markdown
# /audit-docs

Audit documentation coverage vs. the source PRD files.

## Purpose
Compare every PRD file under `C:\github\v6_prds\src\pages\` against
generated feature docs under `src/pages/` and report:
- Missing docs (PRD exists but no generated .md)
- Extra docs (generated .md but no corresponding PRD)
- Stale docs (manifest hash differs from current PRD content)
- Coverage gaps (missing add/edit/delete sections)

## Inputs
- Optional: `--module <name>` to scope audit to one module
- Optional: `--fix` to trigger generation for missing docs

## Steps
1. Glob all PRD `.md` files from `C:\github\v6_prds\src\pages\**\*.md`
2. Glob all generated docs from `src/pages\**\*.md`
3. Build a coverage map: PRD slug → generated doc exists (Y/N)
4. Read each generated doc's `.generation-manifest.json` for hash comparison
5. For each generated doc, check for required sections: Overview, Add, Edit, Delete
6. Report findings grouped by module
7. If `--fix` passed: call generate-feature-doc.ts for each missing doc

## Output
A coverage table with status per feature:
- ✅ Covered (manifest hash matches)
- ⚠️ Stale (PRD changed since last generation)
- ❌ Missing (no generated doc)
- 🔍 Gap (missing add/edit/delete sections)

## Success Criteria
All features show ✅ Covered with no ❌ Missing items.

## Commands to run
```bash
pnpm eval -- --suite=coverage
```
```

**Step 3: Create generate-feature-docs.md**

Create `.claude/commands/generate-feature-docs.md`:
```markdown
# /generate-feature-docs

Generate or regenerate feature documentation from PRD source files.

## Purpose
Run the PRD-to-feature-doc generation pipeline for one or more PRDs.
Output goes to `src/pages/{module}/{feature_slug}/{feature_slug}.md`.

## Inputs
- Required: `--prd <path>` — relative path to PRD file under `v6_prds/src/pages/`
- Optional: `--all` — regenerate all docs (full rebuild)
- Optional: `--module <name>` — regenerate all docs for a module
- Optional: `--dry-run` — show what would be generated without writing

## Steps
1. Validate the PRD path exists and is a `.md` file
2. Determine output path using path-mapping rules (see `scripts/path-mapping.ts`)
3. Run `scripts/generate-feature-doc.ts` with the PRD as input
4. Check exit code: 0=success, 2=skipped(dummy), 3=no-change, 4=non-functional
5. If success: run `pnpm validate` to ensure generated doc is clean
6. Report result with file path and byte count

## Validation after generation
Always run:
```bash
pnpm validate
pnpm build
```

## Success Criteria
- Exit code 0 from generate-feature-doc.ts
- Generated file exists and is > 200 bytes
- pnpm validate passes
- pnpm build succeeds

## Example usage
```bash
pnpm tsx scripts/generate-feature-doc.ts \
  --prd ../v6_prds/src/pages/home/itsm/incident_management/incident_management.md \
  --output src/pages/home/itsm/incident_management/incident_management.md
```
```

**Step 4: Create validate-feature-docs.md**

Create `.claude/commands/validate-feature-docs.md`:
```markdown
# /validate-feature-docs

Run the full validation suite on generated feature documentation.

## Purpose
Check that all generated feature docs meet quality, structure, and content standards.

## What is validated
- ✅ TypeScript typecheck (`pnpm typecheck`)
- ✅ Security scan (`pnpm check:security`)
- ✅ Repo structure check (`pnpm check:setup`)
- ✅ Documentation evals (`pnpm eval`)
- ✅ Build succeeds (`pnpm build`)

## Steps
1. Run `pnpm typecheck` — must exit 0
2. Run `pnpm check:security` — must exit 0
3. Run `pnpm check:setup` — must exit 0
4. Run `pnpm eval` — must exit 0 (AMBER warnings are acceptable, RED is not)
5. Run `pnpm build` — must exit 0

## Failure handling
- TypeScript errors: fix type issues in the file indicated
- Security violations: remove hardcoded keys
- Setup failures: create missing directories or files per CLAUDE.md
- Eval failures: fix the specific doc or structure issue flagged
- Build failures: check Vite output for the error

## Success Criteria
All 5 commands exit with code 0. No RED eval findings.

## Commands
```bash
pnpm validate
pnpm eval
pnpm build
```
```

**Step 5: Create run-evals.md**

Create `.claude/commands/run-evals.md`:
```markdown
# /run-evals

Execute documentation quality evals and report findings.

## Purpose
Run automated quality gates over all feature documentation to detect:
- Missing required sections (add/edit/delete coverage)
- Stale or outdated content
- Broken internal links
- Invalid manifest files
- PRD-language leaking into user-facing docs
- Structure parity failures

## Eval Suites
| Suite | Command | Checks |
|-------|---------|--------|
| `coverage` | `pnpm eval -- --suite=coverage` | PRD → doc parity |
| `structure` | `pnpm docs:structure` | Folder structure rules |
| `links` | `pnpm docs:links` | Internal link validity |
| `docs` | `pnpm docs:validate` | Content hygiene |
| `all` | `pnpm eval` | All suites |

## Steps
1. Run `pnpm eval` (runs all suites)
2. Read output and note:
   - RED findings: must fix before release
   - AMBER findings: should fix, create issues if not fixing now
   - GREEN: all clear
3. For each RED finding: identify the file and fix the issue
4. Re-run `pnpm eval` until all RED findings are resolved

## Interpreting output
- Exit 0 = GREEN (all pass or only AMBER)
- Exit 1 = RED (one or more critical failures)

## Success Criteria
`pnpm eval` exits with code 0. Zero RED findings.
```

**Step 6: Create preview-site.md**

Create `.claude/commands/preview-site.md`:
```markdown
# /preview-site

Build and preview the documentation website locally.

## Purpose
Run a production-equivalent local preview of the documentation site.

## Steps
1. Ensure dependencies are installed: `pnpm install`
2. Sync TOC: `pnpm sync-toc`
3. Run typecheck: `pnpm typecheck`
4. Build: `pnpm build`
5. Start preview server: `pnpm preview`
6. Open browser to `http://localhost:4173/FeatureDocsite/`

## Expected output
- Build completes with no errors
- Preview server starts on port 4173
- Site loads with navigation, content, and theme working
- All versions visible: NextGen, 6.1.1, 6.1, 5.13

## Troubleshooting
- **White screen**: Check browser console for JS errors, likely a missing MDX import
- **404 on page load**: Verify base path is `/FeatureDocsite/` in vite.config.ts
- **Missing content**: Run `pnpm sync-toc` then rebuild
- **Build errors**: Run `pnpm typecheck` first to surface type issues

## Commands
```bash
pnpm install && pnpm sync-toc && pnpm build && pnpm preview
```
```

**Step 7: Create release-readiness.md**

Create `.claude/commands/release-readiness.md`:
```markdown
# /release-readiness

Full release readiness check — run before any deployment or major merge.

## Purpose
Verify the repo is in a clean, validated, deployable state.

## Checklist
- [ ] `pnpm install` — clean install with no lock file drift
- [ ] `pnpm typecheck` — zero TypeScript errors
- [ ] `pnpm lint` — zero ESLint errors (warnings ok)
- [ ] `pnpm check:security` — no hardcoded secrets
- [ ] `pnpm check:setup` — repo structure is complete
- [ ] `pnpm eval` — zero RED eval findings
- [ ] `pnpm build` — production build succeeds
- [ ] `pnpm preview` — preview server starts and site loads
- [ ] Git status is clean (no uncommitted changes)
- [ ] On the correct branch (or main)
- [ ] No package-lock.json present (pnpm-only repo)
- [ ] pnpm-lock.yaml is committed and up to date

## Steps
Run each command in order. Stop and fix any failure before continuing.

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm check:security
pnpm check:setup
pnpm eval
pnpm build
pnpm preview
git status
```

## Success Criteria
All commands exit 0. Git status shows clean working tree. Site renders correctly in preview.

## On failure
- TypeScript errors: fix in the specific file indicated
- Lint errors: run `pnpm lint --fix` for auto-fixable issues
- Security: remove or move secrets to .env.local
- Setup failures: create missing structure per CLAUDE.md
- Build failures: check Vite and React error output
- Eval RED: fix the documented issue in the flagged file
```

**Step 8: Commit**
```bash
git add .claude/commands/
git commit -m "feat(claude): add 6 slash commands for audit, generate, validate, eval, preview, release"
```

---

## Phase 6 — Plans, Prompts, Evals

> **See `2026-03-29-migration-plan.md` for pnpm/TS migration detail.**
> **See `2026-03-29-local-dev-and-verification-plan.md` for local dev detail.**

### Task 11: Create docs/prompts/ (6 prompt files)

Create the following prompt files. Each is a reusable template for the documentation pipeline.

**Files to create:**
- `docs/prompts/feature-doc-generation.md`
- `docs/prompts/editorial-cleanup.md`
- `docs/prompts/structure-normalization.md`
- `docs/prompts/metadata-generation.md`
- `docs/prompts/qa-review.md`
- `docs/prompts/release-readiness-review.md`

**Step 1: Create feature-doc-generation.md**

This prompt wraps the high-level intent behind `scripts/prompts.ts`. It is for human reference and for ad-hoc generation tasks.

See content in `docs/prompts/feature-doc-generation.md`.

**Step 2: Create editorial-cleanup.md**

Prompt for cleaning up auto-generated docs to read as human-authored product docs.

**Step 3–6:** Similarly create remaining 4 prompts.

**Step 7: Commit**
```bash
git add docs/prompts/
git commit -m "docs: add 6 reusable prompts for doc generation, editorial, QA, and release"
```

---

### Task 12: Create docs/evals/ (eval documentation)

**Files to create:**
- `docs/evals/README.md`
- `docs/evals/folder-structure-parity.md`
- `docs/evals/content-hygiene.md`
- `docs/evals/add-edit-delete-coverage.md`
- `docs/evals/navigation-integrity.md`
- `docs/evals/pnpm-typescript-compliance.md`

**Step 1: Create docs/evals/README.md**

```markdown
# Documentation Evals

This directory defines the quality gates ("evals") for feature documentation.

Evals are run via `pnpm eval` which executes `scripts/evals/run-evals.ts`.

## Eval Suites

| Suite | File | What it checks |
|-------|------|----------------|
| structure | folder-structure-parity.md | PRD folder mirroring |
| hygiene | content-hygiene.md | Content quality rules |
| coverage | add-edit-delete-coverage.md | Use-case coverage |
| navigation | navigation-integrity.md | Nav/TOC integrity |
| compliance | pnpm-typescript-compliance.md | Package manager + TS policy |

## Severity Levels

- **RED**: Must fix before release. `pnpm eval` exits non-zero.
- **AMBER**: Should fix. Flagged in output but does not fail CI.
- **GREEN**: All clear.

## Running evals

```bash
pnpm eval                          # all suites
pnpm eval -- --suite=structure    # single suite
pnpm docs:validate                 # docs hygiene only
pnpm docs:structure               # structure only
pnpm docs:links                   # links only
```
```

**Step 2–6:** Create each eval spec file with: purpose, rules, how to check, severity, example findings.

**Step 7: Create scripts/evals/run-evals.ts**

This is the executable eval runner. It imports eval logic and runs it programmatically:

```typescript
#!/usr/bin/env tsx
/**
 * run-evals.ts
 * Execute documentation quality evals and report findings.
 * Usage: tsx scripts/evals/run-evals.ts [--suite=<name>]
 */
import path from 'node:path'
import fs from 'node:fs'

const ROOT = path.resolve(import.meta.dirname, '../..')
const PAGES_DIR = path.join(ROOT, 'src/pages')
const PRD_DIR = 'C:/github/v6_prds/src/pages'

interface EvalFinding {
  severity: 'RED' | 'AMBER' | 'GREEN'
  suite: string
  file: string
  message: string
}

const findings: EvalFinding[] = []

function addFinding(severity: EvalFinding['severity'], suite: string, file: string, message: string): void {
  findings.push({ severity, suite, file, message })
}

// --- Suite: structure ---
function evalStructure(): void {
  console.log('Running eval: structure...')
  if (!fs.existsSync(PAGES_DIR)) {
    addFinding('RED', 'structure', 'src/pages', 'src/pages directory does not exist')
    return
  }
  // Check PRD mirroring: every folder in PRD should have a corresponding .md in src/pages
  if (!fs.existsSync(PRD_DIR)) {
    addFinding('AMBER', 'structure', PRD_DIR, 'PRD source directory not found — skipping parity check')
    return
  }
  // Walk PRD directories and check for corresponding generated docs
  function walkPrd(dir: string, rel: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const slug = entry.name
      const prdFolder = path.join(dir, slug)
      const relFolder = path.join(rel, slug)
      // Check if there's a PRD .md file in this folder
      const prdFile = path.join(prdFolder, `${slug}.md`)
      if (fs.existsSync(prdFile)) {
        const generatedFile = path.join(PAGES_DIR, relFolder, `${slug}.md`)
        if (!fs.existsSync(generatedFile)) {
          addFinding('AMBER', 'structure', generatedFile, `Missing generated doc for PRD: ${relFolder}/${slug}.md`)
        }
      }
      walkPrd(prdFolder, relFolder)
    }
  }
  walkPrd(PRD_DIR, '')
}

// --- Suite: coverage (add/edit/delete) ---
function evalCoverage(): void {
  console.log('Running eval: coverage...')
  if (!fs.existsSync(PAGES_DIR)) return
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf-8').toLowerCase()
        const rel = path.relative(ROOT, full)
        if (!content.includes('add') && !content.includes('create')) {
          addFinding('AMBER', 'coverage', rel, 'No add/create section detected')
        }
        if (!content.includes('edit') && !content.includes('update') && !content.includes('modif')) {
          addFinding('AMBER', 'coverage', rel, 'No edit/update section detected')
        }
        if (!content.includes('delete') && !content.includes('remov')) {
          addFinding('AMBER', 'coverage', rel, 'No delete/remove section detected')
        }
      }
    }
  }
  walk(PAGES_DIR)
}

// --- Suite: compliance ---
function evalCompliance(): void {
  console.log('Running eval: compliance...')
  // No package-lock.json
  if (fs.existsSync(path.join(ROOT, 'package-lock.json'))) {
    addFinding('RED', 'compliance', 'package-lock.json', 'npm lockfile found — must use pnpm-lock.yaml only')
  }
  // pnpm-lock.yaml must exist
  if (!fs.existsSync(path.join(ROOT, 'pnpm-lock.yaml'))) {
    addFinding('RED', 'compliance', 'pnpm-lock.yaml', 'pnpm lockfile missing — run pnpm install')
  }
  // No root JS files
  const forbiddenJs = ['check-env.js', 'verify-security.js', 'verify-setup.js']
  for (const f of forbiddenJs) {
    if (fs.existsSync(path.join(ROOT, f))) {
      addFinding('RED', 'compliance', f, `Forbidden JS file at root — must be converted to TypeScript in scripts/checks/`)
    }
  }
  // CLAUDE.md must exist
  if (!fs.existsSync(path.join(ROOT, 'CLAUDE.md'))) {
    addFinding('AMBER', 'compliance', 'CLAUDE.md', 'CLAUDE.md not found — create authoritative repo guide')
  }
}

// --- Parse args ---
const args = process.argv.slice(2)
const suiteArg = args.find(a => a.startsWith('--suite='))?.split('=')[1]

// --- Run ---
if (!suiteArg || suiteArg === 'structure') evalStructure()
if (!suiteArg || suiteArg === 'coverage') evalCoverage()
if (!suiteArg || suiteArg === 'compliance') evalCompliance()

// --- Report ---
console.log('\n=== Eval Results ===\n')
const red = findings.filter(f => f.severity === 'RED')
const amber = findings.filter(f => f.severity === 'AMBER')

if (red.length === 0 && amber.length === 0) {
  console.log('✅ GREEN — All evals passed.\n')
  process.exit(0)
}

if (amber.length > 0) {
  console.log(`⚠️  AMBER — ${amber.length} warnings:`)
  amber.forEach(f => console.log(`   [${f.suite}] ${f.file}: ${f.message}`))
  console.log()
}

if (red.length > 0) {
  console.log(`❌ RED — ${red.length} critical failures:`)
  red.forEach(f => console.log(`   [${f.suite}] ${f.file}: ${f.message}`))
  console.log()
  process.exit(1)
}

process.exit(0)
```

**Step 8: Commit**
```bash
git add docs/evals/ scripts/evals/
git commit -m "feat(evals): add eval documentation and run-evals.ts script"
```

---

## Phase 7 — CI

### Task 13: Create .github/workflows/ci.yml (baseline CI)

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Write ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main, 'feat/**', 'fix/**']
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_OUTPUT

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: TypeScript check
        run: pnpm typecheck

      - name: Security check
        run: pnpm check:security

      - name: Setup check
        run: pnpm check:setup

      - name: Run evals
        run: pnpm eval

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_OUTPUT

      - name: Cache pnpm store
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: build/
          retention-days: 1
```

**Step 2: Update generate-v6feature-docs.yml for pnpm**

Find all occurrences of `npm install`, `npm run`, and `npm cache` in `.github/workflows/generate-v6feature-docs.yml`.

Replace:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
```

With:
```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}

- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9
    run_install: false
```

Replace `npm install` with `pnpm install --frozen-lockfile`.
Replace `npm run <script>` with `pnpm run <script>`.
Replace `npx tsx` with `pnpm tsx` or `pnpm dlx tsx`.

**Step 3: Commit**
```bash
git add .github/workflows/ci.yml .github/workflows/generate-v6feature-docs.yml
git commit -m "feat(ci): add baseline CI workflow, migrate generate workflow to pnpm"
```

---

## Phase 8 — README Update

### Task 14: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Update the local setup section**

Find: `npm install`
Replace: `pnpm install`

Find: `npm run dev`
Replace: `pnpm dev`

Find: `npm run build`
Replace: `pnpm build`

**Step 2: Add pnpm requirement to Prerequisites**

```markdown
## Prerequisites
- Node.js 20+
- pnpm 9+ (`npm install -g pnpm@9`)
```

**Step 3: Update scripts section**

Replace any `npm run *` with `pnpm *`.

Add the full command reference table from CLAUDE.md.

**Step 4: Add TypeScript policy note**

```markdown
## Contributing
This repo is TypeScript-only. All source files must be `.ts` or `.tsx`.
See CLAUDE.md for full contribution guidelines.
```

**Step 5: Commit**
```bash
git add README.md
git commit -m "docs(readme): update for pnpm, add command reference, TypeScript policy"
```

---

## Phase 9 — Verify

### Task 15: Run full verification

**Step 1: pnpm install**
```bash
pnpm install
```
Expected: All packages installed, `pnpm-lock.yaml` up to date.

**Step 2: typecheck**
```bash
pnpm typecheck
```
Expected: Exit 0, no errors.

**Step 3: check:security**
```bash
pnpm check:security
```
Expected: Exit 0, no hardcoded secrets.

**Step 4: check:setup**
```bash
pnpm check:setup
```
Expected: All checks pass (exit 0).

**Step 5: eval**
```bash
pnpm eval
```
Expected: Exit 0 (GREEN or AMBER only).

**Step 6: build**
```bash
pnpm build
```
Expected: `build/` directory created, no errors.

**Step 7: preview**
```bash
pnpm preview
```
Expected: Server starts on port 4173. Open browser to `http://localhost:4173/FeatureDocsite/`.

**Step 8: Fix any failures**

For each failure:
- TypeScript error → fix in the indicated file
- Missing dependency → `pnpm add -D <pkg>`
- Missing script → add to package.json scripts
- Setup check failure → create the missing structure
- Build error → check Vite output, fix import or type issue

**Step 9: Final commit**
```bash
git add -A
git commit -m "chore(verify): post-restructure verification pass — all gates green"
```

---

## Acceptance Checklist

Before declaring this plan complete, verify all of these:

- [ ] `pnpm-lock.yaml` committed, `package-lock.json` deleted
- [ ] `package.json` has `packageManager: "pnpm@9.x.x"` field
- [ ] `pnpm install` succeeds cleanly
- [ ] `pnpm dev` starts dev server on port 3000
- [ ] `pnpm build` produces `build/` directory
- [ ] `pnpm preview` serves the site
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm validate` exits 0
- [ ] `pnpm eval` exits 0
- [ ] `check-env.js`, `verify-security.js`, `verify-setup.js` deleted from root
- [ ] `scripts/checks/check-env.ts`, `verify-security.ts`, `verify-setup.ts` present
- [ ] `scripts/evals/run-evals.ts` present and functional
- [ ] `CLAUDE.md` present at repo root
- [ ] `.claude/commands/` contains 6 slash command files
- [ ] `docs/plans/`, `docs/prompts/`, `docs/evals/`, `docs/operations/` present
- [ ] `src/types/` with `content.ts` and `navigation.ts` present
- [ ] `.github/workflows/ci.yml` present
- [ ] `generate-v6feature-docs.yml` updated for pnpm
- [ ] `README.md` reflects pnpm and TypeScript policy
- [ ] `_ROLLBACK_RUNBOOK.md` moved to `docs/operations/rollback-runbook.md`
- [ ] No `.js` files at repo root (except `public/validate-fix.js` — static asset)
