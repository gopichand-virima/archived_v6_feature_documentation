/**
 * Phase 1: Batch rename all .mdx files → .md
 *
 * Walks src/pages/content/6_1/, renames every .mdx file in-place to .md.
 * Safe to re-run (skips files already ending in .md).
 *
 * Usage: pnpm tsx --tsconfig scripts/tsconfig.json scripts/rename-mdx-to-md.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'pages', 'content', '6_1');

function walkFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

(function main() {
  const allFiles = walkFiles(CONTENT_ROOT);
  const mdxFiles = allFiles.filter(f => f.endsWith('.mdx'));

  console.log(`🔄 Renaming ${mdxFiles.length} .mdx files to .md...\n`);

  let renamed = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const srcPath of mdxFiles) {
    const destPath = srcPath.slice(0, -4) + '.md'; // replace .mdx with .md
    try {
      if (fs.existsSync(destPath)) {
        console.warn(`⚠️  SKIP (target exists): ${path.basename(srcPath)}`);
        skipped++;
        continue;
      }
      fs.renameSync(srcPath, destPath);
      renamed++;
    } catch (err) {
      const msg = `❌ ${srcPath}: ${(err as Error).message}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  console.log('\n📊 RESULTS');
  console.log('══════════════════════');
  console.log(`Renamed : ${renamed}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Errors  : ${errors.length}`);

  if (errors.length > 0) {
    console.error('\n❌ ERRORS:');
    errors.forEach(e => console.error(' ', e));
    process.exit(1);
  }

  console.log('\n✅ All .mdx files renamed to .md');
  console.log('ℹ️  Next: run  git add src/pages/content/6_1/  to stage changes');
})();
