# Enterprise Memory Sync System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a deterministic change-to-artifact routing and drift-detection system that keeps `docs/memory/repo-memory.json` and supporting Claude artifacts automatically aligned with project changes.

**Architecture:** A static routing map (`change-routing-map.ts`) encodes which repo files belong to which memory categories. A drift detector (`check-memory-drift.ts`) cross-checks actual code values against recorded memory values AND finds git-changed files since the last memory update. A guided updater (`update-memory.ts`) bumps version/date after a maintainer edits the memory. A Claude skill (`sync-repo-memory.md`) orchestrates the full loop.

**Tech Stack:** TypeScript (Node 20+), pnpm, tsx, Node `child_process` for git, Node `fs` for file reads. No external npm packages beyond what the repo already has.

---

## Current State (Audit)

### What already exists
- `docs/memory/repo-memory.json` — 641-line canonical JSON memory (committed to main, `8cca30d`)
- `docs/memory/repo-memory.schema.json` — JSON Schema validator
- `docs/memory/README.md` — operator guide
- `.claude/commands/repo-maintainer.md` — `/repo-maintainer` skill
- `.claude/settings.local.json` — Stop hook (reminder) + PreToolUse Bash hook (pnpm guard)

### Gaps identified in audit

**Schema mismatches** (schema shape ≠ actual JSON shape):
1. `folder_structure`: schema says `additionalProperties: {type: object}` — actual JSON values are strings
2. `anti_patterns_to_avoid`: schema says array of `{pattern, why, instead}` objects — actual JSON is array of strings
3. `generation_pipeline`: schema requires `entry_script, stages, output_format` — actual JSON uses `trigger, main_script, stages (object not array)`
4. `validation_gates`: schema says nested `{command, on_failure}` objects — actual JSON is flat key-value pairs

**Missing functional specs** (not yet in repo-memory.json):
- `memory_sync` section (the sync system metadata itself)
- `dark_mode_contrast` (centralized prose/nav/TOC fix, committed `64ba502`)
- `sub_landing_page_behavior` (module-landing empty state, card grid)
- `url_management` (hash routing, URL structure, breadcrumb URL integration)
- Dark mode anti-patterns (bg-green-50 without dark: variant, hardcoded text-slate-900)

**No drift detection exists** — changes to contract files never automatically route to memory update prompts beyond a vague Stop hook message.

**No routing map exists** — no authoritative mapping of "which file changed → which memory section needs updating."

---

## Change-to-Artifact Routing Model

```
Change Category          → Primary artifact(s)            → Supporting artifacts
────────────────────────────────────────────────────────────────────────────────
Architecture/layout      → repo-memory.json §layout_contracts       → README.md
Theme/dark mode          → repo-memory.json §theme_and_branding     → (none)
Navigation/sidebar       → repo-memory.json §navigation_contract    → (none)
TOC/right-rail           → repo-memory.json §toc_contract           → (none)
Generation pipeline      → repo-memory.json §generation_pipeline    → repo-maintainer.md
Workflow/CI/branches     → repo-memory.json §workflow_contracts     → hooks if branch rule changes
Content rendering        → repo-memory.json §content_rendering_rules → (none)
Search                   → repo-memory.json §search_capabilities    → (none)
Versioning dropdown      → repo-memory.json §versioning_and_dropdown_behavior
Homepage/cards           → repo-memory.json §homepage_cards         → (none)
Validation gates         → repo-memory.json §validation_gates       → README.md
New anti-pattern         → repo-memory.json §anti_patterns_to_avoid → repo-maintainer.md
Schema shape change      → repo-memory.schema.json                  → README.md
Operating rules change   → .claude/commands/repo-maintainer.md      → hooks
Hook behavior change     → .claude/settings.local.json              → README.md
New slash command        → .claude/commands/{name}.md               → README.md
Human guidance change    → docs/memory/README.md                    → (none)
Trivial refactor         → NO UPDATE NEEDED                         → (none)
```

---

## Task 1: Fix schema mismatches

**Files:**
- Modify: `docs/memory/repo-memory.schema.json`

**Step 1:** Align schema to actual JSON shapes:
- `folder_structure`: change `additionalProperties` from `{type: object}` to `{type: string}`
- `anti_patterns_to_avoid`: change from array of objects to array of strings
- `generation_pipeline`: relax `required` to `["trigger", "main_script"]`; make `stages` an object
- `validation_gates`: change `additionalProperties` to `{type: string}`
- Add `memory_sync` property definition

**Step 2:** Validate JSON still parses
```bash
node -e "JSON.parse(require('fs').readFileSync('docs/memory/repo-memory.schema.json','utf8')); console.log('✅ schema valid JSON')"
node -e "JSON.parse(require('fs').readFileSync('docs/memory/repo-memory.json','utf8')); console.log('✅ memory valid JSON')"
```

