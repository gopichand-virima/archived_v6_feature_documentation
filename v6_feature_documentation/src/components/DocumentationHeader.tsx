import { Menu, X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../lib/theme/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ThemeToggle } from "./ThemeToggle";

interface DocumentationHeaderProps {
  showSidebar: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  isHomePage: boolean;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  versions: string[];
  versionDropdownOpen: boolean;
  onVersionDropdownOpenChange: (open: boolean) => void;
  onSearchDialogOpen: () => void;
  onLoginDialogOpen: () => void;
  onReleaseNotesClick?: () => void;
  onDocumentationClick?: () => void;
  selectedModule?: string;
}

/* Shared logo SVG extracted to avoid repetition */
const VirimaLogo = () => (
  <svg width="38" height="25" viewBox="0 0 50 33" fill="none" aria-hidden="true" className="flex-shrink-0">
    <path d="M49.9994 15.8871C49.9994 15.8871 45.192 23.4867 37.7038 28.2218C30.2156 32.957 24.4453 32.7994 24.4453 32.7994V26.817C24.4453 26.817 34.5173 25.2958 34.5173 15.8871C34.5173 6.47846 24.9302 6.38938 24.9302 6.38938L24.8194 0.112373C24.8194 0.112373 30.2087 -0.846994 38.4727 3.94984C43.3898 6.75663 47.3901 10.8995 49.9994 15.8871Z" fill="url(#vlogo_grad_h)"/>
    <path d="M23.4202 31.6139V30.0721L22.0694 29.2977L20.7256 30.0721V31.6139L22.0694 32.3814L23.4202 31.6139Z" fill="#55BA63"/>
    <path d="M17.6027 31.436V30.2436L16.5567 29.6475L15.5107 30.2436V31.436L16.5567 32.0322L17.6027 31.436Z" fill="#55BA63"/>
    <path d="M22.0706 27.6191V24.4669L19.3136 22.8907L16.5566 24.4669V27.6191L19.3136 29.1952L22.0706 27.6191Z" fill="#55BA63"/>
    <path d="M15.2192 26.8583V25.2273L13.7922 24.4119L12.3652 25.2273V26.8583L13.7922 27.6737L15.2192 26.8583Z" fill="#55BA63"/>
    <path d="M12.8916 22.3079V20.1905L11.0352 19.1283L9.17871 20.1905V22.3079L11.0352 23.3701L12.8916 22.3079Z" fill="#55BA63"/>
    <path d="M6.9558 22.0682V20.4305L5.51496 19.6082L4.08105 20.4305V22.0682L5.51496 22.8906L6.9558 22.0682Z" fill="#55BA63"/>
    <path d="M5.51397 18.032V14.8798L2.75698 13.3037L0 14.8798V18.032L2.75698 19.6081L5.51397 18.032Z" fill="#55BA63"/>
    <path d="M15.2192 17.2713V15.6404L13.7922 14.825L12.3652 15.6404V17.2713L13.7922 18.0868L15.2192 17.2713Z" fill="#55BA63"/>
    <path d="M7.11471 12.3581V10.734L5.68772 9.91858L4.26074 10.734V12.3581L5.68772 13.1804L7.11471 12.3581Z" fill="#55BA63"/>
    <path d="M13.1825 12.8857V10.4324L11.0351 9.20581L8.8877 10.4324V12.8857L11.0351 14.1123L13.1825 12.8857Z" fill="#55BA63"/>
    <path d="M15.2341 7.68459V6.03997L13.7933 5.21765L12.3594 6.03997V7.68459L13.7933 8.50691L15.2341 7.68459Z" fill="#55BA63"/>
    <path d="M20.6645 7.53384V5.992L19.3137 5.21765L17.9629 5.992V7.53384L19.3137 8.30818L20.6645 7.53384Z" fill="#55BA63"/>
    <path d="M23.4206 3.059V1.07859L21.6888 0.0849609L19.957 1.07859V3.059L21.6888 4.04578L23.4206 3.059Z" fill="#55BA63"/>
    <path d="M25.167 21.5131L29.7319 18.82L29.6696 13.5641L25.1878 16.2023L25.167 21.5131Z" fill="#7DC242"/>
    <path d="M25.1873 16.2025L29.6691 13.5642L25.021 10.9945L20.4561 13.6876L25.1873 16.2025Z" fill="#CBDB2A"/>
    <path d="M20.4561 13.6875L20.5184 18.9435L25.1665 21.5132L25.1873 16.2024L20.4561 13.6875Z" fill="#A4D178"/>
    <defs>
      <radialGradient id="vlogo_grad_h" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-886.997 -1264.3) rotate(180) scale(1751.86 1748.95)">
        <stop offset="0.05" stopColor="#B9D877"/>
        <stop offset="1" stopColor="#32B44A"/>
      </radialGradient>
    </defs>
  </svg>
);

const navLinkCls = "text-sm text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 bg-transparent border-0 cursor-pointer font-medium";

