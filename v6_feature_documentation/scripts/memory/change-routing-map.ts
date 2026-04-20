/**
 * change-routing-map.ts
 *
 * Authoritative mapping from repo file changes → memory/skill/hook artifacts that need updating.
 *
 * Used by:
 *   - scripts/memory/check-memory-drift.ts  (drift detection)
 *   - .claude/commands/sync-repo-memory.md  (guided update skill)
 *   - docs/memory/README.md                 (operator reference)
 *
 * Design rules:
 *   - trackedFiles are real paths relative to repo root (not globs) for deterministic matching
 *   - memorySections are top-level keys in docs/memory/repo-memory.json
 *   - severity: critical = block release, important = update before next session, low = update at convenience
 *   - A "trivial refactor" rule at the bottom captures files that never need memory updates
 */

export interface SupportingArtifact {
  /** Path relative to repo root */
  file: string;
  /** Human-readable condition under which this file also needs updating */
  condition: string;
}

export interface RoutingRule {
  /** Unique short identifier for this rule */
  id: string;
  /** Human-readable change category label */
  category: string;
  /** What kind of change triggers this rule */
  description: string;
  /** Actual file paths relative to repo root that, when changed, trigger this rule */
  trackedFiles: string[];
  /** Top-level keys in repo-memory.json to update */
  memorySections: string[];
  /** Other artifact files that may also need updating */
  supportingArtifacts: SupportingArtifact[];
  /** How urgent the memory update is */
  severity: 'critical' | 'important' | 'low';
}

