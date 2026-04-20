# /repo-auditor — Full Repository Audit

**Invoke with:** `/repo-auditor`

**Purpose:** Perform a comprehensive, evidence-based audit of the `v6_feature_documentation` repository. Covers architecture, pipeline, publishing, theme, CI, and AI governance. Classifies all findings by severity. Produces a priority-ordered remediation plan.

**When to invoke:**
- At the start of any session where something is broken and root cause is unknown
- Before a release cut or content push
- When onboarding to this project in a new session
- When told to do a "full audit", "health check", or "system review"
- When the repo hasn't been touched in weeks and drift is likely

Do NOT invoke for routine feature work — use `/repo-maintainer` instead.

---

## Step 0 — Deterministic gates first

Run these before any manual inspection. Record the exact exit code and any failures. A non-zero exit is a **Critical** finding that must appear at the top of the report.

```bash
pnpm memory:check     # 0=GREEN 1=AMBER 2=RED — exits with drift status
pnpm validate         # typecheck + security + setup
pnpm build            # full production build (includes sync-toc prebuild)
```

Also capture baseline git state:
```bash
git -C /c/github/v6_feature_documentation branch --show-current
git -C /c/github/v6_feature_documentation status --short
git -C /c/github/v6_feature_documentation log --oneline -5
```

---

## Step 1 — Load the repo contract

Read the canonical memory file before doing any inspection:
```
docs/memory/repo-memory.json
```

Use it as the authoritative contract document throughout this audit. Any discrepancy between memory and reality is a **Contract Drift** finding. Do not re-document what the memory file already states — reference it.

---

## Step 2 — Repo architecture audit

### 2a. Folder boundary checks

Verify these exact boundaries exist and are respected:

| Boundary | Expected | Check |
|----------|----------|-------|
| Content files | `src/pages/content/6_1/` | Manually curated; contains `.md` only |
| Runtime content logic | `src/lib/content/` | No `.md`/`.mdx` content files here |
| Static import maps | `src/lib/imports/` | Auto-generated; do not hand-edit |
| Global styles + tokens | `src/styles/globals.css` | Only authored CSS file |
| Pre-compiled Tailwind | `src/index.css` | Do not edit — artifact |
| Build output | `dist/` | Never `build/` |
| Scripts | `scripts/` | `.ts` only; no `.js`/`.mjs` |

### 2b. Legacy path check

```bash
grep -r "src/content/" src/ --include="*.ts" --include="*.tsx"
grep -r "v6_1" src/ --include="*.ts" --include="*.tsx"
grep -rn "build/" vite.config.ts .github/workflows/ package.json
```

Any `src/content/` reference in runtime code (not a comment or fallback with explanation) is **High**.
Any `v6_1` in output paths is **High**.
Any `build/` reference where `dist/` is expected is **High**.

### 2c. TypeScript policy check

```bash
find src/ scripts/ -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.jsx" \) | grep -v node_modules
```

Every result must be either documented in `docs/decisions/` or a `public/` browser asset. Anything else is **High**.

---

## Step 3 — TOC / doc-graph audit

> **Note:** The PRD-to-feature-doc generation pipeline was retired in April 2026. Content is now manually curated. Steps 3a–3f from the old pipeline audit have been replaced with TOC and graph validation.

### 3a. TOC structure

```bash
pnpm check:toc
```

Must exit 0. Check 7 (duplicate node IDs) may produce a WARN — this is a known forward-looking issue, not a blocker.

### 3b. Path contract

```bash
pnpm check:paths
```

Must exit 0. Verifies `public/doc-graph.json` and `public/search-index.json` exist.

### 3c. Navigation data

Read the first 10 lines of `src/data/navigationData.ts`. Verify:
- File has an auto-generated header comment (must NOT be hand-edited)
- Expected modules: My Dashboard, CMDB, Discovery Scan, ITSM, Vulnerability Management, ITAM, Program/Project Management, Self-Service, Risk Register, Reports, Admin (11 total)

### 3d. Content coverage

```bash
pnpm build-search-index 2>&1 | grep "Entries"
```

`Entries indexed` must equal `TOC pages` and `Entries skipped` must be `0`.

---

## Step 4 — Website publishing / navigation audit

### 4a. sync-toc contract

