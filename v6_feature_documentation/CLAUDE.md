# CLAUDE.md — v6 Feature Documentation Platform

This is the authoritative operating guide for Claude agents and contributors working in this repository.

---

## Repo Purpose

This repository (`v6_feature_documentation`) is the source for the **Virima V6 Feature Documentation website** — a React+Vite single-page app that serves versioned product documentation.

The content pipeline:
```
src/pages/content/6_1/index.md  (master TOC — single source of truth)
        ↓  pnpm sync-toc
src/data/navigationData.ts + src/utils/indexContentMap.ts
        ↓  pnpm build-doc-graph
public/doc-graph.json  (structural metadata — 385 pages, 1045 edges)
        ↓  pnpm build-search-index
public/search-index.json  (385 entries — title, headings, excerpts)
        ↓  pnpm build  (vite)
dist/  (static site + all .md content files)
        ↓  GitHub Pages (via deploy-pages.yml)
```

**Live URL:** `https://virima-products.github.io/v6_feature_documentation/`

### Key architecture boundaries
- `src/lib/content/` — Runtime content loading library (contentLoader, registry, manifests, registration)
- `src/pages/content/` — Manually maintained content files (MDX articles, feature docs)
- `src/pages/content/6_1/index.md` — Master TOC; single source of truth for navigation hierarchy
- `public/doc-graph.json` — Graph-based structural metadata built at build time (not committed)
- `public/search-index.json` — Full-text search index covering all 385 TOC-referenced pages
- Currently only version **6.1** is active (versions 5.13, 6.1.1, NG are commented out for future use)

---

## Architectural Principles

1. **Master TOC is sacred.** `src/pages/content/6_1/index.md` is the single source of truth for navigation. The folder structure under `src/pages/content/6_1/` must stay consistent with it. Never flatten or restructure without updating the master TOC.
2. **TypeScript-only.** All source files in `src/`, `scripts/`, and root utilities must be `.ts` or `.tsx`. No `.js` files except where explicitly documented in `docs/decisions/`.
3. **pnpm is the package manager.** Use `pnpm` for all install, run, and CI commands. Never use `npm run` or `yarn`.
4. **Content is manually curated.** Files under `src/pages/content/6_1/` are hand-edited documentation. The master TOC (`index.md`) drives navigation structure; individual `.md` files are the actual docs. Edit content files directly.
5. **Validation gates must pass.** Before merging anything, `pnpm validate` and `pnpm eval` must pass clean.

---

## What Must Be Preserved

- `src/pages/content/6_1/index.md` — master TOC and navigation source of truth
- Folder structure under `src/pages/content/6_1/` (must match master TOC hierarchy)
- Runtime content loading library in `src/lib/content/` (contentLoader, registry, manifests, registration)
- Add/edit/delete documentation coverage in every feature doc
- Version 6.1 content at `src/pages/content/6_1/` (other versions commented out for future)
- Graph-based doc structure: `scripts/build-doc-graph.ts` + `src/utils/docGraph.ts` + `public/doc-graph.json`
- Search index pipeline: `scripts/build-search-index.ts` + `public/search-index.json`
- Build output directory: `dist/` (not `build/`)

---

## Master TOC and Navigation Contract

`src/pages/content/6_1/index.md` is the single source of truth for the published navigation hierarchy.

### How it flows

```
src/pages/content/6_1/index.md  (hand-edited — defines structure)
    ↓  pnpm sync-toc
src/data/navigationData.ts       (generated — do not hand-edit)
src/utils/indexContentMap.ts     (generated — do not hand-edit)
    ↓  pnpm build-doc-graph
public/doc-graph.json              (generated at build time — not committed)
    ↓  pnpm build-search-index
public/search-index.json         (generated — 385 entries covering all TOC pages)
```

### Rules

- `index.md` is **plain `.md`** — not `.mdx`
- `navigationData.ts` and `indexContentMap.ts` are **generated** — rewritten by `pnpm sync-toc`; do **not** hand-edit them
- `public/doc-graph.json` is built during `pnpm build` via the `prebuild` step; it is **not committed** to git
- `public/search-index.json` covers all 385 pages referenced in the master TOC
- Paths in `index.md` are relative to the version root — e.g., `admin/sla/sla-management-user-guide.md`

### Graph-based doc structure

`scripts/build-doc-graph.ts` builds `public/doc-graph.json` at build time:
- 385 pages (pages + sections)
- 1045 edges (parent/child/sibling relationships)
- Structural metadata only — no body text

`src/utils/docGraph.ts` is the runtime graph client used by the app:
- L0/L1/L2 progressive disclosure
- Loaded from `public/doc-graph.json` at runtime

---

## Naming Conventions

