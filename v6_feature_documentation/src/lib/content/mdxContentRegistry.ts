/**
 * MDX Content Registry
 * 
 * This is a manual registry for MDX content that works around
 * Figma Make's limitations with dynamic imports.
 * 
 * IMPORTANT: This file should be auto-generated or manually populated
 * with actual MDX file content. For now, it serves as a fallback.
 */

// Registry of MDX file contents
const contentRegistry: Record<string, string> = {};

/**
 * Register MDX content
 */
export function registerContent(filePath: string, content: string): void {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  contentRegistry[normalizedPath] = content;
  console.log(`📝 [Registry] Registered: ${normalizedPath}`);
}

/**
 * Get MDX content from registry
 */
export function getRegisteredContent(filePath: string): string | null {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return contentRegistry[normalizedPath] || null;
}

/**
 * Check if content is registered
 */
export function isContentRegistered(filePath: string): boolean {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return normalizedPath in contentRegistry;
}

/**
 * Get all registered paths
 */
export function getRegisteredPaths(): string[] {
  return Object.keys(contentRegistry);
}

/**
 * Get registry size
 */
export function getRegistrySize(): number {
  return Object.keys(contentRegistry).length;
}

/**
 * Unregister MDX content (remove from registry)
 * Useful when switching from placeholder to actual file content
 */
export function unregisterContent(filePath: string): void {
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  if (normalizedPath in contentRegistry) {
    delete contentRegistry[normalizedPath];
    console.log(`🗑️ [Registry] Unregistered: ${normalizedPath}`);
  }
}

// Example of how to register content:
// registerContent('/content/6_1/admin_6_1/admin_org_details/departments_6_1.md', `
// # Departments
// 
// This is the departments content...
// `);

console.log('📦 [Registry] MDX Content Registry initialized');
