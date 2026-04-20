/**
 * Phase 0: Duplicate & Unreferenced File Finder
 *
 * Walks src/pages/content/6_1/, hashes every .mdx file, cross-references
 * against the master TOC (index.mdx), and outputs a JSON report with:
 *   - duplicate groups (same SHA-256 hash)
 *   - unreferenced files (on disk but not in TOC)
 *
 * Usage:  pnpm tsx --tsconfig scripts/tsconfig.json scripts/find-duplicates.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

// ─── Paths ────────────────────────────────────────────────────────────────────

const REPO_ROOT   = process.cwd();
const CONTENT_ROOT = path.join(REPO_ROOT, 'src', 'pages', 'content', '6_1');
const TOC_FILE     = path.join(CONTENT_ROOT, 'index.mdx');
const REPORT_OUT   = path.join(REPO_ROOT, 'scripts', 'find-duplicates-report.json');

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileInfo {
  absolutePath: string;
  contentPath: string;   // /content/6_1/... (matches TOC format)
  hash: string;
  sizeBytes: number;
}

interface DuplicateGroup {
  hash: string;
  sizeBytes: number;
  files: string[];          // contentPath values
  tocReferenced: string[];  // subset that are in the TOC
  tocAbsent: string[];      // subset NOT in the TOC — safe to delete
}

interface Report {
  generatedAt: string;
  totalMdxFiles: number;
  tocEntryCount: number;
  tocUniquePathCount: number;
  duplicateGroupCount: number;
  excessDuplicateFileCount: number;
  unreferencedFileCount: number;
  duplicateGroups: DuplicateGroup[];
  unreferencedFiles: string[];
  tocMultiReferencedPaths: Array<{ path: string; count: number }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function walkMdxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMdxFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function sha256(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

/**
 * Extract all .mdx paths referenced in the TOC.
 * Matches lines like:  - Label → `/content/6_1/.../file.mdx`
 */
