import { useMemo, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Sanitization schema: extends defaultSchema to allow className, style, and
// trusted video embeds (Vimeo/YouTube iframes). All event handlers remain blocked.
const SANITIZE_SCHEMA = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'iframe',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'style',
    ],
    code: [
      ...(defaultSchema.attributes?.['code'] ?? []),
      'className',
    ],
    span: [
      ...(defaultSchema.attributes?.['span'] ?? []),
      'className',
      'style',
    ],
    div: [
      ...(defaultSchema.attributes?.['div'] ?? []),
      'className',
      'style',
    ],
    iframe: [
      'src',
      'title',
      'frameBorder',
      'frameborder',
      'allow',
      'allowFullScreen',
      'allowfullscreen',
      'referrerPolicy',
      'referrerpolicy',
      'style',
      'width',
      'height',
    ],
  },
};
// @ts-expect-error no type declarations for react-syntax-highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error no type declarations for react-syntax-highlighter
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateSlug } from '../utils/extractHeadings';
import { OptimizedImage } from './ui/OptimizedImage';
import { resolveImagePath } from '../utils/imagePathResolver';
import { convertMDXPathToRoute, isRelativeMDXPath } from '../utils/mdxLinkConverter';

/**
 * Link component that converts relative MDX paths to navigation routes
 */
