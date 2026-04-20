# /pipeline-auditor — RETIRED

> **This command is retired.** The PRD-to-feature-documentation generation pipeline was removed in April 2026.
>
> Content is now **manually curated**. Use `/audit-docs` for structure/TOC/graph-based audits.

## What replaced this

| Old task | New approach |
|----------|-------------|
| Audit PRD → doc generation | N/A — pipeline retired |
| Check manifest integrity | N/A — no manifests |
| Validate doc coverage | `/audit-docs` — checks TOC alignment |
| Check navTitle labels | `/audit-docs` — checks navigation structure |
| Find orphan generated docs | `/audit-docs` — check 2 validates TOC paths |

## Current content pipeline

```
src/pages/content/6_1/index.md  (hand-edited master TOC)
    ↓  pnpm sync-toc
src/data/navigationData.ts + src/utils/indexContentMap.ts
    ↓  pnpm build-doc-graph
public/doc-graph.json
    ↓  pnpm build-search-index
public/search-index.json
    ↓  pnpm build
dist/  →  GitHub Pages
```

Use `/validate-docs` to validate the current pipeline.
