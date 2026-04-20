# Technical Debt Log

**Date recorded:** 2026-04-08
**Status:** Known pre-existing issues — non-blocking, documented for future resolution

---

## TD-001 — contentLoader.ts Mixed Static/Dynamic Import

**Severity:** Medium — Vite build warning, non-blocking
**Affects:** Bundle size, code-splitting efficiency

### Warning text

```
(!) src/lib/content/contentLoader.ts is dynamically imported by
  src/components/DocumentationContent.tsx
  src/utils/mdxContentLoader.ts
but also statically imported by
  src/App.tsx
  src/components/CompatibilityMatrix.tsx
  src/components/MDXContent.tsx
  src/components/MDXRenderingTest.tsx
  src/components/ProductSupportPolicies.tsx
  src/utils/debugHelpers.ts
dynamic import will not move module into another chunk.
```

### Root cause

`contentLoader.ts` is consumed two ways:
1. **Static imports** — `App.tsx` and several UI components import it directly at the top level. These imports pull the module into the main synchronous bundle.
2. **Dynamic imports** — `DocumentationContent.tsx` and `mdxContentLoader.ts` try to lazy-load it via `import(...)`. Vite's code-splitter cannot move a module into a separate async chunk if the same module is already in the synchronous bundle.

The result: the dynamic import is effectively a no-op for code-splitting purposes. The module is always loaded synchronously. The 1.8MB main chunk (see TD-002) is a direct consequence.

### Pre-existing history

This mixing was present before the April 2026 migration. The static imports exist in components that were written before dynamic loading was introduced for content delivery.

### Fix

Convert all consumers of `contentLoader.ts` to either all-static or all-dynamic imports. The correct long-term direction is dynamic-only (lazy load content infrastructure only when a page navigation occurs):

1. Remove static `import { fetchContent } from '@/lib/content/contentLoader'` from `App.tsx`, `CompatibilityMatrix.tsx`, `MDXContent.tsx`, `MDXRenderingTest.tsx`, `ProductSupportPolicies.tsx`, and `debugHelpers.ts`.
2. Replace with dynamic `const { fetchContent } = await import('@/lib/content/contentLoader')` inside the functions that need it.
3. Run `pnpm build` — the Vite warning should disappear and the main chunk should shrink.

**Estimated effort:** ~2 hours
**Risk:** Low — the semantics don't change; only the loading timing changes.

---

## TD-002 — 1.8MB Main JavaScript Chunk

**Severity:** Medium — UX impact on first load, non-blocking for functionality
**Affects:** Time-to-interactive on first page load

### Warning text

```
(!) Some chunks are larger than 500 kB after minification. Consider:
- Use build.rollupOptions.output.manualChunks to improve chunking
- Adjust chunk size limit via build.chunkSizeWarningLimit

dist/assets/index-CJQMxWrI.js    1,876.33 kB │ gzip: 579.65 kB
```

### Root cause

The main bundle (`index-*.js`) is 1.88MB uncompressed (580KB gzipped). This is caused by:

1. **TD-001 effect**: `contentLoader.ts` and all its transitive dependencies (react-markdown, remark-gfm, rehype-sanitize, unified, etc.) are forced into the main chunk because of the static/dynamic import mixing.
2. **react-markdown and remark ecosystem**: These are heavy Markdown rendering libraries (~300KB combined). They should only load when a user navigates to a content page, not at app boot.
3. **No `manualChunks` configuration** in `vite.config.ts`: The build uses Vite's automatic chunking, which cannot overcome the static import constraint from TD-001.

### Impact

- First contentful paint is not affected (HTML/CSS load independently)
- Time-to-interactive is delayed by ~0.5–1s on average broadband connections (580KB gzip download + parse)
- GitHub Pages serves assets with `Cache-Control: max-age=31536000` — repeat visits are not affected (cached)
- The static documentation content (`.md` files) is unaffected — each page loads its markdown on demand

### Fix

Fix TD-001 first (remove static imports of contentLoader). Then optionally add `manualChunks`:

```typescript
// vite.config.ts
build: {
  target: 'esnext',
  outDir: 'dist',
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'markdown': ['react-markdown', 'remark-gfm', 'rehype-sanitize', 'unified'],
      }
    }
  }
}
```

This would split the bundle to approximately:
- `react-vendor`: ~150KB gzip (cached after first load)
- `markdown`: ~120KB gzip (loaded only on first content page)
- `index`: ~80KB gzip (app shell — loads immediately)

**Estimated effort:** ~3 hours (including TD-001 fix as prerequisite)
**Risk:** Medium — code-splitting changes can introduce timing bugs in components that assumed synchronous availability of contentLoader. Thorough testing required.

---

## TD-003 — Empty Stubs for Inactive Versions

**Severity:** Low — cosmetic warnings, non-blocking
**Affects:** `pnpm sync-toc` output

### Warning text

```
⚠️  Skipping 6_1_1: content dir not found — generating empty stub
⚠️  Skipping 5_13: content dir not found — generating empty stub
⚠️  Skipping NG: content dir not found — generating empty stub
```

### Root cause

`sync-toc-from-index.ts` is aware of four version codes: `6_1`, `6_1_1`, `5_13`, and `NG`. Only `6_1` has a content directory. The other three generate empty stubs for `indexContentMap.ts`. These warnings are expected and benign — they fire on every `pnpm sync-toc` run and are harmless.

### Fix

These warnings can be suppressed once the other versions are no longer planned (change the log level to debug/verbose) or accepted as ongoing noise until a new version is added.

**Estimated effort:** <30 minutes
**Risk:** Negligible

---

## Not Tracked Here

The following items from the migration are **resolved**, not technical debt:

- ~~`dist/doc-graph.json` deleted by Vite during build~~ — Fixed: moved to `public/`
- ~~`verify-toc-structure.ts` bogus-modules false-positive~~ — Fixed: `{ id: "X"` pattern
- ~~`navigationData.ts` generating 15 modules instead of 11~~ — Fixed: reads master TOC
- ~~5 wrong TOC paths (search-index skipping 5 entries)~~ — Fixed: paths corrected
- ~~`vite.config.ts base: '/'` breaking GitHub Pages~~ — Fixed: `base: './'`
- ~~`ci-cd.yml` running ECR/Kubernetes jobs~~ — Fixed: dead jobs removed
- ~~4 Self-Service TOC entries using Windows backslashes~~ — Fixed: forward slashes
