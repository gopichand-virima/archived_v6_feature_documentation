import { useState, useRef, useEffect } from 'react';
import { DocumentationLayout } from './components/DocumentationLayout';
import { DocumentationContent } from './components/DocumentationContent';
import { HomePage } from './components/HomePage';
import { AIMonitoringDashboard } from './components/AIMonitoringDashboard';
import { SearchDialog } from './components/SearchDialog';
import { GlobalChatProvider } from './components/GlobalChatProvider';
import { MDXRenderingTest } from './components/MDXRenderingTest';
import { VirumaTechCentral } from './components/VirimaTechCentral';
import { VirimaKnowledgeBase } from './components/VirimaKnowledgeBase';
import { ProductSupportPolicies } from './components/ProductSupportPolicies';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { GlossaryPage } from './components/GlossaryPage';
import { ThemeProvider } from './lib/theme/theme-provider';
import { loadHierarchicalToc } from './utils/hierarchicalTocLoader';
import { getModuleSections, getSectionNodes } from './utils/docGraph';
import { setVersion } from './lib/content/contentLoader';
import { updateUrl, getCurrentState } from './utils/browserHistory';
// Import debug helpers to expose to window
import './utils/debugHelpers';
// Import sample content registration
import './lib/content/registerSampleContent';
// Import all content registration
import './lib/content/registerAllContent';
// Import nested content registration
import './lib/content/registerNestedContent';
// Admin placeholder registrations removed — Admin now uses pipeline-generated
// .md content served from src/pages/content/6_1/admin/ via the fetch strategy.
// import './lib/content/registerAdminModules';      // old placeholder content
// import './lib/content/register61AdminDiscovery';  // old placeholder content
// Import remaining content registration
import './lib/content/registerRemainingContent';
// Import missing files registration
import './lib/content/registerMissingFiles';
// Import NextGen content registration — disabled, only 6.1 active
// import './lib/content/registerNextGenContent'; // TODO: Re-enable when NG content is ready

// Version mapping: UI version → internal version code
// Currently only 6.1 is active. Other versions commented out for future reference.
const versionMap: Record<string, string> = {
  // 'NextGen': 'NG',   // TODO: Re-enable when NG content is ready
  // '6.1.1': '6_1_1',  // TODO: Re-enable when 6.1.1 content is ready
  '6.1': '6_1',
  // '5.13': '5_13',    // TODO: Re-enable when 5.13 content is ready
};

