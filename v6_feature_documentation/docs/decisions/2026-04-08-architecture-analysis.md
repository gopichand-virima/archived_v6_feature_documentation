# Architecture Analysis — Multi-Version Design, Graph Evaluation, Token Optimization

**Date:** 2026-04-08
**Scope:** Multi-version architecture design, graph evaluation, token efficiency audit, implementation plan
**Quality bar:** Senior Principal Engineer / Enterprise-grade simplicity
**Hard constraint:** PRD-based auto-generation is disabled and permanently out of scope

---

## Immutable Constraints

These rules apply to every decision in this document:

| Constraint | Rule |
|---|---|
| PRD generation | DISABLED — permanently out of scope. Never reintroduce. |
| Simplicity | Simplicity > cleverness |
| Determinism | Determinism > flexibility |
| Token usage | If it increases tokens → reject |
| Complexity | If it adds complexity without value → reject |
| Working systems | If it is already correct → do not touch |

---

## 1. Current State Assessment

### Architecture layers (actual, not intended)

```
Master TOC (index.md)
    ↓  pnpm sync-toc
navigationData.ts          ← Compiled into 1.88MB main bundle (WRONG PATH)
    ↓  browser loads
DocumentationLayout.tsx    ← Uses static navigationData import

Master TOC (index.md)
    ↓  pnpm build-doc-graph
public/doc-graph.json      ← Built correctly, ~60KB
    ↓  docGraph.ts          ← L0/L1/L2 API implemented correctly
    ↓  zero consumers       ← NEVER LOADED BY ANY COMPONENT (gap)
```

### What is correct and must not be changed

| System | Status | Note |
|--------|--------|------|
| Master TOC (`index.md`) | ✅ CORRECT | Single source of truth — do not restructure |
| `build-doc-graph.ts` | ✅ CORRECT | Deterministic, incremental-capable, 364 nodes/1004 edges |
| `docGraph.ts` runtime client | ✅ CORRECT | Well-implemented L0/L1/L2 API, O(1) Maps, dedup-safe load |
| `build-search-index.ts` | ✅ CORRECT | 364-entry coverage, lazy-loaded |
| `contentLoader.ts` fetch strategy | ✅ CORRECT | Single-file fetch, session cache, no filesystem scan |
| `pnpm prebuild` sequence | ✅ CORRECT | `sync-toc → build-doc-graph → build-search-index → build-sitemap` |

### What is wrong (the gaps)

| Gap | Root Cause | Impact |
|-----|-----------|--------|
| `docGraph.ts` has zero consumers | `DocumentationLayout.tsx` imports `navigationData.ts` statically | Graph is built but never read; all nav data compiled into bundle |
| 1.88MB main chunk | `navigationData.ts` + mixed static/dynamic `contentLoader.ts` import | Slow load, no code-splitting |
| TD-001: static+dynamic import mixing | `contentLoader.ts` imported statically in App.tsx and dynamically in DocumentationContent.tsx | Vite cannot split the chunk |
| 38 duplicate graph node IDs | `slugify(label)` used for IDs instead of file path | Dormant until graph is wired in; will cause navigation bugs |

---

## 2. Graph Evaluation Report

### Graph correctness

**Node schema** — all required fields present and well-typed:
- `id`, `filePath`, `title`, `module`/`moduleLabel`, `section`/`sectionLabel`
- `breadcrumbs[]` — deterministic from TOC, not fragile frontmatter
- `headings[]` — H2/H3 for search and anchors
- `contentHash` — SHA-256 for incremental rebuilds
- `orderIndex` — enables NEXT/PREV edges without filesystem scanning

**Edge types** — all declared, partially populated:

| Edge kind | Count | State |
|-----------|-------|-------|
| CONTAINS | 364 | Built; sources are module slugs, not graph node IDs (benign) |
| NEXT | 320 | Built and correct |
| PREV | 320 | Built and correct |
| LINKS_TO | 0 | Zero — content has no internal cross-links yet |
| PARENT_OF | 0 | Not implemented (design scope, not a bug) |

**Runtime client** — all 6 Map indexes built at load time for O(1) lookup:
- `nodeById` — by slug ID
- `nodeByFilePath` — by content path
- `nodesByModule` — module → node list
- `nodesBySection` — `module::section` → node list
- `edgesBySource` — source node → outgoing edges

