/**
 * MDX Link Converter Utility
 * 
 * Converts relative MDX file paths in cross-references to proper navigation routes
 * Works universally for all modules across all versions (NG, 6.1, 6.1.1, 5.13)
 * 
 * Example: /admin_org_details/cost_center_6_1.md → /6.1/admin/organizational-details/cost-center
 * Example: /itsm/release_mngmt/tasks_6_1.md → /6.1/itsm/release-management/tasks
 * Example: /discovery/comments_6_1.md → /6.1/discovery-scan/.../comments
 */

import { getBasePath } from './browserHistory';
import { loadTocForVersion } from './tocLoader';

/**
 * Comprehensive module and section mapping
 * Maps file path patterns to navigation module/section IDs
 */
const moduleSectionMap: Array<{
  pattern: RegExp;
  module: string;
  section: string;
}> = [
  // Admin - Organizational Details
  { pattern: /admin_org_details/, module: 'admin', section: 'organizational-details' },
  
  // Admin - Discovery
  { pattern: /admin_discovery/, module: 'admin', section: 'discovery' },
  
  // Admin - SACM
  { pattern: /admin_sacm/, module: 'admin', section: 'sacm' },
  
  // Admin - Users
  { pattern: /admin_users/, module: 'admin', section: 'users' },
  
  // Admin - Management Functions
  { pattern: /admin_change_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_contract_mngmt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_event_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_hardware_asset_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_incident_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_knowledge_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_problem_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_procurement/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_project_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_release_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_request_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_vendor_mngmnt/, module: 'admin', section: 'management-functions' },
  { pattern: /admin_sla/, module: 'admin', section: 'management-functions' },
  
  // Admin - Integrations
  { pattern: /admin_integrations/, module: 'admin', section: 'integrations' },
  
  // Admin - Others
  { pattern: /admin_other/, module: 'admin', section: 'others' },
  
  // ITSM - Incident Management
  { pattern: /itsm\/incident_mngmt|itsm_ng\/incident_mngmnt/, module: 'itsm', section: 'incident-management' },
  
  // ITSM - Change Management
  { pattern: /itsm\/change_mngmnt|itsm_ng\/change_mngmnt/, module: 'itsm', section: 'change-management' },
  
  // ITSM - Problem Management
  { pattern: /itsm\/problem_mngmt|itsm_ng\/problem_mngmt/, module: 'itsm', section: 'problem-management' },
  
  // ITSM - Release Management
  { pattern: /itsm\/release_mngmt|itsm_ng\/release_mngmt/, module: 'itsm', section: 'release-management' },
  
  // ITSM - Request Fulfillment
  { pattern: /itsm\/request_fulfillment|itsm_ng\/request_fulfillment/, module: 'itsm', section: 'request-fulfillment' },
  
  // ITSM - Service Portfolio
  { pattern: /itsm\/service_portfolio|itsm_ng\/service_portfolio/, module: 'itsm', section: 'service-portfolio' },
  
  // ITSM - Knowledge Management
  { pattern: /itsm\/knowledge_mngmt|itsm_ng\/knowledge_mngmt/, module: 'itsm', section: 'knowledge-management' },
  
  // ITSM - Configuration Management
  { pattern: /itsm\/config_mngmt|itsm_ng\/config_mngmt/, module: 'itsm', section: 'configuration-management' },
  
  // ITSM - RunBook
  { pattern: /itsm\/runbook|itsm_ng\/runbook/, module: 'itsm', section: 'runbook' },
  
  // Discovery Scan
  { pattern: /discovery\/dashboard|discovery_ng\/dashboard|discovery_6_1\/dashboard/, module: 'discovery-scan', section: 'dashboard' },
  { pattern: /discovery\/run_a_scan|discovery_ng\/run_a_scan|discovery_6_1\/run_a_scan/, module: 'discovery-scan', section: 'run-a-scan' },
  { pattern: /discovery\/recent_scans|discovery_ng\/recent_scans|discovery_6_1\/recent_scans/, module: 'discovery-scan', section: 'recent-scans' },
  { pattern: /discovery\/scheduled_scans_imports|discovery_ng\/scheduled_scans_imports|discovery_6_1\/scheduled_scans_imports/, module: 'discovery-scan', section: 'scheduled-scans-and-imports' },
  { pattern: /discovery\/ipam_networks|discovery_ng\/ipam_networks|discovery_6_1\/ipam_networks/, module: 'discovery-scan', section: 'ipam-networks' },
  { pattern: /discovery\/discovered_items|discovery_ng\/discovered_items|discovery_6_1\/discovered_items/, module: 'discovery-scan', section: 'discovered-items' },
  { pattern: /discovery\/import_from_aws|discovery_ng\/import_from_aws|discovery_6_1\/import_from_aws/, module: 'discovery-scan', section: 'import-from-aws' },
  { pattern: /discovery\/import_from_azure|discovery_ng\/import_from_azure|discovery_6_1\/import_from_azure/, module: 'discovery-scan', section: 'import-from-azure' },
  { pattern: /discovery\/import_from_meraki|discovery_ng\/import_from_meraki|discovery_6_1\/import_from_meraki/, module: 'discovery-scan', section: 'import-from-meraki' },
  { pattern: /discovery\/import_from_intune|discovery_ng\/import_from_intune|discovery_6_1\/import_from_intune/, module: 'discovery-scan', section: 'import-from-intune' },
  { pattern: /discovery\/import_data_files|discovery_ng\/import_data_files|discovery_6_1\/import_data_files/, module: 'discovery-scan', section: 'import-data-files' },
  { pattern: /discovery\/imported_assets|discovery_ng\/imported_assets|discovery_6_1\/imported_assets/, module: 'discovery-scan', section: 'imported-assets' },
  { pattern: /discovery\/ad_azure_import_logs|discovery_ng\/ad_azure_import_logs|discovery_6_1\/ad_azure_import_logs/, module: 'discovery-scan', section: 'ad-user-import-logs' },
  { pattern: /discovery\/azure_ad_import_logs|discovery_ng\/azure_ad_import_logs|discovery_6_1\/azure_ad_import_logs/, module: 'discovery-scan', section: 'azure-ad-user-import-logs' },
  { pattern: /discovery\/comments|discovery\/attachments|discovery\/tasks/, module: 'discovery-scan', section: 'dashboard' }, // Common topics
  
  // CMDB
  { pattern: /cmdb/, module: 'cmdb', section: 'getting-started' },
  
  // Self Service
  { pattern: /self_service|self_service_ng|self_service_6_1|self_service_6_1_1|self_service_5_13/, module: 'self-service', section: 'overview' },
  
  // Reports
  { pattern: /reports|reports_ng|reports_6_1|reports_6_1_1|reports_5_13/, module: 'reports', section: 'overview' },
  
  // Program/Project Management
  { pattern: /prog_proj_mngmnt|prog_proj_mngmnt_ng/, module: 'program-project-management', section: 'overview' },
  
  // Risk Register
  { pattern: /risk_register|risk_register_ng/, module: 'risk-register', section: 'overview' },
  
  // Vulnerability Management
  { pattern: /vulnerability_managment|vulnerability_management/, module: 'vulnerability-management', section: 'overview' },
  
  // ITAM
  { pattern: /itam|itam_ng/, module: 'itam', section: 'overview' },
  
  // My Dashboard
  { pattern: /dashboard_ng|dashboard_6_1|getting_started|application_overview/, module: 'my-dashboard', section: 'getting-started' },
  
  // Common topics - these are referenced from within other modules, so we'll try to infer from context
  { pattern: /common_topics/, module: '', section: '' }, // Will be handled specially
];

