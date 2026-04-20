# /preview-site

Build and preview the documentation website locally.

## Steps
1. `pnpm install` — ensure dependencies are current
2. `pnpm sync-toc` — sync TOC files
3. `pnpm typecheck` — catch type errors before build
4. `pnpm build` — production build
5. `pnpm preview` — serve on http://localhost:4173/FeatureDocsite/

## Commands
```bash
pnpm install && pnpm sync-toc && pnpm build && pnpm preview
```

## Troubleshooting
- White screen: check browser console for missing MDX imports
- 404: verify base path is `/FeatureDocsite/` in vite.config.ts
- Missing content: run `pnpm sync-toc` then rebuild