export default function App() {
  const [selectedVersion, setSelectedVersion] = useState('6.1');
  
  // Handle version changes - update content loader
  const handleVersionChange = (newVersion: string) => {
    // Scroll to top immediately on version change
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedVersion(newVersion);
    
    // Update content loader version
    const internalVersion = versionMap[newVersion] || newVersion;
    setVersion(internalVersion);
    
    // Update URL
    if (!isNavigatingBack.current) {
      updateUrl({
        version: newVersion,
        module: selectedModule,
        section: selectedSection,
        page: selectedPage,
      });
    }
    
    console.log(`🔄 [App] Version changed: ${newVersion} (internal: ${internalVersion})`);
  };
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showSupportPolicies, setShowSupportPolicies] = useState(false);
  const [showCompatibilityMatrix, setShowCompatibilityMatrix] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const versionDropdownTriggerRef = useRef<(() => void) | null>(null);
  
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);
  const isNavigatingBack = useRef(false);

  // Initialize content loader with selected version
  useEffect(() => {
    const internalVersion = versionMap[selectedVersion] || selectedVersion;
    setVersion(internalVersion);
    console.log(`🚀 [App] Initialized content loader with version: ${internalVersion}`);
  }, []); // Only run on mount

  // Initialize state from URL on mount
  useEffect(() => {
    const urlState = getCurrentState();
    console.log('🔍 [App] Initial URL state:', urlState);
    
    // Store initial state in history
    window.history.replaceState(urlState, '', window.location.href);
    
    if (urlState.specialPage) {
      // Handle special pages
      if (urlState.specialPage === 'compatibility-matrix') {
        setShowCompatibilityMatrix(true);
      } else if (urlState.specialPage === 'product-support-policies') {
        setShowSupportPolicies(true);
      } else if (urlState.specialPage === 'knowledge-base') {
        setShowKnowledgeBase(true);
      } else if (urlState.specialPage === 'virima-tech-central') {
        setShowCommunityForum(true);
      } else if (urlState.specialPage === 'glossary') {
        setShowGlossary(true);
      }
      isInitialLoad.current = false;
      return;
    }
    
    // Restore navigation state from URL
    if (urlState.version) {
      setSelectedVersion(urlState.version);
      const internalVersion = versionMap[urlState.version] || urlState.version;
      setVersion(internalVersion);
    }
    
    if (urlState.module) {
      setSelectedModule(urlState.module);
    }
    
    if (urlState.section) {
      setSelectedSection(urlState.section);
    }
    
    if (urlState.page) {
      setSelectedPage(urlState.page);
    }
    
    isInitialLoad.current = false;
  }, []); // Only run on mount

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log('⬅️ [App] Browser back/forward detected:', event.state);
      isNavigatingBack.current = true;
      
      const state = event.state || getCurrentState();
      
      // Reset all special page flags
      setShowCommunityForum(false);
      setShowKnowledgeBase(false);
      setShowSupportPolicies(false);
      setShowCompatibilityMatrix(false);
      setShowGlossary(false);

      // Handle special pages
      if (state.specialPage) {
        if (state.specialPage === 'compatibility-matrix') {
          setShowCompatibilityMatrix(true);
        } else if (state.specialPage === 'product-support-policies') {
          setShowSupportPolicies(true);
        } else if (state.specialPage === 'knowledge-base') {
          setShowKnowledgeBase(true);
        } else if (state.specialPage === 'virima-tech-central') {
          setShowCommunityForum(true);
        } else if (state.specialPage === 'glossary') {
          setShowGlossary(true);
        }
        setSelectedModule('');
        setSelectedSection('');
        setSelectedPage('');
        return;
      }
      
      // Restore navigation state
      if (state.version) {
        setSelectedVersion(state.version);
        const internalVersion = versionMap[state.version] || state.version;
        setVersion(internalVersion);
      } else {
        setSelectedVersion('6.1');
      }
      
      setSelectedModule(state.module || '');
      setSelectedSection(state.section || '');
      setSelectedPage(state.page || '');
      
      // Reset flag after a short delay
      setTimeout(() => {
        isNavigatingBack.current = false;
      }, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Only run on mount

  // Enable MDX testing mode with URL parameter
  const showMDXTest = window.location.search.includes('test-mdx');

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
      // Also support Cmd/Ctrl + / as alternative
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state changes to URL (except during back/forward navigation)
  useEffect(() => {
    // Skip URL update on initial load or during back/forward navigation
    if (isInitialLoad.current || isNavigatingBack.current) {
      return;
    }
    
    // Skip if we're on a special page (handled in their respective handlers)
    if (showCommunityForum || showKnowledgeBase || showSupportPolicies || showCompatibilityMatrix || showGlossary) {
      return;
    }
    
    // Update URL when navigation state changes
    updateUrl({
      version: selectedVersion,
      module: selectedModule,
      section: selectedSection,
      page: selectedPage,
    });
  }, [selectedVersion, selectedModule, selectedSection, selectedPage, showCommunityForum, showKnowledgeBase, showSupportPolicies, showCompatibilityMatrix, showGlossary]);

  // Universal scroll-to-top on navigation
  // This ensures every navigation action starts at the top of the page
  useEffect(() => {
    // Use multiple requestAnimationFrame calls to ensure DOM is fully ready
    const scrollToTop = () => {
      // Scroll content container if it exists
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({
          top: 0,
          behavior: 'instant'
        });
      }
      
      // Also scroll window to top (for any window-level scrolling)
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

    // Use double RAF to ensure content is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTop();
      });
    });
  }, [selectedVersion, selectedModule, selectedSection, selectedPage]);

  const showHomePage = !selectedModule && !showCommunityForum && !showKnowledgeBase && !showSupportPolicies && !showCompatibilityMatrix && !showGlossary;

  const handleModuleChange = async (module: string) => {
    // Check if it's the community forum special case
    if (module === 'virima-tech-central') {
      setShowCommunityForum(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'virima-tech-central' });
      }
      return;
    }
    
    // Check if it's the knowledge base special case
    if (module === 'knowledge-base') {
      setShowKnowledgeBase(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'knowledge-base' });
      }
      return;
    }
    
    // Check if it's the product support policies special case
    if (module === 'product-support-policies') {
      setShowSupportPolicies(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'product-support-policies' });
      }
      return;
    }
    
    // Check if it's the compatibility matrix special case
    if (module === 'compatibility-matrix') {
      setShowCompatibilityMatrix(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'compatibility-matrix' });
      }
      return;
    }

    // Check if it's the glossary special case
    if (module === 'glossary') {
      setShowGlossary(true);
      if (!isNavigatingBack.current) {
        updateUrl({ specialPage: 'glossary' });
      }
      return;
    }

    // Scroll to top immediately on module change
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedModule(module);
    
    // Load hierarchical TOC to get the first section and page
    try {
      const toc = await loadHierarchicalToc(selectedVersion);
      const selectedModuleData = toc.modules.find(m => m.id === module);
      
      if (selectedModuleData && selectedModuleData.sections.length > 0) {
        const firstSection = selectedModuleData.sections[0];
        
        if (firstSection && firstSection.pages.length > 0) {
          const firstPage = firstSection.pages[0];
          setSelectedSection(firstSection.id);
          setSelectedPage(firstPage.id);
          
          // Update URL
          if (!isNavigatingBack.current) {
            updateUrl({
              version: selectedVersion,
              module: module,
              section: firstSection.id,
              page: firstPage.id,
            });
          }
          
          console.log('✅ Set section and page from hierarchical TOC:', {
            section: firstSection.id,
            page: firstPage.id
          });
          return; // Successfully set from TOC
        }
      }
      
      console.warn('⚠️ Module has no sections or pages in TOC — falling back to doc-graph:', module);
    } catch (error) {
      console.error('❌ Failed to load hierarchical TOC for module selection:', error);
    }

    // Fallback: use doc-graph to find first section + page for flat-structure modules
    try {
      const sections = await getModuleSections(module);
      if (sections.length > 0) {
        const firstSection = sections[0];
        const nodes = await getSectionNodes(module, firstSection.id);
        if (nodes.length > 0) {
          const firstPage = nodes[0];
          setSelectedSection(firstSection.id);
          setSelectedPage(firstPage.navId);
          if (!isNavigatingBack.current) {
            updateUrl({
              version: selectedVersion,
              module,
              section: firstSection.id,
              page: firstPage.navId,
            });
          }
          console.log('✅ [doc-graph fallback] Set section/page:', { section: firstSection.id, page: firstPage.navId });
          return;
        }
      }
    } catch (graphError) {
      console.error('❌ Doc-graph fallback also failed:', graphError);
    }

    // Nothing found — show empty module landing page
    setSelectedSection('');
    setSelectedPage('');
    if (!isNavigatingBack.current) {
      updateUrl({ version: selectedVersion, module });
    }
  };

  const handleHomeClick = () => {
    // Scroll to top when going home
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    setSelectedModule('');
    setSelectedSection('');
    setSelectedPage('');
    setShowCommunityForum(false);
    setShowKnowledgeBase(false);
    setShowSupportPolicies(false);
    setShowCompatibilityMatrix(false);
    setShowGlossary(false);

    // Update URL to homepage
    if (!isNavigatingBack.current) {
      updateUrl({});
    }
  };

  // Show test interface if requested
  if (showMDXTest) {
    return <MDXRenderingTest />;
  }

  return (
    <ThemeProvider>
      <GlobalChatProvider
        currentModule={selectedModule}
        currentPage={selectedPage}
      >
        <div className="min-h-screen bg-white dark:bg-slate-900">
          {/* AI Discovery Monitoring Dashboard (dev mode only) */}
          <AIMonitoringDashboard />
          
          {showCommunityForum ? (
            <VirumaTechCentral onBack={handleHomeClick} />
          ) : showKnowledgeBase ? (
            <VirimaKnowledgeBase onBack={handleHomeClick} />
          ) : showSupportPolicies ? (
            <ProductSupportPolicies onBack={handleHomeClick} />
          ) : showCompatibilityMatrix ? (
            <CompatibilityMatrix onBack={handleHomeClick} />
          ) : showGlossary ? (
            <GlossaryPage onBack={handleHomeClick} />
          ) : (
            <DocumentationLayout
            selectedVersion={selectedVersion}
            onVersionChange={handleVersionChange}
            selectedModule={selectedModule}
            onModuleChange={handleModuleChange}
            selectedSection={selectedSection}
            onSectionChange={(section) => {
              // Scroll to top on section change
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
              setSelectedSection(section);
              
              // Update URL
              if (!isNavigatingBack.current) {
                updateUrl({
                  version: selectedVersion,
                  module: selectedModule,
                  section: section,
                  page: selectedPage, // Keep current page if section changes
                });
              }
            }}
            selectedPage={selectedPage}
            onPageChange={(page) => {
              // Scroll to top on page change
              if (contentContainerRef.current) {
                contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
              }
              window.scrollTo({ top: 0, behavior: 'instant' });
              setSelectedPage(page);
              
              // Update URL
              if (!isNavigatingBack.current) {
                updateUrl({
                  version: selectedVersion,
                  module: selectedModule,
                  section: selectedSection,
                  page: page,
                });
              }
            }}
            onHomeClick={handleHomeClick}
            isHomePage={showHomePage}
            versionDropdownTriggerRef={versionDropdownTriggerRef}
            contentContainerRef={contentContainerRef}
            onSearchDialogOpen={() => setSearchDialogOpen(true)}
          >
            {showHomePage ? (
              <HomePage onModuleSelect={handleModuleChange} onSearchDialogOpen={() => setSearchDialogOpen(true)} />
            ) : (
              <DocumentationContent
                version={selectedVersion}
                module={selectedModule}
                section={selectedSection}
                page={selectedPage}
                onHomeClick={handleHomeClick}
                onModuleClick={async () => {
                  // Scroll to top on module click
                  if (contentContainerRef.current) {
                    contentContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
                  }
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  
                  // Load TOC and navigate to first page of module
                  try {
                    const toc = await loadHierarchicalToc(selectedVersion);
                    const module = toc.modules.find(m => m.id === selectedModule);
                    
                    if (module && module.sections.length > 0) {
                      const firstSection = module.sections[0];
                      if (firstSection && firstSection.pages.length > 0) {
                        const firstPage = firstSection.pages[0];
                        setSelectedSection(firstSection.id);
                        setSelectedPage(firstPage.id);
                        return;
                      }
                    }
                  } catch (error) {
                    console.error('Failed to load module:', error);
                  }
                  
                  // Fallback: set empty
                  setSelectedSection('');
                  setSelectedPage('');
                }}
                onVersionClick={() => {
                  versionDropdownTriggerRef.current?.();
                }}
                onSectionPageNavigate={(sec, pg) => {
                  setSelectedSection(sec);
                  setSelectedPage(pg);
                }}
              />
            )}
          </DocumentationLayout>
          )}

        {/* Search Dialog */}
        <SearchDialog
          isOpen={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
          onNavigate={(module, sectionId, pageId, anchor) => {
            setSelectedModule(module);
            setSelectedSection(sectionId);
            setSelectedPage(pageId);
            setSearchDialogOpen(false);
            updateUrl({ version: selectedVersion, module, section: sectionId, page: pageId });
            // Deep-link to section anchor after navigation completes
            if (anchor) {
              setTimeout(() => {
                const el = document.getElementById(anchor);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 500);
            }
          }}
        />
      </div>
    </GlobalChatProvider>
    </ThemeProvider>
  );
}