```bash
grep -n "src/pages/content\|index.md\|version" scripts/sync-toc-from-index.ts | head -15
```

Verify it reads from `src/pages/content/{version}/*/index.md` (not from any other path).

Verify `package.json` has: `"prebuild": "pnpm run sync-toc"` (navigation must rebuild before every build).

### 4b. Navigation data

Read the first 10 lines of `src/data/navigationData.ts`. Verify:
- File has an auto-generated header comment (must NOT be hand-edited)
- Labels match actual navTitles, not generic type names

### 4c. Active versions

```bash
ls src/pages/content/
```

Only `6_1/` should be active. Versions `6_1_1`, `5_13`, `NG` should not have content directories (or if present, should produce empty stubs with a warning during sync-toc).

### 4d. Left nav / TOC components

Check that dark-mode variants are present on interactive nav elements:
```bash
grep -n "hover:bg-slate-50\|text-slate-900\|text-slate-600" src/components/NavigationMenu.tsx | head -10
grep -n "dark:" src/components/NavigationMenu.tsx | wc -l
grep -n "dark:" src/components/TableOfContents.tsx | wc -l
```

A nav or TOC component with zero `dark:` variants is a **High** finding.

---

## Step 5 — Theme / branding / UX audit

### 5a. Brand tokens

```bash
grep -n "\-\-brand\|brand-dark\|brand-light" src/styles/globals.css | head -10
grep -n "VIRIMA\|Virima" index.html src/components/homePageConfig.ts src/components/DocumentationHeader.tsx
```

Verify:
- `--brand: #3db553` in `:root`
- `--brand: #3db553` in `.dark {}` (same green, unchanged)
- `<title>` in `index.html` contains `VIRIMA` (uppercase)
- `homePageConfig.ts` has `brand: "VIRIMA"` (uppercase, not `"Virima"`)
- Header shows `VIRIMA` wordmark

### 5b. Dark mode surface safety

```bash
grep -r "bg-white\b" src/components/ --include="*.tsx" | grep -v "dark:" | grep -v "//\|\/\*"
grep -r "text-slate-900\b\|text-slate-700\b" src/components/ --include="*.tsx" | grep -v "dark:" | grep -v "//\|\/\*"
```

Any hardcoded light-mode-only color on a surface element (not a conditional or hover-only context) is **Medium**.

### 5c. `!important` override check

```bash
grep -n "!important" src/styles/globals.css | head -10
```

`.bg-white !important` or `.text-white !important` overrides fight dark mode. Flag any such overrides as **Medium**.

### 5d. Tailwind v4 back-fill check

Any `dark:*` utility used in `.tsx` files must either exist in `src/index.css` OR be back-filled in `src/styles/globals.css`. Spot-check 2 utilities from NavigationMenu.tsx or TableOfContents.tsx against both files.

### 5e. Inter font + favicon

```bash
grep -n "Inter\|fonts.googleapis\|favicon" index.html
```

Verify Inter font is loaded via Google Fonts preconnect and `display=swap`. Verify favicon is `/FeatureDocsite/favicon.svg`.

---

## Step 6 — CI / workflow audit

### 6a. Package manager correctness

```bash
grep -rn "npm install\|npm run \|npx " .github/workflows/ | grep -v "pnpm\|# "
```

Any `npm install` or `npm run` not in a comment is **Critical** (breaks on locked pnpm runners).

### 6b. Build output references

```bash
grep -rn "\boutDir.*build\b\|['\"]build/['\"]" .github/workflows/ vite.config.ts package.json
```

Any `build/` where `dist/` is expected is **High**.

### 6c. Deployment model

Verify `deploy-pages.yml` deploys to GitHub Pages via `actions/deploy-pages@v4`. This is the sole production deployment path. Flag if any workflow references ECR, Kubernetes, or `ci-cd.yml` as active production paths (these were retired).

---

## Step 7 — AI governance audit

### 7a. CLAUDE.md accuracy

Read `CLAUDE.md`. Check for these known contract points:

| Contract | What to verify |
|----------|---------------|
| Build output | `dist/` (NOT `build/`) |
| Content model | Manually curated — no PRD pipeline references remain |
| Deployment model | GitHub Pages via deploy-pages.yml (ECR/Kubernetes retired) |
| Validation commands | `pnpm validate`, `pnpm build`, `pnpm memory:check` all present |

