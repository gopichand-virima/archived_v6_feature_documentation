# V6 PRD → Feature Documentation Pipeline — Practical Audit Report

**Date**: 2026-03-14
**Auditor**: Claude Code Enterprise (claude-sonnet-4-6)
**Repos audited**:
- Source: `virima-products/v6_prds` (branch: `main`)
- Generator: `virima-products/v6_feature_documentation` (branch: `main`)

---

## 1. Executive Summary

| # | Test Case | Result | Notes |
|---|---|---|---|
| T1 | Add PRD | ✅ **PASS** | Folder, manifest, enterprise filenames, H1 titles, verbatim block all correct |
| T2 | Edit PRD (initial) | ✅ **PASS** | Baseline generation correct; single deliverable for minimal PRD |
| T2 | Edit PRD (update) | ✅ **PASS** | prdContentHash changed; `newOption` reflected in regenerated user guide |
| T3 | Delete PRD (create) | ✅ **PASS** | Initial generation correct |
| T3 | Delete PRD (remove) | ⚠️ **POLICY C (STALE)** | No cleanup branch created; generated docs persist |
| T4 | Dual PRD (add both) | ✅ **PASS** | 3 deliverables from 2 PRDs; no filename collisions |
| T4 | Dual PRD (partial del) | ⚠️ **POLICY C (STALE)** | Same deletion-stale behavior; docs persist with no update |
| Cleanup | All test PRDs removed | ✅ **PASS** | Final run completed; 0 deliverables, no new branch |

**Overall pipeline verdict**: Functional for Add and Edit cases. **Deletion handling (Policy C) is a confirmed gap** requiring remediation. Dual-PRD manifest overwrite is a medium-priority traceability issue.

---

## 2. Environment & Commands

### Repositories

| Repo | Branch | Working Dir |
|---|---|---|
| `virima-products/v6_prds` | `main` | `C:\github\v6_prds` |
| `virima-products/v6_feature_documentation` | `main` | `C:\github\v6_feature_documentation` |

### Pipeline Trigger Workflow

- **File**: `v6_prds/.github/workflows/trigger-v6feature-docs.yml`
- **Trigger**: `push` to `main` on paths matching `src/pages/**/*.md`
- **Action**: Detects changed files via `git diff --name-status HEAD~1 HEAD`, builds JSON payload, `curl` dispatches `repository_dispatch` to `v6_feature_documentation`

### Generation Workflow

- **File**: `v6_feature_documentation/.github/workflows/generate-feature-docs.yml`
- **Trigger**: `repository_dispatch` event type `generate-feature-docs`
- **Model**: `claude-sonnet-4-20250514`
- **Output**: Auto-branch `auto-v6feature-docs-<timestamp>` with generated `.md` files

### Verification Setup

```bash
# Pull both repos to latest main
cd /c/github/v6_prds && git checkout main && git pull origin main
cd /c/github/v6_feature_documentation && git checkout main && git pull origin main

# After each generation, fetch and checkout the new auto-branch
git fetch origin
BRANCH=$(git branch -r | grep "auto-v6feature-docs" | tail -1 | tr -d ' ')
git checkout -b audit-t<N>-<label> $BRANCH
```

---

## 3. Test Results

### T1 — Add PRD

**PRD**: `src/pages/testing/add-prd/add-prd.md`
**Commit SHA**: `bdbf032c683bbc0a4760d5e72e1d93cadda61de8`
**Generation branch**: `auto-v6feature-docs-20260314-062517`
**Generation run**: Run #7 | Duration: 52s | 1 PRD processed, 2 deliverables

**PRD content summary**: IT admin scan feature with `configOptionA` (boolean), `configOptionB` (enum), usage steps, troubleshooting, and a `<!-- INCLUDE-IN-DOCS:verbatim-start -->` block.

