# Migration Plan: npm → pnpm & JavaScript → TypeScript

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the repo from npm to pnpm as the canonical package manager and convert all root JavaScript files to properly typed TypeScript.

**Architecture:** Two independent migration tracks run in parallel. The pnpm track is non-breaking (just lockfile + scripts). The TypeScript track converts 3 root JS files to TS under `scripts/checks/` and assesses 4 `.mjs` scripts.

**Tech Stack:** pnpm 9, tsx (script runner), TypeScript 5.5 strict mode, Node.js ESM (`import.meta.dirname`)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `pnpm import` fails on complex lockfile | Low | Medium | Run `pnpm install` directly instead |
| Peer dependency conflicts with pnpm | Medium | Low | Use `pnpm install --shamefully-hoist` if needed |
| `tsx` not available after migration | Low | High | Add `tsx` to root devDependencies before migrating |
| `.mjs` script breaks after TS conversion | Medium | Medium | Test each script individually; keep `.mjs` fallback |
| CI breaks after pnpm migration | Medium | High | Update CI in same PR as migration |

---

## Track A: npm → pnpm Migration

### A1: Pre-migration verification

**Step 1: Record current state**
```bash
node --version  # must be >=20
npm --version
cat package.json | grep '"version"'
```

**Step 2: Ensure pnpm is installed**
```bash
pnpm --version
```
If not installed:
```bash
npm install -g pnpm@9
# or
corepack enable && corepack prepare pnpm@9 --activate
```

**Step 3: Add tsx to root devDependencies BEFORE migration**

This is critical — `tsx` is needed to run TypeScript scripts and must be installed before we switch package managers.

In `package.json`, add to `devDependencies`:
```json
"tsx": "^4.19.2",
"typescript": "^5.5.3"
```

Run:
```bash
npm install  # install with npm one last time
```

---

### A2: Generate pnpm lockfile

**Step 1: Import existing lockfile**
```bash
pnpm import
```
Expected output: `Lockfile imported from package-lock.json`

If this fails (e.g., lockfile version mismatch):
```bash
pnpm install
```
This regenerates from `package.json` directly.

**Step 2: Verify pnpm-lock.yaml was created**
```bash
ls -la pnpm-lock.yaml
```
Expected: File exists, non-empty.

**Step 3: Run pnpm install to verify**
```bash
pnpm install
```
Expected: All packages installed, no resolution errors.

If peer dependency warnings appear, assess each:
- Radix UI peer deps: usually safe to ignore (`--legacy-peer-deps` equivalent is default in pnpm)
- React version mismatches: check if the package actually works

---

### A3: Update package.json for pnpm

**Step 1: Add packageManager and engines fields**

Open `package.json`. After `"name"` and `"version"`, add:
```json
"packageManager": "pnpm@9.15.0",
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=9.0.0"
},
```

**Step 2: Update prebuild script**

Find:
```json
"prebuild": "npm run sync-toc"
```
Replace:
```json
"prebuild": "pnpm run sync-toc"
```

**Step 3: Verify `dev` and `build` still work**
```bash
pnpm dev &
sleep 5 && kill %1  # start and stop to verify it launches
pnpm build
```

---

### A4: Delete npm lockfile

**Step 1: Remove package-lock.json**
```bash
rm package-lock.json
```

**Step 2: Verify .gitignore doesn't ignore pnpm-lock.yaml**

Check `.gitignore` for any line that would match `pnpm-lock.yaml`:
```bash
grep -n "pnpm" .gitignore
grep -n "lock" .gitignore
```

If `pnpm-lock.yaml` or `*.lock` is in `.gitignore`, remove that line.

**Step 3: Add pnpm store to .gitignore**

Add to `.gitignore`:
```
# pnpm
.pnpm-store/
.pnpm-debug.log
```

---

### A5: Migrate scripts/package.json

**Step 1: Check if scripts/ has its own package.json**
```bash
cat scripts/package.json
```

If it has a `package-lock.json`:
```bash
cd scripts && pnpm import && rm package-lock.json && cd ..
```

**Step 2: Add packageManager field to scripts/package.json**
```json
"packageManager": "pnpm@9.15.0"
```

---

### A6: Update GitHub Actions for pnpm

**File:** `.github/workflows/generate-v6feature-docs.yml`

**Step 1: Find all npm references**
```bash
grep -n "npm" .github/workflows/generate-v6feature-docs.yml
```

**Step 2: Replace Node setup step**

