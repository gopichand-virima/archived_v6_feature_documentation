#!/usr/bin/env tsx
/**
 * check-env.ts
 * Verifies .env.local is configured with required environment variables.
 * Run: pnpm check:env
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const ENV_PATH = path.join(ROOT, '.env.local')

const REQUIRED_VARS: string[] = [
  'VITE_OPENAI_API_KEY',
]

function maskSecret(value: string): string {
  if (value.length <= 20) return '***'
  return `${value.slice(0, 10)}...${value.slice(-10)}`
}

function parseEnvFile(content: string): Record<string, string> {
  const env: Record<string, string> = {}
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'))
  for (const line of lines) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
      env[key] = val
    }
  }
  return env
}

function checkEnv(): void {
  console.log('🔍 Checking environment configuration...\n')

  if (!fs.existsSync(ENV_PATH)) {
    console.error('❌ .env.local not found at:', ENV_PATH)
    console.error('   Create it by copying .env.example or configure manually.\n')
    process.exit(1)
  }

  const raw = fs.readFileSync(ENV_PATH, 'utf-8')
  const env = parseEnvFile(raw)

  let allOk = true
  for (const varName of REQUIRED_VARS) {
    const value = env[varName]
    if (!value || value === 'your_key_here' || value === '') {
      console.error(`❌ ${varName} is missing or is a placeholder`)
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
