# Fix: Stale index.md After PRD Deletion

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure `{module}/index.md` is always rebuilt after any PRD deletion, eliminating the stale sidebar links that appear whenever a feature doc is removed.

**Architecture:** Two-part fix. (1) A new standalone script `scripts/rebuild-module-index.ts` that accepts `--module-dir` and rebuilds `index.md` from surviving manifests — same logic as `updateModuleIndex()` in `generate-feature-doc.ts` but callable independently. (2) The workflow `generate-v6feature-docs.yml` is updated to track which module dirs were affected by deletions and call the rebuild script once for each after all file operations are done. This covers all four failure scenarios: delete-only, add+delete same module, add+delete different modules, multiple deletes in one run.

**Tech Stack:** TypeScript (tsx), GitHub Actions YAML bash, Node.js fs, pnpm

---

## Context: Confirmed root cause

### Why the bug happens

`generate-v6feature-docs.yml` processes changes in two loops:

```
Loop 1 (lines 274–337): additions/modifications
  └─ calls generate-feature-doc.ts
       └─ Stage 4: updateModuleIndex() ← rebuilds index.md NOW
            └─ reads manifests — deleted manifests STILL EXIST here ← stale

Loop 2 (lines 339–383): deletions
  └─ deletes .md files + manifest JSON
  └─ ❌ never calls updateModuleIndex() — index.md left with dead entries
```

### All four broken scenarios

| Scenario | Bug fires? |
|----------|-----------|
| Delete only (no adds) | 🔴 Yes — Loop 2 runs, no Stage 4 ever called |
| Add + delete, same module | 🔴 Yes — Stage 4 sees stale manifests before Loop 2 cleans them |
| Add + delete, different modules | 🔴 Yes — Stage 4 for module B doesn't fix module A's index |
| Multiple deletes in one module | 🔴 Yes — same as delete-only |

### What `3b17222` was

A one-run content cleanup — manually removed stale entries from `admin/index.md` and re-ran sync-toc. **The pipeline bug was not fixed.** The next deletion run will reproduce it identically.

### Design choice: post-processing rebuild (not loop swap)

Swapping loop order is not a complete fix because add+delete in *different modules* still leaves the deleted module's index stale. The only correct fix is:

> After ALL file operations (both loops) complete, rebuild `index.md` for every module that had at least one deletion.

---

## Task 1: Create `scripts/rebuild-module-index.ts`

**Files:**
- Create: `scripts/rebuild-module-index.ts`

This script mirrors the logic of `updateModuleIndex()` in `generate-feature-doc.ts` exactly, but is callable as a standalone CLI tool. It must NOT import from `generate-feature-doc.ts` (that file is protected from edits and is not designed for import).

### Step 1: Create the script file

```bash
# verify scripts/ dir exists
ls C:/github/v6_feature_documentation/scripts/
```

Expected: directory listing including `generate-feature-doc.ts`, `prompts.ts`, etc.

### Step 2: Write the script

Create `scripts/rebuild-module-index.ts` with this exact content:

