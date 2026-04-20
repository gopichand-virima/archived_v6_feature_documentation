# Eval: Add/Edit/Delete Coverage

**Suite:** `coverage`
**Severity:** AMBER
**Script:** `scripts/evals/run-evals.ts`

## What it checks

Every generated feature doc under `src/pages/` must contain sections covering:
1. How to **add/create** the feature record
2. How to **edit/update** the feature record
3. How to **delete/remove** the feature record

## Detection method

Case-insensitive keyword search: add/create, edit/update/modif, delete/remov.

## Remediation

Regenerate via `/generate-feature-docs` or manually add the missing section.
