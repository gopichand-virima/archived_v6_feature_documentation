/**
 * Version Content Loader Component
 * 
 * Automatically loads content based on hierarchical TOC structure
 * NO MANUAL UPDATES NEEDED - reads from index.md files!
 */

import { ReactNode, useEffect, useState } from 'react';
import { resolveHierarchicalFilePath } from '../utils/hierarchicalTocLoader';
import { getContent } from '../lib/content/contentLoader';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface VersionContentLoaderProps {
  version: string;
  moduleId: string;
  sectionId: string;
  pageId: string;
  children: (props: { content: string; filePath: string }) => ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

/**
 * Main component for automatic content loading from TOC hierarchy
 */
export function VersionContentLoader({
  version,
  moduleId,
  sectionId,
  pageId,
  children,
  loadingComponent,
  errorComponent,
}: VersionContentLoaderProps) {
  const [state, setState] = useState<{
    content: string | null;
    filePath: string | null;
    loading: boolean;
    error: string | null;
  }>({
    content: null,
    filePath: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      console.log(`🔄 Loading content for ${version}/${moduleId}/${sectionId}/${pageId}`);
      
      setState({ content: null, filePath: null, loading: true, error: null });

      try {
        // Step 1: Resolve file path from TOC hierarchy
        const filePath = await resolveHierarchicalFilePath(
          version,
          moduleId,
          sectionId,
          pageId
        );

        if (!filePath) {
          throw new Error('Page not found in TOC hierarchy');
        }

        console.log(`✅ Resolved file path: ${filePath}`);

        // Step 2: Load content from file
        const content = await getContent(filePath);

        if (!content) {
          throw new Error(`Failed to load content from ${filePath}`);
        }

        console.log(`✅ Loaded content (${content.length} chars)`);

        if (isMounted) {
          setState({
            content,
            filePath,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('❌ Failed to load content:', error);
        
        if (isMounted) {
          setState({
            content: null,
            filePath: null,
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [version, moduleId, sectionId, pageId]);

  // Loading state
  if (state.loading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Error state
  if (state.error || !state.content) {
    return (
      errorComponent || (
        <DefaultErrorComponent
          error={state.error || 'Content not found'}
          version={version}
          moduleId={moduleId}
          sectionId={sectionId}
          pageId={pageId}
        />
      )
    );
  }

  // Success - render children with content
  return <>{children({ content: state.content, filePath: state.filePath! })}</>;
}

/**
 * Default loading component
 */
function DefaultLoadingComponent() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4">
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

/**
 * Default error component
 */
function DefaultErrorComponent({
  error,
  version,
  moduleId,
  sectionId,
  pageId,
}: {
  error: string;
  version: string;
  moduleId: string;
  sectionId: string;
  pageId: string;
}) {
  return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTitle>Content Loading Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          <div className="text-sm mt-4 space-y-1">
            <p className="text-slate-600">
              <strong>Version:</strong> {version}
            </p>
            <p className="text-slate-600">
              <strong>Module:</strong> {moduleId}
            </p>
            <p className="text-slate-600">
              <strong>Section:</strong> {sectionId}
            </p>
            <p className="text-slate-600">
              <strong>Page:</strong> {pageId}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Version-specific content info badge
 */
export function VersionContentInfo({ version }: { version: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-md text-xs text-slate-700">
      <span className="font-medium">{version}</span>
      <span className="text-slate-400">•</span>
      <span className="text-emerald-600">📋 TOC-Driven</span>
    </div>
  );
}

/**
 * Content loading strategy indicator
 */
export function ContentLoadingIndicator({
  loadedFrom,
}: {
  loadedFrom: 'toc' | 'direct' | 'fallback';
}) {
  const labels = {
    toc: '📋 Loaded from TOC',
    direct: '📁 Direct path',
    fallback: '⚠️ Fallback mode',
  };

  const colors = {
    toc: 'text-emerald-600',
    direct: 'text-blue-600',
    fallback: 'text-amber-600',
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs ${colors[loadedFrom]}`}
      title={`Content loading strategy: ${loadedFrom}`}
    >
      <span>{labels[loadedFrom]}</span>
    </div>
  );
}