Find:
```yaml
- name: Setup Node.js ${{ env.NODE_VERSION }}
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
```

Replace with:
```yaml
- name: Setup Node.js ${{ env.NODE_VERSION }}
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}

- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9
    run_install: false

- name: Get pnpm store directory
  id: pnpm-cache
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_OUTPUT

- name: Cache pnpm store
  uses: actions/cache@v4
  with:
    path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

**Step 3: Replace npm install calls**

Find: `npm install` or `npm ci`
Replace: `pnpm install --frozen-lockfile`

Find: `npm run <script>`
Replace: `pnpm run <script>` or `pnpm <script>`

Find: `npx tsx`
Replace: `pnpm tsx` or `./node_modules/.bin/tsx`

**Step 4: Verify the YAML is valid**
```bash
# Install yq or use node to validate
node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/generate-v6feature-docs.yml','utf8'))" && echo "YAML valid"
```

---

### A7: Verification checkpoint for pnpm migration

Run all these and confirm each passes:

```bash
# 1. Clean install
rm -rf node_modules && pnpm install
echo "✅ pnpm install: $?"

# 2. Dev server starts
timeout 10 pnpm dev || true
echo "✅ pnpm dev: launched"

# 3. Build succeeds
pnpm build
echo "✅ pnpm build: $?"

# 4. Preview works
pnpm preview &
PREVIEW_PID=$!
sleep 3 && kill $PREVIEW_PID 2>/dev/null
echo "✅ pnpm preview: launched"

# 5. No npm lockfile
[ ! -f package-lock.json ] && echo "✅ No package-lock.json" || echo "❌ package-lock.json still exists"

# 6. pnpm lockfile present
[ -f pnpm-lock.yaml ] && echo "✅ pnpm-lock.yaml present" || echo "❌ pnpm-lock.yaml missing"
```

---

## Track B: JavaScript → TypeScript Migration

### B1: Inventory current JS files

**Step 1: List all JS files**
```bash
find . -name "*.js" -o -name "*.mjs" -o -name "*.cjs" | grep -v node_modules | grep -v build | grep -v dist | sort
```

Expected output:
```
./check-env.js
./verify-security.js
./verify-setup.js
./public/validate-fix.js
./scripts/generate-mdx-imports.mjs
./scripts/sync-imports-from-toc.mjs
./scripts/sync-toc-from-index.mjs
./scripts/watch-toc.mjs
```

**Step 2: Categorize each file**

| File | Category | Action |
|------|----------|--------|
| `check-env.js` | Root utility | ✅ Convert → `scripts/checks/check-env.ts` |
| `verify-security.js` | Root utility | ✅ Convert → `scripts/checks/verify-security.ts` |
| `verify-setup.js` | Root utility | ✅ Convert → `scripts/checks/verify-setup.ts` |
| `public/validate-fix.js` | Static asset (served by browser) | ⚠️ Keep — browser runtime file, TypeScript compilation not applicable |
| `scripts/generate-mdx-imports.mjs` | Build script | 🔄 Attempt conversion to `.ts` |
| `scripts/sync-imports-from-toc.mjs` | Build script | 🔄 Attempt conversion to `.ts` |
| `scripts/sync-toc-from-index.mjs` | Build script | 🔄 Attempt conversion to `.ts` |
| `scripts/watch-toc.mjs` | Dev tool | 🔄 Attempt conversion to `.ts` |

---

### B2: Convert root utilities (3 files)

These 3 files are documented in detail in `2026-03-29-enterprise-restructure-plan.md` Tasks 3–5.

Summary:
- Create `scripts/checks/` directory
- Write `check-env.ts`, `verify-security.ts`, `verify-setup.ts` with proper types
- Delete root `.js` files
- Update `package.json` scripts to reference new `.ts` files via `tsx`
- Test each script runs correctly

---

### B3: Assess and convert .mjs scripts

**Step 1: Read each .mjs file**

For each file, check:
- Size and complexity
- Whether it uses `import.meta.url` (ESM-only, but fine in TS with `"module": "ESNext"`)
- Whether it has inline types or is loosely typed
- Whether it's called from CI or package.json scripts

**Step 2: Attempt conversion for `sync-toc-from-index.mjs`**

```bash
cp scripts/sync-toc-from-index.mjs scripts/sync-toc-from-index.ts.bak
```

Create `scripts/sync-toc-from-index.ts` by:
1. Adding explicit return types to all functions
2. Typing function parameters (especially file paths, arrays, objects)
3. Using `import type` where applicable
4. Running: `tsx --tsconfig scripts/tsconfig.json scripts/sync-toc-from-index.ts`

If it works: delete the `.mjs` file and update `package.json`.
If it fails: document the failure reason in `docs/decisions/2026-03-29-mjs-retained.md` and keep the `.mjs`.

**Step 3: Repeat for remaining 3 .mjs files**

Do the same for:
- `scripts/generate-mdx-imports.mjs`
- `scripts/sync-imports-from-toc.mjs`
- `scripts/watch-toc.mjs`

**Step 4: Document retained JS/MJS files**

Create `docs/decisions/2026-03-29-javascript-retained.md`:

```markdown
# JavaScript Files Retained — Decision Record

