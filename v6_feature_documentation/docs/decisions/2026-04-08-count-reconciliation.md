# Count Reconciliation: Content Files vs TOC vs Doc-Graph vs Search-Index

**Date:** 2026-04-08
**Status:** Resolved

---

## Summary

| Layer | Count | What it represents |
|-------|-------|--------------------|
| Content files on disk | 998 | All `.md` files under `src/pages/content/6_1/` (excl. `index.md`) |
| TOC reference lines | 388 | All `- Label → path` lines in `index.md` |
| TOC valid paths | 384 | Paths with correct `/content/6_1/...` format (forward slashes, leading `/`) |
| Doc-graph pages | 364 | Pages successfully parsed and indexed by `build-doc-graph.ts` |
| Search-index entries | 364 | One entry per doc-graph page (100% coverage after 5-path fix) |
| Unreferenced content files | 635 | Files on disk not referenced by any doc-graph page |

---

## How Each Number Is Derived

### 998 Content Files

All `.md` files in `src/pages/content/6_1/` excluding `index.md` itself.

```bash
find src/pages/content/6_1 -name "*.md" ! -name "index.md" | wc -l
# → 998
```

### 388 TOC Reference Lines → 384 Valid Paths

`index.md` contains 388 lines of the form `- Label → path`.

4 of those lines (the entire `## Self-Service` module, lines 441–444) used Windows-style backslashes and lacked the leading `/`:

```
# WRONG (Windows backslash, no leading slash)
- Overview → `content\6_1\self_service_6_1\about_self_service_6_1.md`

# CORRECT
- Overview → `/content/6_1/self_service_6_1/about_self_service_6_1.md`
```

These 4 paths were fixed on 2026-04-08. After the fix:
- `verify-toc-structure.ts` validates 388 paths (all 384 + 4 Self-Service, all resolving to real files)
- `grep -c "→ \`/content/6_1/"` reports 388

### 364 Doc-Graph Pages (384 → 364: –20 sectionless entries)

`build-doc-graph.ts` parses the TOC hierarchy: `## Module → ### Section → - Page`. It requires every page entry to belong to a `### Section`. Entries that appear directly under a `## Module` without any intervening `### Section` are silently dropped.

**24 TOC entries have no section heading** (previously 20 before the Self-Service path fix, now 24 because Self-Service paths are now correctly formatted but Self-Service still has no `### Section`):

| Module | Sectionless entries | Nature |
|--------|--------------------|-|
| Vulnerability Management | 6 | Entire module has no sections |
| Risk Register | 3 | Entire module has no sections |
| Reports | 6 | Entire module has no sections |
| Self-Service | 4 | Entire module has no sections |
| ITSM | 1 | "Overview" entry before first `### Section` |
| ITAM | 1 | "Overview" entry before first `### Section` |
| Discovery Scan | 1 | "Overview" entry before first `### Section` |
| Program/Project Management | 1 | "Overview" entry before first `### Section` |
| Admin | 1 | "Overview" entry before first `### Section` |

**Total sectionless: 24**. These 24 TOC entries are valid (files exist on disk), but the doc-graph cannot include them because they have no section context. The doc-graph `stats.modules = 7` reflects only modules that have at least one section with at least one page.

> **Resolution path**: Add `### Overview` (or similar) section headings to the four sectionless modules and to each module's "Overview" entry. This would bring doc-graph pages from 364 → ~388.

### 364 Search-Index Entries (was 359 before fix)

`build-search-index.ts` independently parses the same TOC and produces one entry per page found. Before 2026-04-08, 5 TOC paths pointed to the wrong filenames — those 5 were silently skipped, giving 359 entries. After fixing the 5 paths, the search-index now has 364 entries (matching doc-graph exactly, 0 skipped).

The 5 wrong paths were:

| Wrong path | Correct path |
|-----------|-------------|
| `common_topics/delete_remove_6_1.md` | `application_overview_6_1/shared_fucntions_6_1/delete_remove_6_1.md` |
| `common_topics/tasks_6_1.md` | `application_overview_6_1/shared_fucntions_6_1/tasks_6_1.md` |
| `common_topics/comments_6_1.md` | `application_overview_6_1/shared_fucntions_6_1/comments_6_1.md` |
| `common_topics/attachments_6_1.md` | `application_overview_6_1/shared_fucntions_6_1/attachments_6_1.md` |
| `view_discovered_intune_record_6_1.md` | `view_a_discovered_intune_record_6_1.md` (missing "a") |

### 635 Unreferenced Content Files

`998 (on disk) − 363 (unique TOC paths) = 635 unreferenced`.

Note: 363 is the count of unique file paths referenced in the TOC. The doc-graph has 364 pages because one file path appears in the TOC twice (referenced from two different TOC entries).

See [`2026-04-08-unreferenced-files-policy.md`](./2026-04-08-unreferenced-files-policy.md) for the full inventory and policy recommendation.

---

## Invariants Going Forward

1. `pnpm check:toc` must report **0 errors, 0 warnings**
2. `build-search-index` must report **0 skipped**
3. Doc-graph `stats.pages` + sectionless entries = total valid TOC paths
4. Any new content page added to disk must also be added to `index.md` (and must have a `### Section` ancestor to appear in the doc-graph)