export function DocumentationHeader({
  showSidebar,
  sidebarOpen,
  onToggleSidebar,
  onHomeClick,
  isHomePage,
  selectedVersion,
  onVersionChange,
  versions,
  versionDropdownOpen,
  onVersionDropdownOpenChange,
  onSearchDialogOpen,
  onLoginDialogOpen: _onLoginDialogOpen,
  onReleaseNotesClick,
  onDocumentationClick,
  selectedModule,
}: DocumentationHeaderProps) {

  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";
  const isReleaseNotes = selectedModule === 'release-notes';
  const activeNavCls = "text-sm text-green-600 dark:text-green-500 font-semibold bg-transparent border-0 cursor-pointer";

  /* ── Homepage header: cream/dark bg matching hero section ── */
  if (isHomePage) {
    const heroBg = isDark ? "#0a0a0a" : "#f0ede8";
    return (
      <header
        className="sticky top-0 z-50 transition-colors duration-100 border-b border-transparent"
        style={{ background: heroBg }}
      >
        <div className="max-w-[1920px] mx-auto flex items-center h-14 sm:h-16 px-4 sm:px-6 lg:px-8">

          {/* Logo — far left */}
          <button
            onClick={onHomeClick}
            className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Home"
          >
            <VirimaLogo />
          </button>

          {/* Centred nav */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
            <button className="text-sm text-green-600 dark:text-green-500 font-semibold bg-transparent border-0 cursor-pointer">
              Home
            </button>
            <a
              href="https://login-v61b.virima.com/www_em/pages/usersDashboard/?entity=my-dashboard-items&tab=MyciTab"
              target="_blank"
              rel="noopener noreferrer"
              className={navLinkCls}
            >
              Console
            </a>
            <button className={navLinkCls} onClick={onDocumentationClick}>
              Documentation
            </button>
            <button className={navLinkCls} onClick={onReleaseNotesClick}>
              Release Notes
            </button>
          </nav>

          {/* Right — theme toggle only on homepage */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  /* ── Docs-page header: matches homepage layout (cream bg + centred nav) ── */
  const docsBg = isDark ? "#0a0a0a" : "#f0ede8";
  return (
    <header
      className={`border-b transition-colors duration-100 ${versionDropdownOpen ? 'header-border-hidden' : 'border-slate-200/60 dark:border-slate-700/60'} sticky top-0 z-50`}
      style={{ background: docsBg }}
    >
      <div className="max-w-[1920px] mx-auto flex items-center h-14 sm:h-16 px-4 sm:px-6 lg:px-8">

        {/* Mobile sidebar toggle */}
        {showSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ml-2 mr-2 flex-shrink-0"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Logo — far left */}
        <button
          onClick={onHomeClick}
          className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Home"
        >
          <VirimaLogo />
        </button>

        {/*
         * Right cluster — Version · Search · Theme
         * ml-auto pushes the cluster to the far right.
         * Version:  always
         * Search:   xl+  (avoid overlap with centred nav below 1280 px)
         * Theme:    always
         */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
          {/* Search bar — enterprise input-style, xl+ only */}
          <button
            onClick={onSearchDialogOpen}
            className="hidden xl:flex items-center gap-3 h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 w-[320px] 2xl:w-[400px] flex-shrink-0"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              boxShadow: isDark ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : '0 1px 2px rgba(0,0,0,0.05)',
            }}
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="flex-1 text-left text-sm text-slate-400 dark:text-slate-500 truncate">Search documentation...</span>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Version pill */}
          <Select
            value={selectedVersion}
            onValueChange={onVersionChange}
            open={versionDropdownOpen}
            onOpenChange={onVersionDropdownOpenChange}
          >
            <SelectTrigger className="version-pill h-9 px-4 font-semibold text-sm rounded-full gap-2 w-auto focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={-2}
              className="border border-slate-200/80 dark:border-[#1a1a1a] shadow-2xl rounded-xl min-w-[160px] py-1 z-[60]"
            >
              <div className="px-3 pt-2.5 pb-1">
                <p className="font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-left" style={{ fontSize: '9px', letterSpacing: '0.14em' }}>Version</p>
              </div>
              {versions.map((version) => (
                <SelectItem
                  key={version}
                  value={version}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-100 py-2 pl-3 pr-8"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    {version}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Centred nav — mirrors homepage; active link highlighted green */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 lg:gap-12">
          <button className={navLinkCls} onClick={onHomeClick}>
            Home
          </button>
          <a
            href="https://login-v61b.virima.com/www_em/pages/usersDashboard/?entity=my-dashboard-items&tab=MyciTab"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkCls}
          >
            Console
          </a>
          <button
            className={isReleaseNotes ? navLinkCls : activeNavCls}
            onClick={onDocumentationClick}
          >
            Documentation
          </button>
          <button
            className={isReleaseNotes ? activeNavCls : navLinkCls}
            onClick={onReleaseNotesClick}
          >
            Release Notes
          </button>
        </nav>

      </div>
    </header>
  );
}