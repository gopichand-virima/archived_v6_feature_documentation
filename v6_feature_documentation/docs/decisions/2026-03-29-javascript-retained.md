# JavaScript Files Retained — Decision Record

**Date:** 2026-03-29
**Decision by:** Enterprise restructure

## Summary

These files remain as JavaScript due to documented technical constraints. All other JavaScript files have been converted to TypeScript under `scripts/checks/`.

---

## public/validate-fix.js

**Status:** Retained as JavaScript (browser runtime asset)

**Reason:** This file is a static browser-executed asset served directly from the `public/` directory. It runs in the browser at runtime, not during the Node.js build process. TypeScript compilation does not apply to files in `public/` — they are served as-is. Converting it to TypeScript would require either:
1. Moving it to `src/` and importing it through the Vite pipeline (changes site behavior), or
2. Adding a separate TypeScript compilation target for browser utilities (over-engineering for a small file).

Neither change is warranted for a small static utility. This file must not use Node.js APIs.

---

## scripts/*.mjs — Conversion Outcome (Task 6)

**All four `.mjs` scripts were successfully converted to TypeScript.** No `.mjs` files are retained.

### scripts/sync-toc-from-index.ts (was .mjs) — HIGH priority

**Status:** Converted and `.mjs` deleted.

**Changes made:**
- Added interfaces: `VersionConfig`, `PageItem`, `SubSection`, `Section`, `Module`
- All function parameters and return types annotated explicitly
- `noUncheckedIndexedAccess` compliance: `match[1] ?? ''` guards on all regex capture groups; `pageStack[indent - 1]` result checked via `if (parent)` before use
- `import.meta.url` pattern was already correct in the source — retained as-is (no `import.meta.dirname` shorthand was used, no polyfill needed)
- `error` catch blocks cast to `Error` for `.message` / `.stack` access under `strict: true`

**package.json `sync-toc` script updated to:** `tsx --tsconfig scripts/tsconfig.json scripts/sync-toc-from-index.ts`

### scripts/sync-imports-from-toc.ts (was .mjs) — HIGH priority

**Status:** Converted and `.mjs` deleted.

**Changes made:**
- Added interfaces: `AllFiles`, `ParseStats`, `ImportReaderResult`
- All function parameters and return types annotated
- `noUncheckedIndexedAccess` compliance: all regex capture groups guarded with `?? ''`
- Non-null assertions (`!`) used only after explicit null-check initialization guards
- Unused parameters prefixed with `_` (`_version`, `_e`) to satisfy `strict: true`

### scripts/generate-mdx-imports.ts (was .mjs) — MEDIUM priority

**Status:** Converted and `.mjs` deleted.

**Changes made:**
- Added interfaces: `ModuleConfig`, `MDXFileInfo`, `GenerateResult`
- All function parameters and return types annotated
- `noUncheckedIndexedAccess` compliance: `split` results typed as `string[]`; all index accesses are safe

### scripts/watch-toc.ts (was .mjs) — LOW priority (dev-only)

**Status:** Converted and `.mjs` deleted.

**Changes made:**
- `syncTimeout` typed as `ReturnType<typeof setTimeout> | null`
- `runSync()` annotated as `Promise<void>`; `watchIndexFile()` and `main()` as `void`
- `eventType` parameter in `watch` callback typed as `string`
- Internal `execAsync` call updated from `node scripts/sync-toc-from-index.mjs` to `node --import tsx/esm scripts/sync-toc-from-index.ts` so the watcher correctly invokes the TypeScript version at runtime

**package.json `watch-toc` script updated to:** `tsx --tsconfig scripts/tsconfig.json scripts/watch-toc.ts`

### TypeScript Configuration Used

`scripts/tsconfig.json` settings that governed the conversion:
- `"module": "ESNext"` + `"moduleResolution": "bundler"` — `import.meta.url` is natively valid; no `__dirname` polyfill needed beyond the existing `fileURLToPath` pattern already present in all four source files
- `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitReturns": true` — drove all additional type annotations and null guards
- Runtime executor: `tsx` (v4.19.x), available at `node_modules/.bin/tsx`

### Notes on References to Deleted Files

References to `.mjs` filenames remain in historical documentation:
`docs/plans/2026-03-29-migration-plan.md`, `docs/plans/2026-03-29-enterprise-restructure-plan.md`, `README.md`.
These are read-only records and do not affect build behavior.

---

## Governance Rule

Any future JavaScript file addition to this repository requires:
1. A documented entry in this file explaining why TypeScript was not viable
2. Explicit approval in the PR description
3. A comment in the file itself: `// JavaScript retained: <reason>` on line 1