export const ROUTING_RULES: RoutingRule[] = [
  // ─── Layout / Shell Architecture ──────────────────────────────────────────
  {
    id: 'layout-architecture',
    category: 'Architecture / Page Shell',
    description: 'Page shell layout, flex structure, header/sidebar/main arrangement, reading width',
    trackedFiles: [
      'src/components/DocumentationLayout.tsx',
      'src/components/DocumentationContent.tsx',
      'src/components/DocumentationHeader.tsx',
    ],
    memorySections: ['layout_contracts', 'website_functional_specs', 'enterprise_capabilities'],
    supportingArtifacts: [
      { file: 'docs/memory/README.md', condition: 'Layout architecture changed significantly (e.g. new shell component or reading width change)' },
    ],
    severity: 'critical',
  },

  // ─── Navigation (Left Sidebar) ────────────────────────────────────────────
  {
    id: 'navigation-sidebar',
    category: 'Navigation / Left Sidebar',
    description: 'Section/page/subpage expand-collapse tree, active state, module selector, hover states',
    trackedFiles: [
      'src/components/NavigationMenu.tsx',
      'src/components/ResizableSidebar.tsx',
    ],
    memorySections: ['navigation_contract', 'website_functional_specs'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── TOC (Right Rail) ─────────────────────────────────────────────────────
  {
    id: 'toc-right-rail',
    category: 'TOC / Right Rail',
    description: 'Auto-extract headings, active tracking, placement, scroll behavior',
    trackedFiles: [
      'src/components/TableOfContents.tsx',
    ],
    memorySections: ['toc_contract', 'website_functional_specs'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Theme / Dark Mode / Branding ─────────────────────────────────────────
  {
    id: 'theme-branding',
    category: 'Theme / Dark Mode / Branding',
    description: 'CSS custom properties, dark mode mechanism, Virima brand colors, font, table colors',
    trackedFiles: [
      'src/styles/globals.css',
      'src/index.css',
    ],
    memorySections: ['theme_and_branding', 'dark_mode_contrast', 'layout_contracts'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Content Rendering ────────────────────────────────────────────────────
  {
    id: 'content-rendering',
    category: 'Content Rendering',
    description: 'Markdown/MDX rendering, heading IDs, code blocks, inline code, blockquotes, links',
    trackedFiles: [
      'src/components/MDXRenderer.tsx',
      'src/components/MDXContent.tsx',
    ],
    memorySections: ['content_rendering_rules', 'dark_mode_contrast'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Table Rendering ──────────────────────────────────────────────────────
  {
    id: 'table-rendering',
    category: 'Table Rendering',
    description: 'Virima table CSS, TH alignment, dark mode table colors, stripe rows',
    trackedFiles: [
      'src/styles/globals.css',
    ],
    memorySections: ['table_rendering_rules', 'theme_and_branding'],
    supportingArtifacts: [],
    severity: 'low',
  },

  // ─── Image Rules ──────────────────────────────────────────────────────────
  {
    id: 'image-rules',
    category: 'Image Asset Rules',
    description: 'Image path resolution, OptimizedImage component, lazy load, alt text, copy plugin',
    trackedFiles: [
      'src/components/ui/OptimizedImage.tsx',
      'src/utils/imagePathResolver.ts',
      'vite.config.ts',
    ],
    memorySections: ['image_asset_rules', 'content_rendering_rules'],
    supportingArtifacts: [],
    severity: 'low',
  },

  // ─── Homepage / Cards ─────────────────────────────────────────────────────
  {
    id: 'homepage-cards',
    category: 'Homepage / Module Cards',
    description: 'Cover page, module card grid, card click routing, enterprise hero layout',
    trackedFiles: [
      'src/components/HomePage.tsx',
      'src/components/homePageConfig.ts',
      'src/components/CoverPage.tsx',
    ],
    memorySections: ['homepage_cards', 'website_functional_specs'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Search ───────────────────────────────────────────────────────────────
  {
    id: 'search-capabilities',
    category: 'Search / AI Search',
    description: 'AISearchDialog, search orchestrator, chat panel, KB browser',
    trackedFiles: [
      'src/components/AISearchDialog.tsx',
      'src/lib/search/search-orchestrator.ts',
      'src/lib/search/config.ts',
    ],
    memorySections: ['search_capabilities'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Versioning / Version Dropdown ────────────────────────────────────────
  {
    id: 'versioning-dropdown',
    category: 'Versioning / Version Dropdown',
    description: 'Version selector location, active versions, version-in-URL, version map',
    trackedFiles: [
      'src/components/DocumentationHeader.tsx',
      'src/components/DocumentationContent.tsx',
    ],
    memorySections: ['versioning_and_dropdown_behavior'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Breadcrumbs / URL Management ─────────────────────────────────────────
  {
    id: 'breadcrumbs-url',
    category: 'Breadcrumbs / URL Management',
    description: 'Breadcrumb builder, hash routing, URL structure, module/section/page in URL',
    trackedFiles: [
      'src/utils/hierarchicalTocLoader.ts',
      'src/utils/tocPathResolver.ts',
      'src/components/MDXContent.tsx',
    ],
    memorySections: ['url_management', 'website_functional_specs'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Content Loading ──────────────────────────────────────────────────────
  {
    id: 'content-loading',
    category: 'Runtime Content Loading',
    description: 'Content loader strategy, fetch paths, caching, version context, scroll reset',
    trackedFiles: [
      'src/lib/content/contentLoader.ts',
      'src/lib/content/registry.ts',
    ],
    memorySections: ['runtime_content_loading'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Generation Pipeline ──────────────────────────────────────────────────
  {
    id: 'generation-pipeline',
    category: 'Generation Pipeline',
    description: 'PRD-to-feature-doc stages, exit codes, skip rules, manifest format',
    trackedFiles: [
      'scripts/generate-feature-doc.ts',
      'scripts/path-mapping.ts',
      'scripts/validate-generation.ts',
    ],
    memorySections: ['generation_pipeline', 'deliverable_decision_engine', 'generation_manifests'],
    supportingArtifacts: [
      { file: '.claude/commands/repo-maintainer.md', condition: 'Pipeline stages or skip rules changed' },
    ],
    severity: 'critical',
  },

  // ─── Publishing / TOC Sync ────────────────────────────────────────────────
  {
    id: 'publishing-toc-sync',
    category: 'Publishing / TOC Sync',
    description: 'sync-toc-from-index reads index.md → navigationData.ts + indexContentMap.ts',
    trackedFiles: [
      'scripts/sync-toc-from-index.ts',
    ],
    memorySections: ['publishing_contract'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── Build Config ─────────────────────────────────────────────────────────
  {
    id: 'build-config',
    category: 'Build Config / Vite',
    description: 'Vite base path, custom plugins, output dir, dev/preview server',
    trackedFiles: [
      'vite.config.ts',
    ],
    memorySections: ['repo_contracts', 'tooling_and_build', 'enterprise_capabilities'],
    supportingArtifacts: [
      { file: 'docs/memory/README.md', condition: 'Base path or output directory changed' },
    ],
    severity: 'critical',
  },

  // ─── Package Manager / Node / TypeScript ──────────────────────────────────
  {
    id: 'tooling-contracts',
    category: 'Tooling Contracts',
    description: 'pnpm version, Node version minimum, TypeScript version, key scripts',
    trackedFiles: [
      'package.json',
    ],
    memorySections: ['repo_contracts', 'tooling_and_build'],
    supportingArtifacts: [],
    severity: 'important',
  },

  // ─── CI/CD Workflows ──────────────────────────────────────────────────────
  {
    id: 'ci-cd-workflows',
    category: 'CI/CD Workflows',
    description: 'Generation workflow, CI pipeline, deploy targets, job names',
    trackedFiles: [
      '.github/workflows/generate-v6feature-docs.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/deploy-pages.yml',
    ],
    memorySections: ['ci_cd_contracts', 'generation_pipeline'],
    supportingArtifacts: [
      { file: '.claude/commands/repo-maintainer.md', condition: 'Generation workflow steps or trigger conditions changed' },
    ],
    severity: 'critical',
  },

  // ─── Validation Gates ─────────────────────────────────────────────────────
  {
    id: 'validation-gates',
    category: 'Validation Gates',
    description: 'Scripts under scripts/checks/, check commands, gate colors',
    trackedFiles: [
      'scripts/checks/verify-setup.ts',
      'scripts/checks/verify-security.ts',
      'scripts/checks/check-env.ts',
    ],
    memorySections: ['validation_gates'],
    supportingArtifacts: [
      { file: 'docs/memory/README.md', condition: 'New gate added or gate command changed' },
    ],
    severity: 'important',
  },

  // ─── Memory Sync System ───────────────────────────────────────────────────
  {
    id: 'memory-sync-system',
    category: 'Memory Sync System',
    description: 'Drift detector, routing map, update helper, sync skill, JSON schema',
    trackedFiles: [
      'scripts/memory/check-memory-drift.ts',
      'scripts/memory/change-routing-map.ts',
      'scripts/memory/update-memory.ts',
      '.claude/commands/sync-repo-memory.md',
      'docs/memory/repo-memory.schema.json',
    ],
    memorySections: ['memory_sync'],
    supportingArtifacts: [
      { file: 'docs/memory/README.md', condition: 'Any change to how the sync system works' },
    ],
    severity: 'important',
  },

  // ─── Operating Rules / Skills / Hooks ─────────────────────────────────────
  {
    id: 'claude-skills-hooks',
    category: 'Claude Skills / Hooks / Operating Rules',
    description: 'Repo-maintainer skill, settings.local.json hooks, other Claude commands',
    trackedFiles: [
      '.claude/commands/repo-maintainer.md',
    ],
    memorySections: ['maintenance_guidance'],
    supportingArtifacts: [
      { file: 'docs/memory/README.md', condition: 'Hook behavior or skill steps changed' },
    ],
    severity: 'low',
  },
];

/**
 * Files whose changes NEVER require a memory update.
 * Trivial refactors, test updates, and generated artifacts are excluded.
 */
export const TRIVIAL_FILE_PATTERNS: string[] = [
  'src/pages/content/',        // pipeline-generated docs — changes tracked by manifests, not memory
  'src/data/navigationData.ts', // auto-generated from index.md
  'src/utils/indexContentMap.ts', // auto-generated from index.md
  'src/lib/imports/',          // auto-generated static import maps
  'src/assets/',               // image assets — not contract-relevant
  'dist/',                     // build output
  'node_modules/',             // dependencies
  '.cache/',                   // tool caches
  'pnpm-lock.yaml',            // lockfile changes are not contract changes
  'scripts/__tests__/',        // test updates — no memory needed
  'docs/plans/',               // plans are documentation, not contracts
  'docs/archive/',             // archived content
];

/**
 * Value cross-checks — specific values that can be extracted from code
 * and compared against what repo-memory.json says they should be.
 */
export interface ValueCheck {
  id: string;
  description: string;
  /** Path to source file */
  sourceFile: string;
  /** Key path in repo-memory.json (dot-separated) */
  memoryPath: string;
  /** Regex to extract value from source file (capture group 1 = value) */
  extractPattern: string;
}

export const VALUE_CHECKS: ValueCheck[] = [
  {
    id: 'package-manager-version',
    description: 'pnpm version in package.json matches memory',
    sourceFile: 'package.json',
    memoryPath: 'repo_contracts.package_manager_version',
    extractPattern: '"packageManager":\\s*"pnpm@([^"]+)"',
  },
  {
    id: 'node-version-minimum',
    description: 'Node version minimum in package.json engines matches memory',
    sourceFile: 'package.json',
    memoryPath: 'repo_contracts.node_version_minimum',
    extractPattern: '"node":\\s*">=([^"]+)"',
  },
  {
    id: 'vite-base-path',
    description: 'Vite base path in vite.config.ts matches memory',
    sourceFile: 'vite.config.ts',
    memoryPath: 'repo_contracts.base_path',
    extractPattern: "base:\\s*['\"]([^'\"]+)['\"]",
  },
  {
    id: 'generation-workflow-file',
    description: 'Generation workflow file name matches memory ci_cd_contracts',
    sourceFile: '.github/workflows/generate-v6feature-docs.yml',
    memoryPath: 'ci_cd_contracts.generation_workflow',
    extractPattern: '^(.+)$',  // just checks the file exists
  },
];
