#!/usr/bin/env tsx
/**
 * update-memory.ts
 *
 * Guided helper for bumping docs/memory/repo-memory.json after manual edits.
 *
 * Usage:
 *   pnpm memory:update              — bump generated_at + patch-bump memory_version
 *   pnpm memory:update --validate   — validate JSON is well-formed (no changes)
 *   pnpm memory:update --section <key>  — print current value of a section for editing reference
 *
 * Never auto-edits memory content — that's the agent's job.
 * This only bumps the version/date metadata and validates structure.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ─── Config ──────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(join(__dirname, '..', '..'));
const MEMORY_FILE = join(REPO_ROOT, 'docs', 'memory', 'repo-memory.json');
const SCHEMA_FILE = join(REPO_ROOT, 'docs', 'memory', 'repo-memory.schema.json');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fatal(msg: string): never {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}

function patchBump(version: string): string {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return version;
  parts[2]++;
  return parts.join('.');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Validate ────────────────────────────────────────────────────────────────

function validateMemory(): boolean {
  if (!existsSync(MEMORY_FILE)) {
    fatal(`Memory file not found: ${MEMORY_FILE}`);
  }

  let memory: Record<string, unknown>;
  try {
    memory = JSON.parse(readFileSync(MEMORY_FILE, 'utf8')) as Record<string, unknown>;
  } catch (e) {
    console.error(`❌  docs/memory/repo-memory.json is not valid JSON:\n    ${String(e)}`);
    return false;
  }

  // Check required top-level keys
  const required = [
    '$schema', 'memory_version', 'generated_at', 'maintained_by',
    'project_identity', 'project_scope', 'repo_contracts', 'folder_structure',
    'generation_pipeline', 'tooling_and_build', 'validation_gates', 'anti_patterns_to_avoid',
  ];
  const missing = required.filter(k => !(k in memory));
  if (missing.length > 0) {
    console.error(`❌  Missing required keys: ${missing.join(', ')}`);
    return false;
  }

  // Check version format
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (!versionPattern.test(String(memory.memory_version ?? ''))) {
    console.error(`❌  memory_version must be semver (e.g. 1.2.3), got: ${memory.memory_version}`);
    return false;
  }

  // Check anti_patterns is an array of strings
  const ap = memory.anti_patterns_to_avoid;
  if (!Array.isArray(ap) || ap.some(x => typeof x !== 'string')) {
    console.error('❌  anti_patterns_to_avoid must be an array of strings');
    return false;
  }

  console.log(`✅  docs/memory/repo-memory.json is valid`);
  console.log(`    version: ${memory.memory_version}  |  generated_at: ${memory.generated_at}`);
  console.log(`    sections: ${Object.keys(memory).filter(k => !k.startsWith('$')).length}`);
  return true;
}

// ─── Bump ────────────────────────────────────────────────────────────────────

function bumpMemory(): void {
  if (!existsSync(MEMORY_FILE)) {
    fatal(`Memory file not found: ${MEMORY_FILE}`);
  }

  let raw: string;
  let memory: Record<string, unknown>;
  try {
    raw = readFileSync(MEMORY_FILE, 'utf8');
    memory = JSON.parse(raw) as Record<string, unknown>;
  } catch (e) {
    fatal(`Cannot parse repo-memory.json: ${String(e)}`);
  }

  const oldVersion = String(memory.memory_version ?? '1.0.0');
  const oldDate = String(memory.generated_at ?? 'unknown');
  const newVersion = patchBump(oldVersion);
  const newDate = todayISO();

  // Replace in raw string to preserve formatting
  const updated = raw
    .replace(
      /"memory_version":\s*"[^"]+"/,
      `"memory_version": "${newVersion}"`,
    )
    .replace(
      /"generated_at":\s*"[^"]+"/,
      `"generated_at": "${newDate}"`,
    );

  // Validate the result still parses
  try {
    JSON.parse(updated);
  } catch (e) {
    fatal(`After bump, JSON became invalid: ${String(e)}`);
  }

  writeFileSync(MEMORY_FILE, updated, 'utf8');

  console.log(`\n✅  repo-memory.json bumped`);
  console.log(`    memory_version: ${oldVersion} → ${newVersion}`);
  console.log(`    generated_at:   ${oldDate} → ${newDate}\n`);
}

// ─── Print section ────────────────────────────────────────────────────────────

function printSection(sectionKey: string): void {
  if (!existsSync(MEMORY_FILE)) {
    fatal(`Memory file not found: ${MEMORY_FILE}`);
  }
  const memory = JSON.parse(readFileSync(MEMORY_FILE, 'utf8')) as Record<string, unknown>;
  if (!(sectionKey in memory)) {
    console.error(`\n❌  Section not found: ${sectionKey}`);
    console.log(`    Available sections: ${Object.keys(memory).filter(k => !k.startsWith('$')).join(', ')}`);
    process.exit(1);
  }
  console.log(`\n── repo-memory.json § ${sectionKey} ──`);
  console.log(JSON.stringify(memory[sectionKey], null, 2));
  console.log();
}

// ─── CLI entry ────────────────────────────────────────────────────────────────

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--validate')) {
    const ok = validateMemory();
    process.exit(ok ? 0 : 1);
  }

  if (args.includes('--section')) {
    const idx = args.indexOf('--section');
    const key = args[idx + 1];
    if (!key) fatal('--section requires a key argument (e.g. --section theme_and_branding)');
    printSection(key);
    return;
  }

  // Default: bump version + date, then validate
  bumpMemory();
  const ok = validateMemory();
  process.exit(ok ? 0 : 1);
}

main();
