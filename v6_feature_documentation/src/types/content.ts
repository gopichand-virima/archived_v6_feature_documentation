/**
 * content.ts
 * Shared type definitions for the documentation content model.
 */

/** Supported documentation versions */
export type DocVersion = 'NG' | '6.1.1' | '6.1' | '5.13'

/** Display label → internal version code mapping */
export const VERSION_MAP: Record<string, DocVersion> = {
  NextGen: 'NG',
  '6.1.1': '6.1.1',
  '6.1': '6.1',
  '5.13': '5.13',
} as const

/** Module within a version */
export interface DocModule {
  id: string
  label: string
  icon?: string
}

/** A single documentation page */
export interface DocPage {
  id: string
  title: string
  path: string
  version: DocVersion
  module: string
  section?: string
}

/** Content loading result */
export interface ContentLoadResult {
  content: string | null
  source: 'static-import' | 'direct-fetch' | 'mdx-bundle' | 'server-fetch' | 'registry' | 'not-found'
  error?: string
}