```typescript
#!/usr/bin/env tsx

/**
 * rebuild-module-index.ts
 *
 * Rebuilds the module-level index.md for a given content module directory
 * by scanning all feature subdirectories for generation manifests.
 *
 * Called by generate-v6feature-docs.yml after PRD deletions to ensure
 * index.md never contains stale entries pointing to deleted files.
 *
 * Usage:
 *   pnpm tsx scripts/rebuild-module-index.ts --module-dir <path>
 *
 * Exit codes:
 *   0 = success (index.md written or no manifests found — no-op)
 *   1 = error   (bad args, unreadable directory, write failure)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Deliverable type fallback labels — must stay in sync with prompts.ts
// ---------------------------------------------------------------------------

const DELIVERABLE_LABELS: Record<string, string> = {
  'concept-overview':    'Concept / Overview Guide',
  'how-to-guide':        'How-To Guide',
  'admin-guide':         'Administrator Guide',
  'user-guide':          'User Guide',
  'interface-guide':     'Interface Guide',
  'configuration-guide': 'Configuration Guide',
  'api-docs':            'API Documentation',
  'integration-guide':   'Integration Guide',
  'troubleshooting':     'Troubleshooting Guide',
  'best-practices':      'Best Practices',
  'feature-walkthrough': 'Feature Walkthrough',
};

// ---------------------------------------------------------------------------
// Manifest shape (only the fields we need)
// ---------------------------------------------------------------------------

interface ManifestDeliverable {
  type: string;
  outputFile: string;
  navTitle?: string;
}

interface GenerationManifest {
  featureName?: string;
  deliverables?: ManifestDeliverable[];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(): { moduleDir: string } {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--module-dir');
  if (idx < 0 || !args[idx + 1]) {
    console.error('Usage: rebuild-module-index.ts --module-dir <path>');
    process.exit(1);
  }
  return { moduleDir: args[idx + 1]! };
}

function rebuildModuleIndex(moduleDir: string): void {
  if (!fs.existsSync(moduleDir)) {
    console.error(`Module dir does not exist: ${moduleDir}`);
    process.exit(1);
  }

  // Determine version root: everything up to and including the version segment
  // e.g. "src/pages/content/6_1/" from "src/pages/content/6_1/admin"
  const normalizedModuleDir = moduleDir.replace(/\\/g, '/');
  const contentMarker = '/content/';
  const contentIdx = normalizedModuleDir.indexOf(contentMarker);
  if (contentIdx < 0) {
    console.error(`Cannot find "/content/" in module dir: ${moduleDir}`);
    process.exit(1);
  }
  const afterContent = normalizedModuleDir.slice(contentIdx + contentMarker.length);
  const versionSegment = afterContent.split('/')[0] ?? '';
  const versionRoot = normalizedModuleDir.slice(0, contentIdx + contentMarker.length) + versionSegment + '/';

  // Module title from dir name
  const moduleName = path.basename(moduleDir);
  const moduleTitle = moduleName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Collect features from immediate subdirectory manifests
  interface FeatureEntry {
    featureName: string;
    featureDir: string;
    deliverables: { type: string; filename: string; navTitle?: string }[];
  }

  const features: FeatureEntry[] = [];

  for (const entry of fs.readdirSync(moduleDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const featureDir = path.join(moduleDir, entry.name);
    let manifestFiles: string[];
    try {
      manifestFiles = fs
        .readdirSync(featureDir)
        .filter((f) => f.startsWith('.generation-manifest.') && f.endsWith('.json'));
    } catch {
      continue;
    }

    for (const manifestFile of manifestFiles) {
      try {
        const raw = fs.readFileSync(path.join(featureDir, manifestFile), 'utf-8');
        const m = JSON.parse(raw) as GenerationManifest;

        const deliverables = (m.deliverables ?? []).map((d) => ({
          type: d.type,
          filename: path.basename(d.outputFile),
          navTitle: d.navTitle,
        }));

        features.push({
          featureName: m.featureName ?? entry.name,
          featureDir: entry.name,
          deliverables,
        });
      } catch {
        // skip malformed manifests
      }
    }
  }

  if (features.length === 0) {
    console.log(`  No manifests found in ${moduleDir} — writing empty index.md stub`);
    // Write a minimal stub so the module is at least listed
    const stubContent = `## ${moduleTitle}\n`;
    const indexPath = path.join(moduleDir, 'index.md');
    fs.writeFileSync(indexPath, stubContent, 'utf-8');
    console.log(`  Written: ${indexPath} (empty stub)`);
    return;
  }

  // Sort alphabetically by feature name for deterministic output
  features.sort((a, b) => a.featureName.localeCompare(b.featureName));

  // Build index.md
  let indexContent = `## ${moduleTitle}\n`;

  for (const feature of features) {
    indexContent += `\n### ${feature.featureName}\n`;
    for (const d of feature.deliverables) {
      const label = d.navTitle ?? DELIVERABLE_LABELS[d.type] ?? d.type;
      const relModuleDir = normalizedModuleDir.startsWith(versionRoot)
        ? normalizedModuleDir.slice(versionRoot.length)
        : normalizedModuleDir;
      const tocPath = `${relModuleDir}/${feature.featureDir}/${d.filename}`;
      indexContent += `- ${label} → ${tocPath}\n`;
    }
  }

  if (!indexContent.endsWith('\n')) {
    indexContent += '\n';
  }

  const indexPath = path.join(moduleDir, 'index.md');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(
    `  Rebuilt: ${indexPath} (${features.length} feature${features.length !== 1 ? 's' : ''})`,
  );
}

const { moduleDir } = parseArgs();
console.log(`\n=== Rebuilding module index: ${moduleDir} ===`);
rebuildModuleIndex(moduleDir);
console.log('Done.\n');
```

### Step 3: Run the script manually against the live admin dir to verify it works

```bash
cd C:/github/v6_feature_documentation
pnpm tsx scripts/rebuild-module-index.ts --module-dir src/pages/content/6_1/admin
```

Expected output:
```
=== Rebuilding module index: src/pages/content/6_1/admin ===
  Rebuilt: src/pages/content/6_1/admin/index.md (N features)
