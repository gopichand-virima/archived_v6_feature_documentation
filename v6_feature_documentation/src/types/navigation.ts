/**
 * navigation.ts
 * Shared type definitions for navigation and TOC structures.
 */

export interface TocEntry {
  id: string
  title: string
  level: number
  children?: TocEntry[]
}

export interface NavSection {
  id: string
  label: string
  pages: NavPage[]
}

export interface NavPage {
  id: string
  label: string
  path: string
  isActive?: boolean
}

export interface BreadcrumbItem {
  label: string
  path?: string
}
