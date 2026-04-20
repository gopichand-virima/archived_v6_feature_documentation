# /repo-hygiene — Repository Hygiene Maintenance

Perform a structured hygiene sweep of the `v6_feature_documentation` repository.
Run after major feature work or before release cuts.
Safe to run repeatedly — evidence-based, conservative deletions only.

---

## Context you must know before starting

**What this repo is:**
- A Vite + React documentation website served at `https://virima-products.github.io/v6_feature_documentation/`
- Build output: `dist/` (not `build/`)
- Package manager: pnpm exclusively (`pnpm-lock.yaml` is authoritative)
- Language policy: TypeScript only — no `.js`, `.mjs`, `.cjs`, `.jsx` unless explicitly justified in `docs/decisions/2026-03-29-javascript-retained.md`
- Content is **manually curated** — no external PRD source. The master TOC is `src/pages/content/6_1/index.md`
- Content files live in `src/pages/content/6_1/` (GFM `.md` only, no `.mdx`)

**Known justified JS exceptions:**
- `public/validate-fix.js` — browser-executed static asset, documented in decisions doc

**Already-clean areas (2026-03-29 hygiene pass):**
- No npm lockfiles at root or `scripts/` — `scripts/pnpm-lock.yaml` is present
- No PS1 migration scripts in `scripts/` — archived to `docs/archive/migration-scripts/`
- No test artifacts in `public/`
- `.playwright-mcp/`, `.claude/settings.local.json`, `scripts/package-lock.json` are gitignored

---

## Phase 1 — Quick status check

Run these first to understand the current state:

```bash
pnpm check:setup      # structural integrity
pnpm check:security   # no hardcoded secrets
pnpm eval             # GREEN/AMBER/RED doc quality
pnpm typecheck        # TypeScript errors in src/
```

Also check:
```bash
git status --short    # untracked or modified files that may be noise
```

---

## Phase 2 — Hygiene audit

Scan these areas systematically. For each candidate, verify it is NOT referenced by:
- source imports
- `package.json` scripts
- `scripts/tsconfig.json` include patterns
- CI workflows (`.github/workflows/*.yml`)
- Docker / nginx / compose files
- CLAUDE.md / README.md / rollback runbook
- evals (`scripts/evals/run-evals.ts`)
- setup checks (`scripts/checks/verify-setup.ts`)

### 2a. Root clutter
Look for:
- Stale `.md` reports that are not `README.md` or `CLAUDE.md`
- Leftover scratch files or temporary notes
- Any `package-lock.json` or `yarn.lock`
- Any committed `build/` or `dist/` directories

### 2b. `public/` directory
Look for:
- Test HTML files (`test-*.html`)
- Debug or scratch scripts
- Superseded sitemap or AI data files (check if the site is live and generating these fresh)
- Files not served by nginx at `/FeatureDocsite/`

### 2c. `scripts/` directory
Look for:
- Stale operation logs (`.csv`, `.log`, `.txt` outputs)
- One-time migration scripts that have been run and completed
- Duplicate script behavior (e.g., two scripts doing the same TOC sync task)
- Any `.js` or `.mjs` files that were not converted during the 2026-03-29 TS migration
- `scripts/dist/` output directory accidentally committed
- Verify `scripts/pnpm-lock.yaml` is present (required by generate workflow)

### 2d. `src/` — dead code
Look for:
- Unused components (check for imports; if a component is never imported anywhere, it's dead)
- Unused utility functions in `src/utils/`
- Unused type definitions in `src/types/` (now that `src/types/content.ts`, `navigation.ts`, `index.ts` exist — check for duplicate type defs elsewhere)
- Unused CSS modules or style files
- `.gitkeep` marker files in directories that now have content
- Stale content files under `src/pages/content/` that are no longer routed

### 2e. `docs/` directory
Look for:
- Duplicate plan documents covering the same topic
- Plans that describe work already merged (keep for history, but note they're complete)
- Prompt files that are no longer used by any workflow or slash command
- Redundant eval documentation that duplicates what `scripts/evals/run-evals.ts` already enforces

### 2f. `.claude/commands/`
Look for:
- Commands that reference scripts or paths that no longer exist
- Duplicate commands (two commands doing essentially the same thing)
- Commands with broken `pnpm run` targets

### 2g. `.github/workflows/`
Look for:
- References to `npm install`, `npm run`, `npx` (should be `pnpm`)
- Workflow files that are never triggered (check `on:` conditions)
- Duplicate jobs across `ci.yml` and `deploy-pages.yml` (`ci-cd.yml` was retired — flag if it still exists)
- Any reference to deleted script files

### 2h. JS policy enforcement
```bash
find . -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.jsx" \) \
  | grep -v "/node_modules/" | grep -v "/.git/"
```
Every result must either:
- Be `public/validate-fix.js` (documented exception), OR
- Have an entry in `docs/decisions/2026-03-29-javascript-retained.md`

If any other JS file exists, it must be converted to TypeScript or explicitly documented.

---

## Phase 3 — Classification

For each candidate found, classify:

| Classification | Criteria |
|---------------|---------|
| **Delete** | No references anywhere, clearly dead or superseded, zero operational value |
| **Archive** | No active references but has governance/audit/historical value → `docs/archive/` |
| **Convert** | Unjustified JS file → convert to TypeScript following existing patterns |
| **Fix** | Broken reference, outdated path, stale script target |
| **Keep** | Referenced, active, or justified |
| **Needs manual decision** | Uncertain — do not delete, flag for human review |

---

## Phase 4 — Implement

Make each change:
- Delete confirmed dead files
- Move archives to `docs/archive/` with an entry in `docs/archive/ARCHIVE_README.md`
- Convert unjustified JS files to TypeScript
- Fix broken references in imports, workflows, commands, and docs
- Update `.gitignore` if new local-only artifact types are found

After each deletion or move, check whether any file references the removed path and update accordingly.

---

## Phase 5 — Verify

Run the full validation suite. All must pass before declaring hygiene complete:

```bash
pnpm install
pnpm typecheck
pnpm check:security
pnpm check:setup
pnpm eval
pnpm build        # requires Phase 5a to be resolved first
docker compose config
```

---

## Acceptance criteria

Hygiene pass is complete only when:

- [ ] No unjustified JS/MJS/JSX files exist outside `public/`
- [ ] No npm lockfiles exist (`package-lock.json`, `yarn.lock`) anywhere in the repo
- [ ] `scripts/pnpm-lock.yaml` is present and committed
- [ ] No stale operation logs or test artifacts in `scripts/` or `public/`
- [ ] All archived items have entries in `docs/archive/ARCHIVE_README.md`
- [ ] No broken imports or workflow references
- [ ] `pnpm check:security` passes
- [ ] `pnpm check:setup` passes (32 OK, 0 errors)
- [ ] `pnpm eval` is GREEN or AMBER only
- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes
- [ ] `docker compose config` is valid