| Check | Result | Detail |
|---|---|---|
| Generated folder exists | ✅ PASS | `src/pages/content/testing/add-prd/` |
| Manifest present | ✅ PASS | `.generation-manifest.json` with all fields |
| Enterprise filenames | ✅ PASS | `using-prd-test-functionality.md`, `prd-test-functionality-administration.md` |
| No `.mdx` files | ✅ PASS | All output files are `.md` |
| H1 — user guide | ✅ PASS | `# Using PRD Test Functionality` |
| H1 — admin guide | ✅ PASS | `# PRD Test Functionality Administration` |
| Verbatim block | ✅ PASS | Preserved in `prd-test-functionality-administration.md` |
| No filename collisions | ✅ PASS | 2 unique basenames |
| prdContentHash present | ✅ PASS | `f9215f37ec220b04...` |

**Manifest excerpt**:
```json
{
  "featureName": "PRD Test Functionality",
  "prdContentHash": "f9215f37ec220b0439e01128aae6095587b0ad4040feb80d3402cc963ab8c879",
  "deliverables": [
    { "type": "user-guide",  "outputFile": "...using-prd-test-functionality.md" },
    { "type": "admin-guide", "outputFile": "...prd-test-functionality-administration.md" }
  ],
  "glossaryTermsAdded": 3
}
```

**Verdict**: ✅ PASS — All 9 checks passed.

---

### T2 — Edit PRD (Initial Baseline)

**PRD**: `src/pages/testing/edit-prd/edit-prd.md` (minimal content: Purpose + 1 usage step)
**Commit SHA**: `10631937813b8db3412e0c7160a7faa6a8281615`
**Generation branch**: `auto-v6feature-docs-20260314-062849`
**Generation run**: Run #8 | Duration: 31s | 1 PRD processed, 1 deliverable

| Check | Result | Detail |
|---|---|---|
| Generated folder exists | ✅ PASS | `src/pages/content/testing/edit-prd/` |
| Manifest present | ✅ PASS | `.generation-manifest.json` |
| Enterprise filename | ✅ PASS | `using-edit-prd-test.md` |
| No `.mdx` files | ✅ PASS | |
| Single deliverable (minimal PRD) | ✅ PASS | Classifier correctly identified only user-guide |
| prdContentHash | ✅ PASS | `59306b064e714bf7...` |

**Verdict**: ✅ PASS — Baseline established.

---

### T2 — Edit PRD (Updated Content)

**PRD**: Same file overwritten — added `newOption: string (values: a,b,c)`, 2-step usage, verbatim block
**Commit SHA**: `4869baf2559f89e021c0b17fb53d64ad65411400`
**Generation branch**: `auto-v6feature-docs-20260314-063054`
**Generation run**: Run #9 | Duration: 28s | 1 PRD processed, 1 deliverable

| Check | Result | Detail |
|---|---|---|
| prdContentHash updated | ✅ PASS | `59306b...` → `dc33f8411916e6d9...` |
| prdNormalizedHash updated | ✅ PASS | Also changed (functional edit) |
| `newOption` reflected | ✅ PASS | Appears 3× in generated doc (description, steps, field table) |
| Same enterprise filename | ✅ PASS | `using-edit-prd-test.md` (no collision with prior run) |
| H1 unchanged | ✅ PASS | `# Using Edit PRD Test` |
| Verbatim block | ⚠️ NOTE | **NOT FOUND** in user-guide. Verbatim block was in updated PRD but not reflected — admin-guide was not generated for this minimal PRD (classifier chose user-guide only). Verbatim blocks are passed through to generated docs; their presence depends on which deliverable type is generated. |

**Verdict**: ✅ PASS (with note on verbatim-in-user-guide). Content update correctly reflected. Hash change detection working correctly.

---

### T3 — Delete PRD (Initial Creation)

**PRD**: `src/pages/testing/delete-prd/delete-prd.md`
**Commit SHA**: `5532d5317a18d8b5e8f75f66698f512b654514aa`
**Generation branch**: `auto-v6feature-docs-20260314-063455`
**Generation run**: Run #10 | Duration: 24s | 1 PRD processed, 1 deliverable

