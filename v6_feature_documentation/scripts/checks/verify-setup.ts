#!/usr/bin/env tsx
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')

type Severity = 'ERROR' | 'WARN' | 'OK'

interface CheckResult {
  name: string
  severity: Severity
  message: string
}

const results: CheckResult[] = []

function check(
  name: string,
  passed: boolean,
  message: string,
  severity: 'ERROR' | 'WARN' = 'ERROR'
): void {
  results.push({
    name,
    severity: passed ? 'OK' : severity,
    message: passed ? 'present' : message,
  })
  const icon = passed ? '✅' : severity === 'WARN' ? '⚠️ ' : '❌'
  console.log(`${icon} ${name}: ${passed ? 'OK' : message}`)
}

function exists(rel: string): boolean {
  return fs.existsSync(path.join(ROOT, rel))
}

function isDir(rel: string): boolean {
  const full = path.join(ROOT, rel)
  return fs.existsSync(full) && fs.statSync(full).isDirectory()
}

function checkRequiredFiles(): void {
  console.log('\n--- Required files ---')

  check('package.json', exists('package.json'), 'missing package.json')
  check('pnpm-lock.yaml', exists('pnpm-lock.yaml'), 'missing pnpm-lock.yaml — run pnpm install')
  check('vite.config.ts', exists('vite.config.ts'), 'missing vite.config.ts')
  check('index.html', exists('index.html'), 'missing index.html')
  check('src/tsconfig.json', exists('src/tsconfig.json'), 'missing src/tsconfig.json')
  check('.gitignore', exists('.gitignore'), 'missing .gitignore')
  check(
    'CLAUDE.md',
    exists('CLAUDE.md'),
    'CLAUDE.md not yet created (will be added in a later task)',
    'WARN'
  )
}

function checkRequiredDirs(): void {
  console.log('\n--- Required directories ---')

  // Core src directories — must exist
  check('src/components', isDir('src/components'), 'missing src/components directory')
  check('src/pages/content', isDir('src/pages/content'), 'missing src/pages/content directory')
  check('src/lib/content', isDir('src/lib/content'), 'missing src/lib/content directory')
  check('src/lib', isDir('src/lib'), 'missing src/lib directory')
  check('src/utils', isDir('src/utils'), 'missing src/utils directory')
  check('src/styles', isDir('src/styles'), 'missing src/styles directory')

  // CI directory — must exist
  check('.github/workflows', isDir('.github/workflows'), 'missing .github/workflows directory')

  // Enterprise-restructure directories — WARN if missing (created in later tasks)
  check(
    'scripts/checks',
    isDir('scripts/checks'),
    'scripts/checks not yet created',
    'WARN'
  )
  check(
    'scripts/evals',
    isDir('scripts/evals'),
    'scripts/evals not yet created',
    'WARN'
  )
  check(
    'docs/plans',
    isDir('docs/plans'),
    'docs/plans not yet created',
    'WARN'
  )
  check(
    'docs/prompts',
    isDir('docs/prompts'),
    'docs/prompts not yet created',
    'WARN'
  )
  check(
    'docs/evals',
    isDir('docs/evals'),
    'docs/evals not yet created',
    'WARN'
  )
  check(
    '.claude/commands',
    isDir('.claude/commands'),
    '.claude/commands not yet created',
    'WARN'
  )

  // Memory system — required for AI governance and drift detection
  check(
    'docs/memory',
    isDir('docs/memory'),
    'docs/memory/ missing — AI memory system not initialized',
    'WARN'
  )
  check(
    'docs/memory/repo-memory.json',
    exists('docs/memory/repo-memory.json'),
    'docs/memory/repo-memory.json missing — canonical memory store not found',
    'WARN'
  )
  check(
    'scripts/memory',
    isDir('scripts/memory'),
    'scripts/memory/ missing — drift detection scripts not present',
    'WARN'
  )
}

function checkPackageJson(): void {
  console.log('\n--- package.json checks ---')

  const pkgPath = path.join(ROOT, 'package.json')
  if (!fs.existsSync(pkgPath)) {
    check('package.json readable', false, 'package.json does not exist')
    return
  }

  let pkg: Record<string, unknown>
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as Record<string, unknown>
  } catch {
    check('package.json parseable', false, 'failed to parse package.json')
    return
  }

  // packageManager must start with pnpm
  const pm = typeof pkg.packageManager === 'string' ? pkg.packageManager : ''
  check(
    'packageManager field is pnpm',
    pm.startsWith('pnpm'),
    `packageManager is "${pm || 'unset'}" — must start with "pnpm"`
  )

  // No package-lock.json at root
  check(
    'no package-lock.json at root',
    !exists('package-lock.json'),
    'package-lock.json found at root — delete it and use pnpm-lock.yaml only'
  )

  // Required scripts
  const scripts = (pkg.scripts as Record<string, unknown>) ?? {}
  const requiredScripts = ['dev', 'build', 'preview', 'typecheck', 'validate', 'eval', 'check:paths', 'memory:check']
  for (const s of requiredScripts) {
    check(
      `script: ${s}`,
      typeof scripts[s] === 'string',
      `script "${s}" is missing from package.json`
    )
  }

  // Required devDependencies
  const devDeps = (pkg.devDependencies as Record<string, unknown>) ?? {}
  const requiredDevDeps = ['typescript', 'tsx']
  for (const dep of requiredDevDeps) {
    check(
      `devDependency: ${dep}`,
      typeof devDeps[dep] === 'string',
      `devDependency "${dep}" is missing`
    )
  }
}

function checkTypescriptOnlyPolicy(): void {
  console.log('\n--- TypeScript-only policy (root JS files must be absent) ---')

  check(
    'check-env.js absent',
    !exists('check-env.js'),
    'check-env.js still exists at root — delete it (use scripts/checks/check-env.ts)'
  )
  check(
    'verify-security.js absent',
    !exists('verify-security.js'),
    'verify-security.js still exists at root — delete it (use scripts/checks/verify-security.ts)'
  )
  check(
    'verify-setup.js absent',
    !exists('verify-setup.js'),
    'verify-setup.js still exists at root — delete it (use scripts/checks/verify-setup.ts)'
  )
}

function printSummary(): void {
  const errors = results.filter(r => r.severity === 'ERROR')
  const warnings = results.filter(r => r.severity === 'WARN')
  const ok = results.filter(r => r.severity === 'OK')

  console.log(`\n${'='.repeat(60)}`)
  console.log(
    `Setup check: ${ok.length} OK, ${warnings.length} warnings, ${errors.length} errors`
  )

  if (warnings.length > 0) {
    console.log('\nWarnings (items not yet created — expected during migration):')
    for (const w of warnings) {
      console.log(`  ⚠️  ${w.name}: ${w.message}`)
    }
  }

  if (errors.length > 0) {
    console.log('\nErrors (must be fixed before proceeding):')
    for (const e of errors) {
      console.log(`  ❌ ${e.name}: ${e.message}`)
    }
    process.exit(1)
  }

  console.log('\nSetup check passed.')
}

// Main
console.log('Virima Documentation — Setup Verification')
console.log(`Root: ${ROOT}`)

checkRequiredFiles()
checkRequiredDirs()
checkPackageJson()
checkTypescriptOnlyPolicy()
printSummary()
