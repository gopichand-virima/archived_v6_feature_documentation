# Local Dev and Verification Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure every developer (and Claude agent) can onboard, run, validate, and contribute in under 10 minutes with zero ambiguity.

**Architecture:** All local commands go through pnpm. Verification is layered: type safety → security → structure → docs quality → build → preview. Each layer has a discrete command that can be run independently.

**Tech Stack:** pnpm 9, Vite 6, TypeScript 5.5, tsx, vitest

---

## Setup Flow (New Developer Onboarding)

### Step 1: Prerequisites check
```bash
node --version    # must show v20.x.x or higher
pnpm --version    # must show 9.x.x
```

If pnpm is missing:
```bash
npm install -g pnpm@9
```

Or with Corepack (preferred):
```bash
corepack enable
corepack prepare pnpm@9 --activate
```

### Step 2: Clone and install
```bash
git clone https://github.com/<org>/v6_feature_documentation.git
cd v6_feature_documentation
pnpm install
```
Expected: All packages install without errors. `node_modules/` populated.

### Step 3: Environment configuration

Copy or create `.env.local`:
```bash
cp .env.example .env.local  # if .env.example exists
# OR create manually:
echo "VITE_OPENAI_API_KEY=your_key_here" > .env.local
```

Verify:
```bash
pnpm check:env
```
Expected: `✅ Environment configuration is valid.`

### Step 4: Start dev server
```bash
pnpm dev
```
Expected:
- Server starts on `http://localhost:3000/FeatureDocsite/`
- Browser opens automatically
- Documentation site is visible with navigation

### Step 5: Verify setup
```bash
pnpm check:setup
```
Expected: All checks pass (may have AMBER warnings for optional items).

---

## Development Workflow

### Running the dev server
```bash
pnpm dev
```
- Hot module reloading is enabled
- Changes to `.tsx`, `.ts`, `.css` files reload instantly
- Changes to `.md` content files require TOC sync (see below)

### After adding or modifying content files
If you add new `.md` feature docs or modify the TOC structure:
```bash
pnpm sync-toc
pnpm dev
```

### TypeScript type checking (without building)
```bash
pnpm typecheck
```
Run this frequently during development. It is significantly faster than a full build.

---

## Validation Commands

Run these in order before every commit:

### 1. TypeScript check
```bash
pnpm typecheck
```
What it does: Runs `tsc -p src/tsconfig.json --noEmit`. Checks all `.ts` and `.tsx` files in `src/`.
Pass criteria: Exit code 0, no output.
On failure: Fix the TypeScript errors shown. Common issues: missing imports, wrong types, unused variables.

### 2. Security check
```bash
pnpm check:security
```
What it does: Scans source files for hardcoded API keys, verifies `.gitignore` covers `.env.*`, checks `lib/search/config.ts` has no hardcoded secrets.
Pass criteria: Exit code 0.
On failure: Remove any hardcoded secret and move it to `.env.local`.

### 3. Setup check
```bash
pnpm check:setup
```
What it does: Verifies required files, directories, scripts, and structural invariants are present.
Pass criteria: Exit code 0. AMBER warnings are acceptable but should be reviewed.
On failure: Create the missing file or directory as indicated.

### 4. Evals
```bash
pnpm eval
```
What it does: Runs documentation quality evals (PRD mirroring, add/edit/delete coverage, compliance with pnpm/TS policy).
Pass criteria: Exit code 0 (GREEN or AMBER only — no RED findings).
On failure: Fix the specific documentation or structural issue flagged.

### 5. Full validation suite
```bash
pnpm validate
```
What it does: Runs typecheck + check:security + check:setup in sequence.
Pass criteria: All three exit 0.

---

## Build and Preview

### Production build
```bash
pnpm build
```
What it does:
1. Runs `pnpm sync-toc` (prebuild hook)
2. Runs TypeScript check
3. Runs Vite build
4. Outputs to `build/`
5. Copies `src/content/` to `build/content/`
6. Copies `src/assets/images/` to `build/assets/images/`

Expected output:
```
vite v6.x.x building for production...
✓ XXX modules transformed.
build/index.html                  X.XX kB
build/assets/...                  Y.YY kB
✓ built in X.XXs
```