function MDXLink({ href, children, filePath, ...props }: { href?: string; children: React.ReactNode; filePath?: string; [key: string]: any }) {
  const isExternal = href?.startsWith('http');
  const [finalHref, setFinalHref] = useState(href || '');
  
  useEffect(() => {
    if (href && !isExternal && isRelativeMDXPath(href)) {
      convertMDXPathToRoute(href, filePath).then((convertedRoute) => {
        if (convertedRoute) {
          setFinalHref(convertedRoute);
          console.log(`[MDXRenderer] Converted link: ${href} → ${convertedRoute}`);
        } else {
          setFinalHref(href); // Keep original if conversion fails
          console.warn(`[MDXRenderer] Failed to convert link: ${href}`);
        }
      }).catch((error) => {
        console.error(`[MDXRenderer] Error converting link: ${href}`, error);
        setFinalHref(href); // Keep original on error
      });
    } else {
      setFinalHref(href || '');
    }
  }, [href, filePath, isExternal]);
  
  return (
    <a 
      href={finalHref}
      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline decoration-emerald-300 dark:decoration-emerald-600 hover:decoration-emerald-500 transition-colors"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

interface MDXRendererProps {
  content: string;
  className?: string;
  filePath?: string; // Optional file path for resolving relative image paths
}

/**
 * MDXRenderer - Enhanced Markdown/MDX rendering component
 * 
 * Features:
 * - Full GitHub Flavored Markdown (GFM) support
 * - Syntax highlighting for code blocks
 * - Auto-generated heading IDs for anchor links
 * - Responsive tables
 * - Custom styled components
 * - HTML support via rehype-raw
 */
export function MDXRenderer({ content, className = '', filePath }: MDXRendererProps) {
  // Memoize the rendered content to avoid unnecessary re-renders
  const renderedContent = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, SANITIZE_SCHEMA]]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, className, children, ...props }) {
            const inline = (props as { inline?: boolean }).inline;
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg !my-6"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            ) : (
              <code 
                className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[0.875em] font-mono dark:text-slate-200"
                style={{ color: 'var(--accent-foreground)' }}
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Headings with auto-generated IDs
          h1: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h1 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-3xl mb-6" 
                {...props}
              >
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h2 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-2xl mt-12 mb-6" 
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h3 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-xl mt-8 mb-4" 
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h4 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-lg mt-6 mb-3" 
                {...props}
              >
                {children}
              </h4>
            );
          },
          h5: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h5 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-base mt-4 mb-2" 
                {...props}
              >
                {children}
              </h5>
            );
          },
          h6: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateSlug(text);
            return (
              <h6 
                id={id} 
                className="scroll-mt-24 text-slate-900 dark:text-white font-bold text-sm mt-4 mb-2" 
                {...props}
              >
                {children}
              </h6>
            );
          },
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4" {...props} />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="mb-6 space-y-2 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-6 space-y-2 list-decimal pl-6" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-slate-700 dark:text-slate-300 leading-relaxed" {...props} />
          ),
          
          // Links - Convert relative MDX paths to navigation routes
          a: ({ node, href, children, ...props }) => {
            return <MDXLink href={href} filePath={filePath} {...props}>{children}</MDXLink>;
          },
          
          // Emphasis and strong
          em: ({ node, ...props }) => (
            <em className="italic text-slate-700 dark:text-slate-300" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-emerald-500 pl-6 pr-4 py-2 my-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-r-lg italic text-slate-700 dark:text-slate-300"
              {...props} 
            />
          ),
          
          // Tables - Enhanced with better performance and styling
          table: ({ node, children, ...props }) => {
            // Count rows in tbody for performance optimization
            let rowCount = 0;
            try {
              if (node && 'children' in node) {
                const tbody = Array.isArray(node.children) 
                  ? node.children.find((child: any) => child?.tagName === 'tbody')
                  : null;
                if (tbody && 'children' in tbody && Array.isArray(tbody.children)) {
                  rowCount = tbody.children.filter((child: any) => child?.tagName === 'tr').length;
                }
              }
            } catch (e) {
              // Fallback if structure is different
              rowCount = 0;
            }
            
            const isLargeTable = rowCount > 20;
            
            return (
              <div className="virima-table-container my-8">
                <div 
                  className={`overflow-x-auto border border-slate-900 dark:border-slate-700 shadow-sm ${
                    isLargeTable ? 'max-h-[600px] overflow-y-auto' : ''
                  }`}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9',
                  }}
                >
                  <table 
                    className="virima-table w-full [border-collapse:collapse]" 
                    {...props}
                    style={{
                      willChange: isLargeTable ? 'transform' : 'auto',
                      borderCollapse: 'collapse',
                    }}
                  >
                    {children}
                  </table>
                </div>
                {/* Scroll indicator for large tables */}
                {isLargeTable && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                    Scroll horizontally and vertically to view all data
                  </div>
                )}
              </div>
            );
          },
          thead: ({ node, ...props }) => (
            <thead className="virima-table-header sticky top-0 z-10" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-white dark:bg-[#0a0a0a]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr 
              className="virima-table-row transition-colors duration-150" 
              {...props} 
            />
          ),
          th: ({ node, children, ...props }) => (
            <th
              className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-[#2E7D32] dark:bg-[#1B5E20] virima-table-th"
              style={{
                backgroundColor: '#2E7D32',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ node, ...props }) => (
            <td 
              className="px-4 sm:px-6 py-4 text-sm text-slate-700 dark:text-slate-300 border border-slate-900 dark:border-slate-700" 
              {...props} 
            />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-slate-200 dark:border-slate-700" {...props} />
          ),
          
          // Images - Using OptimizedImage for better performance
          img: ({ node, src, alt, ...props }) => {
            // Resolve image path relative to content file
            const resolvedSrc = src ? resolveImagePath(src, filePath) : '';

            return (
              <OptimizedImage
                src={resolvedSrc}
                alt={alt || ''}
                priority={true}
                placeholder="blur"
                className="rounded-lg shadow-md my-6 max-w-full h-auto border-[0.5px] border-slate-400 dark:border-slate-600"
                {...props}
              />
            );
          },
          
          // Task lists (GFM)
          input: ({ node, ...props }) => {
            if (props.type === 'checkbox') {
              return (
                <input 
                  type="checkbox" 
                  className="mr-2 rounded text-emerald-600 focus:ring-emerald-500"
                  disabled
                  {...props}
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content]);

  return (
    <div className={`prose prose-slate max-w-none ${className}`}>
      {renderedContent}
    </div>
  );
}