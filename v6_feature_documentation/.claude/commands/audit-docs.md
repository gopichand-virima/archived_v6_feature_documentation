# /audit-docs

Audit documentation coverage, TOC alignment, and structural integrity.

## Purpose

Verify that the documentation site is internally consistent — every TOC entry has a backing file,
every content file is reachable from the TOC, and the build artifacts are up to date.

This command does **not** compare against external PRD sources. It audits the site's own structure.

---

## Audit Levels

### Level 1: TOC structure (fast, ~5s)

```bash
pnpm check:toc
```

Checks:
- Master TOC exists at `src/pages/content/6_1/index.md`
- Every `→ /content/6_1/...` path in the TOC resolves to a `.md` file on disk
- No `.mdx` files remain (migration complete)
- `dist/doc-graph.json` exists with ≥ 300 pages
- `public/search-index.json` has ≥ 300 entries
- `src/data/navigationData.ts` has ≥ 5 modules and no bogus Discovery Scan entries

### Level 2: Path contract (fast, ~3s)

```bash
pnpm check:paths
```

Checks:
- No legacy `v6_1` path references (must be `6_1`)
- No `src/content/` imports (must be `src/pages/content/`)
- Build output is `dist/` not `build/`
- No npm/yarn lockfiles
- `dist/doc-graph.json` and `public/search-index.json` exist

### Level 3: Documentation quality (moderate, ~30s)

```bash
pnpm eval
```

Checks:
- Every feature page covers: Overview, Add, Edit, Delete sections
- No broken internal links
- Structural conformance

### Level 4: Full build validation (slow, ~2-5m)

```bash
pnpm build
```

Runs the full prebuild + Vite build. Verifies all artifacts are regenerated correctly.

---

## Quick full audit

```bash
pnpm check:toc && pnpm check:paths && pnpm eval
```

---

## Interpreting results

| Severity | Meaning | Action |
|----------|---------|--------|
| ✅ OK | Check passed | None |
| ⚠️  WARN | Issue found but not blocking | Investigate before next deploy |
| ❌ ERROR | Structural violation | Must fix before deploy |

Exit code 0 = all checks passed (warnings OK).
Exit code 1 = one or more ERROR findings.

---

## Common findings and fixes

| Finding | Fix |
|---------|-----|
| `toc-file-missing` | Create the missing `.md` file or remove the TOC entry |
| `mdx-file-found` | Run rename: `git mv foo.mdx foo.md` |
| `doc-graph-missing` | Run `pnpm build-doc-graph` |
| `search-index-low-entries` | Run `pnpm build-search-index` |
| `nav-data-bogus-modules` | Delete per-module `index.md` stubs, run `pnpm sync-toc` |
| `legacy-v6_1-path` | Replace `/v6_1/` with `/6_1/` in the flagged file |
