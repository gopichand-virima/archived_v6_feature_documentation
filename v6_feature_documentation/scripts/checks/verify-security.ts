#!/usr/bin/env tsx
/**
 * verify-security.ts
 * Scans source files for hardcoded secrets and verifies security configuration.
 * Run: pnpm check:security
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')

interface ScanResult {
  file: string
  line: number
  excerpt: string
}

const SENSITIVE_PATTERNS: RegExp[] = [
  /sk-[a-zA-Z0-9]{20,}/,             // OpenAI API key (sk-... or sk-proj-...)
  /sk-ant-[a-zA-Z0-9\-_]{20,}/,      // Anthropic API key (sk-ant-...)
  /AKIA[0-9A-Z]{16}/,                 // AWS Access Key ID
  /ghp_[A-Za-z0-9]{36}/,             // GitHub Personal Access Token (classic)
  /github_pat_[A-Za-z0-9_]{22,}/,    // GitHub Fine-grained Personal Access Token
]

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', '.pnpm-store'])
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'])

// Files whose names indicate they are intentionally allowed to contain secrets
const SKIP_FILE_PATTERNS: RegExp[] = [
  /\.env\.local$/,
  /\.env(\.[^.]+)?\.local$/,
  /verify-security\.[tj]s$/,
]

function shouldSkipFile(filePath: string): boolean {
  return SKIP_FILE_PATTERNS.some(p => p.test(filePath))
}

function scanFile(filePath: string): ScanResult[] {
  const ext = path.extname(filePath)
  if (!SCAN_EXTENSIONS.has(ext)) return []
  if (shouldSkipFile(filePath)) return []

  const results: ScanResult[] = []

  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return []
  }

  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(line)) {
        results.push({
          file: filePath,
          line: i + 1,
          excerpt: line.trim().slice(0, 120),
        })
        break // one result per line is enough
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
    return []
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        results.push(...scanDirectory(path.join(dir, entry.name)))
      }
    } else if (entry.isFile()) {
      results.push(...scanFile(path.join(dir, entry.name)))
    }
  }

  return results
}

function verifyGitignore(): boolean {
  console.log('Checking .gitignore...')
  const gitignorePath = path.join(ROOT, '.gitignore')

  if (!fs.existsSync(gitignorePath)) {
    console.error('  FAIL: .gitignore not found')
    return false
  }

  const content = fs.readFileSync(gitignorePath, 'utf-8')
  // Accept either .env.*.local or .env*.local (both are correct gitignore patterns)
  const required = ['.env.local', '.env*.local']
  const missing = required.filter(entry => !content.includes(entry))

  if (missing.length > 0) {
    console.error(`  FAIL: .gitignore is missing required entries: ${missing.join(', ')}`)
    return false
  }

  console.log('  PASS: .gitignore contains .env.local and .env.*.local')
  return true
}

function verifySearchConfig(): boolean {
  console.log('Checking src/lib/search/config.ts...')
  const configPath = path.join(ROOT, 'src', 'lib', 'search', 'config.ts')

  if (!fs.existsSync(configPath)) {
    console.log('  SKIP: src/lib/search/config.ts not found (optional file)')
    return true
  }

  const content = fs.readFileSync(configPath, 'utf-8')

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(content)) {
      console.error('  FAIL: src/lib/search/config.ts contains a hardcoded secret')
      return false
    }
  }

  console.log('  PASS: src/lib/search/config.ts has no hardcoded secrets')
  return true
}

function runSecurityChecks(): void {
  console.log('Virima Documentation - Security Verification\n')
  console.log('='.repeat(60))

  const gitignoreOk = verifyGitignore()
  const configOk = verifySearchConfig()

  console.log('\nScanning source files for hardcoded secrets...')
  const findings = scanDirectory(ROOT)

  console.log('\n' + '='.repeat(60))
  console.log('Results')
  console.log('='.repeat(60))

  let exitCode = 0

  if (findings.length > 0) {
    console.error(`\nFAIL: Found ${findings.length} potential secret(s) in source code:\n`)
    for (const finding of findings) {
      const rel = path.relative(ROOT, finding.file)
      console.error(`  ${rel}:${finding.line}`)
      console.error(`    ${finding.excerpt}`)
    }
    console.error('\nCRITICAL: Remove hardcoded secrets before committing.\n')
    exitCode = 1
  } else {
    console.log('\nPASS: No hardcoded secrets found in source files.')
  }

  if (!gitignoreOk || !configOk) {
    console.error('\nFAIL: One or more security configuration checks failed (see above).')
    exitCode = 1
  }

  if (exitCode === 0) {
    console.log('\nAll security checks passed. Repository is safe to push.\n')
  } else {
    console.error('\nSecurity verification failed. Review and fix issues above.\n')
  }

  process.exit(exitCode)
}

runSecurityChecks()
