# AI Memory System — Operator Guide

This directory contains the canonical machine-readable intelligence store for the `v6_feature_documentation` repository. It is the authoritative reference for Claude agents, CI scripts, and human maintainers.

---

## Files

| File | Purpose |
|------|---------|
| `repo-memory.json` | Canonical AI memory index — architecture, contracts, rules, anti-patterns |
| `repo-memory.schema.json` | JSON Schema — validates memory structure, supports future extension |
| `README.md` | This guide — how to read, use, and update the memory system |

---

## What `repo-memory.json` Contains

The memory file is a single structured JSON document with these top-level sections:

| Section | What it captures |
|---------|----------------|
| `project_identity` | Name, URLs, brand rules |
| `project_scope` | Active version, planned versions, audience, content format |
| `source_target_repo_relationships` | How v6_prds maps to this repo |
| `repo_contracts` | pnpm, TypeScript-only, build dir, base path |
| `folder_structure` | Purpose + ownership of every key directory |
| `folder_mirroring` | How PRD folder structure must be mirrored |
| `generation_pipeline` | 4-stage pipeline, entry script, trigger, manifest format |
| `deliverable_decision_engine` | Which deliverables to generate per PRD type |
| `filename_rules` | Slug conventions, output file naming |
| `display_title_rules` | Title computation for generated docs |
| `generation_manifests` | Manifest schema, companion file rules |
| `publishing_contract` | Module index.md format and rules |
| `navigation_contract` | How sync-toc reads index.md → navigationData.ts |
| `toc_contract` | Right-rail TOC auto-extraction rules |
| `runtime_content_loading` | contentLoader, registry, import maps |
| `website_functional_specs` | Routing, search, version selector, module cards |
| `layout_contracts` | Two-column layout, breakpoints, sticky TOC |
| `responsive_breakpoints` | Screen widths, behaviors |
| `search_capabilities` | Flexsearch index, search UX |
| `versioning_and_dropdown_behavior` | Version map, active version, future gating |
| `homepage_cards` | Module card grid, config location |
| `theme_and_branding` | CSS vars, dark mode palette, brand-green tokens |
| `content_rendering_rules` | MDXRenderer, ReactMarkdown, components |
| `table_rendering_rules` | Table CSS, alignment, virima-table class |
| `image_asset_rules` | Asset paths, OptimizedImage, priority fix |
| `tooling_and_build` | Vite, Tailwind v4 gotchas, key scripts |
| `validation_gates` | All gates with commands and failure actions |
| `workflow_contracts` | Expected workflows: generate, dev, validate |
| `ci_cd_contracts` | GitHub Actions workflow |
| `secret_dependencies` | Required env vars |
| `branch_naming` | Branch pattern, separator rules |
| `enterprise_capabilities` | Key enterprise features of the site |
| `repo_specific_vs_reusable_rules` | What's Virima-specific vs portable |
| `future_reuse` | Architecture notes for reusing this platform |
| `anti_patterns_to_avoid` | Common mistakes and correct alternatives |
| `maintenance_guidance` | When and how to update this file |

---

## How Claude Agents Use This File

When a Claude agent loads `.claude/commands/repo-maintainer.md`, it is instructed to:

1. Read `docs/memory/repo-memory.json` at session start
2. Apply all contracts as immutable rules for the session
3. Update the memory file when architecture or contracts change
4. Never act on repo structure without consulting it first

**Skill path:** `.claude/commands/repo-maintainer.md`

---

## When to Update `repo-memory.json`

Update after any session that changes:

- Folder structure or file ownership
- Pipeline stages, scripts, or output format
- CSS layout contracts or Tailwind v4 workarounds
- Theme tokens or brand rules
- Navigation or TOC contracts
- New anti-patterns discovered

**Do not update** for:
- Routine content generation (adding new feature docs)
- Bug fixes that don't change contracts
- Style tweaks that don't change tokens

---

## Automated Drift Detection

The memory sync system provides deterministic drift detection so Claude agents and humans always know when `repo-memory.json` is out of date.

### Commands

