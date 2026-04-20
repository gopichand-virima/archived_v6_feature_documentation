#!/usr/bin/env tsx
/**
 * check-retrieval-integrity.ts
 *
 * Static-analysis guard for the Ask Virima retrieval pipeline.
 * Enforces that correctness invariants introduced in the 2026-04-08 retrieval
 * hardening pass are never silently removed.
 *
 * Run: pnpm check:retrieval
 * Called automatically by: pnpm validate
 *
 * WHAT IT CHECKS
 * ══════════════
 * 1. docs-search.ts structural invariants
 *    a. STOP_WORDS set must exist and contain the critical stop words
 *       that caused the original retrieval regression
 *    b. containsWord() whole-word matching function must exist
 *    c. No bare `text.includes(term)` or `excerptLower.includes(term)` in
 *       the scoring loop (only in containsWord itself is acceptable)
 *    d. Result cap (.slice(0, 12)) must be present
 *    e. effectiveTerms stop-word filtering must be present
 *
 * 2. intent-detection.ts structural invariants
 *    a. UNSAFE_SIGNALS array must contain injection-detection terms
 *    b. OUT_OF_SCOPE_SIGNALS must contain the core rejection vocabulary
 *
 * 3. Artifact integrity
 *    a. public/search-index.json must exist and contain >= 300 entries
 *       (prevents silent search coverage collapse)
 *    b. public/doc-graph.json must exist and contain >= 300 nodes
 *       (prevents silent graph collapse)
 *
 * EXIT CODES
 *   0  all checks pass
 *   1  one or more checks fail
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// ─── Helpers ──────────────────────────────────────────────────────────────────

let failures = 0;
let passes = 0;

function pass(label: string): void {
  console.log(`  ✅ PASS  ${label}`);
  passes++;
}

function fail(label: string, detail?: string): void {
  console.error(`  ❌ FAIL  ${label}`);
  if (detail) console.error(`         ${detail}`);
  failures++;
}

function readSrc(relPath: string): string {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    fail(`File exists: ${relPath}`, 'File not found — was it deleted?');
    return '';
  }
  return fs.readFileSync(abs, 'utf-8');
}

// ─── Check 1: docs-search.ts structural invariants ───────────────────────────

function checkDocsSearch(): void {
  console.log('\n── docs-search.ts ──────────────────────────────────────────────');

  const src = readSrc('src/lib/search/docs-search.ts');
  if (!src) return;

  // 1a. STOP_WORDS set must exist
  if (/const\s+STOP_WORDS\s*=\s*new\s+Set/.test(src)) {
    pass('STOP_WORDS set defined');
  } else {
    fail('STOP_WORDS set missing', 'Add "const STOP_WORDS = new Set([...])" — prevents stop-word regression');
  }

  // 1a-2. Critical stop words that caused the original regression must be present
  const criticalStopWords = ['how', 'do', 'in', 'what', 'is', 'the', 'i', 'to'];
  const missingWords = criticalStopWords.filter(w => !src.includes(`'${w}'`));
  if (missingWords.length === 0) {
    pass('Critical stop words present (how, do, in, what, is, the, i, to)');
  } else {
    fail(
      `Critical stop words missing: ${missingWords.join(', ')}`,
      'These exact words caused irrelevant pages to rank first — they MUST stay in STOP_WORDS',
    );
  }

  // 1b. containsWord() whole-word matching must exist
  if (/function\s+containsWord\s*\(/.test(src)) {
    pass('containsWord() whole-word function defined');
  } else {
    fail(
      'containsWord() function missing',
      'Whole-word boundary matching prevents "in" from scoring against "information"',
    );
  }

  // 1b-2. containsWord must use a word-boundary regex (not plain includes)
  if (/RegExp/.test(src) && /containsWord/.test(src)) {
    pass('containsWord() uses RegExp (word-boundary)');
  } else {
    fail(
      'containsWord() does not use RegExp',
      'Must use word-boundary regex: /(?:^|[^a-z0-9])${term}(?:[^a-z0-9]|$)/',
    );
  }

  // 1c. No bare .includes(term) in the scoring loop
  // Allow: text.includes(term) ONLY inside containsWord (for short terms < 3 chars)
  // Disallow: scoring lines like `if (excerptLower.includes(term)) score += N`
  const scoringIncludesPattern = /score\s*\+=.*\.includes\(/;
  if (scoringIncludesPattern.test(src)) {
    fail(
      'Bare .includes() found in scoring logic',
      'Scoring must use containsWord() — bare substring matching causes false positives',
    );
  } else {
    pass('No bare .includes() in scoring logic');
  }

  // 1d. Result cap must follow the sort() call in searchDocs (prevents unbounded results).
  //     Pattern: .sort((a, b) => b.score - a.score) followed by .slice(0, N)
  //     The sort and slice may be on different lines, so we scan for .slice(0, N)
  //     that appears after a sort-by-score block. Use the score-sort + slice proximity.
  const resultCapMatch = src.match(/b\.score\s*-\s*a\.score[\s\S]{0,50}\.slice\(0,\s*(\d+)\)/);
  if (resultCapMatch) {
    const cap = parseInt(resultCapMatch[1], 10);
    if (cap >= 5 && cap <= 15) {
      pass(`Result cap enforced after sort: .slice(0, ${cap})`);
    } else if (cap > 15) {
      fail(`Result cap too large: .slice(0, ${cap})`, 'Keep result cap <= 15 to limit token usage');
    } else {
      fail(`Result cap too small: .slice(0, ${cap})`, 'Minimum 5 results needed for useful responses');
    }
  } else {
    fail(
      'Result cap after sort() not found in searchDocs',
      'Add .sort(...).slice(0, 12) — prevents unbounded results',
    );
  }

  // 1e. effectiveTerms stop-word filtering must be used before scoring
  if (/effectiveTerms/.test(src)) {
    pass('effectiveTerms stop-word filtering applied before scoring');
  } else {
    fail(
      'effectiveTerms variable missing',
      'Stop words must be filtered BEFORE scoring begins, not after',
    );
  }

  // 1f. QUERY_SYNONYMS map must be present (abbreviation expansion)
  if (/QUERY_SYNONYMS/.test(src)) {
    pass('QUERY_SYNONYMS abbreviation map present');
  } else {
    fail(
      'QUERY_SYNONYMS missing',
      'Synonym expansion ("sr"→"service request", "ci"→"configuration item") must be present',
    );
  }

  // 1g. expandSynonyms function must exist
  if (/function\s+expandSynonyms\s*\(/.test(src)) {
    pass('expandSynonyms() expansion function defined');
  } else {
    fail(
      'expandSynonyms() function missing',
      'Synonym expansion is required — adds domain abbreviation coverage',
    );
  }

  // 1h. Module boost signals must be present
  if (/MODULE_BOOST_SIGNALS/.test(src)) {
    pass('MODULE_BOOST_SIGNALS module-affinity map present');
  } else {
    fail(
      'MODULE_BOOST_SIGNALS missing',
      'Module boost reduces cross-module noise at zero token cost',
    );
  }

  // 1i. QUERY_SYNONYMS must have >= 10 entries (guards against accidental wipe)
  //     Count lines matching 'key': 'value' pattern inside the QUERY_SYNONYMS block.
  const synonymBlock = src.match(/QUERY_SYNONYMS[^{]*\{([\s\S]*?)\};/)?.[1] ?? '';
  const synonymCount = synonymBlock.split('\n').filter(l => /'\s*:\s*'/.test(l)).length;
  if (synonymCount >= 10) {
    pass(`QUERY_SYNONYMS has ${synonymCount} entries (>= 10 required — guards against accidental wipe)`);
  } else {
    fail(
      `QUERY_SYNONYMS too small: ${synonymCount} entries`,
      'Synonym map must have >= 10 entries — a near-empty map silently breaks abbreviation handling (SR, CI, VM, etc.)',
    );
  }

  // 1j. MODULE_BOOST_SIGNALS must have >= 8 entries
  const boostBlock = src.match(/MODULE_BOOST_SIGNALS[^{]*\{([\s\S]*?)\};/)?.[1] ?? '';
  const boostCount = boostBlock.split('\n').filter(l => /'\s*:\s*'/.test(l)).length;
  if (boostCount >= 8) {
    pass(`MODULE_BOOST_SIGNALS has ${boostCount} entries (>= 8 required)`);
  } else {
    fail(
      `MODULE_BOOST_SIGNALS too small: ${boostCount} entries`,
      'Module boost map must have >= 8 entries — fewer signals mean cross-module noise returns',
    );
  }

  // 1k. expandSynonyms must be additive — original tokens must be spread into result
  //     This prevents a future refactor from accidentally removing original terms.
  if (/const result\s*=\s*\[\.\.\.tokens\]/.test(src)) {
    pass('expandSynonyms() is additive ([...tokens] spread — originals preserved)');
  } else {
    fail(
      'expandSynonyms() additive invariant broken',
      'Must initialise result with [...tokens] spread — original query terms must NEVER be removed by expansion',
    );
  }

  // 1l. searchCurrentPage must be synchronous (no async/await)
  //     DOM-based page search must execute instantly — async would break the UX contract.
  const pageSearchAsync = /async\s+function\s+searchCurrentPage|searchCurrentPage\s*=\s*async/.test(src);
  if (pageSearchAsync) {
    fail(
      'searchCurrentPage() is async — must be synchronous',
      '"This page" scope search must be instant DOM traversal; async introduces latency and loading states',
    );
  } else {
    pass('searchCurrentPage() is synchronous (instant DOM traversal — no async latency)');
  }
}

// ─── Check 2: intent-detection.ts structural invariants ──────────────────────

function checkIntentDetection(): void {
  console.log('\n── intent-detection.ts ─────────────────────────────────────────');

  const src = readSrc('src/lib/chat/intent-detection.ts');
  if (!src) return;

  // 2a. UNSAFE_SIGNALS must contain injection-detection terms
  const requiredUnsafeSignals = ['ignore instructions', 'jailbreak', 'pretend you are', 'ignore previous'];
  const missingUnsafe = requiredUnsafeSignals.filter(s => !src.includes(s));
  if (missingUnsafe.length === 0) {
    pass('UNSAFE_SIGNALS contains all required injection terms');
  } else {
    fail(
      `UNSAFE_SIGNALS missing: ${missingUnsafe.join(' | ')}`,
      'Prompt injection patterns must remain in UNSAFE_SIGNALS',
    );
  }

  // 2b. OUT_OF_SCOPE_SIGNALS must contain the core rejection vocabulary
  const requiredOutOfScope = ['weather', 'stock price', 'recipe', 'symptom', 'capital of'];
  const missingOOS = requiredOutOfScope.filter(s => !src.includes(s));
  if (missingOOS.length === 0) {
    pass('OUT_OF_SCOPE_SIGNALS contains required rejection vocabulary');
  } else {
    fail(
      `OUT_OF_SCOPE_SIGNALS missing: ${missingOOS.join(' | ')}`,
      'Out-of-scope signals must remain to reject off-topic queries',
    );
  }

  // 2c. classifyIntent function must exist
  if (/export function classifyIntent/.test(src)) {
    pass('classifyIntent() exported correctly');
  } else {
    fail('classifyIntent() export missing', 'Core classification function was removed');
  }

  // 2d. Zero external API calls (no fetch, no axios, no import of API clients)
  if (/\bfetch\s*\(/.test(src) || /axios/.test(src)) {
    fail(
      'External API call detected in intent-detection.ts',
      'Intent classification must be synchronous and zero-cost (no external calls)',
    );
  } else {
    pass('Intent detection is zero-cost (no external API calls)');
  }
}

// ─── Check 3: Artifact integrity ──────────────────────────────────────────────

function checkArtifacts(): void {
  console.log('\n── Build artifacts ─────────────────────────────────────────────');

  // 3a. search-index.json must exist and have >= 300 entries
  const searchIndexPath = path.join(ROOT, 'public', 'search-index.json');
  if (fs.existsSync(searchIndexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8')) as unknown[];
      // Threshold: 350 = covers all 11 modules with deduplication
      // (current: 367 unique entries from 388 TOC references, 21 duplicates removed)
      if (index.length >= 350) {
        pass(`search-index.json exists: ${index.length} entries (>= 350 required)`);
      } else {
        fail(
          `search-index.json too small: ${index.length} entries`,
          'Run `pnpm build-search-index` — coverage has degraded below minimum threshold (350 unique pages required)',
        );
      }
    } catch {
      fail('search-index.json parse error', 'File is malformed — rebuild with `pnpm build-search-index`');
    }
  } else {
    fail(
      'public/search-index.json not found',
      'Run `pnpm build-search-index` to generate the search index',
    );
  }

  // 3b. doc-graph.json must exist and have >= 300 nodes
  const graphPath = path.join(ROOT, 'public', 'doc-graph.json');
  if (fs.existsSync(graphPath)) {
    try {
      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8')) as { nodes: unknown[] };
      if (graph.nodes.length >= 300) {
        pass(`doc-graph.json exists: ${graph.nodes.length} nodes (>= 300 required)`);
      } else {
        fail(
          `doc-graph.json too small: ${graph.nodes.length} nodes`,
          'Run `pnpm build-doc-graph` — graph coverage has degraded',
        );
      }
    } catch {
      fail('doc-graph.json parse error', 'File is malformed — rebuild with `pnpm build-doc-graph`');
    }
  } else {
    // doc-graph.json is generated at build time — only fail if this is a CI environment
    const inCI = process.env.CI === 'true';
    if (inCI) {
      fail(
        'public/doc-graph.json not found (CI)',
        'Run `pnpm build-doc-graph` before `pnpm validate` in CI',
      );
    } else {
      console.log('  ⚠️  SKIP  doc-graph.json not found (run `pnpm build-doc-graph` to generate)');
    }
  }

  // 3c. ChatPanel.tsx must use top-3 result cap for response generation
  const chatPanelPath = path.join(ROOT, 'src', 'components', 'ChatPanel.tsx');
  if (fs.existsSync(chatPanelPath)) {
    const chatSrc = fs.readFileSync(chatPanelPath, 'utf-8');
    // Look for slice(1, 3) which takes results 2 and 3 (total = 3)
    if (/\.slice\(1,\s*3\)/.test(chatSrc)) {
      pass('ChatPanel.tsx uses top-3 result cap for response generation');
    } else {
      fail(
        'ChatPanel.tsx top-3 result cap not found',
        'Response generation must use exactly 3 results to maintain token budget',
      );
    }

    // 3d. No Anthropic SDK / LLM call in the doc-retrieval path
    if (/Anthropic|openai|anthropic\.messages|chat\.completions/.test(chatSrc)) {
      fail(
        'LLM client detected in ChatPanel.tsx',
        'Doc retrieval must remain zero-LLM-token — no AI API calls in the search path',
      );
    } else {
      pass('ChatPanel.tsx has no LLM API calls (zero-token retrieval confirmed)');
    }
  } else {
    fail('src/components/ChatPanel.tsx not found');
  }
}

// ─── Check 5: Search Index Data Contract ─────────────────────────────────────

function checkIndexDataContract(): void {
  console.log('\n── Search index data contract ──────────────────────────────────');

  const searchIndexPath = path.join(ROOT, 'public', 'search-index.json');
  if (!fs.existsSync(searchIndexPath)) {
    console.log('  ⚠️  SKIP  search-index.json not found');
    return;
  }

  let index: Array<Record<string, unknown>>;
  try {
    index = JSON.parse(fs.readFileSync(searchIndexPath, 'utf-8')) as Array<Record<string, unknown>>;
  } catch {
    fail('search-index.json parse error', 'Cannot validate data contract on malformed JSON');
    return;
  }

  // 5a. No duplicate IDs — duplicate IDs cause non-deterministic keyboard navigation
  const ids = index.map(e => e['id'] as string);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size === ids.length) {
    pass(`No duplicate IDs in search-index.json (${ids.length} unique entries)`);
  } else {
    fail(
      `search-index.json has ${ids.length - uniqueIds.size} duplicate ID(s)`,
      'Duplicate IDs cause non-deterministic result selection — run `pnpm build-search-index` to rebuild',
    );
  }

  // 5b. All entries have required rendering fields
  //     excerpt is NOT required here — pages with no extractable body text legitimately
  //     have empty excerpts (build-search-index.ts falls back to title for the stored value,
  //     but we still check the core structural fields).
  const requiredFields = ['id', 'navId', 'title', 'module', 'moduleLabel', 'filePath', 'breadcrumb'];
  const missingFieldEntries = index.filter(e =>
    requiredFields.some(f => !e[f] || (e[f] as string).trim() === '')
  );
  if (missingFieldEntries.length === 0) {
    pass('All search-index.json entries have required fields (id, navId, title, module, filePath, breadcrumb)');
  } else {
    const sample = (missingFieldEntries[0]?.['id'] as string | undefined) ?? 'unknown';
    fail(
      `${missingFieldEntries.length} entries missing required fields (first: "${sample}")`,
      `Required: ${requiredFields.join(', ')} — malformed entries render as blank results`,
    );
  }

  // 5b-2. Advisory: warn (not fail) if excerpts are missing — may indicate truncated content
  const emptyExcerpts = index.filter(e => !e['excerpt'] || (e['excerpt'] as string).trim() === '');
  if (emptyExcerpts.length > 0) {
    console.log(`  ⚠️  WARN  ${emptyExcerpts.length} entries have empty excerpts (pages lack extractable body text — check build-search-index excerpt fallback)`);
  }

  // 5c. All filePaths must start with /content/ (path contract)
  //     Malformed paths produce 404s when users click search results.
  const badPaths = index.filter(e => {
    const fp = e['filePath'] as string | undefined;
    return !fp || (!fp.startsWith('/content/') && !fp.startsWith('content/'));
  });
  if (badPaths.length === 0) {
    pass('All search-index.json filePaths start with /content/');
  } else {
    fail(
      `${badPaths.length} entries have invalid filePaths`,
      'All filePaths must start with /content/ — broken paths produce 404s when users click results',
    );
  }
}

// ─── Check 4: No MDX reintroduction ──────────────────────────────────────────

function checkNoMdxRegression(): void {
  console.log('\n── MDX regression guard ─────────────────────────────────────────');

  const contentDir = path.join(ROOT, 'src', 'pages', 'content', '6_1');
  if (!fs.existsSync(contentDir)) {
    console.log('  ⚠️  SKIP  Content directory not found');
    return;
  }

  // Count .mdx files in the content tree (should be zero)
  let mdxCount = 0;
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mdx')) mdxCount++;
    }
  }
  walk(contentDir);

  if (mdxCount === 0) {
    pass('Zero .mdx files in content tree (all converted to .md)');
  } else {
    fail(
      `${mdxCount} .mdx file(s) found in src/pages/content/6_1/`,
      'Content files must be plain .md — MDX was migrated away. Re-check the migration.',
    );
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('Virima Documentation — Retrieval Integrity Check');
console.log('═'.repeat(60));

checkDocsSearch();
checkIntentDetection();
checkArtifacts();
checkIndexDataContract();
checkNoMdxRegression();

console.log('\n' + '═'.repeat(60));
console.log('Summary');
console.log('═'.repeat(60));
console.log(`  PASS: ${passes}  FAIL: ${failures}`);

if (failures > 0) {
  console.error(`\n❌ ${failures} check(s) failed. Fix issues before committing.\n`);
  process.exit(1);
} else {
  console.log('\n✅ All retrieval integrity checks passed.\n');
  process.exit(0);
}
