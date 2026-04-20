# /validate-docs

Run the full validation suite on the documentation site.

## What is validated

| Check | Command | What it catches |
|-------|---------|-----------------|
| TypeScript | `pnpm typecheck` | Type errors in src/ and scripts/ |
| Security scan | `pnpm check:security` | Hardcoded secrets (API keys, tokens) |
| Repo structure | `pnpm check:setup` | Missing required files/directories |
| Path contract | `pnpm check:paths` | Legacy path references, wrong build dir |
| TOC structure | `pnpm check:toc` | Missing .md files, broken nav data, .mdx remnants |
| Doc quality | `pnpm eval` | Coverage gaps, missing sections, structure |
| Build | `pnpm build` | Vite build + prebuild (doc-graph, search-index, sitemap) |

## Quick validation (no build)

```bash
pnpm validate
```

Runs: `typecheck + check:security + check:setup + check:paths`

## TOC structure check

```bash
pnpm check:toc
```

Verifies:
- Master TOC exists at `src/pages/content/6_1/index.md`
- Every TOC path resolves to an existing `.md` file
- No `.mdx` files remain under `src/pages/content/6_1/`
- `dist/doc-graph.json` has ≥ 300 pages
- `public/search-index.json` has ≥ 300 entries
- `src/data/navigationData.ts` has ≥ 5 correct modules

## Full build validation

```bash
pnpm build
```

The prebuild sequence runs automatically:
1. `pnpm sync-toc` — regenerate navigationData.ts + indexContentMap.ts
2. `pnpm build-doc-graph` — build dist/doc-graph.json
3. `pnpm build-search-index` — build public/search-index.json
4. `pnpm build-sitemap` — build public/sitemap.xml
5. `vite build` — production bundle

## Success Criteria

All commands exit code 0. No RED eval findings. No TypeScript errors.