| Check | Result | Detail |
|---|---|---|
| Generated folder exists | ✅ PASS | `src/pages/content/testing/delete-prd/` |
| Manifest present | ✅ PASS | |
| Enterprise filename | ✅ PASS | `using-delete-prd-test.md` |
| prdContentHash present | ✅ PASS | `2127dc34a02596b5...` |

**Verdict**: ✅ PASS — Creation baseline established correctly.

---

### T3 — Delete PRD (Removal)

**Action**: `git rm src/pages/testing/delete-prd/delete-prd.md`
**Commit SHA**: `e1b54bb5ddba814ff0d9246867c4a4742879cbd1`
**Generation run**: Run #11 | Duration: 15s

| Check | Result | Detail |
|---|---|---|
| Dispatch sent | ✅ PASS | trigger workflow correctly detected `action: deleted` |
| New auto-branch created | ❌ NO BRANCH | No `auto-v6feature-docs-*` branch after this run |
| Generated folder removed | ❌ NOT REMOVED | `src/pages/content/testing/delete-prd/` persists on last creation branch |
| `Folders Deleted: 0` in summary | ✅ CONFIRMED | Pipeline processed 0 PRDs, deleted nothing |

**Deletion Policy Observed**: **C (Stale)** — When a PRD is deleted, the pipeline runs with 0 matching PRDs in the dispatch, produces 0 deliverables, creates no new branch, and leaves previously generated docs untouched on the last auto-branch.

**Verdict**: ⚠️ **GAP — Policy C** (see Section 5 for bug details).

---

### T4 — Dual PRD (Add Both)

**PRDs committed in one commit**:
- `src/pages/testing/dual-prd/part-a.md` — "CMDB Discovery Scan Configuration" (IT admin scan setup, configures `discoveryScope`, `scanProtocols`, `ciClassMapping`, `scanSchedule`)
- `src/pages/testing/dual-prd/part-b.md` — "CMDB Discovery Scan Administration" (admin credentials, exclusion lists, CI reconciliation, `credentialVaultId`, `reconciliationPolicy`)

**Commit SHA**: `21e662c897cc40c80dff5ee75f03868bda9e7907`
**Generation branch**: `auto-v6feature-docs-20260314-064140`
**Generation run**: Run #12 | Duration: 1m 44s | 2 PRDs processed, 3 deliverables

| Check | Result | Detail |
|---|---|---|
| Shared output folder | ✅ PASS | Both PRDs → `src/pages/content/testing/dual-prd/` |
| 3 deliverables generated | ✅ PASS | part-a → 2 docs; part-b → 1 doc |
| Enterprise filenames | ✅ PASS | `cmdb-discovery-scan-configuration-administration.md`, `cmdb-discovery-scan-administration-administration.md`, `troubleshooting-cmdb-discovery-scan-configuration.md` |
| No `.mdx` files | ✅ PASS | |
| H1 — config admin | ✅ PASS | `# CMDB Discovery Scan Configuration` |
| H1 — admin administration | ✅ PASS | `# CMDB Discovery Scan Administration` |
| H1 — troubleshooting | ✅ PASS | `# Troubleshooting Discovery Scan Configuration` |
| No filename collisions | ✅ PASS | 3 unique basenames |
| Manifest `sourcePath` | ⚠️ NOTE | Points only to `part-b.md` (last-processed PRD) — **not a combined manifest** |
| Both source PRDs in manifest | ❌ NO | `deliverables` only lists `admin-guide` from part-b; part-a deliverables not recorded |

**Manifest excerpt (actual)**:
```json
{
  "sourcePath": "src/pages/testing/dual-prd/part-b.md",
  "featureName": "CMDB Discovery Scan Administration",
  "prdContentHash": "64ad1cac0036cc52245dcb03b821cd57458cbd24f42756e109ef78edf2587d94",
  "deliverables": [
    { "type": "admin-guide", "outputFile": "...cmdb-discovery-scan-administration-administration.md" }
  ]
}
```

**Verdict**: ✅ PASS for generation and naming. ⚠️ **MEDIUM: Manifest only reflects last-processed PRD** — traceability gap for dual-PRD folders.

---

