import { useState, useEffect } from 'react';
import { MDXRenderer } from './MDXRenderer';
import { getContent } from '../lib/content/contentLoader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { generateTestMarkdown, test61Files, analyzeMDXContent } from '../utils/mdxTestUtils';

/**
 * MDXRenderingTest Component
 * 
 * This component provides a visual testing interface for the MDX rendering system.
 * It can be used to verify that all markdown features are rendering correctly.
 * 
 * Usage:
 * 1. Navigate to a test page or add this component temporarily to App.tsx
 * 2. Select test files or use the comprehensive test document
 * 3. Verify visual rendering matches expectations
 * 
 * To enable in development:
 * - Add to App.tsx or any route
 * - Access via URL parameter or dev mode flag
 */

interface TestResult {
  filePath: string;
  description: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  content?: string;
  contentLength?: number;
  features?: ReturnType<typeof analyzeMDXContent>;
  error?: string;
}

export function MDXRenderingTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [showTestDoc, setShowTestDoc] = useState(false);
  const [testing, setTesting] = useState(false);

  // Initialize test cases
  useEffect(() => {
    setTestResults(
      test61Files.map(file => ({
        filePath: file.path,
        description: file.description,
        status: 'pending' as const,
      }))
    );
  }, []);

  // Run all tests
  const runAllTests = async () => {
    setTesting(true);
    const results: TestResult[] = [];

    for (const file of test61Files) {
      const result: TestResult = {
        filePath: file.path,
        description: file.description,
        status: 'loading',
      };
      
      // Update UI to show loading
      setTestResults(prev => [...prev.filter(r => r.filePath !== file.path), result]);

      try {
        const content = await getContent(file.path);
        
        if (content) {
          const features = analyzeMDXContent(content);
          result.status = 'success';
          result.content = content;
          result.contentLength = content.length;
          result.features = features;
        } else {
          result.status = 'error';
          result.error = 'Content not found';
        }
      } catch (error) {
        result.status = 'error';
        result.error = error instanceof Error ? error.message : 'Unknown error';
      }

      results.push(result);
      setTestResults([...results]);
    }

    setTesting(false);
  };

  // Run single test
  const runSingleTest = async (filePath: string) => {
    const file = test61Files.find(f => f.path === filePath);
    if (!file) return;

    const result: TestResult = {
      filePath: file.path,
      description: file.description,
      status: 'loading',
    };

    setTestResults(prev =>
      prev.map(r => (r.filePath === filePath ? result : r))
    );

    try {
      const content = await getContent(filePath);
      
      if (content) {
        const features = analyzeMDXContent(content);
        result.status = 'success';
        result.content = content;
        result.contentLength = content.length;
        result.features = features;
        setSelectedTest(result);
      } else {
        result.status = 'error';
        result.error = 'Content not found';
      }
    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setTestResults(prev =>
      prev.map(r => (r.filePath === filePath ? result : r))
    );
  };

  const testDocument = generateTestMarkdown();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            MDX Rendering Test Suite
          </h1>
          <p className="text-slate-600">
            Verify that all MDX content renders correctly across version 6.1
          </p>
        </div>

        {/* Control Panel */}
        <Card className="p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={runAllTests}
              disabled={testing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setShowTestDoc(true);
                setSelectedTest(null);
              }}
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2" />
              Show Test Document
            </Button>

            <Button
              onClick={() => {
                setShowTestDoc(false);
                setSelectedTest(null);
                setTestResults(
                  test61Files.map(file => ({
                    filePath: file.path,
                    description: file.description,
                    status: 'pending' as const,
                  }))
                );
              }}
              variant="outline"
            >
              Reset Tests
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Cases List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900">
                Test Cases
              </h2>
              <div className="space-y-2">
                {testResults.map((result) => (
                  <button
                    key={result.filePath}
                    onClick={() => runSingleTest(result.filePath)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 mb-1 truncate">
                          {result.description}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {result.filePath.split('/').pop()}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {result.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                        )}
                        {result.status === 'loading' && (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        )}
                        {result.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                        {result.status === 'error' && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    {result.features && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.features.hasHeadings && (
                          <Badge variant="secondary" className="text-xs">
                            H
                          </Badge>
                        )}
                        {result.features.hasLists && (
                          <Badge variant="secondary" className="text-xs">
                            L
                          </Badge>
                        )}
                        {result.features.hasLinks && (
                          <Badge variant="secondary" className="text-xs">
                            A
                          </Badge>
                        )}
                        {result.features.hasImages && (
                          <Badge variant="secondary" className="text-xs">
                            I
                          </Badge>
                        )}
                        {result.features.hasCodeBlocks && (
                          <Badge variant="secondary" className="text-xs">
                            C
                          </Badge>
                        )}
                        {result.features.hasTables && (
                          <Badge variant="secondary" className="text-xs">
                            T
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="font-semibold mb-2">Legend:</div>
                  <div>H = Headings</div>
                  <div>L = Lists</div>
                  <div>A = Links (Anchors)</div>
                  <div>I = Images</div>
                  <div>C = Code Blocks</div>
                  <div>T = Tables</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {showTestDoc ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                      Comprehensive Test Document
                    </h2>
                    <p className="text-sm text-slate-600">
                      This document contains all supported markdown features
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-6">
                    <MDXRenderer content={testDocument} />
                  </div>
                </>
              ) : selectedTest?.content ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                      {selectedTest.description}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>
                        {selectedTest.contentLength} characters
                      </span>
                      {selectedTest.features && (
                        <div className="flex gap-2">
                          {Object.entries(selectedTest.features)
                            .filter(([key, value]) => value && key !== 'contentLength')
                            .map(([key]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-6">
                    <MDXRenderer content={selectedTest.content} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <FileText className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">No content selected</p>
                  <p className="text-sm">
                    Click a test case or show the test document to preview
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Summary Stats */}
        {testResults.length > 0 && testResults.some(r => r.status !== 'pending') && (
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-900">
              Test Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">
                  {testResults.length}
                </div>
                <div className="text-sm text-slate-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {testResults.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-slate-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-slate-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {testResults.filter(r => r.status === 'loading').length}
                </div>
                <div className="text-sm text-slate-600">Running</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