Pass criteria: Exit code 0, `build/` directory created and non-empty.

### Preview server
```bash
pnpm preview
```
What it does: Serves the `build/` directory via a local HTTP server.
URL: `http://localhost:4173/FeatureDocsite/`
Expected: Documentation site renders correctly with all versions and navigation.

### One-liner for full build+preview cycle
```bash
pnpm install && pnpm sync-toc && pnpm build && pnpm preview
```

---

## Troubleshooting

### White screen after `pnpm preview`
Cause: Usually a missing MDX import or broken content registration.
Fix:
1. Open browser DevTools → Console
2. Look for "Cannot find module" or "Failed to fetch" errors
3. If content file is missing from static imports: add it to the appropriate `src/lib/imports/*.ts` file
4. Rebuild: `pnpm build && pnpm preview`

### `pnpm dev` starts but content shows "Content not available"
Cause: MDX file exists on disk but is not registered in the content system.
Fix:
1. Run `pnpm sync-toc` to regenerate TOC and import files
2. If still missing: manually add the import to `src/lib/imports/` for the relevant module
3. Restart dev server

### TypeScript errors after pulling latest changes
Cause: New types or interfaces added that conflict with existing code.
Fix:
1. Run `pnpm typecheck` to see all errors
2. Fix each error individually — do not use `@ts-ignore` unless justified
3. If errors are in generated files: regenerate them with the pipeline

### Build fails with "Module not found"
Cause: Usually a new import added to source that doesn't have a corresponding file.
Fix:
1. Check Vite error output for the specific module path
2. Verify the file exists at the expected path
3. Check path aliases in `src/tsconfig.json` (`@/*` → `./src/*`)

### `pnpm check:setup` reports missing directories
Cause: Repository structure has drifted from expected.
Fix: Create the missing directory. If it's a new requirement from CLAUDE.md, create any required content too.

### `pnpm eval` reports RED findings
Cause: Documentation quality gate violation.
Fix: Read the specific finding message, navigate to the indicated file, and fix the issue. Common fixes:
- Add missing "add/create" section to a feature doc
- Fix PRD mirroring (create missing generated doc)
- Remove `package-lock.json` if it reappeared

---

## Verification Runbook (Full Pre-Release Check)

Run these commands in order. Stop at the first failure and fix before continuing.

```bash
# 1. Dependencies
pnpm install
echo "STEP 1: install — $?"

# 2. Type safety
pnpm typecheck
echo "STEP 2: typecheck — $?"

# 3. Security
pnpm check:security
echo "STEP 3: security — $?"

# 4. Structure
pnpm check:setup
echo "STEP 4: setup — $?"

# 5. Docs quality
pnpm eval
echo "STEP 5: eval — $?"

# 6. Build
pnpm build
echo "STEP 6: build — $?"

# 7. Working tree clean
git status --porcelain
echo "STEP 7: git status — clean?"
```

All steps must show exit code 0 and git status must be clean.

---

## Package Manager Reference

This repo uses **pnpm exclusively**. Never use `npm` or `yarn`.

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Add a dependency | `pnpm add <pkg>` |
| Add a devDependency | `pnpm add -D <pkg>` |
| Remove a dependency | `pnpm remove <pkg>` |
| Run a script | `pnpm <script>` or `pnpm run <script>` |
| Run a one-off binary | `pnpm dlx <bin>` (equivalent of npx) |
| Update lockfile | `pnpm install` (auto-updates on install) |

---

## CI Pipeline Reference

The CI pipeline runs on every push to `main`, `feat/**`, and `fix/**` branches:

1. **Validate job**: typecheck → check:security → check:setup → eval
2. **Build job** (depends on validate): pnpm build → upload artifact

If CI fails:
1. Click the failing job in GitHub Actions
2. Read the step output
3. Fix locally using the corresponding local command
4. Push the fix

For the feature doc generation pipeline (auto-triggered by PRD updates), see:
- `.github/workflows/generate-v6feature-docs.yml`
- `docs/operations/rollback-runbook.md`