Any factual error in CLAUDE.md is **Critical** — it misguides every agent session.

### 7b. Command freshness

For each file in `.claude/commands/`, verify output paths and commands are current:

| Command | Key check |
|---------|-----------|
| `repo-auditor.md` | This skill exists |
| `repo-maintainer.md` | References `pnpm memory:check` in Step 2.5 |
| `sync-repo-memory.md` or `memory-maintainer.md` | Routing table is current |
| `pipeline-auditor.md` | Is tombstoned with RETIRED header; redirects to `/audit-docs` |
| `repo-hygiene.md` | References `dist/` not `build/`; no `src/content/` references |
| `generate-feature-docs.md` | Is a redirect tombstone pointing to `/add-doc-page` |
| `release-readiness.md` | Includes `pnpm memory:check` |

### 7c. Memory accuracy spot-check

Run `pnpm memory:check` (already done in Step 0). Additionally verify three specific memory values:

```bash
# Check these manually:
# 1. repo_contracts.base_path vs vite.config.ts base value
grep -n "^  base:" vite.config.ts
pnpm memory:update --section repo_contracts

# 2. source_target_repo_relationships.source_prd_path — must be 6_1 not v6_1
pnpm memory:update --section source_target_repo_relationships

# 3. theme_and_branding.brand_green vs globals.css --brand token
grep -n "\-\-brand:" src/styles/globals.css | head -3
```

A memory value that contradicts the actual code is **Critical** (it is a documented lie).

### 7d. Hooks

Read `.claude/settings.json`. Verify:
- `PreToolUse` hook on `Bash` blocks `npm install`/`yarn`/`npx` (exit code 2 = blocking)
- `PreToolUse` hook on `Edit|Write|MultiEdit` warns on edits to `src/pages/content/` (pipeline-owned)
- `PreToolUse` hook on `Edit|Write|MultiEdit` warns on `/v6_1/` legacy path usage
- `Stop` hook message references `pnpm memory:check` with exit code guidance

---

## Step 8 — Synthesize and report

### Severity classification

| Severity | Definition |
|----------|-----------|
| **Critical** | Broken build, wrong facts in governance docs, pipeline fails, blocks operation |
| **High** | Contract violations, stale paths, missing governance, reproducibility risk |
| **Medium** | Style inconsistencies, incomplete specs, dark mode gaps, minor branding issues |
| **Low** | Polish items, convenience improvements, optional hardening |

### Findings format

For each finding, output:
```
[SEVERITY] {Category} — {Short title}
Evidence: {exact file:line or command output}
Impact:   {what breaks or misleads if unaddressed}
Fix:      {exact action — file to edit, command to run}
```

### Final output structure

```
## Audit Report — {date}

### Step 0 Results
{gate command outputs}

### Findings
{findings, grouped by area, highest severity first}

### Priority-Ordered Remediation
1. Critical: ...
2. High: ...
3. Medium: ...
4. Low: ...

### Memory / Governance Status
{GREEN/AMBER/RED from memory:check + any governance drift noted}
```

---

## What NOT to flag

Do not flag these — they are expected, known, or by design:

- `src/data/navigationData.ts` is auto-generated (expected — has generation header)
- `src/utils/indexContentMap.ts` is auto-generated (expected)
- `src/lib/imports/` has many auto-generated files (expected)
- Vite chunk size warning (~1.8MB index.js) — pre-existing, non-blocking
- Versions `6_1_1`, `5_13`, `NG` not having content — planned, commented out
- `.cache/` and `dist/` directories — gitignored, expected
- `pnpm-lock.yaml` being large — expected
- `contentLoader.ts` having a `/src/content/` string in a defensive HTML-extraction fallback — acceptable

---

## Memory / governance integration

This audit skill:
- **Reads** `docs/memory/repo-memory.json` as the contract reference (Step 1)
- **Runs** `pnpm memory:check` as a deterministic gate (Step 0)
- **Flags** memory inaccuracies as Critical findings (Step 7c)
- **Does NOT update** memory itself — use `/memory-maintainer` or `/sync-repo-memory` for that
- **References** `docs/memory/README.md` for drift detection documentation