- Feature slugs: `lowercase_underscore` (e.g., `incident_management`, `change_dashboard`)
- Component files: `PascalCase.tsx` (e.g., `DocumentationLayout.tsx`)
- Utility files: `camelCase.ts` (e.g., `tocLoader.ts`, `basePath.ts`)
- Script files: `kebab-case.ts` or `camelCase.ts` under `scripts/`
- Check scripts: `scripts/checks/` — one concern per file
- Eval scripts: `scripts/evals/` — named by eval suite

---

## Content Conventions

- Feature docs are GFM markdown (`.md`), not MDX (`.mdx`)
- No frontmatter in feature docs
- Every feature doc must cover: Overview, Add, Edit, Delete use cases
- Headings use sentence case (e.g., `## Managing incidents`)
- Internal links use relative paths
- No Confluence macro syntax in output docs

---

## Allowed Automated Edits

Claude agents **may**:
- Edit content files under `src/pages/content/6_1/` directly (content is manually curated)
- Edit `src/pages/content/6_1/index.md` to add/remove/reorder navigation entries
- Update TOC-derived files by running `pnpm sync-toc` after editing `index.md`
- Run `pnpm validate` and fix reported issues
- Create new slash commands under `.claude/commands/`
- Update docs under `docs/`

Claude agents **must NOT**:
- Hand-edit `src/data/navigationData.ts` or `src/utils/indexContentMap.ts` — these are generated by `pnpm sync-toc`
- Hand-edit `public/doc-graph.json` — this is generated by `pnpm build-doc-graph`
- Edit `scripts/build-doc-graph.ts` without explicit human review
- Change the Vite base path (currently `'./'` — relative paths required for GitHub Pages root-served deployment)
- Commit to `main` directly without passing validation gate

---

## Expected Workflow

### Add or update content

```bash
# 1. Edit the content file directly
#    e.g., src/pages/content/6_1/admin/users/users-access-management.md

# 2. If adding a new page, also update the master TOC
#    src/pages/content/6_1/index.md

# 3. Sync navigation from the updated master TOC
pnpm sync-toc

# 4. Validate and build
pnpm validate
pnpm build
```

### Local development
```bash
pnpm install
pnpm dev          # starts dev server on :3000
pnpm build        # typecheck + production build (includes prebuild: doc-graph + search-index)
pnpm preview      # serve the build locally
```

### Validation
```bash
pnpm typecheck       # TypeScript check only
pnpm validate        # typecheck + security + setup
pnpm eval            # documentation quality evals
pnpm check:security  # scan for hardcoded secrets
pnpm check:setup     # verify repo structure
pnpm check:env       # verify .env.local
```

---

## Local Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Typecheck + production build (runs prebuild: doc-graph + search-index) |
| `pnpm preview` | Serve build locally (port 4173) |
| `pnpm typecheck` | TypeScript type check |
| `pnpm lint` | ESLint check |
| `pnpm validate` | Full validation suite |
| `pnpm eval` | Run documentation evals |
| `pnpm check:env` | Check .env.local |
| `pnpm check:setup` | Verify repo structure |
| `pnpm check:security` | Scan for hardcoded secrets |
| `pnpm sync-toc` | Sync navigationData.ts + indexContentMap.ts from index.md |
| `pnpm watch-toc` | Watch index.md and auto-sync TOC |
| `pnpm build-doc-graph` | Build public/doc-graph.json from master TOC + content files |
| `pnpm build-search-index` | Build public/search-index.json (385 entries) |

---

## Package Manager: pnpm

**Always use pnpm.** Never use npm or yarn.

```bash
pnpm install          # install dependencies
pnpm add <pkg>        # add dependency
pnpm add -D <pkg>     # add devDependency
pnpm run <script>     # run script
pnpm dlx <binary>     # run one-off binary (replaces npx)
```

The `packageManager` field in `package.json` is set to `pnpm@9.15.0`. The lockfile is `pnpm-lock.yaml`.

---

## TypeScript Policy

- All source files must be `.ts` or `.tsx`
- Strict mode is enabled (`strict: true` in all tsconfigs)
- No `any` unless documented with a justification comment
- Shared types live in `src/types/`
- Run `pnpm typecheck` before every commit

---

## Quality Gates

| Gate | Command | On Failure |
|------|---------|------------|
| TypeScript | `pnpm typecheck` | Fix type errors |
| Security scan | `pnpm check:security` | Remove hardcoded secrets |
| Setup check | `pnpm check:setup` | Fix missing structure |
| Docs eval | `pnpm eval` | Fix flagged docs |
| Build | `pnpm build` | Fix build errors |

---

## Slash Commands

| Command | Purpose |
|---------|---------|
| `/audit-docs` | Audit TOC alignment, path contracts, doc structure — no PRD comparison |
| `/add-doc-page` | Add a new documentation page to the site |
| `/validate-docs` | Run full validation suite (typecheck + checks + TOC + build) |
| `/run-evals` | Execute documentation quality evals |
| `/preview-site` | Build and preview the site locally |
| `/release-readiness` | Full release readiness check |
| `/security-review` | Security posture review — headers, container, secrets, content rendering |
| `/new-docsite` | Load blueprint + reference pack for new docsite or clone architecture questions |