**Step 3:** Commit
```bash
git add docs/memory/repo-memory.schema.json
git commit -m "fix(memory-schema): align schema shape to actual JSON structure"
```

---

## Task 2: Create scripts/memory/change-routing-map.ts

**Files:**
- Create: `scripts/memory/change-routing-map.ts`

This is a pure data module — no side effects, no imports except types.

**Content:**
```typescript
export interface SupportingArtifact {
  file: string;
  condition: string;
}

export interface RoutingRule {
  id: string;
  category: string;
  description: string;
  trackedFiles: string[];       // actual file paths relative to repo root
  memorySections: string[];     // top-level keys in repo-memory.json
  supportingArtifacts: SupportingArtifact[];
  severity: 'critical' | 'important' | 'low';
}

export const ROUTING_RULES: RoutingRule[] = [
  {
    id: 'layout-contracts',
    category: 'Architecture / Layout',
    description: 'Page shell, sidebar-main flex layout, constrained reading width',
    trackedFiles: [
      'src/components/DocumentationLayout.tsx',
      'src/components/DocumentationContent.tsx',
      'src/components/DocumentationHeader.tsx',
    ],
    memorySections: ['layout_contracts', 'website_functional_specs'],
    supportingArtifacts: [{ file: 'docs/memory/README.md', condition: 'Layout architecture changed significantly' }],
    severity: 'critical',
  },
  // ... full list
];
```

**Step 1:** Create `scripts/memory/` directory and write `change-routing-map.ts`

**Step 2:** Verify TypeScript compiles
```bash
cd C:/github/v6_feature_documentation && pnpm tsx --tsconfig scripts/tsconfig.json -e "import('./scripts/memory/change-routing-map.ts').then(m => console.log('Rules:', m.ROUTING_RULES.length))"
```

**Step 3:** Commit
```bash
git add scripts/memory/change-routing-map.ts
git commit -m "feat(memory): add change-to-artifact routing map"
```

---

## Task 3: Create scripts/memory/check-memory-drift.ts

**Files:**
- Create: `scripts/memory/check-memory-drift.ts`

Two detection strategies:
1. **Value cross-check** — read actual values from code, compare to memory recorded values
2. **File-change tracking** — git log since `generated_at`, map through routing rules

**Step 1:** Write the script (see implementation section)

**Step 2:** Run it and verify it works
```bash
pnpm tsx --tsconfig scripts/tsconfig.json scripts/memory/check-memory-drift.ts
```
Expected: GREEN (no drift since memory was just updated in 8cca30d)

**Step 3:** Commit
```bash
git add scripts/memory/check-memory-drift.ts
git commit -m "feat(memory): add deterministic drift detector for repo-memory"
```

---

## Task 4: Create scripts/memory/update-memory.ts

**Files:**
- Create: `scripts/memory/update-memory.ts`

**Step 1:** Write a helper that bumps `generated_at` and patch-bumps `memory_version`

Usage:
```bash
pnpm memory:update            # bump date + version after editing memory
pnpm memory:update --validate  # just validate JSON is well-formed
```

**Step 2:** Test it
```bash
pnpm tsx --tsconfig scripts/tsconfig.json scripts/memory/update-memory.ts --validate
```

**Step 3:** Commit
```bash
git add scripts/memory/update-memory.ts
git commit -m "feat(memory): add guided memory update helper"
```

---

## Task 5: Add memory scripts to package.json

**Files:**
- Modify: `package.json`

Add to `"scripts"`:
```json
"memory:check":  "tsx --tsconfig scripts/tsconfig.json scripts/memory/check-memory-drift.ts",
"memory:update": "tsx --tsconfig scripts/tsconfig.json scripts/memory/update-memory.ts"
```

**Step 1:** Edit package.json

**Step 2:** Verify scripts resolve
```bash
pnpm memory:check
pnpm memory:update --validate
```

**Step 3:** Commit
```bash
git add package.json
git commit -m "feat(memory): add memory:check and memory:update pnpm scripts"
```

---

## Task 6: Expand repo-memory.json

**Files:**
- Modify: `docs/memory/repo-memory.json`

Add/expand:
1. `memory_sync` section — documents the sync system artifacts, scripts, drift-check behavior
2. `dark_mode_contrast` section — specs for centralized dark mode (committed 64ba502)
3. `sub_landing_page_behavior` — module landing page, empty state behavior
4. `url_management` — hash routing, URL format, breadcrumb URL integration
5. Append new anti-patterns discovered (dark mode patterns, CSS specificity pitfalls)
6. Bump `memory_version` to `1.1.0`, update `generated_at` to `2026-04-01`

**Step 1:** Edit JSON (keep all existing sections, add new ones at end before `anti_patterns_to_avoid`)

**Step 2:** Validate
```bash
node -e "JSON.parse(require('fs').readFileSync('docs/memory/repo-memory.json','utf8')); console.log('✅ valid JSON')"
```