Load deduplication: concurrent `loadDocGraph()` calls share one Promise — correct.

### Graph usefulness assessment

**What the graph can do right now:**

1. Replace `navigationData.ts` entirely — `getModuleList()`, `getModuleSections()`, `getSectionNodes()` cover the sidebar fully
2. Derive breadcrumbs deterministically — `getBreadcrumbs(nodeId)` vs fragile frontmatter
3. Provide NEXT/PREV navigation — `getNextNode()`/`getPrevNode()` — no component uses this yet
4. Title and heading search — `searchNodes()` as a fast pre-filter before full-text search-index

**What the graph cannot do today (known limitations):**

1. LINKS_TO edges are zero — `getRelatedNodes()` always returns `[]` — no cross-links in content yet
2. Duplicate node IDs (38 collisions) — `nodeById` Map holds last-inserted — will return wrong nodes. **Must fix before wiring into components.**
3. Sectionless entries (24) not in graph — those pages exist on disk but are not reachable via graph navigation

### Confidence scores

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Correctness** | **82/100** | Structure is sound; 38 duplicate IDs are a known dormant bug; 24 sectionless entries missing |
| **Usefulness** | **35/100** | Potential is HIGH; actual use is ZERO — graph is never fetched by any component |
| **Token efficiency** | **40/100** | The correct path (graph → lazy → L2) is fully implemented; the wrong path (static bundle) is what runs |
| **Maintainability** | **75/100** | Deterministic rebuild from master TOC is excellent; two parallel navigation systems (graph + navigationData.ts) create drift risk |

**Overall score: 58/100** — The graph is a correctly-built, unused asset. It becomes high-value the moment it replaces `navigationData.ts`.

---

## 3. TOC vs Graph Responsibility Separation

This boundary must be explicit and enforced:

| Responsibility | Owner | Rule |
|----------------|-------|------|
| Hierarchy definition | **Master TOC** (`index.md`) | Only place to add/remove/reorder pages and sections |
| Ordering (sidebar order) | **Master TOC** → `orderIndex` in graph | Never hardcode order in components |
| Navigation sidebar structure | **Graph** (L1) | `getModuleList()` + `getSectionNodes()` — not `navigationData.ts` |
| Breadcrumbs | **Graph** | `getBreadcrumbs(nodeId)` — never frontmatter |
| NEXT/PREV buttons | **Graph** | `getNextNode()` / `getPrevNode()` |
| Page content body | **Fetch** (L2) | `contentLoader.ts` — single fetch per page, cached |
| Full-text search | **search-index.json** | Lazy-loaded on first search — not the graph |
| Routing / URL resolution | **Graph** | `getNodeByFilePath()` maps URL path → node |

