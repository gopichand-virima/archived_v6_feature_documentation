# Unreferenced Content Files: Inventory and Policy

**Date:** 2026-04-08
**Status:** Policy decision pending

---

## The Numbers

| Location | Count |
|----------|-------|
| Content files on disk | 998 |
| Files referenced by TOC (`index.md`) | 363 unique paths |
| **Files NOT in TOC** | **635** |

These 635 files live under `src/pages/content/6_1/` but have no entry in the master TOC. The app cannot navigate to them. They do not appear in the sidebar, search index, or doc-graph.

---

## Inventory by Module

| Module directory | Unreferenced files | % of module on disk |
|------------------|--------------------|---------------------|
| `admin_6_1/` | 303 | ~76% |
| `itsm_6_1/` | 154 | ~90% |
| `discovery_6_1/` | 106 | ~41% |
| `itam_6_1/` | 63 | ~79% |
| `self_service_6_1/` | 4 | 100% (module unnavigable — sectionless) |
| `reports_6_1/` | 2 | 25% |
| `risk_register_6_1/` | 1 | 25% |
| `getting_started_6_1/` | 1 | — |
| root `6_1/` | 1 (`README_6_1.md`) | — |
| **Total** | **635** | |

---

## File Classification

Based on file naming patterns, the unreferenced files fall into three categories:

### Category A — Content Backlog (majority)
Real documentation content that was written but never added to the TOC. These files have normal names matching the module they serve.

Examples:
- `admin_6_1/admin_change_mngmnt/add_change_model_6_1.md`
- `itsm_6_1/change_mngmnt/changes_6_1.md`
- `itsm_6_1/change_mngmnt/cab_meetings_6_1.md`
- `discovery_6_1/` (106 files — likely a large content backlog)
- `self_service_6_1/about_self_service_6_1.md`

These files are intentionally written content waiting to be wired into the navigation. They should be **kept and progressively added to the TOC** as documentation coverage expands.

### Category B — Legacy / Superseded Versions
Files with names suggesting old versions or deprecated content.

Examples:
- `admin_6_1/admin/admin_functions_old_6_1.md`
- `admin_6_1/admin/admin_functions_v5_6_1.md`
- `admin_6_1/admin/admin_functions_v6_6_1.md`

These should be **reviewed for deletion** — they predate the current content pipeline and likely contain stale information. If any content is still relevant, it should be migrated into a properly named file referenced by the TOC.

### Category C — Draft / Planning Artifacts
Files that appear to be temporary or planning files, not finished documentation.

Examples:
- `README_6_1.md` (at root of `6_1/` — likely a planning note)
- `getting_started_6_1/user_settings_6_1.md` (possible draft)

These should be **reviewed and deleted** if they serve no user-facing documentation purpose.

---

## Sectionless Modules (Special Case)

Four entire modules have no `### Section` headings in the TOC, so ALL their files are treated as unreferenced by the doc-graph parser:

| Module | Files on disk | TOC entries | Doc-graph pages |
|--------|--------------|-------------|-----------------|
| Vulnerability Management | 6 | 6 (sectionless) | 0 |
| Self-Service | 4 | 4 (sectionless) | 0 |
| Risk Register | 3 | 3 (sectionless) | 0 |
| Reports | ~8 | 6 (sectionless) | 0 |

These modules have correct TOC entries with valid file paths, but the `parseTOC` function in `build-doc-graph.ts` requires a `### Section` ancestor to include a page in the graph.

**Fix**: Add a `### Section` heading to each of these modules (e.g., `### Overview`, `### Features`). No content files need to move — only the TOC structure needs updating.

---

## Policy Recommendation

### Immediate (before next release)
1. **Do not delete any files without human review.** The 635 files are all valid `.md` content — many represent significant documentation work.
2. **Sectionless modules**: Add `### Section` headings to Risk Register, Reports, Vulnerability Management, and Self-Service TOC entries so their pages appear in the doc-graph.
3. **Legacy files** (`_old_`, `_v5_`, `_v6_` suffixes): Schedule for human review and deletion. These are safe to remove after verification they contain no unique content.

### Short-Term (next sprint)
4. **Content backlog audit**: Assign each unreferenced content file to one of:
   - ✅ Add to TOC (wire into navigation)
   - 🗄️ Archive to `docs/archive/` (content exists but out of scope for current release)
   - 🗑️ Delete (duplicate, superseded, or draft)
5. **Target**: Reduce unreferenced count from 635 to <100 by wiring the Category A backlog into the TOC.

### Long-Term
6. **Add a CI gate**: Extend `verify-toc-structure.ts` to warn when unreferenced file count exceeds a configurable threshold. This prevents future content drift where files are written but never exposed to users.

---

## What NOT to Do

- **Do not bulk-delete all 635 files.** Most are real documentation written by content authors. Bulk deletion would destroy that work.
- **Do not add all 635 to the TOC blindly.** Many need review for quality, accuracy, and TOC placement before being published.
- **Do not restructure the content directories** to match the TOC without updating both the TOC and all internal cross-links simultaneously.

---

## How to Identify Unreferenced Files

```bash
# Run the analysis locally
python3 -c "
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
with open('src/pages/content/6_1/index.md', encoding='utf-8') as f:
    content = f.read()

toc_paths = set()
for line in content.split('\n'):
    if '/content/6_1/' not in line: continue
    m = re.match(r'^-\s+.+?\s+\u2192\s+\`?/content/6_1/([^\`\s]+)', line.strip())
    if m: toc_paths.add(m.group(1))

all_files = set()
for root, dirs, files in os.walk('src/pages/content/6_1'):
    for f in files:
        if f.endswith('.md') and f != 'index.md':
            all_files.add(os.path.relpath(os.path.join(root, f), 'src/pages/content/6_1').replace(os.sep, '/'))

for p in sorted(all_files - toc_paths):
    print(p)
"
```

---

## Related

- [`2026-04-08-count-reconciliation.md`](./2026-04-08-count-reconciliation.md) — full count reconciliation
- `src/pages/content/6_1/index.md` — master TOC (edit this to wire files into navigation)
- `pnpm check:toc` — validates TOC → file alignment (does not catch unreferenced files going the other way)
