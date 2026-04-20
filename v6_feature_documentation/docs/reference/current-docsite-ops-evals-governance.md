# V6 Feature Documentation Platform — Ops, Evals, and Governance

**Purpose:** Operational runbook covering all validation commands, eval system behavior, drift detection, workflow governance, deployment controls, security controls, failure recovery, and enterprise readiness status.

**Last Updated:** 2026-04-03
**Repository:** `virima-products/v6_feature_documentation`
**Live Site:** https://virima-products.github.io/v6_feature_documentation/

---

# 1. Operational Overview

This repository runs a fully automated documentation generation pipeline with multiple overlapping quality gates. The operational model is:

- **Trigger:** PRD changes in `v6_prds` → `repository_dispatch` → generation pipeline.
- **Review:** Every run creates a branch + PR regardless of validation outcome. No auto-merge.
- **Merge:** Human only. After merge, `deploy-pages.yml` deploys to GitHub Pages.
- **Ongoing maintenance:** Memory drift check, eval runs, dependency updates.

**Operational hierarchy:**

```
repository_dispatch (PRD merge)
    ↓ generate-v6feature-docs.yml
        ↓ generate-feature-doc.ts (AI generation)
        ↓ validate-generation.ts (GREEN/AMBER/RED gate)
        ↓ branch + PR created
            ↓ ci.yml (typecheck, security, setup, paths, evals, memory)
                ↓ human review + merge
                    ↓ deploy-pages.yml (build + GitHub Pages)
```

---

# 2. All Validation Commands

### `pnpm typecheck`

| Property | Value |
|---------|-------|
| Command | `tsc -p src/tsconfig.json --noEmit` |
| What it checks | TypeScript type correctness across all `src/` files |
| Expected output when passing | No output (silent success) |
| Failure meaning | Type errors in source files — must fix before merge |
| Blocks merge? | Yes |
| Exit code | 0 = pass, 1 = fail |

---

### `pnpm check:security`

| Property | Value |
|---------|-------|
| Command | `tsx scripts/checks/verify-security.ts` |
| What it checks | Scans `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.json` for hardcoded secrets: OpenAI keys (`sk-`), Anthropic keys (`sk-ant-`), AWS keys (`AKIA`), GitHub tokens (`ghp_`, `github_pat_`) |
| Expected output when passing | `All checks passed — no secrets found` (or similar clean output) |
| Failure meaning | A hardcoded credential is present in source files |
| Blocks merge? | Yes |
| Exit code | 0 = pass, non-zero = fail |
| Skips | `node_modules`, `.git`, `build`, `dist`, `.env.local`, the scanner script itself |

---

### `pnpm check:setup`

