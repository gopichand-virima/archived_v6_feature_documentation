# Graph-Driven Deep Audit Report

**Date:** 2026-04-08
**Audit type:** Graph-first, token-efficiency-focused hardening pass
**Operator:** Senior Principal Engineer audit protocol

---

## 1. Baseline Validation (All Systems GO)

All existing checks pass:

| Check | Result | Detail |
|-------|--------|--------|
| `check:toc` (7 checks) | ✅ 6 OK, 1 WARN, 0 ERR | Warn is a known dormant issue (see §3) |
| `check:paths` (8 checks) | ✅ 11 OK, 0 WARN, 0 ERR | Path contract fully enforced |
| `check:setup` (38 checks) | ✅ 38 OK, 0 WARN, 0 ERR | Repository structure intact |
| `check:security` | ✅ PASS | No hardcoded secrets |
| `typecheck` | ✅ PASS | No TypeScript errors |

---

## 2. Graph Integrity Analysis (L0 → L1 → L2)

### L0: Metadata
```json
{ "version": "6.1", "modules": 7, "sections": 44, "pages": 364, "edges": 1004 }
```
**stats.pages == nodes.length: PASS** (both 364, no phantom stats)

### L1: Edge Distribution

| Edge kind | Count | Expected |
|-----------|-------|----------|
| `CONTAINS` | 364 | 364 (one per page) |
| `NEXT` | 320 | ≤ 364 (no edge for last in section) |
| `PREV` | 320 | matches NEXT |
| `LINKS_TO` | 0 | TBD (see Finding G-3) |
| `PARENT_OF` | 0 | Not built (by design in current impl) |

### L2: Node Analysis

**Pages per module:**
| Module | Pages |
|--------|-------|
| Discovery Scan | 148 |
| Admin | 94 |
| My Dashboard | 44 |
| CMDB | 41 |
| ITSM | 17 |
| ITAM | 16 |
| Program/Project Mgmt | 4 |
| **Total** | **364** |

---

## 3. Findings

### G-1 — Duplicate Node IDs [WARN — Dormant]

**Severity:** Medium (dormant until `docGraph.ts` is integrated into components)
**Count:** 38 unique IDs have 2+ pages each (e.g., `overview`, `dashboard`, `attachments`, `comments`, `delete`)

**Root cause:** `build-doc-graph.ts` assigns node IDs via `slugify(entry.label)`. Pages with the same label in different modules get the same ID.

**Blast radius:** `docGraph.ts` builds `nodeById = new Map(nodes.map(n => [n.id, n]))`. With duplicate IDs, only the last node for each ID is stored. `getNextNode(nodeId)` would return edges from a mixed set (NEXT edges from all sections with that label). Breadcrumb lookups via `getNodeById` would return the wrong module's page.

**Current exposure:** ZERO — `docGraph.ts` has zero consumers in the app. The graph is built but not yet used for runtime navigation.

**Fix when integrating docGraph.ts:**
```typescript
// build-doc-graph.ts line 336 — change from:
const nodeId = slugify(entry.label) || `page-${totalPages}`;
// to:
const nodeId = slugify(entry.filePath.replace(/^\/content\/6_1\//, '').replace(/\//g, '-').replace(/\.md$/, ''));
```
This produces path-derived unique IDs (e.g., `getting-started-6-1-authentication-6-1`).

**Guard added:** `check:toc` Check 7 warns if duplicate IDs exist in `doc-graph.json`.

---

### G-2 — Orphan CONTAINS Edge Sources [BENIGN]

**Severity:** Low (no functional impact)
**Count:** 306 of 364 CONTAINS edges have module IDs (`my-dashboard`, `discovery-scan`, etc.) as source — these are NOT node IDs in the graph.

**Root cause:** `build-doc-graph.ts` line 424: `edges.push({ source: node.module, target: node.id, kind: 'CONTAINS' })`. Module slugs are used as sources but never stored as nodes.

