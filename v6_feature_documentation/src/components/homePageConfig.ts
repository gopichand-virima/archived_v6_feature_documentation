/**
 * Shared Configuration for HomePage and CoverPage
 * 
 * This file contains shared constants, data, and utilities that both
 * HomePage and CoverPage components use. Changes made here will be
 * automatically reflected in both components.
 * 
 * Purpose:
 * - Prevent code duplication between HomePage and CoverPage
 * - Ensure consistency when both components need the same data
 * - Allow CoverPage to remain lightweight even if HomePage has many changes
 */

// Image assets - shared between components
export const homePageAssets = {
  aiIcon: "/assets/ai_chat.png",
  logo: "/assets/virima_logo.png",
} as const;

// Module definitions - shared module data
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

// Quick Links definitions - shared quick links data
export interface QuickLinkDefinition {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
  href?: string;
  onClick?: string; // Module ID to trigger
}

// Animation configuration - shared animation settings
export const animationConfig = {
  background: {
    duration: 1.2,
    ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
    opacity: 0.09,
    darkOpacity: 0.5,
  },
  title: {
    delay: 1.4,
    duration: 0.8,
    ease: "easeOut" as const,
  },
  tagline: {
    delay: 1.6,
    duration: 0.8,
    ease: "easeOut" as const,
  },
  description: {
    delay: 1.8,
    duration: 0.8,
    ease: "easeOut" as const,
  },
  search: {
    delay: 2.0,
    duration: 0.6,
    ease: "easeOut" as const,
  },
  button: {
    delay: 2.2,
    duration: 0.6,
    ease: "easeOut" as const,
  },
} as const;

// Text content - shared text strings
export const homePageText = {
  brand: "VIRIMA",
  tagline: "Welcome to the Documentation Platform",
  description: "Explore comprehensive feature documentation, release notes, and more across all Virima modules and versions.",
  searchPlaceholder: "Search docs...",
  searchPlaceholderMobile: "Search docs...",
  getStartedButton: "Get Started",
  valueProposition: {
    title: "Enterprise IT Operations, Simplified",
    description: "Virima delivers a comprehensive suite of IT management solutions designed for enterprise-scale operations with the agility modern businesses demand.",
  },
  quickLinks: {
    title: "Quick Links",
  },
} as const;

