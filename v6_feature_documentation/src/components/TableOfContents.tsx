import { useState, useEffect } from 'react';
import { extractHeadingsFromDOM, ensureHeadingIds, createHeadingObserver } from '../utils/extractHeadings';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items?: TOCItem[];
  autoExtract?: boolean;
}

export function TableOfContents({ items, autoExtract = true }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TOCItem[]>(items || []);

  // Auto-extract headings from DOM if enabled and no manual items provided
  useEffect(() => {
    if (autoExtract && (!items || items.length === 0)) {
      // Small delay to ensure content is fully rendered
      const timer = setTimeout(() => {
        // Ensure all headings have IDs first
        ensureHeadingIds();

        // Initial extraction
        const extractedHeadings = extractHeadingsFromDOM();
        setTocItems(extractedHeadings);

        // Set up observer for dynamic content changes
        const observer = createHeadingObserver((headings) => {
          setTocItems(headings);
        });

        return () => observer.disconnect();
      }, 100);

      return () => clearTimeout(timer);
    } else if (items) {
      setTocItems(items);
    }
  }, [items, autoExtract]);

  // Intersection Observer to track which heading is in view
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const headingElements = document.querySelectorAll('h2[id], h3[id], h4[id]');
    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  return (
    <div>
      <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          {/* "On this page" icon — three horizontal lines, top/bottom longer, middle shorter */}
          <svg
            aria-hidden="true"
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            className="flex-shrink-0 text-slate-500 dark:text-slate-400"
          >
            <rect x="0" y="0" width="14" height="2" rx="1" fill="currentColor" />
            <rect x="2" y="5" width="10" height="2" rx="1" fill="currentColor" />
            <rect x="0" y="10" width="14" height="2" rx="1" fill="currentColor" />
          </svg>
          On this page
        </h4>
      </div>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm py-1.5 px-2 rounded transition-colors ${
              item.level === 2 ? 'pl-2' : item.level === 3 ? 'pl-4' : 'pl-8'
            } ${
              activeId === item.id
                ? 'nav-item-active text-green-600 dark:text-green-400 font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/20'
            }`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(item.id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                  window.history.pushState(null, '', `#${item.id}`);
                }, 100);
              }
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