| Property | Value |
|---------|-------|
| Command | `tsx scripts/checks/verify-setup.ts` |
| What it checks | Required files exist (`package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `index.html`, `src/tsconfig.json`, `.gitignore`, `CLAUDE.md`); required directories exist (`src/components`, `src/pages/content`, `src/lib/content`, `src/lib`, `src/utils`, `src/styles`, `.github/workflows`, `scripts/checks`) |
| Expected output when passing | All checkmarks green, no ERRORs |
| Failure meaning | Missing required file or directory in repo structure |
| Blocks merge? | Yes (ERROR level); warnings (WARN) do not block |
| Exit code | 0 = all pass or only warnings, 1 = any ERROR |

---

### `pnpm check:paths`

| Property | Value |
|---------|-------|
| Command | `tsx scripts/checks/verify-paths.ts` |
| What it checks | Scans source files for: (1) references to legacy `src/content/` path, (2) references to `build/` as output dir, (3) use of `npm run` or `yarn` instead of `pnpm`, (4) git-tracked files in `dist/` or `build/`, (5) `package-lock.json` presence, (6) `src/pages/v6_prds/` path |
| Expected output when passing | All checks OK, no ERRORs |
| Failure meaning | Legacy path reference or structural violation in source files |
| Blocks merge? | Yes (ERROR level) |
| Exit code | 0 = all pass or only warnings, 1 = any ERROR |

---

### `pnpm validate`

| Property | Value |
|---------|-------|
| Command | `pnpm run typecheck && pnpm run check:security && pnpm run check:setup && pnpm run check:paths` |
| What it checks | Runs all four individual checks in sequence |
| Expected output when passing | All four checks pass with no errors |
| Failure meaning | One or more individual checks failed |
| Blocks merge? | Yes |
| Exit code | 0 = all pass, non-zero = at least one failed |
| Notes | Stop on first failure (`&&` chaining) — if typecheck fails, security/setup/paths do not run |

---

### `pnpm build`

| Property | Value |
|---------|-------|
| Command | `vite build` (with `prebuild` hook: `pnpm run sync-toc` runs first) |
| What it checks | (1) `pnpm sync-toc` — reads module index.md files, regenerates navigationData.ts and indexContentMap.ts; (2) Vite production build — TypeScript compilation, asset bundling, content copy to `dist/content/`, image copy to `dist/assets/images/` |
| Expected output when passing | `dist/` produced, content files copied, no build errors |
| Failure meaning | Build-breaking TypeScript or bundler error; sync-toc failure |
| Blocks merge? | Yes |
| Exit code | 0 = success, non-zero = failure |
| Notes | `dist/` should never be committed; it is upload-only via CI artifact |

---

### `pnpm eval`

| Property | Value |
|---------|-------|
| Command | `tsx scripts/evals/run-evals.ts` |
| What it checks | Four suites: `structure` (PRD parity), `coverage` (CRUD sections), `nav-integrity` (index.md completeness + link resolution), `compliance` (pnpm, lockfile, governance files) |
| Expected output when passing | GREEN summary; all suites pass with no RED findings |
| Failure meaning | RED = high-risk issue (missing index.md, broken links, compliance); AMBER = warning (missing CRUD in some docs — expected for troubleshooting guides) |
| Blocks merge? | RED = yes; AMBER = human judgment |
| Exit code | 0 = GREEN, 1 = RED, 2 = AMBER (see eval system section) |
| Notes | Requires `v6_prds` repo at `C:\github\v6_prds` for `structure` suite; absent = AMBER skip |

---

### `pnpm memory:check`

| Property | Value |
|---------|-------|
| Command | `tsx --tsconfig scripts/tsconfig.json scripts/memory/check-memory-drift.ts` |
| What it checks | (1) VALUE CROSS-CHECK: reads actual values from code files, compares against `docs/memory/repo-memory.json`; (2) FILE-CHANGE TRACK: `git log` since memory's `generated_at` to find which sections may need updating |
| Expected output when passing | GREEN: no drift detected |
| Failure meaning | AMBER = file changes detected, memory may need updating; RED = value mismatch (memory records wrong facts) |
| Blocks merge? | No (`continue-on-error: true` in CI) |
| Exit code | 0 = GREEN, 1 = AMBER, 2 = RED |
| Add `--json` flag | Outputs machine-readable drift report |

---

### `pnpm memory:update`

| Property | Value |
|---------|-------|
| Command | `tsx --tsconfig scripts/tsconfig.json scripts/memory/update-memory.ts` |
| What it does | Updates `docs/memory/repo-memory.json` to reflect current repo state |
| When to run | After architecture changes, new scripts, new contracts |
| Notes | Can also be triggered via `/sync-repo-memory` or `/update-memory` slash commands |

---

### `pnpm sync-toc`

| Property | Value |
|---------|-------|
| Command | `tsx --tsconfig scripts/tsconfig.json scripts/sync-toc-from-index.ts` |
| What it does | Reads all `src/pages/content/{version}/*/index.md` files, parses module/section/page structure, writes `src/data/navigationData.ts` and `src/utils/indexContentMap.ts` |
| Expected output when passing | Both files updated; module count reported |
| Failure meaning | Malformed index.md; missing content directory |
| When to run | Runs automatically as `prebuild` hook; run manually after index.md changes |
| Notes | Only active version `6_1` is included in exported navigation |

---

### `pnpm rebuild-index`

| Property | Value |
|---------|-------|
| Command | `tsx --tsconfig scripts/tsconfig.json scripts/rebuild-module-index.ts --module-dir <path>` |
| What it does | Scans all subdirectories of the given module dir for `.generation-manifest.*.json` files; rebuilds `index.md` from surviving manifests; sorts alphabetically by feature name |
| Expected output when passing | `Module index rebuilt: {path}/index.md ({N} features)` |
| Failure meaning | Module dir does not exist; write failure |
| When to run | Automatically by pipeline after deletions; manually after any manual manifest cleanup |
| Notes | If no manifests found, writes a minimal stub and exits 0 (not an error) |

---

# 3. Eval System

## Eval Scripts Location

```
scripts/evals/
  run-evals.ts    ← single entry point for all suites
```

There is one file. All four suites are implemented as functions within `run-evals.ts`.

## Suite Descriptions

### Suite: `structure`

Checks folder parity between `v6_prds` PRD source and generated docs.

- Walks `C:\github\v6_prds\src\pages` recursively.
- For every PRD folder containing `{slug}.md`, checks that `src/pages/{version}/{module}/{slug}/{slug}.md` exists.
- If `v6_prds` repo is absent: emits AMBER and skips (graceful degradation for CI runners without the PRD repo).
- Missing generated doc = AMBER finding.

### Suite: `coverage`

Checks that every generated feature doc covers CRUD operations.

- Walks all `.md` files under `src/pages/`.
- Skips: `index.md`, files starting with `_`, files containing `SUMMARY`, `REGISTRY`, `README` in name.
- For each file: checks for presence of add/create keywords, edit/update keywords, delete/remove keywords (case-insensitive).
- Missing keyword = AMBER finding.

**Tolerated AMBER:** Troubleshooting guides do not have add/edit/delete sections by design. These AMBER findings from the `coverage` suite are pre-existing, expected, and should not block merge.

### Suite: `nav-integrity`

Checks navigation data consistency.

- Rule 1: Every module directory must have an `index.md`. Missing = AMBER.
- Rule 2: Every `→ path.md` reference in `index.md` must resolve to a real file. Stale entry = AMBER.
- Rule 3: Every feature subdirectory must have at least one `.md` file. Empty dir = AMBER.
- Excludes non-version directories from version-level walk (`testing`, `_archive`, dirs starting with `_`).

### Suite: `compliance`

Checks repo governance compliance.

- `pnpm-lock.yaml` exists → RED if missing.
- `package-lock.json` absent → RED if present.
- `package.json` has `packageManager: "pnpm..."` → RED if not.
- No forbidden root JS files (`check-env.js`, `verify-security.js`, `verify-setup.js`) → RED if found.
- `CLAUDE.md` exists → AMBER if missing.
- `.claude/commands/` exists → AMBER if missing.
- `scripts/checks/` exists → AMBER if missing.

## GREEN / AMBER / RED Thresholds

| Threshold | Exit Code | Condition |
|-----------|-----------|---------|
| GREEN | 0 | No RED or AMBER findings |
| AMBER | 2 | One or more AMBER findings, no RED |
| RED | 1 | One or more RED findings |

## Eval Findings in CI

In `ci.yml`, `pnpm eval` is run as a required step. If it exits RED (code 1), the CI job fails and the PR cannot merge. If it exits AMBER (code 2), the CI step technically "fails" (non-zero exit), but reviewers are expected to assess AMBER findings manually. In practice, the tolerated AMBER from troubleshooting coverage means AMBER is always expected and reviewers confirm the findings are expected rather than blocking.

## How to Add Eval Exemptions

There is no formal exemption registry. Current exemptions are handled by:
1. The `isSkippable` check in `coverage` suite skips `index.md`, `_*` files, `SUMMARY`, `REGISTRY`, `README` files.
2. The `NON_VERSION_DIRS` set in `nav-integrity` excludes `testing`, `_archive`.
3. The `SHARED_CONTENT_FILES` set in `validate-generation.ts` excludes `glossary.md` from traceability checks.

To add a new exemption: edit the relevant set/array in `run-evals.ts`. Document the reason in the commit message.

---

# 4. Drift and Memory Enforcement

## Memory System Architecture

```
docs/memory/repo-memory.json          ← canonical AI memory (version + timestamp)
scripts/memory/change-routing-map.ts  ← maps file patterns → memory sections
scripts/memory/check-memory-drift.ts  ← drift detector (VALUE CROSS-CHECK + FILE-CHANGE TRACK)
scripts/memory/update-memory.ts       ← memory updater
```

## Two Detection Strategies

**Strategy 1: VALUE CROSS-CHECK**
Reads specific values from actual code files and compares against what `repo-memory.json` records. Example: reads `packageManager` from `package.json`, compares to `repo_contracts.package_manager_version` in memory. A mismatch = RED (critical: memory records wrong facts).

**Strategy 2: FILE-CHANGE TRACK**
Runs `git log --name-status --since={memory.generated_at}` to find files changed since memory was last updated. Maps changed files through `ROUTING_RULES` in `change-routing-map.ts` to identify which memory sections may need updating. File changes = AMBER (memory may need updating).

## Memory Lifecycle

| Event | Action |
|-------|--------|
| Architecture change | Run `pnpm memory:update` or `/sync-repo-memory` |
| New script added | Update `scripts/` section in memory |
| New contract established | Update `repo_contracts` section |
| Session ends with code changes | Run `pnpm memory:check` (Stop hook reminds) |
| Memory drift RED detected | Run `pnpm memory:update` then verify with `pnpm memory:check` |

## Drift Check in CI

`pnpm memory:check` runs in `ci.yml` with `continue-on-error: true`. This means:
- Drift does NOT block CI or PR merge.
- The step shows as yellow (warning) in the Actions UI if drift is detected.
- It is informational — reviewers can see whether memory is current.

---

# 5. Workflow and Governance Controls

## Workflow Matrix

| Workflow | File | Trigger | Deploys? | Creates PR? |
|---------|------|---------|---------|------------|
| Generate V6 Feature Docs | `generate-v6feature-docs.yml` | `repository_dispatch` from `v6_prds`; `workflow_dispatch` | No | Yes (always) |
| Deploy to GitHub Pages | `deploy-pages.yml` | Push to `main`; `workflow_dispatch` | Yes | No |
| CI | `ci.yml` | Push to `feat/**`, `fix/**`, `refactor/**`, `autofeature**`; PR to `main` | No | No |

## Branch Naming Convention

```
autofeature-featuredocs-6_1-{DDMMYYYY}-{HHMMSS}
```

Example: `autofeature-featuredocs-6_1-03042026-143022`

Rules:
- No slashes in branch names.
- Format: `autofeature-{desc}-{version}-{timestamp}`.
- `ci.yml` triggers on `autofeature**` branches (prefix match).

## Gate Outcomes and PR Behavior

| Gate | Workflow outcome | PR created? | PR label in title |
|------|-----------------|-------------|------------------|
| GREEN | Success | Yes | `[GREEN]` |
| AMBER | Success | Yes | `[AMBER]` |
| RED | Failure (exit 1) | Yes | `[RED]` |

All three gates create a PR. GREEN and AMBER allow workflow success; RED fails the workflow after PR creation.

## Concurrency Controls

Both generation and deploy workflows use `cancel-in-progress: false`. A second run queues; it never cancels an in-flight run. This prevents partial state from a mid-run cancellation.

## Deletion Safety Controls

Configurable per run via workflow inputs or environment variables:

| Variable | Default | Meaning |
|---------|---------|---------|
| `DELETION_MAX_FILES` | 10 | RED gate if more than 10 files deleted in one run |
| `DELETION_MAX_PERCENT` | 25 | RED gate if deletions exceed 25% of changed files |

`deletion_max_percent` can be raised via `workflow_dispatch` input for planned restructures.

## Skip-Generation Mode

Available on `workflow_dispatch` only (`skip_generation: true`). Skips Claude API calls and validates existing docs. Used for pipeline testing without consuming API tokens. Ignored on `repository_dispatch`.

## Full Rebuild Mode

`full_rebuild: true` via `workflow_dispatch` or `repository_dispatch` payload. Enables `--force` flag on `generate-feature-doc.ts`, bypassing content hash check and regenerating all PRDs.

---

# 6. Deployment Controls

## Production Deployment Flow

```
Push to main (or workflow_dispatch)
    ↓ deploy-pages.yml
        ↓ pnpm install --frozen-lockfile
        ↓ pnpm build (runs pnpm sync-toc first via prebuild hook)
        ↓ cp dist/index.html dist/404.html (SPA fallback)
        ↓ actions/configure-pages@v5
        ↓ actions/upload-pages-artifact@v3 (uploads dist/)
        ↓ actions/deploy-pages@v4
```

**Permissions required on build job:** `contents: read`, `pages: write`, `id-token: write`
**Permissions required on deploy job:** `pages: write`, `id-token: write`

The `id-token: write` permission is required for OIDC token exchange with GitHub Pages — it is not optional.

## Deployment Environment

- **Environment name:** `github-pages`
- **URL:** `${{ steps.deployment.outputs.page_url }}`
- **Concurrency group:** `pages-deploy` — only one deployment active at a time; never cancels in-flight.

## How to Verify Deployment

1. Check Actions → `Deploy to GitHub Pages` run for green status.
2. Visit `https://virima-products.github.io/v6_feature_documentation/`.
3. If 404: verify Settings → Pages → Source = "GitHub Actions" (not branch-based).

## Rollback

See `docs/operations/rollback-runbook.md` for procedures. Short version: revert the offending commit on `main` and push — `deploy-pages.yml` will redeploy the previous state.

---

# 7. Security Controls

## Active Security Controls

| Control | Implementation | Scope |
|---------|---------------|-------|
| XSS protection | `rehype-sanitize` in `MDXRenderer.tsx` — blocks `<script>`, event handlers | All rendered markdown |
| Secret scanning | `scripts/checks/verify-security.ts` via `pnpm check:security` | `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.json` |
| pnpm-only enforcement | `.claude/settings.json` PreToolUse hook + `pnpm check:paths` | All Claude sessions + CI |
| HTTP security headers | `nginx.conf` (local Docker only — NOT production) | Local Docker preview |
| Supply-chain governance | `.github/CODEOWNERS` | Dockerfile, nginx.conf, workflows, memory, checks |
| OIDC deployment | `id-token: write` on deploy-pages job | No long-lived deploy tokens |

## Secret Scanning Patterns

| Pattern | Catches |
|---------|---------|
| `/sk-[a-zA-Z0-9]{20,}/` | OpenAI API keys |
| `/sk-ant-[a-zA-Z0-9\-_]{20,}/` | Anthropic API keys |
| `/AKIA[0-9A-Z]{16}/` | AWS Access Key IDs |
| `/ghp_[A-Za-z0-9]{36}/` | GitHub classic PATs |
| `/github_pat_[A-Za-z0-9_]{22,}/` | GitHub fine-grained PATs |

## What Claude Agents Must NOT Do (Security)

- Add login/auth/session systems (wrong architecture for public docs).
- Disable `rehype-sanitize` without adding equivalent XSS protection.
- Move API keys from `.env.local` into source code.
- Prefix `ANTHROPIC_API_KEY` with `VITE_` (would be compiled into the JS bundle).
- Change `nginx.conf` or `Dockerfile` without CODEOWNERS review.

## Known Limitation: VITE_* Bundle Exposure

Any `VITE_*` environment variable is compiled into the JavaScript bundle and visible in browser DevTools. API keys for search or AI features MUST NOT use `VITE_` prefix. Required future work: proxy API calls through a backend-for-frontend (BFF) service.

## Dependency Vulnerabilities

As of 2026-04-03, approximately 10 open Dependabot vulnerabilities:
- 1 high: `lodash` (transitive).
- 5 moderate: `vite`/`mdast` packages.
- 4 low: `vite` packages.

Action: Run `pnpm update --recursive` periodically and review Dependabot alerts.

---

# 8. Failure Modes and Recovery Runbooks

### 1. Generation fails mid-batch (partial state)

**Symptoms:** Some PRDs generated, others show in `failed_files` output in Actions summary. Partial manifest state. PR created with only partial content.

**Recovery:**
1. Identify failed PRDs from the GitHub Actions job summary or validation report artifact.
2. Fix the underlying issue (malformed PRD, API rate limit, source file missing).
3. Re-trigger `generate-v6feature-docs.yml` via `workflow_dispatch` with the specific failed PRDs in the `changes` input.
4. Review and merge the new PR. The partial PR from the failed run can be closed if the retry covers all changes.

---

### 2. PR creation blocked (repo permissions)

**Symptoms:** Workflow log shows `PR creation failed — branch pushed, create PR manually`. The branch exists on remote but no PR was opened.

**Recovery:**
1. Go to `Settings → Actions → General → Workflow permissions`.
2. Enable "Allow GitHub Actions to create and approve pull requests".
3. The branch already exists — navigate to it on GitHub and click "Compare & pull request".
4. For future runs, the pipeline will create PRs automatically.

---

### 3. Stale module index after deletions

**Symptoms:** Navigation shows entries for features that no longer exist. `pnpm eval` reports AMBER stale nav entries in `nav-integrity` suite.

**Recovery:**
```bash
# Rebuild the affected module's index
pnpm rebuild-index -- --module-dir src/pages/content/6_1/{module}

# Then regenerate navigationData.ts and indexContentMap.ts
pnpm sync-toc

# Commit both changes
git add src/pages/content/6_1/{module}/index.md src/data/navigationData.ts src/utils/indexContentMap.ts
git commit -m "fix(nav): rebuild stale module index after deletion"
```

Note: This is automatically handled by the pipeline's AFFECTED_MODULES final pass. Manual recovery is only needed if the pipeline was interrupted before that step.

---

### 4. navigationData.ts out of sync

**Symptoms:** Navigation shows wrong structure, missing modules, or stale entries. Usually after a hand-edit or a skipped `pnpm build` / `pnpm sync-toc`.

**Recovery:**
```bash
pnpm sync-toc
# Verify the output looks correct
git diff src/data/navigationData.ts src/utils/indexContentMap.ts
git add src/data/navigationData.ts src/utils/indexContentMap.ts
git commit -m "fix(nav): regenerate navigationData from module indexes"
```

---

### 5. Merge conflict on generated files

**Symptoms:** Git conflict in `src/pages/content/`, `src/data/navigationData.ts`, or `src/utils/indexContentMap.ts` when merging an autofeature branch.

**Recovery:**
- For `src/pages/content/` files: Always take the pipeline's version (theirs). These are pipeline-owned.
- For `navigationData.ts` / `indexContentMap.ts`: Do NOT try to resolve manually. Instead:
  1. Accept either version.
  2. Run `pnpm sync-toc` to regenerate from the merged `index.md` state.
  3. Commit the regenerated files.

---

### 6. GitHub Pages not deploying

**Symptoms:** Push to `main` triggers but Pages are not updated. 404 or stale content on live URL.

**Diagnosis:**
1. Check Actions → `Deploy to GitHub Pages` — did it run? Did it succeed?
2. If never ran: verify `deploy-pages.yml` trigger matches the push (branch must be `main`).
3. If ran but failed on "Configure Pages" or "Deploy Pages": check `Settings → Pages → Source = GitHub Actions`.
4. If source is set to a branch (e.g., `gh-pages`): change to "GitHub Actions".
5. Check job permissions: `pages: write` and `id-token: write` must be on both build and deploy jobs.

**Recovery:**
```bash
# Force a redeploy by re-running the workflow manually
# Actions → Deploy to GitHub Pages → Re-run all jobs
# OR push an empty commit to main
git commit --allow-empty -m "chore: trigger pages redeploy"
git push origin main
```

---

### 7. Memory drift RED

**Symptoms:** `pnpm memory:check` exits 2 (RED). Value mismatch reported — memory records incorrect facts about the repo.

**Recovery:**
```bash
# Option A: Run the memory update script
pnpm memory:update

# Option B: Use the slash command
# /sync-repo-memory

# Verify no more drift
pnpm memory:check

# Commit the updated memory
git add docs/memory/repo-memory.json
git commit -m "chore(memory): update repo-memory to current state"
```

---

### 8. Content hash mismatch (stale docs despite PRD change)

**Symptoms:** PRD was updated but `generate-feature-doc.ts` exits code 3 (no changes). Docs reflect old PRD content.

**Recovery:**
```bash
# Trigger workflow_dispatch with full_rebuild=true
# OR: trigger with specific PRDs in changes input and force flag
# In workflow UI: workflow_dispatch → full_rebuild = true
```

This bypasses the hash check and regenerates all PRDs (or the specified PRD).

---

# 9. Manual Settings Outside the Repo

This is the required checklist for setting up a new repo instance. These settings cannot be configured via committed files.

**Required checklist:**

- [ ] **1. GitHub Pages source**
  - Location: `Settings → Pages → Source`
  - Required: Select **GitHub Actions** (not branch-based)
  - Why required: `deploy-pages.yml` uses `upload-pages-artifact` and `deploy-pages` which require Actions-based source

- [ ] **2. GitHub Actions PR creation permission**
  - Location: `Settings → Actions → General → Workflow permissions`
  - Required: Check **"Allow GitHub Actions to create and approve pull requests"**
  - Why required: Pipeline calls `gh pr create` using workflow token; without this, PR creation fails

- [ ] **3. Repository secret: ANTHROPIC_API_KEY**
  - Location: `Settings → Secrets and variables → Actions → New repository secret`
  - Required: Anthropic API key scoped to this use case
  - Security: Set usage limits and domain restrictions at the Anthropic console

- [ ] **4. Repository secret: PRD_REPO_TOKEN**
  - Location: `Settings → Secrets and variables → Actions → New repository secret`
  - Required: GitHub PAT with `contents: read` on the `v6_prds` repo
  - Security: Use fine-grained PAT scoped to the specific PRD repo

- [ ] **5. CODEOWNERS team assignment**
  - Location: `.github/CODEOWNERS`
  - Required: Replace placeholder team names with actual GitHub teams
  - Covers: Dockerfile, nginx.conf, workflows (`devops` team), CLAUDE.md, memory, checks (`docs-team`)

- [ ] **6. Branch protection rules (recommended)**
  - Location: `Settings → Branches → Add rule for "main"`
  - Recommended settings:
    - Require pull request before merging: Yes
    - Require status checks to pass: `validate`, `build` (from ci.yml)
    - Do not allow bypassing the above settings

- [ ] **7. API key scoping at provider level**
  - For ANTHROPIC_API_KEY: restrict to expected IPs or usage limits at console.anthropic.com
  - Set monthly budget alerts to detect unexpected usage

- [ ] **8. PRD repo trigger workflow**
  - Location: `v6_prds/.github/workflows/` (in the source PRD repo)
  - Required: A workflow that fires `repository_dispatch` to this repo when PRDs merge to `main`
  - Without this, generation only runs on manual `workflow_dispatch`

---

# 10. Enterprise Readiness Checklist

Status of each enterprise readiness criterion as of 2026-04-03.

| Criterion | Status | Notes |
|-----------|--------|-------|
| Automated CI on all PRs | True | `ci.yml` runs on feature branches and PRs to main |
| TypeScript strict mode | True | `strict: true` in `src/tsconfig.json` |
| No hardcoded secrets (enforced in CI) | True | `pnpm check:security` runs in CI |
| Dependency lockfile (pnpm) | True | `pnpm-lock.yaml`; `package-lock.json` blocked |
| Automated deployment | True | `deploy-pages.yml` on every merge to main |
| XSS protection on rendered content | True | `rehype-sanitize` in `MDXRenderer.tsx` |
| Supply-chain governance (CODEOWNERS) | True | Covers CI files, governance files |
| Human-review gate on all generated content | True | Branch + PR on every run; no auto-merge |
| Deletion safety gate | True | `DELETION_MAX_FILES=10`, `DELETION_MAX_PERCENT=25` |
| Validation gate (GREEN/AMBER/RED) | True | 7-check `validate-generation.ts` |
| Memory / drift detection system | True | `check-memory-drift.ts` runs in CI |
| Documentation quality evals | True | Four eval suites in `run-evals.ts` |
| Session-level agent guardrails | True | `.claude/settings.json` hooks |
| SPA deep link support (404 fallback) | True | `dist/404.html` = `dist/index.html` |
| Dark mode support | True | `next-themes`; full dark variant coverage |
| HTTPS / TLS | True | GitHub Pages CDN provides TLS |
| Accessibility (a11y) audit | False | Not implemented; no systematic a11y review |
| Search functionality | False | Infrastructure present (`cmdk`, `src/lib/search/`) but no working search deployed |
| Backend-for-frontend (BFF) for API keys | False | Required before AI search production use |
| Automated dependency updates | Partial | Dependabot configured; 10 open alerts pending triage |
| Performance monitoring | False | No RUM, no Lighthouse CI, no performance budgets |
| Error tracking | False | No Sentry or equivalent |
| Multiple active versions | False | Only 6.1 active; 6.1.1/5.13/NextGen defined but commented out |
| Internationalization (i18n) | False | Not implemented |
| Content versioning UI | Partial | Version selector in header; inactive versions defined but not functional |
| SEO optimization | Partial | GitHub Pages serves content; no explicit SEO meta tags or sitemap |
| HTTP security headers (production) | False | Headers configured in `nginx.conf` for local Docker only; not applied in GitHub Pages deployment |
| Content search via Anthropic API | False | Would require BFF proxy; blocked by VITE_* exposure risk |
