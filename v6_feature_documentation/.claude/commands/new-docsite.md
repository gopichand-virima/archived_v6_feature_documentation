# New Docsite — Architecture Reference Command

**Invoke with:** `/new-docsite`

**Triggers on:** any request about creating a new docsite, building a similar website, cloning
this repo's docsite architecture, reusing the current site's stack or workflows, extracting
go-to files for a new docs project, or seeding a new repo from this one.

---

## Step 1 — Load All Three Reference Documents

Read the authoritative architectural reference files:

```
docs/reference/current-docsite-blueprint.md
docs/reference/current-docsite-reference-pack.md
docs/reference/current-docsite-ops-evals-governance.md
```

- `current-docsite-blueprint.md` — full architecture, content model, pipeline, copy/adapt/regenerate matrix, failure modes, clone guide (21 sections)
- `current-docsite-reference-pack.md` — ranked file lists, reuse table, repo-specific assumptions to remove, required external settings (10 sections)
- `current-docsite-ops-evals-governance.md` — all validation commands, eval system, governance, deployment controls, security, failure runbooks, enterprise readiness checklist (10 sections)

Treat all three as the primary reusable knowledge base.
Use current code/config/workflows as source of truth when exact behavior must be verified.

---

## Step 2 — Cross-Check Current Source of Truth (when needed)

For implementation-level accuracy, cross-check these files directly:

| Purpose | File |
|---------|------|
| Build config + custom plugins | `vite.config.ts` |
| Scripts + pnpm version + engines | `package.json` |
| Deploy workflow | `.github/workflows/deploy-pages.yml` |
| CI workflow | `.github/workflows/ci.yml` |
| Master TOC (single source of truth) | `src/pages/content/6_1/index.md` |
| TOC sync script | `scripts/sync-toc-from-index.ts` |
| Doc graph builder | `scripts/build-doc-graph.ts` |
| Search index builder | `scripts/build-search-index.ts` |
| Graph runtime client | `src/utils/docGraph.ts` |
| AI memory / contracts | `docs/memory/repo-memory.json` |
| Operating rules | `CLAUDE.md` |
| Session hooks | `.claude/settings.json` |

---

## Step 3 — Answer with Blueprint as Primary Reference

Structure the answer to clearly distinguish:

- **Source-of-truth files** — authoritative; never the derived copies
- **Generated files** — derived artifacts; regenerate, do not copy
- **Copied parts** — safe to reuse verbatim in a new repo
- **Adapted parts** — rename, reconfigure, or rewire for the new context
- **Regenerated parts** — run the pipeline; do not hand-copy content

---

## Key behaviors to never simplify away

- Master TOC driven navigation (`index.md` → `sync-toc` → `navigationData.ts` + `indexContentMap.ts`)
- Graph-based doc structure (`build-doc-graph.ts` → `public/doc-graph.json` → `docGraph.ts`)
- Full-coverage search index (`build-search-index.ts` → `public/search-index.json` — all TOC pages)
- GitHub Pages deployment assumptions (relative base path `'./'`, artifact upload)
- Branch+PR governance (all gates; no direct-to-main even on GREEN)
- Eval/quality gate system (`pnpm eval` — GREEN/AMBER/RED, tolerated warnings, exemptions)
- Validation/drift/memory contracts (`pnpm validate`, `pnpm memory:check`)
- TypeScript-only source policy (strict mode throughout)
- pnpm-only enforcement (hooks block npm/yarn)
- Content is manually curated — no auto-generation pipeline

---

## Prompt sources

For regenerating all three reference docs from scratch:
- `docs/prompts/reverse-engineer-current-docsite.md`

For building a new site from the blueprint:
- `docs/prompts/build-new-docsite-from-blueprint.md`