Done.
```

Also verify the output file looks correct:
```bash
cat src/pages/content/6_1/admin/index.md
```

Expected: `## Admin`, followed by `### {Feature Name}` sections, no `role_access` or `smtp_configuration` entries (they were already cleaned in 3b17222).

### Step 4: TypeScript check the new script

```bash
cd C:/github/v6_feature_documentation
pnpm tsx --tsconfig scripts/tsconfig.json scripts/rebuild-module-index.ts --module-dir src/pages/content/6_1/admin
```

Expected: exits 0, no TS errors.

### Step 5: Verify bad-arg guard works

```bash
pnpm tsx scripts/rebuild-module-index.ts 2>&1 || true
```

Expected: prints usage message, exits 1.

### Step 6: Add script to package.json for convenience

In `package.json`, add under `scripts`:
```json
"rebuild-index": "tsx --tsconfig scripts/tsconfig.json scripts/rebuild-module-index.ts"
```

Run `pnpm rebuild-index --module-dir src/pages/content/6_1/admin` to confirm it works via pnpm too.

### Step 7: Commit

```bash
cd C:/github/v6_feature_documentation
git add scripts/rebuild-module-index.ts package.json
git commit -m "feat(scripts): add rebuild-module-index.ts — rebuilds index.md from surviving manifests after PRD deletions"
```

---

## Task 2: Update `generate-v6feature-docs.yml` — track and rebuild after deletions

**Files:**
- Modify: `.github/workflows/generate-v6feature-docs.yml`

### Step 1: Find the deletions loop to understand exact line range

```bash
grep -n "Processing deletions\|DELETED_DIRS\|AFFECTED_MODULE\|rebuild.*index\|Post-deletion" \
  .github/workflows/generate-v6feature-docs.yml | head -20
```

Expected: shows lines ~339–383 as the deletions loop.

### Step 2: Add `AFFECTED_MODULES` tracking variable at the top of the generate step

Locate the variable initialisation block (around line 255 where `DELETED_DIRS=""` is set).

**Find:**
```yaml
          DELETED_DIRS=""
          DELETED_DIRS_COUNT=0
          DELETED_FILES_COUNT=0
```

**Replace with:**
```yaml
          DELETED_DIRS=""
          DELETED_DIRS_COUNT=0
          DELETED_FILES_COUNT=0
          AFFECTED_MODULES=""
```

### Step 3: Collect affected module dirs inside the deletions loop

Inside the deletions loop, after the line `OUTPUT_DIR=$(dirname "$(echo "$file" | sed 's|^src/pages/|src/pages/content/|')")`:

**Find** (the OUTPUT_DIR derivation line in the deletions loop, around line 352):
```bash
            OUTPUT_DIR=$(dirname "$(echo "$file" | sed 's|^src/pages/|src/pages/content/|')")
            PRD_SLUG=$(basename "$file" .md)
```

**Replace with:**
```bash
            OUTPUT_DIR=$(dirname "$(echo "$file" | sed 's|^src/pages/|src/pages/content/|')")
            MODULE_DIR=$(dirname "$OUTPUT_DIR")
            PRD_SLUG=$(basename "$file" .md)

            # Track unique module dirs affected by deletions
            if [[ -n "$MODULE_DIR" ]] && ! echo "$AFFECTED_MODULES" | grep -qF "$MODULE_DIR"; then
              AFFECTED_MODULES="${AFFECTED_MODULES}${MODULE_DIR}\n"
            fi
```

### Step 4: Add the post-deletion index rebuild block after the deletions loop

The deletions loop ends around line 383 with the `done <<< "$(echo "$CHANGES" | jq -c '.[]')"` line.

Immediately after that line (and before the `HAS_GENERATED` block), **add**:

```yaml
          # ── Post-deletion: rebuild index.md for every affected module ──────
          # This ensures index.md never retains stale entries for deleted PRDs,
          # regardless of whether additions also ran in this batch.
          if [[ -n "$AFFECTED_MODULES" ]]; then
            echo ""
            echo "=== Post-deletion: rebuilding module indexes ==="
            while IFS= read -r mod_dir; do
              [[ -z "$mod_dir" ]] && continue
              echo "  Rebuilding index for: $mod_dir"
              npx --yes tsx --tsconfig scripts/tsconfig.json \
                scripts/rebuild-module-index.ts --module-dir "$mod_dir" || \
                echo "::warning::Failed to rebuild index for $mod_dir — continuing"
            done <<< "$(printf '%b' "$AFFECTED_MODULES")"
          fi
```