Date: 2026-03-29

## public/validate-fix.js

**Why retained as JavaScript:**
This file is a browser-executed static asset served directly from the `public/` directory.
It runs in the browser at runtime, not during the build. TypeScript compilation cannot
produce a browser-runnable file in this location without changes to the Vite pipeline.
Conversion would require either:
1. Moving the file to `src/` and importing it (changes site behavior), or
2. Setting up a separate TypeScript compilation target for browser utilities.

Neither is warranted for a small utility file. This file must not import Node.js APIs.

## scripts/*.mjs (if not converted)

**Why retained as MJS (if applicable):**
[Fill in per-file reason if conversion failed]
```

---

### B4: TypeScript strictness verification

**Step 1: Run typecheck on entire src/**
```bash
pnpm typecheck
```
Expected: Exit 0. Any errors must be fixed.

**Step 2: Run typecheck on scripts/**
```bash
cd scripts && npx tsc --noEmit && cd ..
```
Or:
```bash
tsx --tsconfig scripts/tsconfig.json scripts/validate-generation.ts --dry-run
```

**Step 3: Check for `any` usage**
```bash
grep -r "any" src/ --include="*.ts" --include="*.tsx" | grep -v "// eslint-disable" | grep -v "\.d\.ts"
```

For each `any` found:
- If it's a typed exception: add `// eslint-disable-next-line @typescript-eslint/no-explicit-any — <reason>` comment
- If it can be typed: replace with proper type

**Step 4: Verify no `@ts-ignore` abuse**
```bash
grep -rn "@ts-ignore" src/ scripts/
```

Each `@ts-ignore` should have a comment explaining why it's needed.

---

### B5: Migration verification checkpoint

Run all checks and confirm each passes:

```bash
# TypeScript check
pnpm typecheck && echo "✅ TypeScript check passed"

# No root JS files
[ ! -f check-env.js ] && [ ! -f verify-security.js ] && [ ! -f verify-setup.js ] \
  && echo "✅ No forbidden root JS files" \
  || echo "❌ Root JS files still present"

# New TypeScript scripts work
pnpm check:env && echo "✅ check:env passed"
pnpm check:security && echo "✅ check:security passed"
pnpm check:setup && echo "✅ check:setup passed"

# Scripts directory has correct files
ls scripts/checks/*.ts && echo "✅ scripts/checks/*.ts present"
ls scripts/evals/*.ts && echo "✅ scripts/evals/*.ts present"
```

---

## Final Migration Checklist

| Item | Status | Notes |
|------|--------|-------|
| pnpm installed | ☐ | `pnpm --version` |
| `pnpm-lock.yaml` generated | ☐ | From `pnpm import` or `pnpm install` |
| `package-lock.json` deleted | ☐ | Root and scripts/ |
| `packageManager` field in package.json | ☐ | `"pnpm@9.x.x"` |
| `pnpm install` works cleanly | ☐ | No errors |
| `pnpm build` works | ☐ | `build/` produced |
| `check-env.js` deleted | ☐ | Replaced by `scripts/checks/check-env.ts` |
| `verify-security.js` deleted | ☐ | Replaced by `scripts/checks/verify-security.ts` |
| `verify-setup.js` deleted | ☐ | Replaced by `scripts/checks/verify-setup.ts` |
| `pnpm check:env` works | ☐ | Runs TypeScript version |
| `pnpm check:security` works | ☐ | Runs TypeScript version |
| `pnpm check:setup` works | ☐ | Runs TypeScript version |
| `.mjs` files assessed | ☐ | Converted or documented |
| CI updated for pnpm | ☐ | generate-v6feature-docs.yml |
| `pnpm typecheck` exits 0 | ☐ | No type errors |
| Decision record created | ☐ | `docs/decisions/2026-03-29-javascript-retained.md` |
