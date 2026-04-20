import { useEffect, useState } from 'react';
import { getContent, setVersion as setContentLoaderVersion } from '../lib/content/contentLoader';
import { FeedbackSection } from './FeedbackSection';
import { ContentNotAvailable } from './ContentNotAvailable';
import { MDXRenderer } from './MDXRenderer';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Home } from 'lucide-react';
import { 
  buildBreadcrumbPath, 
  type BreadcrumbItem as HierarchicalBreadcrumbItem 
} from '../utils/hierarchicalTocLoader';

interface MDXContentProps {
  filePath: string;
  version?: string;
  module?: string;
  moduleName?: string;
  section?: string;
  sectionName?: string;
  page?: string;
  pageName?: string;
  onHomeClick?: () => void;
  onVersionClick?: () => void;
  onModuleClick?: () => void;
}

export function MDXContent({ filePath, version, module, moduleName: _moduleName, section, sectionName: _sectionName, page, pageName: _pageName, onHomeClick, onVersionClick, onModuleClick }: MDXContentProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<HierarchicalBreadcrumbItem[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Set version in contentLoader if provided (ensures correct version context)
        if (version) {
          // Map display version to internal version code
          // Currently only 6.1 active. Other versions commented for future reference:
          const versionMap: Record<string, string> = {
            // 'NextGen': 'NG',   // TODO: Re-enable when NG content is ready
            // '6.1.1': '6_1_1',  // TODO: Re-enable when 6.1.1 content is ready
            '6.1': '6_1',
            // '5.13': '5_13',    // TODO: Re-enable when 5.13 content is ready
          };
          const internalVersion = versionMap[version] || version.replace(/\./g, '_').toUpperCase();
          setContentLoaderVersion(internalVersion);
          console.log(`🔄 [MDXContent] Set contentLoader version to: ${internalVersion} (from route version: ${version})`);
        }
        
        // Load content dynamically from contentLoader (async)
        const mdxContent = await getContent(filePath);
        
        console.log('MDXContent - Loading file:', filePath);
        console.log('MDXContent - Content found:', mdxContent ? `Yes (${mdxContent.length} chars)` : 'No');
        
        if (mdxContent) {
          setContent(mdxContent);
        } else {
          throw new Error(`Content not found for path: ${filePath}`);
        }

        // Load breadcrumbs if we have the necessary params
        if (version && module && section && page) {
          try {
            const breadcrumbPath = await buildBreadcrumbPath(version, module, section, page);
            setBreadcrumbs(breadcrumbPath);
          } catch (breadcrumbError) {
            console.error('Error loading breadcrumbs:', breadcrumbError);
            // Don't fail the whole component if breadcrumbs fail
            setBreadcrumbs([]);
          }
        }
      } catch (err) {
        console.error('Error loading MDX content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filePath, version, module, section, page]);
  
  // Scroll to top when filePath changes (new page loaded)
  useEffect(() => {
    if (!loading && content) {
      // Use double RAF to ensure DOM is ready after content renders
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Find the scrollable container (content area)
          const scrollContainer = document.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
          }
          // Also scroll window to top
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      });
    }
  }, [filePath]); // Only when filePath changes (new page)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ContentNotAvailable 
        filePath={filePath} 
        errorDetails={error}
        version={version}
        module={module}
        section={section}
        page={page}
      />
    );
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const isHome = crumb.type === 'home';
                
                return (
                  <div key={`${crumb.type}-${index}`} className="contents">
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-slate-900 dark:text-slate-100">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => {
                            if (crumb.type === 'home' && onHomeClick) {
                              onHomeClick();
                            } else if (crumb.type === 'version' && onVersionClick) {
                              onVersionClick();
                            } else if (crumb.type === 'module' && onModuleClick) {
                              onModuleClick();
                            }
                          }}
                          className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                        >
                          {isHome ? <Home className="w-4 h-4" /> : crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}
      
      <MDXRenderer content={content} filePath={filePath} />
      
      <FeedbackSection />
    </div>
  );
}