**What graph must NOT do:**
- Store page body content (keeps it under 120KB for all versions)
- Replicate the master TOC hierarchy redundantly
- Drive URL routing (React Router owns URLs; graph resolves page metadata from URLs)
- Replace search-index.json (graph search is for quick title/heading lookup; FTS is search-index.json's job)

**What graph is NOT responsible for:**
- Authentication (no auth in this system)
- Content validation (that's `pnpm check:toc`)
- Version management UI (version switcher is a component concern)

---

## 4. Token Optimization Analysis

### Current token waste (quantified)

| Source | Waste | Size |
|--------|-------|------|
| `navigationData.ts` compiled into main bundle | ~150KB in JS bundle | Full sidebar data for 364 pages loaded at boot |
| Mixed static/dynamic import of `contentLoader.ts` | ~500KB+ extra (prevents code-splitting) | Vite cannot split the chunk |
| `doc-graph.json` built but never loaded | CI time only — no runtime waste | But zero benefit for 60KB of CI artifact |
| Search index loaded at boot | Not loaded at boot (already lazy) ✓ | 0 extra tokens at boot |
| Page content fetched | Per-page only ✓ | Correct — L2 only on navigate |

**Total avoidable bundle waste: ~650KB in main chunk.**

### Token-efficient target state

```
Boot sequence (target):
  1. Load app shell (React router, theme, layout) — ~200KB
  2. Fetch doc-graph.json once — ~60KB
  3. Derive sidebar from graph nodes — 0 additional tokens
  4. User navigates to page → fetch single .md file — ~5-50KB
  5. User searches → fetch search-index.json — ~200KB (once, then cached)

Current state:
  1. Load 1.88MB bundle (ALL navigation data, content loader, everything)
  2. Never fetch doc-graph.json
  3. Render sidebar from compiled-in navigationData.ts
```

**Savings if gap is closed: ~650KB eliminated from main bundle. doc-graph.json adds ~60KB on first navigation — net savings ~590KB.**

### L0 / L1 / L2 contract (enforce this)

| Level | What loads | When | Token cost | Current state |
|-------|-----------|------|-----------|---------------|
| L0 | Graph stats (modules/sections/pages count, version) | App boot | ~100 tokens | NOT ENFORCED (static nav loaded instead) |
| L1 | Page titles + paths for one module/section | Sidebar expand | ~200-500 tokens | NOT ENFORCED |
| L2 | Full markdown body for one page | Page click | ~1-5K tokens | ✅ CORRECT |

---

## 5. Multi-Version Architecture Design

### Guiding constraints

- No content duplication across versions
- Adding a new version must be low effort and low token impact
- No shared-content inheritance systems (overkill; increases complexity)
- Versions are independent content trees with independent TOC files
- The graph supports versions natively (`version` field in `doc-graph.json`)

### Current version support in code

`contentLoader.ts` has version management built in:
```typescript
let currentVersion = '6_1';
const validVersions = ['6_1'];

export function setVersion(version: string): void {
  if (!validVersions.includes(version)) { ... return; }
  ...
}
```

`navigationData.ts` has:
```typescript
export const versions = ["6.1"];
```

`build-doc-graph.ts` has hardcoded constants:
```typescript
const VERSION      = '6.1';
const VERSION_PATH = '6_1';
```

### Multi-version target design

**Approach: Version-isolated content trees + single multi-version graph file**

```
File system:
  src/pages/content/
    6_1/index.md          ← 6.1 master TOC (existing)
    6_1_1/index.md        ← 6.1.1 master TOC (future)
    7_0/index.md          ← 7.0 master TOC (future)

Build:
  pnpm build-doc-graph     → public/doc-graph.json
  (covers all active versions, nodes tagged with `version` field)

Runtime:
  Load doc-graph.json once
  Filter nodes: version === currentVersion
  Sidebar renders from filtered node set
```

**Why version-isolated trees (not shared):**
- Simple: no inheritance logic, no "delta from base version" complexity
- Deterministic: any page can be verified by path alone
- Content editable independently: 6.1.1 pages can differ from 6.1 without framework
- Low token cost: graph file grows ~60KB per version (~60KB × 4 versions = ~240KB total)

### Adding a new version (step-by-step)

This is the complete process. It must be low effort:

```bash
# 1. Create the content tree
mkdir -p src/pages/content/6_1_1/

# 2. Create the master TOC for the new version
# (Start by copying 6_1/index.md and adjusting paths)
cp src/pages/content/6_1/index.md src/pages/content/6_1_1/index.md
# Edit: update version-specific paths

# 3. Update contentLoader.ts — add version to validVersions
# Change: const validVersions = ['6_1'];
# To:     const validVersions = ['6_1', '6_1_1'];

# 4. Update build-doc-graph.ts — add version to VERSIONS array
# (requires a one-time refactor: VERSION_PATH → VERSIONS array)

# 5. Run pipeline
pnpm sync-toc
pnpm build-doc-graph
pnpm build-search-index

# 6. Verify
pnpm check:toc
pnpm typecheck
```

**Estimated effort: 30 minutes per new version** (after one-time refactor of build-doc-graph.ts).

### Required one-time refactor to support multi-version builds

`build-doc-graph.ts` currently has hardcoded `VERSION = '6.1'` and `VERSION_PATH = '6_1'`. This needs to become a versions array. This is a single change to the build script — not a runtime change.

```typescript
// Current (single-version):
const VERSION      = '6.1';
const VERSION_PATH = '6_1';

// Target (multi-version):
const ACTIVE_VERSIONS = [
  { label: '6.1',   path: '6_1'   },
  // { label: '6.1.1', path: '6_1_1' },  // uncomment when ready
] as const;
```

The rest of the build script loops over `ACTIVE_VERSIONS` and produces nodes tagged with their version. The output is one `doc-graph.json` with all version nodes.

---

## 6. Minimal Implementation Plan

Ordered by impact per effort. Each step is independent.

### Step 1 — Fix duplicate node IDs in build-doc-graph.ts [BLOCKER for Step 2]

**Effort:** 15 minutes
**Impact:** Unblocks graph integration; prevents navigation bugs
**Change:** `build-doc-graph.ts` line ~336

```typescript
// Current (label-based, causes 38 collisions):
const nodeId = slugify(entry.label) || `page-${totalPages}`;

// Fix (path-based, unique):
const nodeId = slugify(
  entry.filePath
    .replace(/^\/content\/6_1\//, '')
    .replace(/\//g, '-')
    .replace(/\.md$/, '')
);
// e.g., "admin_6_1/admin_users/user_management_6_1.md"
//    → "admin-6-1-admin-users-user-management-6-1"
```

**Run after:** `pnpm build-doc-graph && pnpm check:toc` (Check 7 must go from WARN to PASS)

---

### Step 2 — Wire docGraph.ts into DocumentationLayout.tsx [HIGHEST VALUE]

**Effort:** 2-3 hours
**Impact:** Removes ~150KB of nav data from main bundle; enforces L0/L1 pattern; enables version switching
**Prerequisite:** Step 1 complete (unique node IDs)

Replace:
```typescript
import { versions, modules as hardcodedModules, getSectionsForModule } from "../data/navigationData";
```

With:
```typescript
import { loadDocGraph, getModuleList, getModuleSections, getSectionNodes } from "../utils/docGraph";
```

Components render sidebar by:
1. `getModuleList()` — list of `{ id, label }` for module nav items
2. `getModuleSections(moduleId)` — sections when a module is expanded
3. `getSectionNodes(moduleId, sectionId)` — pages when a section is expanded

**navigationData.ts** becomes unused after this change and can be deleted.

---

### Step 3 — Fix contentLoader.ts import mixing [TD-001]

**Effort:** 30 minutes
**Impact:** Enables Vite code-splitting; reduces main chunk by ~500KB
**Change:** Audit all import sites; ensure contentLoader.ts is only dynamically imported

---

### Step 4 — Refactor build-doc-graph.ts to support version array [MULTI-VERSION UNBLOCK]

**Effort:** 1-2 hours
**Impact:** Unblocks multi-version content; adds ~60KB per version to graph file
**Change:** Replace `VERSION`/`VERSION_PATH` constants with `ACTIVE_VERSIONS` array

---

### Step 5 — Add sectionless entry support [TOC COMPLETENESS]

**Effort:** 1 hour
**Impact:** Brings 24 sectionless TOC entries into the graph (currently dropped by parseTOC)
**Change:** `build-doc-graph.ts` — handle pages appearing before first `### Section` heading in a module
**Fix:** Assign them to a synthetic `"overview"` section or the module itself as their section

---

## 7. What NOT to Build

| Rejected idea | Reason |
|---|---|
| Version inheritance / content sharing system | Complexity without clear value; independent trees are simpler |
| Cross-version search | Not requested; adds indexing complexity |
| PRD-to-doc generation pipeline | Permanently out of scope |
| Automatic "diff" between versions | Speculative feature; not needed |
| GraphQL or REST API layer | No backend; static site only |
| Heavy graph intelligence (community detection, criticality scoring) | Overkill for a docs navigation system |
| Generating breadcrumbs from frontmatter | Already solved via graph — frontmatter breadcrumbs would add drift risk |
| PARENT_OF edges | Not consuming; add only when a component actually needs them |

---

## 8. System Assessment

```
Master TOC architecture:       CORRECT and enforced
Graph build:                   CORRECT, deterministic, incremental-capable
Graph runtime client:          CORRECT API, zero consumers (gap)
Content loader:                CORRECT strategy, mixed import (TD-001)
Search index:                  CORRECT coverage, lazy-loaded
Token efficiency (target):     DESIGNED correctly but NOT ENFORCED at runtime
Token efficiency (actual):     PARTIAL — L2 correct; L0/L1 loads wrong path
Multi-version readiness:       DESIGN in place; 2 code changes needed
Bundle size:                   1.88MB (should be ~1.2MB after fixes)
```

**Status: ARCHITECTURALLY SOUND with two high-value gaps to close:**

1. `docGraph.ts` is a correctly-built, never-used asset → wire it into DocumentationLayout
2. Duplicate node IDs (38) are a dormant bug → fix before wiring

Closing these two gaps transforms the system from "graph built but ignored" to "graph-driven, token-efficient navigation" with no new infrastructure required.
