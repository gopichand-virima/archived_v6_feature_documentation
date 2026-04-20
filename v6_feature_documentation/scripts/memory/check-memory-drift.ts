#!/usr/bin/env tsx
/**
 * check-memory-drift.ts
 *
 * Deterministic drift detector for docs/memory/repo-memory.json.
 *
 * Two detection strategies:
 *   1. VALUE CROSS-CHECK  — reads specific values from actual code files,
 *      compares them against what repo-memory.json records
 *   2. FILE-CHANGE TRACK  — git log since memory's generated_at, maps
 *      changed files through ROUTING_RULES to find which sections need updating
 *
 * Exit codes:
 *   0 = GREEN  — no drift detected
 *   1 = AMBER  — file changes detected, memory may need updating
 *   2 = RED    — value mismatch (critical: memory records wrong facts)
 *
 * Usage:
 *   pnpm memory:check
 *   pnpm tsx --tsconfig scripts/tsconfig.json scripts/memory/check-memory-drift.ts
 *   pnpm tsx --tsconfig scripts/tsconfig.json scripts/memory/check-memory-drift.ts --json
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ROUTING_RULES, TRIVIAL_FILE_PATTERNS, VALUE_CHECKS, type RoutingRule } from './change-routing-map.js';

// ─── Config ──────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(join(__dirname, '..', '..'));
const MEMORY_FILE = join(REPO_ROOT, 'docs', 'memory', 'repo-memory.json');
const JSON_OUTPUT = process.argv.includes('--json');

// ─── Types ───────────────────────────────────────────────────────────────────

interface DriftReport {
  memoryVersion: string;
  memoryDate: string;
  valueMismatches: ValueMismatch[];
  fileChanges: FileChangeResult[];
  affectedRules: AffectedRule[];
  status: 'GREEN' | 'AMBER' | 'RED';
  summary: string;
}

interface ValueMismatch {
  id: string;
  description: string;
  memoryPath: string;
  memoryValue: string;
  actualValue: string;
  severity: 'critical';
}

interface FileChangeResult {
  file: string;
  status: string;
  isTrivial: boolean;
}

interface AffectedRule {
  rule: RoutingRule;
  changedFiles: string[];
  updateDirective: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readMemory(): Record<string, unknown> {
  if (!existsSync(MEMORY_FILE)) {
    fatal(`Memory file not found: ${MEMORY_FILE}`);
  }
  return JSON.parse(readFileSync(MEMORY_FILE, 'utf8')) as Record<string, unknown>;
}

function getNestedValue(obj: Record<string, unknown>, dotPath: string): string {
  const parts = dotPath.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- traversal is intentionally flexible
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return '';
    current = current[part];
  }
  return String(current ?? '');
}

function extractValueFromFile(filePath: string, pattern: string): string | null {
  const fullPath = join(REPO_ROOT, filePath);
  if (!existsSync(fullPath)) return null;
  const content = readFileSync(fullPath, 'utf8');
  const match = content.match(new RegExp(pattern, 'm'));
  return match ? match[1] : null;
}

function isTrivialFile(filePath: string): boolean {
  return TRIVIAL_FILE_PATTERNS.some(p => filePath.startsWith(p) || filePath.includes(p));
}

function getChangedFilesSince(since: string): FileChangeResult[] {
  try {
    // Find the commit hash that last touched repo-memory.json on or before the since date
    // Then list all files changed after that commit
    const memoryCommit = execSync(
      `git -C "${REPO_ROOT}" log --oneline --follow -- docs/memory/repo-memory.json`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).split('\n')[0]?.split(' ')[0] ?? '';

    if (!memoryCommit) {
      // No git history yet — fall back to checking all uncommitted changes
      const status = execSync(
        `git -C "${REPO_ROOT}" status --porcelain`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
      );
      return status.trim().split('\n')
        .filter(l => l.trim())
        .map(l => ({
          file: l.slice(3).trim(),
          status: l.slice(0, 2).trim(),
          isTrivial: isTrivialFile(l.slice(3).trim()),
        }));
    }

    // Files changed in commits AFTER the most recent memory update commit
    const changedSinceRaw = execSync(
      `git -C "${REPO_ROOT}" diff --name-status ${memoryCommit}..HEAD`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );

    return changedSinceRaw.trim().split('\n')
      .filter(l => l.trim() && !l.startsWith('docs/memory/'))
      .map(l => {
        const parts = l.split('\t');
        const status = parts[0] ?? 'M';
        const file = parts[parts.length - 1] ?? '';
        return { file, status, isTrivial: isTrivialFile(file) };
      })
      .filter(r => r.file);
  } catch {
    return [];
  }
}

function matchFilesToRules(changes: FileChangeResult[]): AffectedRule[] {
  const nonTrivial = changes.filter(c => !c.isTrivial);
  const affectedMap = new Map<string, AffectedRule>();

  for (const change of nonTrivial) {
    for (const rule of ROUTING_RULES) {
      const matches = rule.trackedFiles.some(tf => {
        const normalized = change.file.replace(/\\/g, '/');
        return normalized === tf || normalized.endsWith('/' + tf) || normalized.includes(tf);
      });

      if (matches) {
        const existing = affectedMap.get(rule.id);
        if (existing) {
          existing.changedFiles.push(change.file);
        } else {
          const sections = rule.memorySections.map(s => `repo-memory.json § ${s}`).join(', ');
          const supporting = rule.supportingArtifacts
            .map(a => `${a.file} (${a.condition})`)
            .join('; ');
          const directive = supporting
            ? `Update ${sections}\n       Also check: ${supporting}`
            : `Update ${sections}`;

          affectedMap.set(rule.id, {
            rule,
            changedFiles: [change.file],
            updateDirective: directive,
          });
        }
      }
    }
  }

  return Array.from(affectedMap.values());
}

function fatal(msg: string): never {
  console.error(`\n❌ FATAL: ${msg}\n`);
  process.exit(3);
}

// ─── ANSI colors ─────────────────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};

function colorize(status: 'GREEN' | 'AMBER' | 'RED'): string {
  if (status === 'GREEN') return `${C.green}${C.bold}${status}${C.reset}`;
  if (status === 'AMBER') return `${C.yellow}${C.bold}${status}${C.reset}`;
  return `${C.red}${C.bold}${status}${C.reset}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const memory = readMemory();
  const memoryVersion = String(memory.memory_version ?? 'unknown');
  const memoryDate = String(memory.generated_at ?? 'unknown');

  if (!JSON_OUTPUT) {
    console.log(`\n${C.bold}${'═'.repeat(60)}${C.reset}`);
    console.log(`${C.bold}  Memory Drift Check — v6_feature_documentation${C.reset}`);
    console.log(`${C.bold}${'═'.repeat(60)}${C.reset}`);
    console.log(`${C.cyan}  Memory:  v${memoryVersion} — last updated ${memoryDate}${C.reset}`);
    console.log();
  }

  // ── Strategy 1: Value cross-checks ────────────────────────────────────────
  const valueMismatches: ValueMismatch[] = [];

  if (!JSON_OUTPUT) {
    console.log(`${C.bold}▶ VALUE CROSS-CHECKS${C.reset}  (actual code values vs memory)`);
    console.log(`  ${'─'.repeat(56)}`);
  }

  for (const check of VALUE_CHECKS) {
    const memoryValue = getNestedValue(memory, check.memoryPath);
    const actualValue = extractValueFromFile(check.sourceFile, check.extractPattern);

    if (actualValue === null) {
      if (!JSON_OUTPUT) {
        console.log(`  ${C.gray}⊘  ${check.description}: source file not found — skipping${C.reset}`);
      }
      continue;
    }

    const matches = check.id === 'generation-workflow-file'
      ? existsSync(join(REPO_ROOT, check.sourceFile)) // just check file exists
      : actualValue === memoryValue;

    if (matches) {
      if (!JSON_OUTPUT) {
        console.log(`  ${C.green}✓${C.reset}  ${check.description}: ${C.gray}${actualValue}${C.reset}`);
      }
    } else {
      if (!JSON_OUTPUT) {
        console.log(`  ${C.red}✗${C.reset}  ${C.bold}${check.description}${C.reset}`);
        console.log(`      Memory says: ${C.yellow}${memoryValue}${C.reset}`);
        console.log(`      Actual:      ${C.red}${actualValue}${C.reset}`);
        console.log(`      Fix:  update repo-memory.json § ${check.memoryPath}`);
      }
      valueMismatches.push({
        id: check.id,
        description: check.description,
        memoryPath: check.memoryPath,
        memoryValue,
        actualValue,
        severity: 'critical',
      });
    }
  }

  // ── Strategy 2: File-change tracking ──────────────────────────────────────
  const fileChanges = getChangedFilesSince(memoryDate);
  const nonTrivialChanges = fileChanges.filter(c => !c.isTrivial);
  const affectedRules = matchFilesToRules(fileChanges);

  if (!JSON_OUTPUT) {
    console.log();
    console.log(`${C.bold}▶ FILE CHANGES SINCE MEMORY UPDATE${C.reset}  (${memoryDate})`);
    console.log(`  ${'─'.repeat(56)}`);
  }

  if (nonTrivialChanges.length === 0) {
    if (!JSON_OUTPUT) {
      console.log(`  ${C.green}✓${C.reset}  No non-trivial file changes detected.`);
    }
  } else {
    for (const change of nonTrivialChanges) {
      const isTracked = affectedRules.some(r => r.changedFiles.includes(change.file));
      if (!JSON_OUTPUT) {
        const icon = isTracked ? `${C.yellow}◆${C.reset}` : `${C.gray}◇${C.reset}`;
        const label = isTracked ? '' : `${C.gray} (untracked in routing map)${C.reset}`;
        console.log(`  ${icon}  ${change.file}${label}`);
      }
    }
  }

  // ── Affected rules summary ─────────────────────────────────────────────────
  if (affectedRules.length > 0 && !JSON_OUTPUT) {
    console.log();
    console.log(`${C.bold}▶ ROUTING: REQUIRED MEMORY UPDATES${C.reset}`);
    console.log(`  ${'─'.repeat(56)}`);

    for (const affected of affectedRules) {
      const sev = affected.rule.severity === 'critical'
        ? `${C.red}[CRITICAL]${C.reset}`
        : affected.rule.severity === 'important'
        ? `${C.yellow}[IMPORTANT]${C.reset}`
        : `${C.gray}[low]${C.reset}`;

      console.log(`\n  ${sev} ${C.bold}${affected.rule.category}${C.reset}`);
      console.log(`  Changed files: ${affected.changedFiles.join(', ')}`);
      console.log(`  ${C.cyan}→ ${affected.updateDirective}${C.reset}`);
    }
  }

  // ── Final status ──────────────────────────────────────────────────────────
  let status: 'GREEN' | 'AMBER' | 'RED';
  let summary: string;
  let exitCode: number;

  if (valueMismatches.length > 0) {
    status = 'RED';
    summary = `${valueMismatches.length} value mismatch(es) — memory records wrong facts. Run /sync-repo-memory.`;
    exitCode = 2;
  } else if (affectedRules.length > 0) {
    const hasCritical = affectedRules.some(r => r.rule.severity === 'critical');
    status = hasCritical ? 'RED' : 'AMBER';
    summary = `${affectedRules.length} category/categories need memory update. Run /sync-repo-memory.`;
    exitCode = 1;
  } else {
    status = 'GREEN';
    summary = 'Memory is current. No drift detected.';
    exitCode = 0;
  }

  const report: DriftReport = {
    memoryVersion,
    memoryDate,
    valueMismatches,
    fileChanges: fileChanges.filter(c => !c.isTrivial),
    affectedRules,
    status,
    summary,
  };

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log();
    console.log(`${'═'.repeat(60)}`);
    console.log(`  STATUS: ${colorize(status)}`);
    console.log(`  ${summary}`);
    if (exitCode > 0) {
      console.log(`\n  ${C.cyan}Next step: Run /sync-repo-memory or pnpm memory:update${C.reset}`);
    }
    console.log(`${'═'.repeat(60)}\n`);
  }

  process.exit(exitCode);
}

main();
