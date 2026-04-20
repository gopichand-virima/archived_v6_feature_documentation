---
name: sync-repo-memory
description: Detect memory drift and update docs/memory/repo-memory.json (and supporting artifacts) to reflect the latest project state
---

# /sync-repo-memory — Memory Sync Skill

Use this skill whenever:
- A work session changed architecture, theme, layout, pipeline, or navigation contracts
- You are about to start a session and want to confirm memory is current
- `pnpm memory:check` reported AMBER or RED
- The Stop hook reminder fired at end of session

---

## Step 1 — Run the drift detector

```bash
pnpm memory:check
```

Read the output carefully:

| Status | Meaning | Action |
|--------|---------|--------|
| 🟢 GREEN | No drift — memory is current | Nothing to do. Skip to Step 6. |
| 🟡 AMBER | File changes detected — memory may be stale | Proceed to Step 2 |
| 🔴 RED | Value mismatch or critical contract changed | Proceed to Step 2 immediately |

---

## Step 2 — Inspect each flagged category

For every **category** listed in the drift report:

1. Read the actual source file(s) that changed (listed under "Changed files")
2. Read the current value of the affected memory section:
   ```bash
   pnpm memory:update --section <section_key>
   ```
   Example: `pnpm memory:update --section theme_and_branding`
3. Compare: does the memory accurately describe the current implementation?

---

## Step 3 — Determine what to update

Use the routing model to decide which artifact(s) need updating:

| What changed | Update this |
|---|---|
| Layout, routing, page shell | `repo-memory.json` § `layout_contracts`, `website_functional_specs` |
| Theme, dark mode, CSS tokens | `repo-memory.json` § `theme_and_branding`, `dark_mode_contrast` |
| Navigation sidebar | `repo-memory.json` § `navigation_contract` |
| TOC / right rail | `repo-memory.json` § `toc_contract` |
| Homepage / cards | `repo-memory.json` § `homepage_cards` |
| Search behavior | `repo-memory.json` § `search_capabilities` |
| Version dropdown | `repo-memory.json` § `versioning_and_dropdown_behavior` |
| Breadcrumbs / URLs | `repo-memory.json` § `url_management`, `website_functional_specs` |
| Content rendering (MDX) | `repo-memory.json` § `content_rendering_rules` |
| Generation pipeline stages | `repo-memory.json` § `generation_pipeline` + `.claude/commands/repo-maintainer.md` |
| CI/CD workflow changes | `repo-memory.json` § `ci_cd_contracts` + `repo-maintainer.md` if trigger changed |
| Build config / base path | `repo-memory.json` § `repo_contracts`, `tooling_and_build` + `docs/memory/README.md` |
| Validation gate commands | `repo-memory.json` § `validation_gates` |
| New anti-pattern discovered | `repo-memory.json` § `anti_patterns_to_avoid` — append to array |
| Schema shape change | `docs/memory/repo-memory.schema.json` |
| Hook behavior change | `.claude/settings.local.json` + `docs/memory/README.md` |
| Human guidance change | `docs/memory/README.md` only |
| Trivial refactor | **NO UPDATE NEEDED** |

---

## Step 4 — Update the right artifact(s)

### Updating repo-memory.json

Edit the JSON directly — add, modify, or extend the relevant section(s).

**Rules:**
- Keep `repo-memory.json` as the **only** machine-readable source of truth
- Do NOT duplicate facts into README.md or CLAUDE.md
- Append to `anti_patterns_to_avoid` array — do not delete existing entries
- Update `enterprise_capabilities` if a new capability was added
- If a layout bug was discovered and fixed, record it in `leftnav_rightnav_toc.layout_bug_history`

### Updating repo-maintainer.md

Edit `.claude/commands/repo-maintainer.md` if:
- A new "always do" or "never do" operating rule was established
- Pipeline step order changed
- A new required validation step was added

### Updating docs/memory/README.md

Update the human operator guide if:
- The update process itself changed
- A new script or command was added
- A new section was added to repo-memory.json

---

## Step 5 — Bump version and date

After all edits are complete:

```bash
pnpm memory:update
```

This:
- Patch-bumps `memory_version` (e.g. `1.1.0` → `1.1.1`)
- Sets `generated_at` to today's date
- Validates JSON structure

**Version bump guidance:**
- Patch (`x.x.+1`): Adding facts, updating values — use `pnpm memory:update`
- Minor (`x.+1.0`): Restructuring sections or adding new top-level keys — bump manually
- Major (`+1.0.0`): Breaking schema changes or complete restructure — bump manually + update schema

---

## Step 6 — Validate and commit

```bash
pnpm validate
pnpm build
```

Both must pass. Then commit:

```bash
git add docs/memory/repo-memory.json  # and any other updated artifacts
git commit -m "chore(memory): sync repo-memory — <brief description of what changed>"
```

---

## Quick Reference: What NOT to update

Do not update memory for:
- Trivial refactors (rename variable, fix typo in a comment)
- Changes to `src/pages/content/` (generated docs — tracked by manifests)
- Changes to `src/data/navigationData.ts` or `src/utils/indexContentMap.ts` (auto-generated)
- Image asset additions/changes (not a contract change)
- Lockfile (`pnpm-lock.yaml`) changes
- Test updates in `scripts/__tests__/`

---

## Troubleshooting

**`pnpm memory:check` shows AMBER but nothing meaningful changed**
→ Run `pnpm memory:update --section <key>` to see the current recorded value
→ If it still accurately describes reality, just run `pnpm memory:update` to bump the date

**`pnpm memory:check` shows RED for a value mismatch**
→ The memory records a value that's wrong (e.g. wrong pnpm version)
→ Edit repo-memory.json to correct the value, then `pnpm memory:update`

**After editing repo-memory.json, JSON is invalid**
→ Run `pnpm memory:update --validate` to see the error
→ Fix the JSON syntax, then run again

**Not sure which section to update**
→ Run `pnpm memory:check` and read the "ROUTING" section — it tells you exactly which sections to update
