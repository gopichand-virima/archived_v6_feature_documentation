#!/usr/bin/env node
/**
 * Watch TOC Files - Auto-sync on changes
 *
 * Watches for changes to index.md files and automatically runs sync-toc
 *
 * Usage: npm run watch-toc
 */

import { watch, existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSIONS: string[] = ['6_1', '6_1_1', '5_13', 'NG'];
const CONTENT_DIR = path.join(__dirname, '../src/content');

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 1000; // Wait 1 second after last change before syncing

/**
 * Run sync script
 */
async function runSync(): Promise<void> {
  console.log('\n🔄 Detected change in index.md, syncing...\n');

  try {
    const { stdout, stderr } = await execAsync('node --import tsx/esm scripts/sync-toc-from-index.ts');
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error running sync:', err.message);
  }
}

/**
 * Watch a specific index.md file
 */
function watchIndexFile(versionDir: string): void {
  const indexPath = path.join(CONTENT_DIR, versionDir, 'index.md');

  if (!existsSync(indexPath)) {
    console.log(`⚠️  ${indexPath} not found, skipping...`);
    return;
  }

  console.log(`👀 Watching: ${indexPath}`);

  watch(indexPath, { persistent: true }, (eventType: string) => {
    if (eventType === 'change') {
      console.log(`\n📝 Change detected in ${versionDir}/index.md`);

      // Debounce: clear existing timeout and set new one
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }

      syncTimeout = setTimeout(() => {
        runSync().catch((err: Error) => console.error('❌ Sync failed:', err.message));
      }, DEBOUNCE_MS);
    }
  });
}

/**
 * Main execution
 */
function main(): void {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TOC Watcher - Auto-sync on index.md changes');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('👀 Watching for changes to index.md files...\n');

  // Watch all version index files
  VERSIONS.forEach((version: string) => {
    watchIndexFile(version);
  });

  console.log('\n✅ Watcher started. Press Ctrl+C to stop.\n');
  console.log('💡 Tip: Edit any index.md file and changes will auto-sync!\n');
}

main();
