# docs/archive — Archived Artifacts

This directory holds artifacts that are no longer part of active development but are preserved for governance, audit, or rollback value.

**Do not delete this directory.**
**Do not edit files here** — they are historical records.

## Contents

### `2026-03-14-prds-generation-audit-report.md`
Stale audit report generated 2026-03-14 covering the PRD-to-feature-doc pipeline. Archived 2026-03-29 — superseded by the `docs/` governance structure (plans, evals, operations).

### `migration-scripts/`
One-time PowerShell scripts used during the 2026-03-29 asset and folder naming convention migration. The migration is complete. These scripts are Windows-only and not part of any automated pipeline.

| Script | Purpose |
|--------|---------|
| `fix-all-getting-started-mdx-paths.ps1` | Fixed getting_started MDX image paths across all versions |
| `fix-getting-started-images-all-versions.ps1` | Applied naming convention fixes to NG, 6_1_1, and 5_13 getting_started images |
| `rename-folders-to-convention.ps1` | Renamed folders to lowercase with underscores |
| `rename-images-to-convention.ps1` | Renamed image files to naming convention (lowercase, underscores) |
| `update-mdx-image-references.ps1` | Updated MDX content references to match renamed image files |

These scripts required human review before running and contained hardcoded paths. Do not run them again without verifying paths against the current repo structure.
