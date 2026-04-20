import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: 'blur' | 'empty';
  priority?: boolean; // If true, loads immediately without lazy loading
}

/**
 * OptimizedImage - High-performance image component with lazy loading
 * 
 * Features:
 * - Intersection Observer for efficient lazy loading
 * - Placeholder support (blur or empty)
 * - Error handling with fallback
 * - Responsive image support
 * - Priority loading option
 */
export function OptimizedImage({
  src,
  alt,
  placeholder = 'empty',
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If priority, load immediately
    if (priority) {
      setIsInView(true);
      return;
    }

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate placeholder blur data URL (tiny 1x1 transparent PNG)
  const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=';

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ 
        minHeight: props.height ? `${props.height}px` : undefined,
        maxWidth: '100%',
      }}
    >
      {/* Placeholder/Blur effect */}
      {!isLoaded && !hasError && placeholder === 'blur' && (
        <div
          className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading image...</div>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <ImageWithFallback
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`h-auto transition-opacity duration-300 ${className}`}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="text-center p-4">
            <svg
              className="w-12 h-12 mx-auto text-slate-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
}