/**
 * Extract version from file path
 */
function extractVersionFromPath(filePath: string): string | null {
  // Match patterns like /content/6_1/, /content/6_1_1/, /content/5_13/, /content/NG/
  const versionMatch = filePath.match(/\/content\/(6_1|6_1_1|5_13|NG)\//);
  if (!versionMatch) return null;
  
  const internalVersion = versionMatch[1];
  // Map internal version to display version
  const versionMap: Record<string, string> = {
    '6_1': '6.1',
    '6_1_1': '6.1.1',
    '5_13': '5.13',
    'NG': 'NextGen',
  };
  
  return versionMap[internalVersion] || null;
}

/**
 * Extract version from file name
 */
function extractVersionFromFileName(fileName: string): string | null {
  if (fileName.includes('_6_1_1_1')) {
    return '6.1.1';
  } else if (fileName.includes('_6_1_1')) {
    return '6.1.1';
  } else if (fileName.includes('_6_1')) {
    return '6.1';
  } else if (fileName.includes('_5_13')) {
    return '5.13';
  } else if (fileName.includes('_ng')) {
    return 'NextGen';
  }
  return null;
}

/**
 * Convert snake_case or mixed case to kebab-case page ID
 */
function fileNameToPageId(fileName: string): string {
  // Remove version suffixes
  let baseName = fileName
    .replace(/_6_1_1_1$/, '')
    .replace(/_6_1_1$/, '')
    .replace(/_6_1$/, '')
    .replace(/_5_13$/, '')
    .replace(/_ng$/, '');
  
  // Convert snake_case to kebab-case
  return baseName.replace(/_/g, '-').toLowerCase();
}

/**
 * Extract module and section from relative path using pattern matching
 */
function extractModuleAndSection(relativePath: string): { module: string; section: string } | null {
  // Try each pattern in order (more specific patterns should come first)
  for (const { pattern, module, section } of moduleSectionMap) {
    if (pattern.test(relativePath)) {
      if (module && section) {
        return { module, section };
      }
      // Special case: common_topics - we'll handle this differently
      if (relativePath.includes('common_topics')) {
        return null; // Will be handled by TOC lookup
      }
    }
  }
  
  return null;
}

/**
 * Try to resolve route using TOC lookup (async)
 * This is the most accurate method
 */
async function resolveRouteFromTOC(
  relativePath: string,
  version: string,
  _currentFilePath?: string
): Promise<string | null> {
  try {

    // Try to extract the actual file path from the relative path
    // Patterns like /itsm/release_mngmt/tasks_6_1.md
    // or /admin_org_details/cost_center_6_1.md
    const cleanPath = relativePath.replace(/^\//, '').replace(/\.md$/, '');
    const pathParts = cleanPath.split('/');
    
    // Load TOC for this version
    const toc = await loadTocForVersion(version);
    
    // Search through all modules, sections, and pages to find matching file path
    for (const module of toc.modules) {
      for (const section of module.sections) {
        const findPage = (pages: any[]): any | null => {
          for (const page of pages) {
            // Check if the file path matches
            if (page.filePath) {
              const filePathParts = page.filePath.split('/').filter(Boolean);
              const fileName = filePathParts[filePathParts.length - 1]?.replace(/\.md$/, '');
              const relativeFileName = pathParts[pathParts.length - 1];
              
              // Match if file names match (ignoring version suffix)
              if (fileName && relativeFileName && 
                  (fileName === relativeFileName || 
                   fileName.replace(/_(6_1|6_1_1|5_13|ng)$/, '') === relativeFileName.replace(/_(6_1|6_1_1|5_13|ng)$/, ''))) {
                // Found matching page!
                const basePath = getBasePath();
                return `${basePath}/${version}/${module.id}/${section.id}/${page.id}`;
              }
            }
            
            // Check sub-pages
            if (page.subPages) {
              const found = findPage(page.subPages);
              if (found) return found;
            }
          }
          return null;
        };
        
        const route = findPage(section.pages);
        if (route) {
          return route;
        }
      }
    }
  } catch (error) {
    console.warn('[MDXLinkConverter] TOC lookup failed:', error);
  }
  
  return null;
}

/**
 * Convert relative MDX file path to navigation route
 * 
 * @param relativePath - Relative path like /admin_org_details/cost_center_6_1.md or /itsm/release_mngmt/tasks_6_1.md
 * @param currentFilePath - Current file path for context (e.g., /content/6_1/admin_6_1/admin_org_details/about_org_details_6_1.md)
 * @returns Navigation route like /6.1/admin/organizational-details/cost-center or null if conversion fails
 */
export async function convertMDXPathToRoute(relativePath: string, currentFilePath?: string): Promise<string | null> {
  // Accept .md links
  if (!relativePath || (!relativePath.endsWith('.md'))) {
    return null;
  }

  // Remove leading slash and file extension
  const cleanPath = relativePath.replace(/^\//, '').replace(/\.md$/, '');
  const pathParts = cleanPath.split('/');
  const fileName = pathParts[pathParts.length - 1] || cleanPath;
  
  // Extract version
  let version: string | null = null;
  if (currentFilePath) {
    version = extractVersionFromPath(currentFilePath);
  }
  if (!version) {
    version = extractVersionFromFileName(fileName);
  }
  
  if (!version) {
    console.warn(`[MDXLinkConverter] Could not determine version for path: ${relativePath}`);
    return null;
  }
  
  // First, try TOC lookup (most accurate)
  const tocRoute = await resolveRouteFromTOC(relativePath, version, currentFilePath);
  if (tocRoute) {
    return tocRoute;
  }
  
  // Fallback to pattern matching
  const moduleSection = extractModuleAndSection(relativePath);
  if (!moduleSection || !moduleSection.module || !moduleSection.section) {
    console.warn(`[MDXLinkConverter] Could not determine module/section for path: ${relativePath}`);
    return null;
  }
  
  // Get page ID from file name
  const pageId = fileNameToPageId(fileName);
  
  // Build navigation route
  const basePath = getBasePath();
  const route = `${basePath}/${version}/${moduleSection.module}/${moduleSection.section}/${pageId}`;
  
  return route;
}

/**
 * Check if a path is a relative markdown file path that needs conversion.
 * Accepts both .md and .md for tolerance during transition.
 */
export function isRelativeMDXPath(href: string): boolean {
  return href.startsWith('/') &&
         href.endsWith('.md') &&
         !href.startsWith('http') &&
         !href.startsWith('/content/');
}
