/**
 * React Hooks for Version-Specific Content Loading
 * 
 * Provides hooks for loading content based on version-specific architectures
 */

import { useState, useEffect } from 'react';
import {
  loadVersionContent,
  loadNextGenContent,
  load61Content,
  isVersionTOCDriven,
  getVersionConfig,
  type ContentLoadResult,
} from './versionContentLoader';

/**
 * Hook for loading version-specific content
 */
export function useVersionContent(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
) {
  const [result, setResult] = useState<ContentLoadResult>({
    content: null,
    filePath: null,
    error: null,
    loadedFrom: 'fallback',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!version || !moduleId || !sectionId || !pageId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadResult = await loadVersionContent(version, moduleId, sectionId, pageId);
        
        if (mounted) {
          setResult(loadResult);
        }
      } catch (error) {
        if (mounted) {
          setResult({
            content: null,
            filePath: null,
            error: error instanceof Error ? error.message : 'Failed to load content',
            loadedFrom: 'fallback',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [version, moduleId, sectionId, pageId]);

  return {
    ...result,
    loading,
  };
}

/**
 * Hook specifically for NextGen content
 */
export function useNextGenContent(
  moduleId: string,
  sectionId: string,
  pageId: string
) {
  const [result, setResult] = useState<ContentLoadResult>({
    content: null,
    filePath: null,
    error: null,
    loadedFrom: 'fallback',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!moduleId || !sectionId || !pageId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadResult = await loadNextGenContent(moduleId, sectionId, pageId);
        
        if (mounted) {
          setResult(loadResult);
        }
      } catch (error) {
        if (mounted) {
          setResult({
            content: null,
            filePath: null,
            error: error instanceof Error ? error.message : 'Failed to load content',
            loadedFrom: 'fallback',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [moduleId, sectionId, pageId]);

  return {
    ...result,
    loading,
  };
}

/**
 * Hook specifically for version 6.1 content
 */
export function use61Content(
  moduleId: string,
  sectionId: string,
  pageId: string
) {
  const [result, setResult] = useState<ContentLoadResult>({
    content: null,
    filePath: null,
    error: null,
    loadedFrom: 'fallback',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!moduleId || !sectionId || !pageId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadResult = await load61Content(moduleId, sectionId, pageId);
        
        if (mounted) {
          setResult(loadResult);
        }
      } catch (error) {
        if (mounted) {
          setResult({
            content: null,
            filePath: null,
            error: error instanceof Error ? error.message : 'Failed to load content',
            loadedFrom: 'fallback',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [moduleId, sectionId, pageId]);

  return {
    ...result,
    loading,
  };
}

/**
 * Hook to check if a version uses TOC architecture
 */
export function useVersionStrategy(version: string) {
  const [isTOCDriven, setIsTOCDriven] = useState(false);
  const [config, setConfig] = useState<ReturnType<typeof getVersionConfig>>(null);

  useEffect(() => {
    setIsTOCDriven(isVersionTOCDriven(version));
    setConfig(getVersionConfig(version));
  }, [version]);

  return {
    isTOCDriven,
    config,
    strategy: config?.contentStrategy,
  };
}

/**
 * Hook for version-aware content path resolution
 */
export function useContentPath(
  version: string,
  moduleId: string,
  sectionId: string,
  pageId: string
) {
  const { filePath, loading } = useVersionContent(version, moduleId, sectionId, pageId);

  return {
    path: filePath,
    loading,
  };
}