**Blast radius:** `edgesBySource.get('my-dashboard')` returns CONTAINS edges, but `nodeById.get('my-dashboard')` returns undefined. The `getRelatedNodes` function iterates all edges and skips null `nodeById` lookups (handled safely). No crash, minimal waste.

**Decision:** ACCEPT. Fixing requires adding module/section nodes to the graph, which is a design change outside current scope. Document for future work.

---

### G-3 — Zero LINKS_TO Edges [FEATURE GAP]

**Severity:** Low (aspirational feature, no current consumer)
**Count:** 0 `LINKS_TO` edges in the graph despite the type being declared.

**Root cause:** `build-doc-graph.ts` extracts `internalLinks` from each page but most `.md` files don't contain internal cross-links (they use external resource paths). The `filePathToNodeId` Map lookup at line 439 uses full `/content/6_1/...` paths but inline links in content are relative — path normalization is missing.

**Decision:** ACCEPT for now. Zero `LINKS_TO` edges means `getRelatedNodes` always returns `[]` — correct behavior (no wrong data). Fix when cross-page linking is needed.

---

### G-4 — Duplicate File Paths in Graph [KNOWN, INTENTIONAL]

**Count:** 14 files referenced from multiple TOC entries (e.g., shared CMDB pages in ITSM and ITAM modules)

**Impact:** `nodeByFilePath` Map holds only the last node for duplicate paths. `getNodeByFilePath` for a shared page returns one module's context, not the caller's context.

**Decision:** ACCEPT. This is intentional content reuse. When fixed in G-1 (path-based IDs), each cross-referenced instance will get a unique node ID (containing the module context), resolving this.

---

### I-1 — 44 Broken Image References in Doc-Graph [KNOWN]