| Command | Purpose |
|---------|---------|
| `pnpm memory:check` | Detect drift — compares recorded values against actual code + git history |
| `pnpm memory:update` | Bump `memory_version` (patch) and `generated_at` after manual edits |
| `pnpm memory:update --validate` | Validate JSON structure only (no changes) |
| `pnpm memory:update --section <key>` | Print a section for editing reference |

### Exit Codes

| Code | Status | Meaning |
|------|--------|---------|
| `0` | GREEN | No drift detected — memory is current |
| `1` | AMBER | File changes detected — memory may need updating |
| `2` | RED | Value mismatch — memory records wrong facts (critical) |

### Detection Strategies

**Strategy 1 — Value Cross-Check:** Extracts specific values directly from source files (e.g., pnpm version from `package.json`, Vite base path from `vite.config.ts`) and compares them against what `repo-memory.json` records. A mismatch means the memory is factually wrong — RED.

**Strategy 2 — File-Change Tracking:** Uses `git log` to find commits since the last memory update, maps changed files through `scripts/memory/change-routing-map.ts` (19 routing rules), and reports which memory sections need updating — AMBER.

### Change-to-Artifact Routing

The routing map (`scripts/memory/change-routing-map.ts`) maps each tracked file to:
- **`memorySections`** — top-level keys in `repo-memory.json` to update
- **`supportingArtifacts`** — other files (skills, README) that may also need updating
- **`severity`** — `critical` (block release), `important` (before next session), `low` (at convenience)

Example routing rule:
```
src/styles/globals.css  →  theme_and_branding, dark_mode_contrast, layout_contracts
vite.config.ts          →  repo_contracts, tooling_and_build, enterprise_capabilities
scripts/generate-feature-doc.ts  →  generation_pipeline, deliverable_decision_engine
```

### Guided Update Skill

After `pnpm memory:check` reports drift, use the `/sync-repo-memory` Claude skill to walk through:

1. `pnpm memory:check` — read the drift report
2. Inspect flagged memory sections vs actual code
3. Determine what changed using the routing table
4. Edit `repo-memory.json` targeted sections
5. `pnpm memory:update` → `pnpm validate` → commit

### Typical End-of-Session Workflow

```bash
pnpm memory:check          # check for drift (exit 0 = done)
# If AMBER/RED:
#   run /sync-repo-memory  (guided skill)
#   pnpm memory:update     (bumps version + date)
#   pnpm validate          (all gates green)
#   git commit             (include memory update)
```

---

## Manual Update Process

1. Read current `repo-memory.json`
2. Apply targeted edits — do not rewrite the whole file unless restructuring
3. Run `pnpm memory:update` — bumps `memory_version` patch and `generated_at` automatically
4. Validate: `pnpm memory:update --validate`
5. Commit with message: `docs: update repo-memory.json — <what changed>`

---

## Validating the Schema

```bash
# Structural + version check
pnpm memory:update --validate

# Full JSON parse only
node -e "JSON.parse(require('fs').readFileSync('docs/memory/repo-memory.json','utf8')); console.log('✅ Valid JSON')"

# Against schema (requires ajv-cli)
pnpm dlx ajv-cli validate -s docs/memory/repo-memory.schema.json -d docs/memory/repo-memory.json
```

---

## Key Rules (Never Violate)

These are derived from `repo_contracts` in the memory file:

| Rule | Detail |
|------|--------|
| **pnpm only** | Never `npm install` or `yarn` |
| **TypeScript only** | No `.js` source files under `src/` |
| **dist/ not build/** | Build output dir is always `dist/` |
| **/FeatureDocsite/ base path** | Never change this — GitHub Pages uses it |
| **No hand-editing generated content** | `src/pages/content/` is pipeline-owned |
| **No hand-editing index.md** | Module index.md is pipeline-maintained |
| **PRD source is read-only** | `v6_prds/` is a reference repo only |
| **VIRIMA uppercase** | Brand name is always VIRIMA, never Virima |
| **Tailwind v4 pre-compiled** | New utility classes must be back-filled in `globals.css` |
| **Validate before merge** | `pnpm validate` and `pnpm build` must pass |

---

## Directory Structure

```
docs/
└── memory/
    ├── repo-memory.json          ← Canonical AI memory index (machine-readable)
    ├── repo-memory.schema.json   ← JSON Schema for validation
    └── README.md                 ← This file (human guide)
```