---

## Security Model

### Architecture

This is a **public-facing static documentation site**. It has no user accounts, no backend, and no server-side state. The security model is appropriately scoped — no auth/RBAC/session system is needed or should be added.

| Layer | Owner | Mechanism |
|---|---|---|
| TLS / HTTPS | GitHub Pages CDN | TLS provided automatically by GitHub Pages |
| DDoS / rate limiting | WAF / Cloudflare (upstream) | Edge-level; not implemented in-app |
| Authentication | None required | Public documentation site |
| Content rendering safety | `rehype-sanitize` in `MDXRenderer.tsx` | Blocks XSS from HTML in markdown |
| HTTP security headers | `nginx.conf` (local Docker) | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Secret scanning | `pnpm check:security` (runs in CI) | Patterns: OpenAI `sk-`, Anthropic `sk-ant-`, AWS `AKIA`, GitHub `ghp_`/`github_pat_` |
| Supply-chain governance | `.github/CODEOWNERS` | Requires review for Dockerfile, nginx.conf, workflows, governance files |
| Container (local only) | `nginxinc/nginx-unprivileged:alpine` | nginx runs as uid 101; port 8080 — NOT used in production deployment |

### API Key Exposure (Known Limitation — Required Future Work)

All `VITE_*` environment variables are compiled into the JavaScript bundle and visible in browser DevTools. This includes search/AI API keys (OpenAI, Anthropic, etc.).

**Current mitigation:** CSP `connect-src https:` restricts API calls to HTTPS endpoints only.

**Required future work:** API calls must be proxied through a backend-for-frontend (BFF) service before this platform is exposed to untrusted public networks. Until then:
- Scope API keys to specific domains at the provider level
- Apply strict usage limits and budget alerts
- Do NOT add real, unscoped production keys to the Vite build

### What Claude agents MUST NOT do (security-specific)
- Add login/auth/session systems — wrong architecture for a public docs site
- Disable `rehype-sanitize` without adding equivalent XSS protection
- Move API keys from `.env.local` into source code
- Expose `ANTHROPIC_API_KEY` via a `VITE_` prefix (would be compiled into the bundle)
- Change `nginx.conf` or `Dockerfile` (retained for local Docker preview only; not production CI)

---

## Deployment Model

**Production deployment:** GitHub Pages via `deploy-pages.yml` workflow.
**Live URL:** `https://virima-products.github.io/v6_feature_documentation/`
**Vite base:** `'./'` (relative — GitHub Pages serves the artifact at domain root; relative paths resolve correctly from there)

| Trigger | Workflow | Result |
|---------|----------|--------|
| Push to `main` | `deploy-pages.yml` | Builds + deploys to GitHub Pages |
| Feature branch push / PR | `ci.yml` | Validates + builds (no deploy) |

### One-time repo setup required
GitHub Pages must be enabled in the repository settings:
1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. No branch-based source is needed — `deploy-pages.yml` manages artifact upload directly

### Local Docker preview (optional)
Docker and nginx.conf are retained for local smoke-testing only. They are **not** used in production CI/CD.
```bash
docker compose up --build
# Site available at: http://localhost:8080/v6_feature_documentation/
```

### Deployment history
The previous `ci-cd.yml` workflow (Docker → ECR → Kubernetes) was retired. GitHub Pages via `deploy-pages.yml` is the sole production deployment target. The auto-generation pipeline (`generate-v6feature-docs.yml`) was also retired as part of the migration to manually curated content.

---

## Rollback / Safety

See `docs/operations/rollback-runbook.md` for rollback procedures.

All content changes go through branch + PR review before reaching main.

---

## New Docsite Reference

For any request about building a new docsite, cloning this website's functionality, or reusing
this repo as a seed implementation, first consult:

- `docs/reference/current-docsite-blueprint.md` — Full architectural reference: stack, content model, pipeline, copy/adapt/regenerate matrix, failure modes, clone guide (21 sections)
- `docs/reference/current-docsite-reference-pack.md` — Compact companion: ranked file lists, reuse table, repo-specific assumptions to remove, required external settings (10 sections)
- `docs/reference/current-docsite-ops-evals-governance.md` — Operational runbook: all validation commands, eval system, governance controls, security, failure recovery runbooks, enterprise readiness checklist (10 sections)

Prompt sources:
- `docs/prompts/reverse-engineer-current-docsite.md` — Regenerate the blueprint when architecture changes
- `docs/prompts/build-new-docsite-from-blueprint.md` — Guide for building a new site from the blueprint

Slash command: `/new-docsite` — loads blueprint + reference pack before answering any new-docsite question.

Treat the blueprint as the durable architectural reference. Use current code/config/workflows as
source of truth when exact behavior must be verified.