**Step 3:** Commit
```bash
git add docs/memory/repo-memory.json
git commit -m "feat(memory): expand coverage — dark mode, sub-landing, URL, memory-sync section"
```

---

## Task 7: Create .claude/commands/sync-repo-memory.md

**Files:**
- Create: `.claude/commands/sync-repo-memory.md`

A 5-step orchestration skill:
1. Run `pnpm memory:check` and parse output
2. For each flagged category, show what needs updating
3. Update the memory section(s) — read current component/file state and encode it
4. Run `pnpm memory:update` to bump version and date
5. Validate JSON and commit

**Step 1:** Write the skill file

**Step 2:** Commit
```bash
git add .claude/commands/sync-repo-memory.md
git commit -m "feat(memory): add /sync-repo-memory Claude skill"
```

---

## Task 8: Update repo-maintainer.md

**Files:**
- Modify: `.claude/commands/repo-maintainer.md`

Add Step 2.5: "Run `pnpm memory:check` and inspect drift report. If drift detected, run `/sync-repo-memory` before proceeding."

---

## Task 9: Improve Stop hook in settings.local.json

**Files:**
- Modify: `.claude/settings.local.json` (local only, gitignored)

Current Stop hook is a generic vague reminder. Improve it to reference `pnpm memory:check` specifically.

---

## Task 10: Update docs/memory/README.md

**Files:**
- Modify: `docs/memory/README.md`

Add section: **Automated Drift Detection** documenting:
- `pnpm memory:check` — what it does, exit codes, when to run
- `pnpm memory:update` — what it does, when to use
- `/sync-repo-memory` skill — full workflow
- Change-to-artifact routing table (human-readable version)

---

## Task 11: Run validation + build

```bash
pnpm validate    # typecheck + security + setup
pnpm build       # production build
```

All gates must be GREEN.

---

## Task 12: Final commit — push branch

```bash
git push -u origin autofeature-memory-sync-system-6_1-01042026
```

---

## Success Criteria

- [ ] `pnpm memory:check` exits 0 when memory is current, 1 when drift detected
- [ ] `pnpm memory:check` output shows exact category + memory section to update
- [ ] `pnpm memory:update` bumps `generated_at` and `memory_version` patch
- [ ] `/sync-repo-memory` skill guides agent through full drift-detect → update → validate loop
- [ ] `repo-memory.json` covers all explicitly required functional specs (leftnav/rightnav/toc, dark mode, homepage cards, search, version dropdown, body width, breadcrumbs, URL management)
- [ ] Schema matches actual JSON structure (no shape mismatches)
- [ ] `pnpm validate` and `pnpm build` pass clean
- [ ] Change-routing-map covers all contract file categories
- [ ] Anti-patterns list includes dark mode CSS pitfalls

---

## Routing Map Reference (full)

| Change in file(s) | Category | Memory section(s) | Supporting artifacts |
|---|---|---|---|
| `src/components/DocumentationLayout.tsx` | Architecture/Layout | `layout_contracts`, `website_functional_specs` | README.md |
| `src/components/DocumentationContent.tsx` | Architecture/Layout | `layout_contracts`, `toc_contract` | — |
| `src/components/NavigationMenu.tsx` | Navigation | `navigation_contract` | — |
| `src/components/TableOfContents.tsx` | TOC | `toc_contract` | — |
| `src/components/MDXRenderer.tsx` | Content rendering | `content_rendering_rules` | — |
| `src/styles/globals.css` | Theme/Dark mode | `theme_and_branding`, `dark_mode_contrast`, `layout_contracts` | — |
| `src/components/HomePage.tsx`, `homePageConfig.ts` | Homepage | `homepage_cards` | — |
| `src/components/AISearchDialog.tsx` | Search | `search_capabilities` | — |
| `src/lib/content/contentLoader.ts` | Content loading | `runtime_content_loading` | — |
| `vite.config.ts` | Build config | `repo_contracts`, `tooling_and_build` | README.md |
| `package.json` | Tooling | `repo_contracts`, `tooling_and_build` | — |
| `.github/workflows/generate-v6feature-docs.yml` | CI/CD | `ci_cd_contracts`, `generation_pipeline` | repo-maintainer.md |
| `.github/workflows/ci.yml` | CI/CD | `ci_cd_contracts` | — |
| `.github/workflows/deploy-pages.yml` | CI/CD deploy | `ci_cd_contracts` | — |
| `scripts/generate-feature-doc.ts` | Pipeline | `generation_pipeline` | repo-maintainer.md |
| `scripts/sync-toc-from-index.ts` | Publishing | `publishing_contract` | — |
| `src/components/DocumentationHeader.tsx` | Versioning | `versioning_and_dropdown_behavior` | — |
| `src/utils/hierarchicalTocLoader.ts` | Breadcrumbs/URL | `url_management`, `website_functional_specs` | — |
