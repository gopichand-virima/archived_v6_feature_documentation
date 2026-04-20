/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional: Serper API key for the "Search Web" tab.
   * When not set, the Search Web tab is hidden.
   * Security: This key is compiled into the JS bundle. Restrict its usage
   * at the Serper dashboard level (domain restrictions + rate limits).
   */
  readonly VITE_SERPER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
