/**
 * SearchDialog.tsx
 *
 * Enterprise-grade two-tab search dialog for the V6 Feature Documentation site.
 *
 * Tabs:
 *   Search Docs — client-side search over the build-time generated index
 *                 (public/search-index.json). Zero external API calls.
 *                 Scope: "This page" (DOM-based) or "All docs" (index-based).
 *   Ask Virima  — unified search that prioritises Virima documentation first,
 *                 then supplements with Serper-powered web results.
 *                 Hidden when VITE_SERPER_API_KEY is not configured.
 *
 * Architecture invariants:
 *   - Search Docs never calls LLM / web APIs — index only.
 *   - Ask Virima state never leaks into Search Docs and vice-versa.
 *   - Scope selector is always visible while on the Search Docs tab.
 *   - Keyboard navigation works correctly for both scopes.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, ChevronRight, TrendingUp, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { searchDocs, searchCurrentPage, preloadSearchIndex, sampleDocQuestions, sampleDocQuestionsAsync, type SearchResult, type CurrentPageResult } from '../lib/search/docs-search';
import { classifyIntent, buildScopeRejectionMessage, buildUnsafeRejectionMessage, buildGreetingResponse } from '../lib/chat/intent-detection';
import { type Message } from '../lib/chat/conversation-service';
import { useTheme } from '../lib/theme/theme-provider';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user selects a documentation result. Optional anchor for deep linking. */
  onNavigate: (module: string, sectionId: string, pageId: string, anchor?: string) => void;
}

type ActiveTab = 'docs' | 'web';
type SearchScope = 'all-docs' | 'this-page';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a natural-language intro sentence from the query + top result metadata.
 * Returns a short, Claude-like opener that directly addresses the user's question.
 */
function buildIntroSentence(query: string, title: string, moduleLabel: string): string {
  const q = query.toLowerCase().replace(/[?!.]+$/, '').trim();
  const label = moduleLabel ? ` in the ${moduleLabel} module` : ' in Virima 6.1';

  const howDoI = q.match(/^how do i (.+)/);
  if (howDoI) {
    return `To ${howDoI[1]}${label}, use the **${title}** feature.`;
  }

  const howTo = q.match(/^how to (.+)/);
  if (howTo) {
    return `Here's how to ${howTo[1]}${label} using **${title}**.`;
  }

  const whatIs = q.match(/^what is (.+)/);
  if (whatIs) {
    return `**${title}** is a ${moduleLabel || 'Virima 6.1'} feature.`;
  }

  const canI = q.match(/^can i (.+)/);
  if (canI) {
    return `Yes — you can ${canI[1]} using **${title}**${label}.`;
  }

  return `**${title}**${label}.`;
}

// Fallback questions used only before the search index is loaded on the very first open.
const FALLBACK_QUESTIONS = [
  'How do I add a new user and assign roles?',
  'How do I run a vulnerability scan?',
  'How do I create and assign an incident?',
  'How do I schedule a discovery scan?',
];