function extractTocPaths(tocContent: string): string[] {
  const paths: string[] = [];
  // Matches → followed by optional backtick then /content/...mdx
  const re = /→\s*`?(\S+\.mdx)`?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tocContent)) !== null) {
    paths.push(m[1].trim());
  }
  return paths;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async function main() {
  console.log('🔍 Duplicate & Unreferenced File Finder\n');

  if (!fs.existsSync(TOC_FILE)) {
    console.error(`❌ TOC file not found: ${TOC_FILE}`);
    process.exit(1);
  }

  // 1. Parse TOC ──────────────────────────────────────────────────────────────
  const tocContent  = fs.readFileSync(TOC_FILE, 'utf-8');
  const tocAllPaths = extractTocPaths(tocContent);          // raw list (may contain dupes)
  const tocPathSet  = new Set(tocAllPaths);                 // unique paths

  console.log(`📋 TOC entries   : ${tocAllPaths.length}`);
  console.log(`📋 TOC unique paths: ${tocPathSet.size}`);

  // Find paths referenced more than once in TOC
  const tocPathCount = new Map<string, number>();
  for (const p of tocAllPaths) {
    tocPathCount.set(p, (tocPathCount.get(p) ?? 0) + 1);
  }
  const tocMultiRef = [...tocPathCount.entries()]
    .filter(([, n]) => n > 1)
    .map(([p, n]) => ({ path: p, count: n }))
    .sort((a, b) => b.count - a.count);

  // 2. Walk disk ─────────────────────────────────────────────────────────────
  const allAbsolutePaths = walkMdxFiles(CONTENT_ROOT);
  // exclude index.mdx itself
  const contentFiles = allAbsolutePaths.filter(
    f => path.basename(f) !== 'index.mdx'
  );
  console.log(`📁 .mdx files on disk (excl. index.mdx): ${contentFiles.length}\n`);

  // 3. Hash every file ────────────────────────────────────────────────────────
  console.log('⚙️  Hashing files...');
  const fileInfos: FileInfo[] = [];
  for (const abs of contentFiles) {
    const rel = '/' + path.relative(path.join(REPO_ROOT, 'src', 'pages'), abs)
                          .replace(/\\/g, '/');
    fileInfos.push({
      absolutePath: abs,
      contentPath: rel,
      hash: sha256(abs),
      sizeBytes: fs.statSync(abs).size,
    });
  }
  console.log('✅ Hashing complete\n');

  // 4. Find duplicates ────────────────────────────────────────────────────────
  const byHash = new Map<string, FileInfo[]>();
  for (const info of fileInfos) {
    const group = byHash.get(info.hash) ?? [];
    group.push(info);
    byHash.set(info.hash, group);
  }

  const duplicateGroups: DuplicateGroup[] = [];
  for (const [hash, infos] of byHash) {
    if (infos.length < 2) continue;
    const files       = infos.map(i => i.contentPath);
    const tocReferenced = files.filter(f => tocPathSet.has(f));
    const tocAbsent     = files.filter(f => !tocPathSet.has(f));
    duplicateGroups.push({
      hash,
      sizeBytes: infos[0].sizeBytes,
      files,
      tocReferenced,
      tocAbsent,
    });
  }
  duplicateGroups.sort((a, b) => b.files.length - a.files.length);

  const excessCount = duplicateGroups.reduce(
    (sum, g) => sum + Math.max(0, g.files.length - 1),
    0
  );

  // 5. Find unreferenced files ────────────────────────────────────────────────
  const unreferencedFiles = fileInfos
    .filter(i => !tocPathSet.has(i.contentPath))
    .map(i => i.contentPath)
    .sort();

  // 6. Build report ───────────────────────────────────────────────────────────
  const report: Report = {
    generatedAt: new Date().toISOString(),
    totalMdxFiles: contentFiles.length,
    tocEntryCount: tocAllPaths.length,
    tocUniquePathCount: tocPathSet.size,
    duplicateGroupCount: duplicateGroups.length,
    excessDuplicateFileCount: excessCount,
    unreferencedFileCount: unreferencedFiles.length,
    duplicateGroups,
    unreferencedFiles,
    tocMultiReferencedPaths: tocMultiRef,
  };

  fs.writeFileSync(REPORT_OUT, JSON.stringify(report, null, 2), 'utf-8');

  // 7. Print summary ──────────────────────────────────────────────────────────
  console.log('📊 REPORT SUMMARY');
  console.log('═════════════════════════════════════════');
  console.log(`Total .mdx files on disk : ${report.totalMdxFiles}`);
  console.log(`TOC-referenced paths     : ${report.tocUniquePathCount}`);
  console.log(`Duplicate groups         : ${report.duplicateGroupCount}`);
  console.log(`Excess duplicate files   : ${report.excessDuplicateFileCount}`);
  console.log(`Unreferenced files       : ${report.unreferencedFileCount}`);
  console.log(`TOC multi-ref paths      : ${tocMultiRef.length}`);
  console.log(`Report saved to          : ${REPORT_OUT}\n`);

  if (duplicateGroups.length > 0) {
    console.log('🔴 DUPLICATE GROUPS (first 15):');
    for (const g of duplicateGroups.slice(0, 15)) {
      console.log(`  [${g.hash.substring(0, 8)}] ${g.files.length} copies, ${g.sizeBytes}B`);
      for (const f of g.files) {
        const tag = tocPathSet.has(f) ? '✅ TOC' : '🗑️  del';
        console.log(`    ${tag}  ${f}`);
      }
    }
    if (duplicateGroups.length > 15) {
      console.log(`  ...and ${duplicateGroups.length - 15} more groups — see report JSON`);
    }
    console.log('');
  }

  if (unreferencedFiles.length > 0) {
    const show = Math.min(unreferencedFiles.length, 25);
    console.log(`⚠️  UNREFERENCED FILES (first ${show} of ${unreferencedFiles.length}):`);
    for (const f of unreferencedFiles.slice(0, show)) {
      console.log(`  - ${f}`);
    }
    if (unreferencedFiles.length > show) {
      console.log(`  ...see report JSON for full list`);
    }
    console.log('');
  }

  if (tocMultiRef.length > 0) {
    console.log('📌 TOC PATHS REFERENCED MORE THAN ONCE:');
    for (const { path: p, count } of tocMultiRef) {
      console.log(`  [×${count}] ${p}`);
    }
    console.log('');
  }

  console.log('✅ Done.');
})();
