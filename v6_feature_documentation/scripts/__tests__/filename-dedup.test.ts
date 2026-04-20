/**
 * filename-dedup.test.ts
 *
 * Unit tests for generateFilename() suffix and prefix deduplication.
 * Run with: npx tsx --test scripts/__tests__/filename-dedup.test.ts
 *
 * These tests verify that when a feature name already contains a word that
 * the filename pattern would also append/prepend, the duplicate is collapsed.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateFilename } from '../prompts.js';

describe('generateFilename — suffix deduplication', () => {
  it('deduplicates -administration suffix when feature name ends with "Administration"', () => {
    // slug='cmdb-administration', pattern='{slug}-administration.md'
    // → 'cmdb-administration-administration.md' → 'cmdb-administration.md'
    assert.equal(generateFilename('CMDB Administration', 'admin-guide'), 'cmdb-administration.md');
  });

  it('deduplicates -overview suffix when feature name ends with "Overview"', () => {
    // slug='dashboard-overview', pattern='{slug}-overview.md'
    // → 'dashboard-overview-overview.md' → 'dashboard-overview.md'
    assert.equal(generateFilename('Dashboard Overview', 'concept-overview'), 'dashboard-overview.md');
  });

  it('deduplicates -integration suffix when feature name ends with "Integration"', () => {
    // slug='aws-connector-integration', pattern='{slug}-integration.md'
    // → 'aws-connector-integration-integration.md' → 'aws-connector-integration.md'
    assert.equal(generateFilename('AWS Connector Integration', 'integration-guide'), 'aws-connector-integration.md');
  });

  it('deduplicates -api-reference suffix when feature name ends with "API Reference"', () => {
    // slug='asset-api-reference', pattern='{slug}-api-reference.md'
    // → 'asset-api-reference-api-reference.md' → 'asset-api-reference.md'
    assert.equal(generateFilename('Asset API Reference', 'api-docs'), 'asset-api-reference.md');
  });

  it('deduplicates -best-practices suffix when feature name ends with "Best Practices"', () => {
    // slug='security-best-practices', pattern='{slug}-best-practices.md'
    // → 'security-best-practices-best-practices.md' → 'security-best-practices.md'
    assert.equal(generateFilename('Security Best Practices', 'best-practices'), 'security-best-practices.md');
  });

  it('does not modify filenames with no duplication', () => {
    assert.equal(generateFilename('Image Gallery', 'admin-guide'), 'image-gallery-administration.md');
    assert.equal(generateFilename('AWS Connector', 'integration-guide'), 'aws-connector-integration.md');
    assert.equal(generateFilename('Scan History', 'concept-overview'), 'scan-history-overview.md');
  });
});

describe('generateFilename — prefix deduplication', () => {
  it('deduplicates troubleshooting- prefix when feature name starts with "Troubleshooting"', () => {
    // slug='troubleshooting-tools', pattern='troubleshooting-{slug}.md'
    // → 'troubleshooting-troubleshooting-tools.md' → 'troubleshooting-tools.md'
    assert.equal(generateFilename('Troubleshooting Tools', 'troubleshooting'), 'troubleshooting-tools.md');
  });

  it('deduplicates using- prefix when feature name starts with "Using"', () => {
    // slug='using-reports', pattern='using-{slug}.md'
    // → 'using-using-reports.md' → 'using-reports.md'
    assert.equal(generateFilename('Using Reports', 'user-guide'), 'using-reports.md');
  });

  it('deduplicates getting-started-with- prefix when feature name starts with "Getting Started With"', () => {
    // slug='getting-started-with-asset-management', pattern='getting-started-with-{slug}.md'
    // → 'getting-started-with-getting-started-with-asset-management.md'
    // → 'getting-started-with-asset-management.md'
    assert.equal(
      generateFilename('Getting Started With Asset Management', 'feature-walkthrough'),
      'getting-started-with-asset-management.md',
    );
  });

  it('does not modify normal how-to guide filenames', () => {
    // slug='image-gallery', pattern='using-{slug}.md' → 'using-image-gallery.md' (no dedup)
    assert.equal(generateFilename('Image Gallery', 'user-guide'), 'using-image-gallery.md');
    assert.equal(generateFilename('Scan Tools', 'troubleshooting'), 'troubleshooting-scan-tools.md');
  });
});

describe('generateFilename — no false positives', () => {
  it('does not deduplicate partial word matches', () => {
    // "Administrators" slugifies to "administrators", not "administration"
    // pattern = '{slug}-administration.md' → 'administrators-administration.md' (no dedup)
    assert.equal(generateFilename('Administrators', 'admin-guide'), 'administrators-administration.md');
  });

  it('returns lowercase hyphenated filenames', () => {
    const result = generateFilename('IT Asset Management', 'user-guide');
    assert.match(result, /^[a-z0-9-]+\.md$/);
  });
});