export function SearchDialog({ isOpen, onClose, onNavigate }: SearchDialogProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  // Per-tab query state — never shared across tabs
  const [docsQuery, setDocsQuery] = useState('');
  const [webQuery, setWebQuery] = useState('');

  // Rotated on every open — derived from the live search index for real 6.1 doc coverage
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>(FALLBACK_QUESTIONS);

  const [activeTab, setActiveTab] = useState<ActiveTab>('docs');
  const [searchScope] = useState<SearchScope>('all-docs');

  // Search Docs tab state
  const [docsResults, setDocsResults] = useState<SearchResult[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  // This page search state
  const [pageResults, setPageResults] = useState<CurrentPageResult[]>([]);

  // Ask Virima tab state
  const [webDocResults, setWebDocResults] = useState<SearchResult[]>([]);
  // Formatted response derived from top docs (retrieval + response pattern)
  const [askVirimaResponse, setAskVirimaResponse] = useState<string | null>(null);
  const [askVirimaSources, setAskVirimaSources] = useState<SearchResult[]>([]);
  // True when the current response is a greeting/vague/rejection (no doc sources to show)
  const [isNonDocResponse, setIsNonDocResponse] = useState(false);
  const [webLoading, setWebLoading] = useState(false);
  const [webError, setWebError] = useState<string | null>(null); // set on doc search failure

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const docsInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);


  // Preload search index and detect article context when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Try sync first (index already cached from a prior search this session)
      const sync = sampleDocQuestions();
      if (sync) {
        setSuggestedQueries(sync);
      } else {
        // Index not cached yet — load it then sample (async, non-blocking)
        sampleDocQuestionsAsync().then(qs => {
          if (qs.length > 0) setSuggestedQueries(qs);
        }).catch(() => { /* keep fallback */ });
      }
      preloadSearchIndex();
      setSelectedIndex(-1);
      setTimeout(() => {
        docsInputRef.current?.focus();
      }, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset all state on close
  useEffect(() => {
    if (!isOpen) {
      setDocsQuery('');
      setWebQuery('');
      setDocsResults([]);
      setPageResults([]);
      setWebDocResults([]);
      setAskVirimaResponse(null);
      setAskVirimaSources([]);
      setIsNonDocResponse(false);
      setDocsError(null);
      setWebError(null);
      setSelectedIndex(-1);
      setActiveTab('docs');
    }
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Tab switching — clears the other tab's state entirely
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Search Docs tab — debounced for "All docs"
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!docsQuery.trim()) {
      setDocsResults([]);
      setPageResults([]);
      setDocsError(null);
      setSelectedIndex(-1);
      return;
    }

    if (searchScope === 'this-page') {
      // Synchronous DOM search — no debounce, no async, no index loading
      const results = searchCurrentPage(docsQuery);
      setPageResults(results);
      setDocsResults([]);
      setDocsLoading(false);
      setSelectedIndex(-1);
      return;
    }

    // "All docs" — async index search with 200 ms debounce
    setDocsLoading(true);
    setDocsError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchDocs(docsQuery);
        setDocsResults(results);
        setPageResults([]);
        setSelectedIndex(-1);
      } catch {
        setDocsError('Search is temporarily unavailable. Please try again.');
        setDocsResults([]);
      } finally {
        setDocsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [docsQuery, searchScope]);

  // ---------------------------------------------------------------------------
  // Ask Virima tab — Virima docs first, then external web in parallel
  // ---------------------------------------------------------------------------

  const handleWebSearch = useCallback(async (queryOverride?: string) => {
    const q = (queryOverride ?? webQuery).trim();
    if (!q) return;
    if (queryOverride) setWebQuery(queryOverride);

    setSelectedIndex(-1);
    setIsNonDocResponse(false);

    // ------------------------------------------------------------------
    // Intent classification — synchronous, zero-cost
    // ------------------------------------------------------------------
    const intent = classifyIntent(q);

    if (intent.intent === 'greeting') {
      setAskVirimaResponse(buildGreetingResponse(q));
      setAskVirimaSources([]);
      setWebDocResults([]);
      setIsNonDocResponse(true);
      return;
    }

    if (intent.intent === 'unsafe') {
      setAskVirimaResponse(buildUnsafeRejectionMessage());
      setAskVirimaSources([]);
      setWebDocResults([]);
      setIsNonDocResponse(true);
      return;
    }

    if (intent.intent === 'out-of-scope') {
      setAskVirimaResponse(buildScopeRejectionMessage(q));
      setAskVirimaSources([]);
      setWebDocResults([]);
      setIsNonDocResponse(true);
      return;
    }

    // ------------------------------------------------------------------
    // In-scope — retrieve from 6.1 documentation
    // ------------------------------------------------------------------
    setWebLoading(true);

    try {
      const docResults = await searchDocs(q);
      setWebDocResults(docResults.slice(0, 5));

      if (docResults.length > 0) {
        const r1 = docResults[0];
        const clean = (t: string) => t.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();

        // Build a Claude-style intro sentence, then add the excerpt and structure
        const intro = buildIntroSentence(q, clean(r1.title), r1.moduleLabel);
        const headingLines = r1.headings.slice(0, 4).map(h => `• ${clean(h)}`).join('\n');
        const related = docResults.slice(1, 3);

        let response = `${intro}\n\n${r1.excerpt}`;
        if (headingLines) response += `\n\n**Key sections:**\n${headingLines}`;
        if (related.length > 0) {
          const relatedList = related
            .map(r => `• **${clean(r.title)}** — ${r.breadcrumb || r.moduleLabel}`)
            .join('\n');
          response += `\n\n**See also:**\n${relatedList}`;
        }

        setAskVirimaResponse(response);
        setAskVirimaSources(docResults.slice(0, 3));
        setIsNonDocResponse(false);
      } else {
        // No results — polite, scoped empty-state message
        setAskVirimaResponse(
          `I couldn't find documentation matching "${q}" in the Virima 6.1 knowledge base.\n\n` +
          `Try rephrasing using module names (e.g., CMDB, Discovery, ITSM) or ` +
          `specific feature terms (e.g., SLA, incident, service request).`
        );
        setAskVirimaSources([]);
        setIsNonDocResponse(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setWebError(message);
      setWebDocResults([]);
      setAskVirimaResponse(null);
      setAskVirimaSources([]);
    } finally {
      setWebLoading(false);
    }
  }, [webQuery]);

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  // Result count: docs tab is scope-aware; Ask Virima tab navigates source citations
  const resultCount =
    activeTab === 'docs'
      ? (searchScope === 'this-page' ? pageResults.length : docsResults.length)
      : askVirimaSources.length;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, resultCount - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, -1));
      } else if (e.key === 'Enter') {
        if (activeTab === 'web' && selectedIndex === -1) {
          handleWebSearch();
          return;
        }
        if (selectedIndex >= 0) {
          if (activeTab === 'docs') {
            if (searchScope === 'this-page') {
              // "This page" Enter — scroll to heading
              const r = pageResults[selectedIndex];
              if (r) {
                onClose();
                setTimeout(() => {
                  const el = document.getElementById(r.headingId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }
            } else {
              // "All docs" Enter — navigate to page
              const r = docsResults[selectedIndex];
              if (r) handleDocResultClick(r);
            }
          } else {
            // Ask Virima tab — Enter navigates to the selected source citation
            const r = askVirimaSources[selectedIndex];
            if (r) handleDocResultClick(r);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, searchScope, resultCount, selectedIndex, docsResults, pageResults, askVirimaSources, handleWebSearch, onClose]
  );

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const el = resultsRef.current.querySelectorAll('[data-result-item]')[selectedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // ---------------------------------------------------------------------------
  // Result click handlers
  // ---------------------------------------------------------------------------

  const handleDocResultClick = useCallback(
    (result: SearchResult) => {
      // Use navId (label-slug) as pageId — matches useDocGraphNav's page.id contract.
      // Use section (not the old sectionId which was always undefined at runtime).
      onNavigate(result.module, result.section, result.navId, result.matchedHeadingId);
      onClose();
    },
    [onNavigate, onClose]
  );

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const DocsResultItem = ({
    result,
    index,
  }: {
    result: SearchResult;
    index: number;
  }) => (
    <button
      type="button"
      data-result-item
      onClick={() => handleDocResultClick(result)}
      className="w-full text-left px-4 py-3 rounded-md transition-colors flex items-start gap-3 group"
      style={{
        backgroundColor: selectedIndex === index ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : undefined,
      }}
    >
      <FileText className="w-4 h-4 mt-0.5 shrink-0 text-slate-400 group-hover:text-emerald-500" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-medium transition-colors leading-snug group-hover:text-emerald-500"
            style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
          >
            {result.title}
          </span>
          {result.matchedHeading && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-xs truncate" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                {result.matchedHeading}
              </span>
            </>
          )}
        </div>
        <div className="text-xs mt-0.5 font-medium" style={{ color: isDark ? '#34d399' : '#047857' }}>
          {result.breadcrumb}
        </div>
        {result.excerpt && (
          <div className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {result.excerpt}
          </div>
        )}
      </div>
    </button>
  );



  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent
        className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-auto shadow-2xl"
        style={{
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
          borderColor: isDark ? '#1a1a1a' : undefined,
          boxShadow: isDark ? '0 0 0 1px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)' : undefined,
        }}
        onKeyDown={handleKeyDown}
      >
        <DialogTitle className="sr-only">Documentation Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search Virima documentation or use Ask Virima for assisted queries
        </DialogDescription>

        {/* Header area */}
        <div
          className="px-6 pt-6 pb-4"
          style={{ background: isDark ? '#0a0a0a' : 'linear-gradient(to bottom right, #f8fafc, #ffffff)' }}
        >
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl" style={{ color: isDark ? '#ffffff' : '#0f172a' }}>Search</h2>
          </div>

          {/* Search input */}
          <form
            className="relative"
            onSubmit={e => e.preventDefault()}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              ref={docsInputRef}
              type="text"
              value={docsQuery}
              onChange={e => setDocsQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-12 pr-4 h-12 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg shadow-sm text-sm placeholder-slate-400 outline-none"
              style={{
                backgroundColor: isDark ? '#111111' : '#ffffff',
                borderWidth: 1, borderStyle: 'solid',
                borderColor: isDark ? '#1a1a1a' : '#cbd5e1',
                color: isDark ? '#f1f5f9' : '#0f172a',
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>

        {/* Results panel */}
        <div className="overflow-y-auto max-h-[500px] px-6" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>

          {/* ================================================================ */}
          {/* Search Docs tab                                                  */}
          {/* ================================================================ */}
          {activeTab === 'docs' && (
            <div className="py-4 space-y-3">

              {/* Loading */}
              {docsLoading && (
                <div className="flex items-center justify-center py-8 text-sm" style={{ color: isDark ? '#94a3b8' : '#94a3b8' }}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {/* Error */}
              {docsError && !docsLoading && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{docsError}</p>
                </div>
              )}

              {/* Results */}
              {!docsLoading && !docsError && (
                <div ref={resultsRef} className="space-y-1">

                  {/* ── This page results ─────────────────────────────────── */}
                  {searchScope === 'this-page' && pageResults.length > 0 ? (
                    pageResults.map((result, i) => (
                      <button
                        key={result.headingId}
                        type="button"
                        data-result-item
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            const el = document.getElementById(result.headingId);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors group"
                        style={{
                          backgroundColor: selectedIndex === i ? (isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5') : undefined,
                        }}
                      >
                        <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-slate-400 group-hover:text-emerald-500" />
                        <div className="min-w-0 flex-1">
                          <div
                            className="text-sm font-medium transition-colors truncate group-hover:text-emerald-500"
                            style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                          >
                            {result.heading}
                          </div>
                          {result.parentHeading && (
                            <div className="text-xs mt-0.5" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                              {result.parentHeading}
                            </div>
                          )}
                          {result.snippet && (
                            <p className="text-xs mt-1 line-clamp-2" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                              {result.snippet}
                            </p>
                          )}
                        </div>
                      </button>
                    ))

                  ) : searchScope === 'this-page' && docsQuery.trim() ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                        No matches found in this document.
                      </p>
                      <p className="text-xs mt-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                        Try another term or switch to All docs.
                      </p>
                    </div>

                  ) : searchScope === 'all-docs' && docsResults.length > 0 ? (
                    // Results: All docs
                    <>
                      {docsResults.map((result, i) => (
                        <DocsResultItem key={result.id} result={result} index={i} />
                      ))}
                      {/* Affordance to continue in Ask Virima */}
                      <div className="px-4 py-3 border-t border-slate-100 dark:border-[#1a1a1a] mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              if (typeof window !== 'undefined' && typeof (window as Window & { openGlobalChat?: () => void }).openGlobalChat === 'function') {
                                (window as Window & { openGlobalChat?: () => void }).openGlobalChat!();
                              }
                            }, 120);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Open Ask Virima
                        </button>
                      </div>
                    </>

                  ) : searchScope === 'all-docs' && docsQuery.trim() ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                        No documentation results found.
                      </p>
                      <p className="text-xs mt-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                        Try a broader feature name or a different keyword.
                      </p>
                    </div>

                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#94a3b8' }}>
                        {searchScope === 'this-page'
                          ? 'Type to find sections in this document.'
                          : 'Type to search all published documentation.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* Ask Virima tab — Virima docs first, then external web            */}
          {/* ================================================================ */}
          {activeTab === 'web' && (
            <div ref={resultsRef}>
              {webLoading && (
                <div className="flex items-center justify-center py-10 text-sm" style={{ color: isDark ? '#94a3b8' : '#94a3b8' }}>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {webError && !webLoading && webDocResults.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{webError}</p>
                </div>
              )}

              {!webLoading && askVirimaResponse ? (
                <div className="py-4 px-4 space-y-4">
                  {/* Back to suggestions */}
                  <button
                    type="button"
                    onClick={() => {
                      setAskVirimaResponse(null);
                      setAskVirimaSources([]);
                      setWebDocResults([]);
                      setWebQuery('');
                      setSelectedIndex(-1);
                      setIsNonDocResponse(false);
                      setSuggestedQueries(sampleDocQuestions() ?? suggestedQueries);
                    }}
                    className="flex items-center gap-1.5 text-xs hover:text-emerald-500 transition-colors group"
                    style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to suggestions
                  </button>

                  {/* Response card */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: isDark ? '#111111' : '#f8fafc',
                      borderWidth: 1, borderStyle: 'solid',
                      borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                    }}
                  >
                    {/* Badge — only for grounded documentation answers */}
                    {!isNonDocResponse && (
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="h-4 w-4 shrink-0" style={{ color: isDark ? '#34d399' : '#059669' }} />
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: isDark ? '#34d399' : '#047857' }}>
                          Based on Virima 6.1 documentation
                        </span>
                      </div>
                    )}

                    {/* Response body */}
                    <div className="space-y-2 text-sm leading-relaxed" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                      {askVirimaResponse.split('\n').map((line, i) => {
                        if (!line.trim()) return <div key={i} className="h-1" />;
                        const boldLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                        return (
                          <p
                            key={i}
                            style={line.startsWith('•') ? { marginLeft: '0.5rem', color: isDark ? '#94a3b8' : '#475569' } : undefined}
                            dangerouslySetInnerHTML={{ __html: boldLine }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Source citations — only for grounded documentation answers */}
                  {!isNonDocResponse && askVirimaSources.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2 px-1"
                        style={{ color: isDark ? '#475569' : '#94a3b8' }}>
                        Sources
                      </p>
                      <div className="space-y-1">
                        {askVirimaSources.map((src) => (
                          <button
                            key={src.id}
                            type="button"
                            data-result-item
                            onClick={() => handleDocResultClick(src)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group border border-transparent"
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? '#111111' : '#f1f5f9')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-emerald-500" />
                            <div className="min-w-0 flex-1">
                              <span
                                className="text-sm font-medium leading-snug group-hover:text-emerald-500 transition-colors"
                                style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
                              >
                                {src.title}
                              </span>
                              <div className="text-xs truncate mt-0.5"
                                style={{ color: isDark ? '#475569' : '#94a3b8' }}>
                                {src.breadcrumb}
                              </div>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 group-hover:text-emerald-500 shrink-0"
                              style={{ color: isDark ? '#334155' : '#cbd5e1' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Continue in chat — only for grounded documentation answers */}
                  {!isNonDocResponse && (
                    <button
                      type="button"
                      onClick={() => {
                        const msgs: Message[] = [
                          { id: `usr-${Date.now()}`, role: 'user', content: webQuery, timestamp: new Date() },
                          { id: `ast-${Date.now() + 1}`, role: 'assistant', content: askVirimaResponse ?? '', timestamp: new Date() },
                        ];
                        onClose();
                        setTimeout(() => {
                          (window as Window & { openGlobalChat?: (m: Message[]) => void }).openGlobalChat?.(msgs);
                        }, 120);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border"
                      style={{
                        color: isDark ? '#34d399' : '#047857',
                        backgroundColor: isDark ? 'rgba(52,211,153,0.08)' : '#f0fdf4',
                        borderColor: isDark ? 'rgba(52,211,153,0.2)' : '#bbf7d0',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(52,211,153,0.15)' : '#dcfce7';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(52,211,153,0.08)' : '#f0fdf4';
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Continue in chat
                    </button>
                  )}
                </div>
              ) : !webLoading && webQuery.trim() ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-medium" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                    No results found for &ldquo;{webQuery}&rdquo;
                  </p>
                  <p className="text-xs mt-1" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                    Try a different keyword or rephrase your query.
                  </p>
                </div>
              ) : !webLoading ? (
                <div className="py-4 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }} />
                      <span className="text-sm" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>Try asking</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestedQueries.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => { handleWebSearch(q); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group text-left shadow-sm"
                          style={{
                            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                            borderWidth: 1, borderStyle: 'solid',
                            borderColor: isDark ? '#1a1a1a' : '#e2e8f0',
                          }}
                        >
                          <span className="text-sm transition-colors flex-1 group-hover:text-emerald-500" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{q}</span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer — keyboard hints */}
        {activeTab === 'docs' && (searchScope === 'this-page' ? pageResults.length : docsResults.length) > 0 && (
          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-200 dark:border-[#1a1a1a] text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">Enter</kbd>
              Open
            </span>
            <span className="ml-auto">
              {searchScope === 'this-page' ? pageResults.length : docsResults.length}{' '}
              result{(searchScope === 'this-page' ? pageResults.length : docsResults.length) !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {activeTab === 'web' && askVirimaSources.length > 0 && (
          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-200 dark:border-[#1a1a1a] text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">Enter</kbd>
              Open
            </span>
            <span className="ml-auto">
              {webDocResults.length > 0 && `${webDocResults.length} doc`}
              {' '}source{askVirimaSources.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
