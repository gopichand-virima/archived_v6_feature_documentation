/**
 * MDX Test Utilities
 * 
 * Utilities for testing and validating MDX content rendering
 */

export interface MDXTestResult {
  filePath: string;
  success: boolean;
  contentLength: number;
  hasHeadings: boolean;
  hasLists: boolean;
  hasLinks: boolean;
  hasImages: boolean;
  hasCodeBlocks: boolean;
  hasTables: boolean;
  error?: string;
}

/**
 * Analyzes MDX content to determine what markdown features it contains
 */
export function analyzeMDXContent(content: string): Omit<MDXTestResult, 'filePath' | 'success' | 'error'> {
  return {
    contentLength: content.length,
    hasHeadings: /^#{1,6}\s+.+/m.test(content),
    hasLists: /^[\s]*[-*+]\s+/m.test(content) || /^[\s]*\d+\.\s+/m.test(content),
    hasLinks: /\[.+\]\(.+\)/.test(content),
    hasImages: /!\[.*\]\(.+\)/.test(content),
    hasCodeBlocks: /```[\s\S]*?```/.test(content) || /`[^`]+`/.test(content),
    hasTables: /\|.+\|/.test(content),
  };
}

/**
 * Test sample files from version 6_1 content
 */
export const test61Files = [
  {
    path: '/content/6_1/admin_6_1/about_admin_6_1.md',
    description: 'Admin module overview',
    expectedFeatures: ['headings', 'lists', 'links'],
  },
  {
    path: '/content/6_1/admin_6_1/admin/admin_functions_v6_6_1.md',
    description: 'Admin functions with images',
    expectedFeatures: ['headings', 'images', 'links'],
  },
  {
    path: '/content/6_1/cmdb_6_1/cmdb_overview_6_1.md',
    description: 'CMDB overview',
    expectedFeatures: ['headings', 'lists'],
  },
  {
    path: '/content/6_1/discovery_6_1/about_discovery_scan_6_1.md',
    description: 'Discovery scan overview',
    expectedFeatures: ['headings', 'lists', 'links'],
  },
  {
    path: '/content/6_1/itam_6_1/about_itam_6_1.md',
    description: 'ITAM overview',
    expectedFeatures: ['headings', 'lists'],
  },
  {
    path: '/content/6_1/itsm_6_1/about_itsm_6_1.md',
    description: 'ITSM overview',
    expectedFeatures: ['headings', 'lists'],
  },
];

/**
 * Generates a markdown test document with all supported features
 */
export function generateTestMarkdown(): string {
  return `# Main Heading (H1)

This is a paragraph with **bold text**, *italic text*, and \`inline code\`.

## Secondary Heading (H2)

This section demonstrates various markdown features.

### Lists (H3)

Unordered list:
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered list:
1. First step
2. Second step
3. Third step

### Links and Images

Here's a [link to Virima](https://www.virima.com) and an internal [documentation link](/admin/overview).

![Sample Image](https://via.placeholder.com/600x300)

### Code Blocks

Inline code: \`const x = 10;\`

Block code:
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('Virima');
\`\`\`

### Tables

| Feature | Status | Version |
|---------|--------|---------|
| MDX Rendering | ✅ Active | 6.1 |
| Syntax Highlighting | ✅ Active | 6.1 |
| GFM Support | ✅ Active | 6.1 |

### Blockquotes

> This is a blockquote with important information.
> It can span multiple lines.

### Horizontal Rule

---

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Additional Features

**Strong emphasis** and *emphasis* work great.

---

## Conclusion

This test document contains all major markdown features supported by the MDX renderer.
`;
}

/**
 * Validates that rendered HTML contains expected elements
 */
export function validateRenderedHTML(html: string): {
  hasHeaders: boolean;
  hasParagraphs: boolean;
  hasLists: boolean;
  hasLinks: boolean;
  hasCodeBlocks: boolean;
  hasTables: boolean;
} {
  return {
    hasHeaders: /<h[1-6]/.test(html),
    hasParagraphs: /<p/.test(html),
    hasLists: /<ul|<ol/.test(html),
    hasLinks: /<a/.test(html),
    hasCodeBlocks: /<code/.test(html) || /<pre/.test(html),
    hasTables: /<table/.test(html),
  };
}