### Step 5: Verify no stale `commit_green`/`commit_review` references crept back

```bash
grep -n "AFFECTED_MODULES\|rebuild.*index\|rebuild-module-index" \
  .github/workflows/generate-v6feature-docs.yml
```

Expected: shows the new AFFECTED_MODULES variable and the rebuild call, nothing else unexpected.

### Step 6: Verify no remaining references to the old broken state

```bash
grep -n "commit_green\|commit_review\|Commit to main" \
  .github/workflows/generate-v6feature-docs.yml
```

Expected: zero matches.

### Step 7: Commit the workflow change

```bash
git add .github/workflows/generate-v6feature-docs.yml
git commit -m "fix(workflow): rebuild module index.md after PRD deletions — fixes stale sidebar bug

Root cause: deletions loop removed manifests but never called updateModuleIndex().
Stage 4 ran during additions loop BEFORE deletions, so stale entries persisted.

Fix: track AFFECTED_MODULES during deletions, then call rebuild-module-index.ts
for each affected module after all file operations complete.

Covers all four scenarios:
  - delete-only batch
  - add+delete same module
  - add+delete different modules
  - multiple deletes in one module"
```

---

## Task 3: Final validation and push

### Step 1: Run full validation suite

```bash
cd C:/github/v6_feature_documentation
pnpm validate
```

Expected: all checks pass (typecheck, security, setup, paths).

### Step 2: Run build

```bash
pnpm build
```

Expected: `✓ built in ~40s` with no errors.

### Step 3: Run memory check

```bash
pnpm memory:check
```

Expected: `STATUS: GREEN — Memory is current. No drift detected.`

### Step 4: Push all commits

```bash
git push origin main
```

### Step 5: Smoke-test the fix end-to-end (manual verification)

To confirm the fix works without running the full pipeline, do a local dry run:

```bash
# Simulate what happens after a deletion:
# 1. Remove a feature dir temporarily
cp -r src/pages/content/6_1/admin/surveys /tmp/surveys-backup

# 2. Also remove its manifest (simulates deletion loop outcome)
rm -rf src/pages/content/6_1/admin/surveys

# 3. Run the rebuild script (simulates the new post-deletion step)
pnpm tsx scripts/rebuild-module-index.ts --module-dir src/pages/content/6_1/admin

# 4. Verify surveys is gone from index.md
grep -i "survey" src/pages/content/6_1/admin/index.md
# Expected: no match (surveys removed from index)

# 5. Restore the dir
cp -r /tmp/surveys-backup src/pages/content/6_1/admin/surveys

# 6. Rebuild again to restore index
pnpm tsx scripts/rebuild-module-index.ts --module-dir src/pages/content/6_1/admin

# 7. Verify surveys is back
grep -i "survey" src/pages/content/6_1/admin/index.md
# Expected: survey entries present again
```

### Step 6: Final state check

```bash
git log --oneline -5
git status
```

Expected:
- Working tree clean
- Top commit: "fix(workflow): rebuild module index.md after PRD deletions"

---

## What is intentionally NOT changed

| File | Reason |
|------|--------|
| `scripts/generate-feature-doc.ts` | Protected — requires explicit human review. The `updateModuleIndex()` function is correct; the bug is in the *caller* (the workflow). |
| `scripts/validate-generation.ts` | Protected — no changes needed. |
| `scripts/sync-toc-from-index.ts` | Correct — reads index.md; fix is upstream (generation of index.md). |
| `src/lib/content/` | Runtime only — untouched. |

---

## Regression test matrix

After this fix, these scenarios should all produce correct `index.md`:

| Scenario | Expected outcome |
|----------|-----------------|
| Delete PRD, no adds | index.md rebuilt, deleted feature absent |
| Add PRD, no deletes | index.md rebuilt by Stage 4 as before |
| Add + delete, same module | Post-deletion rebuild overwrites Stage 4 stale output |
| Add + delete, different modules | Post-deletion rebuild fixes deleted module; Stage 4 fixes added module |
| Multiple deletes, one module | Post-deletion rebuild runs once per unique module dir |
| Multiple deletes, multiple modules | One rebuild per affected module dir |
