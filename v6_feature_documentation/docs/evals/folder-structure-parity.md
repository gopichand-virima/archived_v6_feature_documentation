# Eval: Folder Structure Parity

**Suite:** `structure`
**Severity:** AMBER

## What it checks

Every PRD folder in `C:\github\v6_prds\src\pages\` that contains a `{slug}.md` file must have a corresponding generated doc at `src/pages\{same-path}\{slug}.md`.

## Remediation

Run `/generate-feature-docs --prd <missing-prd-path>` for any missing docs.
