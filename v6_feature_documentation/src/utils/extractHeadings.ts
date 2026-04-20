/**
 * Utility to dynamically extract headings from page content
 * for automatic Table of Contents generation
 */

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extracts all h2 and h3 headings from the current page DOM
 * and returns them as TOC items
 */
export function extractHeadingsFromDOM(): HeadingItem[] {
  const headings: HeadingItem[] = [];
  
  // Select all h2 and h3 elements within the main content area
  const contentArea = document.querySelector('main');
  if (!contentArea) return headings;
  
  const headingElements = contentArea.querySelectorAll('h2, h3');
  
  headingElements.forEach((heading) => {
    // Skip headings that are inside cards or non-structural elements
    const isInsideCard = heading.closest('[class*="grid"], [class*="card"]');
    const isStructural = heading.id || !isInsideCard;
    
    if (!isStructural) return;
    
    // Skip if no id (we'll add IDs dynamically if needed)
    let id = heading.id;
    if (!id) {
      // Generate ID from text content
      id = heading.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || '';
      
      // Set the ID on the element for navigation
      if (id) {
        heading.id = id;
      }
    }
    
    const text = heading.textContent?.trim() || '';
    const level = parseInt(heading.tagName.substring(1)); // Extract number from 'H2' or 'H3'
    
    if (id && text) {
      headings.push({ id, text, level });
    }
  });
  
  return headings;
}

/**
 * Creates a MutationObserver to watch for content changes
 * and update TOC accordingly
 */
export function createHeadingObserver(
  callback: (headings: HeadingItem[]) => void
): MutationObserver {
  const observer = new MutationObserver(() => {
    const headings = extractHeadingsFromDOM();
    callback(headings);
  });
  
  const contentArea = document.querySelector('main');
  if (contentArea) {
    observer.observe(contentArea, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
  
  return observer;
}

/**
 * Generate a slug from text (for heading IDs)
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Ensure all headings in the content have IDs
 * This is run once when content is loaded
 */
export function ensureHeadingIds(): void {
  const contentArea = document.querySelector('main');
  if (!contentArea) return;
  
  const headings = contentArea.querySelectorAll('h2, h3, h4');
  
  headings.forEach((heading) => {
    if (!heading.id && heading.textContent) {
      const slug = generateSlug(heading.textContent);
      if (slug) {
        heading.id = slug;
      }
    }
  });
}