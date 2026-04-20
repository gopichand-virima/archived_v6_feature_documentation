# Virima V6 Feature Documentation

> Manually curated product documentation website for Virima V6.
> Content is maintained by hand in GFM Markdown and published to GitHub Pages via a graph-driven navigation pipeline.

**Live Site:** https://virima-products.github.io/v6_feature_documentation/
**Repository:** https://github.com/virima-products/v6_feature_documentation

[![Deploy](https://img.shields.io/github/actions/workflow/status/virima-products/v6_feature_documentation/deploy-pages.yml?branch=main&label=deploy)](https://github.com/virima-products/v6_feature_documentation/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vite.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220)](https://pnpm.io/)

---

## Overview

This repository is the **Virima V6 Feature Documentation website** — a React + Vite single-page application that serves manually curated product documentation across all Virima modules.

Documentation is written directly as GFM Markdown files. Navigation is driven by a master TOC (`src/pages/content/6_1/index.md`) which is the single source of truth for structure, ordering, and hierarchy.

---

## Content Pipeline

```
src/pages/content/6_1/index.md  (master TOC — hand-edited)
        ↓  pnpm sync-toc
src/data/navigationData.ts + src/utils/indexContentMap.ts
        ↓  pnpm build-doc-graph
public/doc-graph.json  (385 pages, 1045 edges — structural metadata)
        ↓  pnpm build-search-index
public/search-index.json  (385 entries — full-text search, all TOC pages)
        ↓  pnpm build  (vite)
dist/  →  GitHub Pages
```

### Key architectural decisions

- **Single source of truth**: `src/pages/content/6_1/index.md` defines all navigation hierarchy
- **Graph-driven navigation**: `public/doc-graph.json` loaded once per session; sidebar/breadcrumbs derived from it — no redundant fetches
- **Progressive disclosure**: L0 graph metadata → L1 section page lists → L2 page content
- **GFM only**: All content is plain Markdown (`.md`), rendered by `react-markdown` + `remark-gfm`
- **Relative base path**: `base: './'` — assets resolve correctly from GitHub Pages subdirectory

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5.5 (strict) |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Component library | Radix UI primitives + shadcn/ui patterns |
| Content format | GFM Markdown (`.md`) |
| Content renderer | `react-markdown` + `remark-gfm` + `rehype-sanitize` |
| Package manager | pnpm 9 |
| Runtime | Node.js ≥ 20 |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0

```bash
# Enable pnpm via corepack (recommended)
corepack enable
```

### Installation

```bash
git clone https://github.com/virima-products/v6_feature_documentation.git
cd v6_feature_documentation
pnpm install
pnpm dev
```

Development server starts at `http://localhost:3000/`

### Production build

```bash
pnpm build    # runs prebuild (sync-toc + doc-graph + search-index + sitemap) then vite build
pnpm preview  # serve the build at http://localhost:4173/
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with hot reload (port 3000) |
| `pnpm build` | Full production build (prebuild + vite) |
| `pnpm preview` | Preview production build locally (port 4173) |
| `pnpm typecheck` | TypeScript type check only |
| `pnpm validate` | Full suite: typecheck + security + setup + paths + retrieval integrity |
| `pnpm eval` | Run all documentation quality evals |
| `pnpm eval:search` | Run search quality eval suite (7 suites, 48 tests, 95% accuracy threshold) |
| `pnpm sync-toc` | Regenerate `navigationData.ts` + `indexContentMap.ts` from master TOC |
| `pnpm watch-toc` | Watch mode — auto-sync TOC on index.md changes |
| `pnpm build-doc-graph` | Build `public/doc-graph.json` from master TOC + content files |
| `pnpm build-search-index` | Build `public/search-index.json` (385 entries covering all TOC pages) |
| `pnpm check:toc` | Validate TOC→file alignment, navigation data, search index |
| `pnpm check:retrieval` | Run 26 static integrity guards for the retrieval pipeline |
| `pnpm check:paths` | Enforce path contract (no legacy paths, pnpm-only, etc.) |
| `pnpm check:env` | Verify `.env.local` configuration |
| `pnpm check:setup` | Verify repository structure completeness |
| `pnpm check:security` | Scan for hardcoded secrets |
| `pnpm memory:check` | Detect drift in `docs/memory/repo-memory.json` |
| `pnpm memory:update` | Update memory file after architectural changes |

---

## Project Structure

```
v6_feature_documentation/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR quality checks + build validation
│       └── deploy-pages.yml          # Production deploy → GitHub Pages
│
├── scripts/                          # Build-time scripts (TypeScript)
│   ├── sync-toc-from-index.ts        # Master TOC → navigationData.ts + indexContentMap.ts
│   ├── build-doc-graph.ts            # Master TOC + .md files → public/doc-graph.json
│   ├── build-search-index.ts         # doc-graph → public/search-index.json (385 entries)
│   ├── build-sitemap.ts              # Generates public/sitemap.xml + public/llms.txt
│   ├── watch-toc.ts                  # File watcher for TOC sync
│   ├── checks/                       # Validation scripts
│   │   ├── check-retrieval-integrity.ts  # 26 static guards for retrieval pipeline
│   │   ├── verify-toc-structure.ts   # TOC → file alignment
│   │   ├── verify-setup.ts           # Repository structure
│   │   ├── verify-paths.ts           # Path contract enforcement
│   │   └── verify-security.ts        # Secret scanning
│   ├── evals/                        # Documentation quality eval suites
│   │   ├── eval-search-quality.ts    # 48-test search behavioral regression suite
│   │   └── run-evals.ts              # Docs quality eval runner
│   └── memory/                       # Memory drift detection and update scripts
│
├── src/
│   ├── components/                   # React UI components
│   │   ├── DocumentationLayout.tsx   # Main layout with sidebar
│   │   ├── DocumentationContent.tsx  # Page content renderer
│   │   ├── MDXRenderer.tsx           # GFM markdown renderer (react-markdown)
│   │   ├── SearchDialog.tsx          # Enterprise search modal (docs + this-page scope)
│   │   └── ChatPanel.tsx             # Ask Virima chat panel
│   ├── data/
│   │   └── navigationData.ts         # AUTO-GENERATED by pnpm sync-toc — do not hand-edit
│   ├── lib/
│   │   ├── search/
│   │   │   └── docs-search.ts        # Core search engine (scoring, synonyms, module boost)
│   │   └── chat/
│   │       └── intent-detection.ts   # Zero-cost query classification (no LLM)
│   ├── utils/
│   │   ├── docGraph.ts               # Runtime graph client (L0/L1/L2 progressive disclosure)
│   │   ├── indexContentMap.ts        # AUTO-GENERATED by pnpm sync-toc — do not hand-edit
│   │   └── ...
│   └── pages/
│       └── content/
│           └── 6_1/
│               ├── index.md          # MASTER TOC — single source of truth for navigation
│               ├── admin_6_1/        # Admin module content files
│               ├── cmdb_6_1/         # CMDB module content files
│               ├── discovery_6_1/    # Discovery Scan module content files
│               ├── itsm_6_1/         # ITSM module content files
│               ├── release_notes_6_1/    # Release Notes module content files (11 pages)
│               ├── support_6_1/          # Support module content files (7 pages)
│               └── ...               # Other module directories
│
├── public/
│   ├── doc-graph.json                # BUILD ARTIFACT — 385 pages, 1045 edges
│   ├── search-index.json             # BUILD ARTIFACT — 385 unique search entries
│   ├── sitemap.xml                   # BUILD ARTIFACT — all TOC pages
│   └── llms.txt                      # LLM-readable site index (GEO/SEO)
│
├── docs/
│   ├── memory/repo-memory.json       # Architecture memory for AI agents
│   ├── reference/                    # Docsite blueprint and reference docs
│   ├── decisions/                    # Architectural decision records (ADRs)
│   │   ├── 2026-04-08-search-system-contract.md  # Search pipeline contract & guardrails
│   │   └── ...
│   └── operations/                   # Runbooks (rollback, incident response)
│
├── .claude/
│   ├── commands/                     # Claude slash commands
│   ├── settings.json                 # Hook guardrails (pnpm-only, generated-file protection)
│   └── settings.local.json           # Local permission overrides
│
├── CLAUDE.md                         # Authoritative operating guide for contributors and AI agents
├── vite.config.ts
├── package.json
└── pnpm-lock.yaml
```

---

## Content Authoring

### Adding a new page

1. Create the `.md` file at the correct path under `src/pages/content/6_1/`
2. Add an entry to the master TOC (`src/pages/content/6_1/index.md`):
   ```
   - Page Title → /content/6_1/{module}/{section}/{filename}.md
   ```
3. Sync navigation:
   ```bash
   pnpm sync-toc
   ```
4. Validate:
   ```bash
   pnpm check:toc
   pnpm validate
   ```

### Content format

- GFM Markdown, no frontmatter
- Feature docs must include: Overview, Add, Edit, Delete sections
- Headings use sentence case
- Internal links use relative paths
- No Confluence macro syntax

---

## Search System

The search experience is a fully client-side, zero-backend, deterministic full-text search over all 385 documentation pages.

### Architecture

| Component | File | Role |
|-----------|------|------|
| Search engine | `src/lib/search/docs-search.ts` | Scoring, synonyms, module boost |
| Search UI | `src/components/SearchDialog.tsx` | Modal, scope selector, keyboard nav |
| Index builder | `scripts/build-search-index.ts` | Generates `search-index.json` at build time |
| Search index | `public/search-index.json` | 385 entries — title, headings, excerpt, breadcrumb |

### Query pipeline (6 steps, deterministic)

```
1. Tokenise → stop-word filter → effective terms
2. Synonym expansion (additive — originals kept): sr→service request, ci→configuration item, vm→vulnerability management, ...
3. Module boost detection: first term matching MODULE_BOOST_SIGNALS → +20 to matching module
4. Score all entries: title(100/60/40) + heading(25) + breadcrumb(15) + module(10) + excerpt(5)
5. Sort descending by score
6. Cap at 12 results
```

### Search scopes

- **All docs** — async, index-based, 200ms debounce, covers all 385 pages
- **This page** — synchronous DOM traversal of `<article>` headings, instant, zero network

### Quality guarantees

- **26 static integrity guards** (`pnpm check:retrieval`) — prevent silent regression of stop-word filter, whole-word matching, synonym map, module boost, data contract
- **48 behavioral tests** (`pnpm eval:search`) — 7 suites: retrieval accuracy, stop-word filtering, ranking determinism, guardrail classification, token efficiency, synonyms/abbreviations, performance
- **95% accuracy threshold** — eval runner exits non-zero if fewer than 46/48 tests pass
- **Performance budget** — single query < 50ms; batch of 5 < 200ms

See `docs/decisions/2026-04-08-search-system-contract.md` for the full system contract, scoring model, and evolution rules.

### Search is strictly isolated from Ask Virima

- `SearchDialog` makes zero LLM API calls
- `ChatPanel` may call `searchDocs()` to retrieve context for grounded responses, but does not replace the search modal
- `classifyIntent()` routes queries with zero token cost (pure string matching)

---

## Validation

```bash
pnpm validate          # typecheck + security + setup + paths + retrieval integrity
pnpm check:toc         # TOC→file alignment, navigation data, search index
pnpm check:retrieval   # 26 static guards for the retrieval pipeline
pnpm eval              # documentation quality evals
pnpm eval:search       # 48-test search behavioral regression suite
pnpm build             # full production build (most thorough)
```

All checks must pass (exit 0) before merging to `main`.

---

## Deployment

Deployment is automatic via `deploy-pages.yml` on every push to `main`.

GitHub Pages must be configured to use **GitHub Actions** as the source (Settings → Pages → Source → GitHub Actions). No branch-based source is needed.

Local Docker preview (optional, for nginx config testing):
```bash
docker compose up --build
# Site available at: http://localhost:8080/v6_feature_documentation/
```

---

## Contributing

See [CLAUDE.md](CLAUDE.md) for the authoritative operating guide — architecture principles, naming conventions, allowed/prohibited edits, and quality gates.
