# Build New Docsite from Blueprint

**Purpose:** Use this prompt when starting work on a new documentation site that reuses this
repo's architecture, stack, or generation pipeline. Hand this to Claude alongside the blueprint
files to get accurate, enterprise-grade implementation guidance.

---

## Prompt

Before answering, read:

- `docs/reference/current-docsite-blueprint.md`
- `docs/reference/current-docsite-reference-pack.md`
- `docs/reference/current-docsite-ops-evals-governance.md`

Use them as the authoritative reference for designing a new documentation site with the same
architecture, generation behavior, governance model, eval posture, and deployment behavior as
the current V6 Feature Docs repo.

Preserve these behaviors unless explicitly told otherwise:
- Vite-based static docs site
- Markdown-driven content (GFM .md — not .mdx for generated docs)
- Manifest/index-driven generation
- Generated module index pages (pipeline-maintained, not hand-edited)
- Deterministic navigation/index-map generation via sync-toc
- Post-change module index rebuilding (rebuild-module-index.ts final pass)
- GitHub Pages-compatible deployment (relative base path `'./'`)
- Branch+PR governance (all gates create branch+PR; humans merge)
- Machine-readable repo memory/contracts (repo-memory.json)
- Validation/drift-aware maintenance flow (GREEN/AMBER/RED gates)
- Eval-aware acceptance flow (pnpm eval before merge)
- Separation of source-of-truth vs generated files

In your answer:
1. Identify which current files should be **copied** (verbatim reuse)
2. Identify which should be **adapted** (rename, reconfigure, rewire)
3. Identify which should be **regenerated** (run the pipeline; do not copy generated artifacts)
4. Identify which repo-specific assumptions must be renamed or removed
5. Identify which GitHub/repo settings must be configured outside the codebase
6. Preserve functional behavior — not just visual similarity
7. Call out anything from the V6 Feature Docs nervous system that must be retained for
   enterprise-grade operation

Do not simplify away:
- The generation pipeline stages (Stage 0–3 + final module index rebuild pass)
- The module index.md ownership contract (pipeline-maintained, format strictly enforced)
- The navigation/index map generation contracts (navigationData.ts + indexContentMap.ts are derived)
- The manifest schema (.generation-manifest.{slug}.json)
- The rebuild-module-index.ts final-pass fix (prevents stale index after deletions)
- The validation gate logic (GREEN/AMBER/RED with configurable deletion threshold)
- The GitHub Pages deployment model (artifact upload, not branch-based source)
- The eval/quality gate system (pnpm eval + GREEN/AMBER/RED interpretation)
- The memory/drift enforcement contracts (pnpm memory:check in CI)
- The branch+PR governance (no direct-to-main, even on GREEN)
