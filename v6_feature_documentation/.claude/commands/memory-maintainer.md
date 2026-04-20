# /memory-maintainer — Memory Lifecycle Manager

**Invoke with:** `/memory-maintainer`

**Purpose:** Manage the full lifecycle of the AI memory system — not just drift detection and updates, but schema evolution, routing rule maintenance, new section creation, and versioning decisions. Use this when changes are structural or when `/sync-repo-memory` isn't enough.

**Relationship to `/sync-repo-memory`:**
- `/sync-repo-memory` handles the common case: drift detected → update existing sections → bump patch version
- `/memory-maintainer` handles structural changes: new sections, schema updates, routing rule changes, major/minor version decisions, and systematic memory health reviews

**When to invoke:**
- Adding a new top-level section to `repo-memory.json`
- Changing the JSON Schema (`repo-memory.schema.json`)
- Adding new routing rules to `change-routing-map.ts`
- When `pnpm memory:check` shows RED with a value mismatch (not just AMBER)
- When onboarding a new module or version (expanding the pipeline's scope)
- When the memory system itself needs reviewing (schema drift, stale routing rules)

---

## Step 1 — Assess what kind of change is needed

Before editing anything, classify the change:

| Change Type | Version Bump | Skill to Use |
|-------------|-------------|--------------|
| Updating a value in an existing section | Patch (`1.1.0` → `1.1.1`) | `/sync-repo-memory` |
| Adding facts to an existing section | Patch | `/sync-repo-memory` |
| Adding a new top-level section | Minor (`1.1.0` → `1.2.0`) | `/memory-maintainer` |
| Renaming or restructuring existing sections | Minor | `/memory-maintainer` |
| Changing the JSON Schema | Minor or Major | `/memory-maintainer` |
| Breaking schema change or complete restructure | Major (`1.1.0` → `2.0.0`) | `/memory-maintainer` |
| Adding/updating routing rules only | Patch (routing map is a separate artifact) | `/memory-maintainer` |

---

## Step 2 — Run full system check

```bash
pnpm memory:check           # Current drift status
pnpm memory:update --validate  # JSON structure valid
```

Record the current state before making any changes. If memory:check shows RED for a value mismatch, fix that first — do not add new sections on top of wrong facts.

---

## Step 3 — Adding a new memory section

When a new feature area, contract, or behavior needs to be documented in memory:

### 3a. Determine the section key

Use the same naming convention as existing sections:
- `snake_case`
- Descriptive but concise (e.g., `error_boundary_behavior`, `chat_assistant_contract`)
- Check that no existing section already covers this (avoid duplication)

### 3b. Write the section

Structure each new section as a JSON object with:
- At least one `description` or `purpose` field
- Specific observable facts (values, file paths, behaviors) — not aspirational statements
- Anti-patterns if any are known for this area

Example structure for a new section:
```json
"error_boundary_behavior": {
  "description": "How the app handles content loading failures and rendering errors",
  "content_load_error": "Falls back to hardcoded navigationData.ts constants if TOC loading fails",
  "empty_state": "Shows placeholder message when no content is available for a route",
  "affected_components": ["DocumentationLayout.tsx", "MDXContent.tsx"]
}
```

### 3c. Add the section to `repo-memory.json`

Edit the JSON directly. Insert the new section alphabetically among the top-level keys (after the metadata fields: `$schema`, `memory_version`, `generated_at`, `maintained_by`).

### 3d. Update the JSON Schema

Open `docs/memory/repo-memory.schema.json`. The schema uses `additionalProperties: true` for flexibility, but if the new section has a well-defined shape, add it:

```json
"error_boundary_behavior": {
  "type": "object",
  "description": "Content loading failure and rendering error behavior"
}
```

Only add schema enforcement for sections with stable, well-known shapes. Do not add strict schemas for sections that will evolve frequently.

### 3e. Add routing rules to `change-routing-map.ts`

Open `scripts/memory/change-routing-map.ts`. Add a new `RoutingRule` entry for the files that, when changed, should trigger an update to the new memory section:

```typescript
{
  id: 'error-boundary-behavior',
  category: 'Error Boundary / Loading States',
  description: 'Error boundaries, content load failures, empty states',
  trackedFiles: [
    'src/components/DocumentationLayout.tsx',
    'src/lib/content/contentLoader.ts',
  ],
  memorySections: ['error_boundary_behavior'],
  supportingArtifacts: [],
  severity: 'low',
},
```

**Routing rule guidance:**
- `severity: 'critical'` — blocks release if not updated (core contracts: build config, CI, pipeline)
- `severity: 'important'` — update before next session (layout, navigation, theme)
- `severity: 'low'` — update at convenience (minor behaviors, edge cases)

### 3f. Bump minor version

```bash
# Manually edit memory_version in repo-memory.json: x.y.z → x.(y+1).0
# Then run:
pnpm memory:update  # sets generated_at and validates; you already bumped the minor
```

Actually: `pnpm memory:update` always does a PATCH bump. For a minor bump, edit `memory_version` manually first, then run `pnpm memory:update` which will do a patch bump on your manual minor bump. Or edit the version field directly to the desired value and run `--validate` only.

Correct sequence for minor bump:
1. Edit `repo-memory.json` — change version to `x.(y+1).0`
2. Edit `repo-memory.json` — add the new section
3. Run `pnpm memory:update --validate` to verify JSON structure
4. Run `pnpm memory:check` to confirm GREEN

---

## Step 4 — Updating the JSON Schema

Only update `docs/memory/repo-memory.schema.json` when:
- A new section has a well-defined, stable shape
- An existing section's shape changed in a breaking way
- The top-level required keys changed

**Required keys** (must always be present):
```json
"required": [
  "$schema", "memory_version", "generated_at", "maintained_by",
  "project_identity", "project_scope", "repo_contracts", "folder_structure",
  "generation_pipeline", "tooling_and_build", "validation_gates", "anti_patterns_to_avoid"
]
```

Do NOT add sections to `required` unless they are truly non-negotiable for every future repo state.

After editing the schema, validate:
```bash
pnpm memory:update --validate
# If ajv-cli available:
pnpm dlx ajv-cli validate -s docs/memory/repo-memory.schema.json -d docs/memory/repo-memory.json
```

---

## Step 5 — Memory health review (full)

Run this review when the memory hasn't been formally reviewed in a while or before a major milestone:

### 5a. Completeness check

Read the repo's actual state and compare against memory coverage:

```bash
# What sections does memory currently have?
pnpm memory:update --validate  # shows section count
node -e "const m=JSON.parse(require('fs').readFileSync('docs/memory/repo-memory.json','utf8')); console.log(Object.keys(m).filter(k=>!k.startsWith('$')).join('\n'));"
```

For each major repo area below, verify a memory section exists and is accurate:

| Area | Expected Memory Section |
|------|------------------------|
| PRD source path | `source_target_repo_relationships` |
| Generation pipeline | `generation_pipeline` |
| Deliverable types | `deliverable_decision_engine` |
| Navigation contract | `navigation_contract`, `publishing_contract` |
| Theme tokens | `theme_and_branding` |
| Dark mode | `dark_mode_contrast` |
| Layout | `layout_contracts` |
| Left nav / TOC | `navigation_contract`, `toc_contract` |
| Search | `search_capabilities` |
| Version dropdown | `versioning_and_dropdown_behavior` |
| Homepage cards | `homepage_cards` |
| URL / breadcrumbs | `url_management` |
| CI/CD | `ci_cd_contracts` |
| Validation gates | `validation_gates` |
| Memory system | `memory_sync` |
| Anti-patterns | `anti_patterns_to_avoid` |
| Build tooling | `tooling_and_build` |
| Repo contracts | `repo_contracts` |

Any missing section is a gap to fill.

### 5b. Value accuracy spot-check

Verify 5 specific recorded values against actual code:

```bash
# pnpm version
grep -o '"packageManager": "pnpm@[^"]*"' package.json
pnpm memory:update --section repo_contracts  # compare

# Vite base path
grep "base:" vite.config.ts
# compare against repo_contracts.base_path

# Source PRD path (critical — known historical mismatch)
pnpm memory:update --section source_target_repo_relationships
# source_prd_path must use 6_1, not v6_1

# Brand green token
grep "^\s*--brand:" src/styles/globals.css | head -2
pnpm memory:update --section theme_and_branding

# Active version
ls src/pages/content/
pnpm memory:update --section project_scope
```

A wrong recorded value is **Critical** — fix it immediately.

### 5c. Routing rule completeness

Read `scripts/memory/change-routing-map.ts`. Verify that every major tracked file has at least one routing rule:

```bash
grep -n "trackedFiles" scripts/memory/change-routing-map.ts | wc -l  # rule count
grep -n "id:" scripts/memory/change-routing-map.ts | wc -l            # should match
```

Check whether any recently added scripts, components, or workflows are missing routing rules. New tracked files to consider:
- Any new component in `src/components/` that changes layout/theme behavior
- Any new script in `scripts/` that changes pipeline behavior
- Any new workflow in `.github/workflows/`

---

## Step 6 — Finalize and commit

```bash
pnpm memory:update          # bump patch + set generated_at + validate
pnpm memory:check           # confirm GREEN
pnpm validate               # full validation suite
pnpm build                  # ensure build still passes
```

Commit:
```bash
git add docs/memory/repo-memory.json docs/memory/repo-memory.schema.json scripts/memory/change-routing-map.ts
git commit -m "chore(memory): <describe what changed> — v{new_version}"
```

---

## Anti-pattern: what NOT to do

- **Do NOT** duplicate memory facts into CLAUDE.md or README.md — one source of truth
- **Do NOT** add new routing rules without also adding the corresponding memory section
- **Do NOT** add sections for aspirational/planned features — only current, observable facts
- **Do NOT** delete existing `anti_patterns_to_avoid` entries — append only
- **Do NOT** add sections to `required` in the schema unless they are truly required for the system to function
- **Do NOT** run `pnpm memory:update` without actually having updated any content — version bumps should track real changes

---

## Quick version bump reference

| Trigger | Version Change | Command |
|---------|---------------|---------|
| Updated a value, added a fact | Patch | `pnpm memory:update` |
| Added a new section | Minor | Edit version manually → `pnpm memory:update --validate` |
| Changed schema shape | Minor | Edit version manually → update schema → validate |
| Breaking restructure | Major | Edit version manually → update schema → validate |
