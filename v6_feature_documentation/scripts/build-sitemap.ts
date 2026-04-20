/**
 * build-sitemap.ts
 *
 * Build-time script that generates:
 *   public/sitemap.xml  — standard XML sitemap for search engines
 *   public/llms.txt     — AI discovery artifact (llmstxt.org format)
 *
 * Run via: pnpm build-sitemap
 * Integrated into: pnpm prebuild (runs before vite build)
 *
 * Both outputs are derived from navigationData.ts so they stay in sync
 * with the published navigation automatically — no manual maintenance needed.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SITE_URL = 'https://virima-products.github.io/v6_feature_documentation';
const SITE_NAME = 'Virima Documentation';
const SITE_DESCRIPTION =
  'Official documentation for the Virima V6 IT management platform — covering ITSM, CMDB, Discovery, ITAM, and Vulnerability Management.';

// ---------------------------------------------------------------------------
// Types — mirroring navigationData.ts shape
// ---------------------------------------------------------------------------

interface NavPage {
  id: string;
  label: string;
  path: string;
}

interface NavSection {
  id: string;
  label: string;
  pages: NavPage[];
}

interface FlatEntry {
  path: string;
  label: string;
  moduleLabel: string;
  sectionLabel: string;
}

// ---------------------------------------------------------------------------
// Load navigation map from navigationData.ts (regex parse — no Vite needed)
// ---------------------------------------------------------------------------

function loadFlatEntries(): FlatEntry[] {
  const navDataPath = join(process.cwd(), 'src', 'data', 'navigationData.ts');
  if (!existsSync(navDataPath)) {
    console.error(`navigationData.ts not found at ${navDataPath}`);
    process.exit(1);
  }

  const source = readFileSync(navDataPath, 'utf-8');

  // Extract module labels: { id: "admin", label: "Admin" }
  const moduleLabelMap = new Map<string, string>();
  for (const m of source.matchAll(/\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"\s*\}/g)) {
    moduleLabelMap.set(m[1]!, m[2]!);
  }

  // Extract section blocks (e.g. export const adminSections = [...])
  const sectionBlockRegex = /export\s+const\s+(\w+)Sections\s*=\s*\[([\s\S]*?)\];\s*\n/g;
  const pageRegex = /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*path:\s*"([^"]+)"\s*\}/g;

  const entries: FlatEntry[] = [];

  for (const block of source.matchAll(sectionBlockRegex)) {
    const moduleKey = block[1]!.toLowerCase(); // "admin" from "adminSections"
    const blockText = block[2]!;

    // Find sections inside the block
    const sectionRegex = /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)"[\s\S]*?pages:\s*\[([\s\S]*?)\]\s*\}/g;
    for (const sec of blockText.matchAll(sectionRegex)) {
      const sectionLabel = sec[2]!;
      const pagesText = sec[3]!;
      for (const p of pagesText.matchAll(pageRegex)) {
        entries.push({
          path: p[3]!,
          label: p[2]!,
          moduleLabel: moduleLabelMap.get(moduleKey) ?? moduleKey,
          sectionLabel,
        });
      }
    }

    // Fallback: if no sections found, extract pages directly
    if (![...blockText.matchAll(sectionRegex)].length) {
      for (const p of blockText.matchAll(pageRegex)) {
        entries.push({
          path: p[3]!,
          label: p[2]!,
          moduleLabel: moduleLabelMap.get(moduleKey) ?? moduleKey,
          sectionLabel: '',
        });
      }
    }
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Build sitemap.xml
// ---------------------------------------------------------------------------

function buildSitemap(entries: FlatEntry[], buildDate: string): string {
  const homeUrl = SITE_URL;

  const pageUrls = entries.map(e => {
    const fullUrl = `${SITE_URL}/${e.path}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${homeUrl}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${pageUrls.join('\n')}
</urlset>
`;
}

// ---------------------------------------------------------------------------
// Build llms.txt  (llmstxt.org format)
// ---------------------------------------------------------------------------

function buildLlmsTxt(entries: FlatEntry[]): string {
  // Group by module
  const moduleMap = new Map<string, FlatEntry[]>();
  for (const e of entries) {
    if (!moduleMap.has(e.moduleLabel)) moduleMap.set(e.moduleLabel, []);
    moduleMap.get(e.moduleLabel)!.push(e);
  }

  const sections: string[] = [];
  for (const [moduleLabel, pages] of moduleMap) {
    const links = pages.map(p => `- [${p.label}](${SITE_URL}/${p.path})`).join('\n');
    sections.push(`## ${moduleLabel}\n\n${links}`);
  }

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

This file follows the llmstxt.org standard for AI system discovery.

## About

- [Home](${SITE_URL})
- [Virima Website](https://virima.com)
- [Virima Support](https://support.virima.com)

${sections.join('\n\n')}
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const entries = loadFlatEntries();
  const buildDate = new Date().toISOString().split('T')[0]!;

  // sitemap.xml
  const sitemapXml = buildSitemap(entries, buildDate);
  const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`sitemap.xml: ${entries.length + 1} URLs → ${sitemapPath}`);

  // llms.txt
  const llmsTxt = buildLlmsTxt(entries);
  const llmsPath = join(process.cwd(), 'public', 'llms.txt');
  writeFileSync(llmsPath, llmsTxt, 'utf-8');
  console.log(`llms.txt: ${entries.length} pages → ${llmsPath}`);
}

main();
