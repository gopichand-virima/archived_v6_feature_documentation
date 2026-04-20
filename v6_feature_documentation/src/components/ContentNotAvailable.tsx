/**
 * Content Not Available Component
 * Displays when documentation content is missing or being prepared
 * Uses errorMessageService for context-aware error messages
 */

import { AlertTriangle } from 'lucide-react';
import { generateAccurateErrorMessage, type ContentErrorContext } from '../utils/errorMessageService';
import { useTheme } from '../lib/theme/theme-provider';

interface ContentNotAvailableProps {
  filePath?: string;
  errorDetails?: string;
  version?: string;
  module?: string;
  section?: string;
  page?: string;
}

export function ContentNotAvailable({
  filePath,
  errorDetails,
  version,
  module,
  section,
  page
}: ContentNotAvailableProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  // Generate context-aware error message if we have enough context
  const errorContext: ContentErrorContext | null = filePath ? {
    filePath,
    version,
    module,
    section,
    page,
  } : null;

  const errorMessage = errorContext 
    ? generateAccurateErrorMessage(errorContext)
    : null;

  return (
    <div
      className="border-l-4 rounded-r-md p-6 mb-8"
      style={{
        background: isDark ? 'rgba(92,45,5,0.25)' : '#fffbeb',
        borderColor: isDark ? '#b45309' : '#f59e0b'
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <h3 className="text-amber-800 dark:text-amber-200 font-semibold text-lg">
            {errorMessage?.title || 'Content Not Available'}
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            {errorMessage?.instructions?.[0] || 'The documentation for this page is currently being prepared.'}
          </p>
          {errorMessage ? (
            <div className="space-y-2">
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                <span className="font-semibold">File path:</span> {errorMessage.filePath}
              </p>
              {errorMessage.version && (
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  <span className="font-semibold">Version:</span> {errorMessage.version}
                </p>
              )}
              {errorMessage.tocFilePath && (
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  <span className="font-semibold">TOC file:</span> <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-amber-700 dark:text-amber-300">{errorMessage.tocFilePath}</code>
                </p>
              )}
              {errorMessage.registrationFile && (
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  <span className="font-semibold">Registration file:</span> <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-amber-700 dark:text-amber-300">{errorMessage.registrationFile}</code>
                </p>
              )}
              {errorDetails && (
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  <span className="font-semibold">Error details:</span> {errorDetails}
                </p>
              )}
            </div>
          ) : (
            filePath && (
              <div className="space-y-2">
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  <span className="font-semibold">File path:</span> {filePath}
                </p>
                {errorDetails && (
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    <span className="font-semibold">Error details:</span> {errorDetails}
                  </p>
                )}
              </div>
            )
          )}
          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
              <span className="font-semibold">To add this topic:</span>
            </p>
            {errorMessage?.instructions ? (
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400 ml-1">
                {errorMessage.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            ) : (
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400 ml-1">
                <li>Create the MDX file at the path shown above</li>
                <li>Update the TOC structure in the version's <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-amber-700 dark:text-amber-300">index.md</code> file</li>
                <li>Register the content in the appropriate registration file</li>
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}