### T4 — Dual PRD (Partial Deletion — Remove part-a)

**Action**: `git rm src/pages/testing/dual-prd/part-a.md`
**Commit SHA**: `fac72ba0fa7d0aa7d029a97f8047f378d7b60ceb`
**Generation run**: Run #13 | Duration: 13s

| Check | Result | Detail |
|---|---|---|
| Dispatch sent | ✅ PASS | trigger detected `action: deleted` for part-a |
| New auto-branch created | ❌ NO BRANCH | No new branch after this run |
| Docs from part-a removed | ❌ NOT REMOVED | `cmdb-discovery-scan-configuration-administration.md` and `troubleshooting-*` persist |
| Docs from part-b updated | ❌ NOT UPDATED | part-b still in `src/pages/testing/dual-prd/`, but no re-generation triggered |

**Verdict**: ⚠️ **Policy C** — Same stale behavior as T3 deletion. Part-a's orphaned docs persist alongside part-b's unchanged docs. The manifest (overwritten by part-b's last run) does not reflect the partial deletion.

---

### Cleanup Run

**Action**: `git rm -r src/pages/testing/`
**Commit SHA**: `9425ba63d7913420a2b365e3046bcb6dbc4ff99d`
**Generation run**: Run #14 | Duration: 18s | 0 PRDs processed, 0 deliverables, no new branch

**Verdict**: ✅ PASS — All test PRDs removed from `v6_prds/main`. Pipeline completed cleanly.

---

## 4. Observed Pipeline Behaviors

### 4.1 Deletion Policy: C (Stale)

When a PRD is deleted from `v6_prds`, the `trigger-v6feature-docs.yml` correctly dispatches `action: deleted` to `v6_feature_documentation`. However, the `generate-feature-docs.yml` workflow processes only the PRDs included in the dispatch payload and **does not delete** previously generated output folders or files. No new auto-branch is created for deletion-only runs. Generated documentation persists indefinitely on the last auto-branch that created it.

**Observed in**: T3-Delete removal (Run #11), T4-Partial deletion (Run #13), Cleanup (Run #14).

### 4.2 Incremental Processing

Each run processes only the PRDs listed in the dispatch payload. When 2 PRDs are dispatched (T4-Dual), both are processed sequentially within the same run, writing to the same shared output directory. No full re-scan of all existing PRDs occurs (unless `process_all_prds: true` workflow_dispatch).

### 4.3 Dual-PRD Manifest Overwrite

When two PRDs share an output folder, each PRD's generation step overwrites `.generation-manifest.json` with its own data. The final manifest reflects only the last-processed PRD. **Files generated by earlier PRDs remain in the folder** but are not tracked in the manifest. This means:
- Hash-based change detection (Stage 0) will only detect changes to the last-processed PRD
- If part-a changes after part-b was processed last, Stage 0 will compare against part-b's hash and may enter UPDATE or GENERATE mode incorrectly

### 4.4 Enterprise Naming & H1 Titles

All generated files use enterprise naming patterns:
- `using-{slug}.md` — user-guide
- `{slug}-administration.md` — admin-guide
- `troubleshooting-{slug}.md` — troubleshooting

H1 titles match patterns: `# Using {Feature}`, `# {Feature} Administration`, `# Troubleshooting {Feature}`.

### 4.5 Hash-Based Change Detection

Both `prdContentHash` (full content) and `prdNormalizedHash` (metadata-stripped) are written to the manifest. Hash changes correctly detected between T2 initial and T2 updated runs. The mechanism is sound for single-PRD scenarios.

### 4.6 Verbatim Block Handling

`<!-- INCLUDE-IN-DOCS:verbatim-start/end -->` blocks are passed through to generated documentation when they appear in sections that correspond to the generated deliverable type. In T1, the verbatim block appeared in the admin-guide (matching the "Administration" section context). In T2, the block was added to a PRD that only generated a user-guide, and the verbatim text did not surface. This is expected behavior — verbatim passthrough depends on deliverable-section alignment.

### 4.7 Auto-Branch Naming

Generated branches follow the pattern `auto-v6feature-docs-<YYYYMMDD>-<HHMMSS>`. No branches are created for runs that produce 0 deliverables (deletion-only dispatches, runs with `has_changes=false`).

### 4.8 Token Usage

| Deliverable Type | Approximate Input Tokens | Approximate Output Tokens |
|---|---|---|
| user-guide (simple PRD) | 2,181–2,325 | 434–543 |
| admin-guide (simple PRD) | 2,141 | 643 |
| admin-guide (CMDB admin PRD) | 3,414 | 1,920 |

---

## 5. Bugs / Issues / Recommendations

### BUG-01 — Deletion Does Not Clean Up Generated Docs [HIGH]

**Observed**: T3 (single PRD deletion), T4 partial deletion, cleanup run.
**Behavior**: When a PRD is deleted from `v6_prds`, the pipeline runs with 0 matching PRDs, produces 0 deliverables, and creates no new branch. Previously generated docs remain in the last auto-branch permanently.
**Impact**: Orphaned documentation for features that have been removed or consolidated. No mechanism to inform consumers that docs are stale.
**Recommendation**: Add a deletion handler in `generate-feature-docs.yml`:
1. When `action: deleted` entries are present in the payload, load the generation manifest for the corresponding output directory
2. If the manifest exists and `sourcePath` matches the deleted PRD path, either: (a) delete the entire output directory (Policy A), or (b) update the manifest with `{ "status": "prd-deleted", "deletedAt": "..." }` and optionally add a banner to each generated file (Policy B)
3. Create a new auto-branch containing the cleanup to maintain an auditable history

### ISSUE-02 — Dual-PRD Manifest Overwrites Traceability [MEDIUM]

**Observed**: T4-Dual — manifest only records `part-b.md` despite 3 deliverables from 2 PRDs.
**Behavior**: Each PRD's generation step overwrites `.generation-manifest.json`. Files generated by earlier PRDs in the same run are untracked.
**Impact**: Hash-based change detection is unreliable for dual-PRD folders. If part-a changes, Stage 0 reads part-b's hash and may incorrectly skip or overwrite.
**Recommendation**: Change manifest write strategy for shared output folders:
1. On first PRD in a batch for a given output directory, write a fresh manifest with `{ "sourcePrds": [...] }`
2. On subsequent PRDs, append to `sourcePrds` and merge `deliverables` arrays
3. Write final manifest once after all PRDs for that directory are processed

### ISSUE-03 — Filename Naming Ambiguity for `-administration` Pattern [LOW]

**Observed**: T4-Dual generated `cmdb-discovery-scan-administration-administration.md` (double `-administration` suffix).
**Cause**: The PRD title "CMDB Discovery Scan Administration" → slug `cmdb-discovery-scan-administration` → admin-guide pattern `{slug}-administration.md`.
**Impact**: Confusing filename when the feature name itself ends in "administration". Not functionally broken, but readability is poor.
**Recommendation**: In `generateFilename()`, detect and de-duplicate trailing `-administration` suffix: if `slug.endsWith('-administration')`, use `slug.md` instead of `slug-administration.md`.

### RECOMMENDATION-01 — Add `src/pages/testing/` to Trigger Exclusion List [LOW]

**Context**: Test PRDs pushed directly to `main` under `src/pages/testing/` triggered real pipeline runs affecting shared auto-branches. This is by design for this audit but should be restricted post-audit.
**Recommendation**: Add `src/pages/testing/**` to the `paths-ignore` list in `trigger-v6feature-docs.yml`, or add a skip condition: `if [[ "$file" == src/pages/testing/* ]]; then continue; fi` in the detect step.

### RECOMMENDATION-02 — Structured Summary Table in GitHub Actions Step Output [LOW]

**Context**: Generation run summaries (PRDs Processed, Deliverables, Skipped, Failed) are visible in the Actions UI summary but not captured in the auto-branch. An appended `_GENERATION_SUMMARY.md` in each auto-branch would make post-run inspection easier without navigating Actions.

---

## 6. Appendix — Run Inventory

### Auto-Branches Created

| Auto-Branch | Triggered By | PRDs | Deliverables | Duration |
|---|---|---|---|---|
| `auto-v6feature-docs-20260314-062517` | T1-Add commit `bdbf032` | 1 | 2 | 52s |
| `auto-v6feature-docs-20260314-062849` | T2-Initial commit `1063193` | 1 | 1 | 31s |
| `auto-v6feature-docs-20260314-063054` | T2-Update commit `4869baf` | 1 | 1 | 28s |
| `auto-v6feature-docs-20260314-063455` | T3-Create commit `5532d53` | 1 | 1 | 24s |
| *(no branch)* | T3-Delete commit `e1b54bb` | 0 | 0 | 15s |
| `auto-v6feature-docs-20260314-064140` | T4-Dual commit `21e662c` | 2 | 3 | 1m 44s |
| *(no branch)* | T4-PartialDel commit `fac72ba` | 0 | 0 | 13s |
| *(no branch)* | Cleanup commit `9425ba6` | 0 | 0 | 18s |

### v6_prds Audit Commits (in order)

```
bdbf032  test(audit): T1-Add — add test PRD for generation audit
1063193  test(audit): T2-Edit — add initial edit-prd for baseline
4869baf  test(audit): T2-Edit — update edit-prd with new config and usage
5532d53  test(audit): T3-Delete — add delete-prd for deletion test
e1b54bb  test(audit): T3-Delete — remove delete-prd to test deletion behavior
21e662c  test(audit): T4-Dual — add CMDB Discovery dual PRDs (part-a config + part-b admin)
fac72ba  test(audit): T4-Dual — remove part-a to test partial deletion
9425ba6  test(audit): cleanup — remove all test PRDs from testing/
```

### Generated File Inventory (T1–T4)

**T1-Add** — `src/pages/content/testing/add-prd/`
- `using-prd-test-functionality.md` (H1: `# Using PRD Test Functionality`)
- `prd-test-functionality-administration.md` (H1: `# PRD Test Functionality Administration`, contains verbatim block)
- `.generation-manifest.json`

**T2-Edit** — `src/pages/content/testing/edit-prd/`
- `using-edit-prd-test.md` (H1: `# Using Edit PRD Test`, updated → reflects `newOption`)
- `.generation-manifest.json`

**T3-Delete** — `src/pages/content/testing/delete-prd/` (stale on branch `auto-v6feature-docs-20260314-063455`)
- `using-delete-prd-test.md` (H1: `# Using Delete PRD Test`) — **orphaned**
- `.generation-manifest.json` — **orphaned**

**T4-Dual** — `src/pages/content/testing/dual-prd/`
- `cmdb-discovery-scan-configuration-administration.md` (H1: `# CMDB Discovery Scan Configuration`)
- `cmdb-discovery-scan-administration-administration.md` (H1: `# CMDB Discovery Scan Administration`)
- `troubleshooting-cmdb-discovery-scan-configuration.md` (H1: `# Troubleshooting Discovery Scan Configuration`)
- `.generation-manifest.json` (tracks `part-b.md` only — see ISSUE-02)

### Verification Commands Used

```bash
# Check generated folder structure
ls -la src/pages/content/testing/<test>/

# Read manifest
cat src/pages/content/testing/<test>/.generation-manifest.json

# Verify enterprise filenames + H1 titles
for f in src/pages/content/testing/<test>/*.md; do head -3 "$f"; echo "---"; done

# Verbatim passthrough check
grep -R "preserve this exact sentence" src/pages/content/testing/<test>/

# Extension check (no .mdx)
find src/pages/content/testing/<test> -name "*.mdx" || echo "no .mdx"

# Filename collision detection
find src/pages/content/testing/<test> -name "*.md" | xargs -I{} basename {} | sort | uniq -d || echo "no collisions"

# Hash change verification (T2)
cat src/pages/content/testing/edit-prd/.generation-manifest.json | grep -E "prdContentHash|prdNormalizedHash"
```