**Severity:** Low (doesn't affect navigation or search; affects visual rendering)
**Count:** 44 total broken image refs across 14 pages (only 14 of 364 pages have any images)

| Category | Count | Root cause |
|----------|-------|-----------|
| Old-style `Resources/Images/...` paths | 27 | Legacy Confluence-era paths never converted |
| Missing files (correct path format) | 17 | Naming mismatches (e.g., `sso_and_authentication` vs `sso_authentication`, `user_authentication_9.png` when only 1-8 exist) |

**Decision:** ACCEPT for now. These are content-level issues, not architecture issues. Track in image hygiene backlog.

---

### I-2 — 96% of Pages Have No Images [COVERAGE GAP]

**Count:** 350 of 364 pages have zero image references in the doc-graph.

**Decision:** ACCEPT. Image coverage is a content backlog item, not a structural integrity issue.

---

### C-1 — Stale Slash Commands Reference Dead PRD Pipeline [CONFIG]

**Severity:** Medium (could confuse future agents or contributors)
**Affected commands:** `pipeline-auditor.md`, `repo-auditor.md`, `repo-hygiene.md`, `repo-maintainer.md`, `new-docsite.md`, `memory-maintainer.md`, `run-evals.md`

**Decision:** Update commands to remove pipeline references. The PRD pipeline is intentionally retired. See §5 Hardening Plan.

---

### C-2 — settings.json Hook Had Stale CLAUDE.md Section Reference [FIXED]

**Original:** "See CLAUDE.md » PRD-to-Feature-Doc Rules for the path contract."
**Section does not exist** in current CLAUDE.md.
**Fixed:** Updated to "See CLAUDE.md » Naming Conventions for the path contract."

---

## 4. Token Optimization Report

### What IS token-efficient (proven)

| Layer | Mechanism | Token cost |
|-------|-----------|-----------|
| Search index load | Lazy (first search only), cached for session | 0 at boot |
| Content fetch | Single HTTP fetch per page navigation, no pre-fetch | 0 at boot |
| Navigation data | Static TypeScript import (compiled into bundle) | 0 at runtime (pre-compiled) |
| `contentLoader.ts` | Direct fetch, no filesystem scan, single strategy primary | O(1) per page |
| doc-graph.json | Built at compile time, never re-parsed per request | 0 at runtime* |

*`doc-graph.json` is currently NOT loaded by any browser component.

### Where tokens are wasted

| Issue | Token waste | Fix path |
|-------|-------------|---------|
| `navigationData.ts` compiled into 1.88MB bundle (TD-002) | ~150KB extra in main bundle | Fix static/dynamic import mixing (TD-001) |
| `docGraph.ts` not integrated | doc-graph.json is built but never read → waste of CI time only (not runtime tokens) | Integrate when sidebar/nav refactor happens |
| No inverted LINKS_TO edge index | `getRelatedNodes` iterates all 1004 edges O(n) | Add target→nodes Map when LINKS_TO edges exist |

### Progressive disclosure: NOT YET ENFORCED at runtime

The L0/L1/L2 pattern described in the architecture docs is implemented in `docGraph.ts` but:
- L0 (`doc-graph.json`) is NOT loaded by any component
- L1 (section page lists from graph) is NOT used — app uses `navigationData.ts` instead
- L2 (content fetch) IS implemented (single fetch per page)

The browser currently loads ALL navigation data (`navigationData.ts`) at startup in the 1.88MB bundle, which is the opposite of the intended L0 metadata load. The graph architecture is a ready-made solution to this problem but requires component integration.

---

## 5. Hardening Plan (Minimal, Implemented)

### Implemented in this pass

| Guard | Location | Threshold | Impact |
|-------|----------|-----------|--------|
| Doc-graph page count floor raised | `verify-toc-structure.ts` check 4 | `>= 360` (was 300) | Catches 60-page silent drops |
| Search-index entry count floor raised | `verify-toc-structure.ts` check 5 | `>= 360` (was 300) | Catches 60-entry silent drops |
| Duplicate node ID check (new) | `verify-toc-structure.ts` check 7 | WARN if any duplicates | Guards docGraph.ts integration |
| Hook stale reference fixed | `.claude/settings.json` | N/A | Removes misleading guidance |

### Not implemented (out of scope for this pass)

| Guard | Reason |
|-------|--------|
| Path-based node IDs in build-doc-graph.ts | G-1 fix — wait until docGraph.ts integration is planned |
| Inverted LINKS_TO edge index in docGraph.ts | G-3 fix — wait until content cross-links are added |
| Image broken-ref CI check | Nice-to-have; images don't affect navigation correctness |
| Slash command cleanup | Addressed separately per user's confirmation |

---

## 6. Correctness Proof

The following are **proven correct** via graph-based validation (not assumptions):

| Claim | Proof |
|-------|-------|
| All 388 TOC paths resolve to real files | `check:toc` Check 2: 388/388 resolved |
| Graph page count matches stats | `stats.pages (364) == nodes.length (364)` |
| Search index covers all graph pages | `search-index.json: 364 entries, 0 skipped` |
| No .mdx files remain | `check:toc` Check 3: zero .mdx files |
| No legacy pipeline scripts | Background agent: generation scripts absent |
| No alternate TOC sources in runtime | Only `navigationData.ts` (from master TOC) is used |
| No filesystem scanning at runtime | `contentLoader.ts` has zero `readdir/existsSync` calls |
| `contentLoader.ts` is single-strategy | One primary path (fetch), one legacy fallback (registry) |
| `check:toc` thresholds hardened | 300 → 360 for pages and search entries |
| Duplicate node IDs are guarded | Check 7 warns when `doc-graph.json` has ID collisions |

---

## 7. System Assessment

```
Architecture:  CORRECT and deterministic
Source-of-truth enforcement:  PROVEN (master TOC only)
Graph integrity:  VALID (364 nodes, 1004 edges, stats consistent)
Search coverage:  100% (364/364, 0 skipped)
Token efficiency:  PARTIAL (L2 correct; L0/L1 not yet integrated)
Regression guards:  HARDENED (thresholds tightened, new duplicate ID check)
Legacy pipeline:  ABSENT (confirmed removed)
```

**Status: PRODUCTION READY** with two known forward-looking items (G-1 duplicate IDs dormant, L0/L1 not yet integrated).
