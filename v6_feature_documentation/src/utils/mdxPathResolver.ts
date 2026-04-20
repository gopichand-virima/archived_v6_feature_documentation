/**
 * Utility to resolve MDX file paths based on version, module, section, and page
 */

interface PathResolverParams {
  version: string;
  module: string;
  section: string;
  page: string;
}

/**
 * Convert version string to directory format
 * NextGen -> NG
 * 6.1.1 -> 6_1_1
 * 6.1 -> 6_1
 * 5.13 -> 5_13
 */
/**
 * Convert page/section ID to filename format
 * cost-center -> cost_center
 * my-dashboard -> my_dashboard
 */
function formatIdToFilename(id: string): string {
  return id.replace(/-/g, '_');
}

/**
 * Get the MDX file path for Admin module in version 6.1
 * Admin has a complex nested structure with subfolders
 */
function getAdmin61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/admin_6_1';
  
  // Map sections to their folder names
  const sectionFolderMap: Record<string, string> = {
    'admin': 'admin',
    'admin-change-management': 'admin_change_mngmnt',
    'admin-contract-management': 'admin_contract_mngmnt',
    'admin-discovery': 'admin_discovery',
    'admin-event-management': 'admin_event_mngmnt',
    'admin-hardware-asset-management': 'admin_hardware_asset_mngmnt',
    'admin-incident-management': 'admin_incident_mngmt',
    'admin-integrations': 'admin_integrations',
    'admin-knowledge-management': 'admin_knowl_mngmt',
    'organizational-details': 'admin_org_details',
    'admin-organizational-details': 'admin_org_details',
    'admin-other': 'admin_other',
    'admin-problem-management': 'admin_problem_mngmt',
    'admin-procurement': 'admin_procurement',
    'admin-project-management': 'admin_project_mngmnt',
    'admin-release-management': 'admin_release_mngmt',
    'admin-request-management': 'admin_request_mngmnt',
    'admin-sacm': 'admin_sacm',
    'admin-security': 'admin_security',
    'admin-service-catalog': 'admin_service_catalog',
    'admin-settings': 'admin_settings',
    'admin-users': 'admin_users',
    'admin-vendor-management': 'admin_vendor_mngmnt',
  };

  const folderName = sectionFolderMap[section];
  if (folderName) {
    const fileName = `${formatIdToFilename(page)}_6_1.md`;
    return `${basePath}/${folderName}/${fileName}`;
  }

  // Try the base admin folder for files without a subfolder
  const fileName = `${formatIdToFilename(page)}_6_1.md`;
  return `${basePath}/${fileName}`;
}

/**
 * Get the MDX file path for ITAM module in version 6.1
 */
function getITAM61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/itam_6_1';
  
  // Map sections to their folder names
  const sectionFolderMap: Record<string, string> = {
    'contract-management': 'contract_management',
    'financial-management': 'financial_management',
    'hardware-assets': 'hw_assets',
    'procurement': 'procurement',
    'software-asset-management': 'sw_asset_mngmt',
    'vendor-management': 'vendor_management',
    'itam-cmdb': 'itam_cmdb',
  };

  const folderName = sectionFolderMap[section];
  if (folderName) {
    const fileName = `${formatIdToFilename(page)}_6_1.md`;
    return `${basePath}/${folderName}/${fileName}`;
  }

  // Try the base itam folder
  const fileName = `${formatIdToFilename(page)}_6_1.md`;
  return `${basePath}/${fileName}`;
}

/**
 * Get the MDX file path for ITSM module in version 6.1
 */
function getITSM61Path(page: string, section: string): string | null {
  const basePath = '/content/6_1/itsm_6_1';
  
  // Map sections to their folder names
  const sectionFolderMap: Record<string, string> = {
    'change-management': 'change_mngmnt',
    'configuration-management': 'config_mngmt',
    'incident-management': 'incident_mngmnt',
    'knowledge-management': 'knowledge_mngmt',
    'problem-management': 'problem_mngmt',
    'release-management': 'release_mngmt',
    'request-fulfillment': 'request_fulfillment',
    'runbook': 'runbook',
    'service-portfolio': 'service_portfolio',
  };

  const folderName = sectionFolderMap[section];
  if (folderName) {
    const fileName = `${formatIdToFilename(page)}_6_1.md`;
    return `${basePath}/${folderName}/${fileName}`;
  }

  // Try the base itsm folder
  const fileName = `${formatIdToFilename(page)}_6_1.md`;
  return `${basePath}/${fileName}`;
}

/**
 * Get the MDX file path for other modules in version 6.1
 */
function getOtherModule61Path(module: string, page: string, _section: string): string | null {
  // Map module names to folder names
  const moduleFolderMap: Record<string, string> = {
    'vulnerability-management': 'vulnerability_managment_6_1',
    'program-project-management': 'prog_proj_mngmnt_6_1',
    'reports': 'reports_6_1',
    'risk-register': 'risk_register_6_1',
    'discovery-scan': 'discovery_6_1',
  };

  const folderName = moduleFolderMap[module];
  if (folderName) {
    const fileName = `${formatIdToFilename(page)}_6_1.md`;
    return `/content/6_1/${folderName}/${fileName}`;
  }

  return null;
}

/**
 * Get the MDX file path for My Dashboard module in version 6.1
 * 
 * Navigation structure:
 * - My Dashboard (section: my-dashboard)
 *   - Dashboards (page: dashboards) → dashboards-6_1.md
 *     - Contents (page: dashboards-contents) → dashboards-contents-6_1.md
 *     - Customization (page: customization) → dashboards-customization-6_1.md
 *     - Report Actions (page: report-actions) → dashboards-report-actions-6_1.md
 *     - My Dashboard (page: my-dashboard-section) → my-dashboard-6_1.md
 *       - Contents (page: my-dashboard-contents) → my-dashboard-contents-6_1.md
 */
function getMyDashboard61Path(page: string, _section: string): string | null {
  const basePath = '/content/6_1/my-dashboard';
  
  // Direct page-to-file mapping
  const fileMap: Record<string, string> = {
    'dashboards': 'dashboards-6_1.md',
    'dashboards-contents': 'dashboards-contents-6_1.md',
    'customization': 'dashboards-customization-6_1.md',
    'report-actions': 'dashboards-report-actions-6_1.md',
    'my-dashboard-section': 'my-dashboard-6_1.md',
    'my-dashboard-contents': 'my-dashboard-contents-6_1.md',
    'my-dashboard-overview': 'my-dashboard-overview-6_1.md',
    'system-icons': 'system-icons-6_1.md',
  };

  const fileName = fileMap[page];
  if (fileName) {
    return `${basePath}/${fileName}`;
  }

  return null;
}

/**
 * Get the MDX file path for CMDB module in version 6.1
 */
function getCmdb61Path(page: string, _section: string): string | null {
  const basePath = '/content/6_1/cmdb_6_1';
  
  // Direct page-to-file mapping for CMDB
  const fileMap: Record<string, string> = {
    'access-cmdb': 'access_cmdb_6_1.md',
    'attachments': 'attachments_6_1.md',
    'audits': 'audits_6_1.md',
    'audits-tab': 'audits_tab_6_1.md',
    'business-service-map': 'business_service_map_6_1.md',
    'change-attributes': 'change_attributes_6_1.md',
    'ci-details-and-tabs': 'ci_details_and_tabs_6_1.md',
    'ci-left-panel': 'ci_left_panel_6_1.md',
    'cmdb-overview': 'cmdb_overview_6_1.md',
    'comments': 'comments_6_1.md',
    'components': 'components_6_1.md',
    'contacts-on-a-ci': 'contacts_on_a_ci_6_1.md',
    'copy-to-ivanti': 'copy_to_ivanti_6_1.md',
    'copy-to-jira': 'copy_to_jira_6_1.md',
    'copy-to-servicenow': 'copy_to_servicenow_6_1.md',
    'delete': 'delete_6_1.md',
    'details': 'details_6_1.md',
    'export': 'export_6_1.md',
    'generate-installed-software-report': 'generate_installed_software_report_6_1.md',
    'history': 'history_6_1.md',
    'itsm': 'itsm_6_1.md',
    'logon-events': 'logon_events_6_1.md',
    'maintenance': 'maintenance_6_1.md',
    'manage-ci': 'manage_ci_6_1.md',
    'manage-cmdb': 'manage_cmdb_6_1.md',
    'new': 'new_6_1.md',
    'other-functions-and-page-elements': 'other_functions_and_page_elements_6_1.md',
    'private-properties': 'private_properties_6_1.md',
    'proce-network-virtualization-hierarchy': 'proce_network_virtualization_hierarchy_6_1.md',
    'process-adm': 'process_adm_6_1.md',
    'process-available-patch-report': 'process_available_patch_report_6_1.md',
    'process-cloud-hierarchy': 'process_cloud_hierarchy_6_1.md',
    'process-devops': 'process_devops_6_1.md',
    'process-missing-components': 'process_missing_components_6_1.md',
    'process-network-connection': 'process_network_connection_6_1.md',
    'process-software-installation': 'process_software_installation_6_1.md',
    'relationships': 'relationships_6_1.md',
    'sla': 'sla_6_1.md',
    'tasks': 'tasks_6_1.md',
    'view-and-edit-a-ci': 'view_and_edit_a_ci_6_1.md',
    'vulnerability': 'vulnerability_6_1.md',
  };

  const fileName = fileMap[page];
  if (fileName) {
    return `${basePath}/${fileName}`;
  }

  return null;
}

/**
 * Resolve the path to the MDX file based on navigation parameters
 */
export function resolveMDXPath({ version, module, section, page }: PathResolverParams): string | null {
  console.log('resolveMDXPath called with:', { version, module, section, page });
  
  // Special handling for My Dashboard in version 6.1
  if (module === 'my-dashboard' && version === '6.1') {
    const path = getMyDashboard61Path(page, section);
    console.log('My Dashboard 6.1 path:', path);
    return path;
  }
  
  // Special handling for CMDB in version 6.1
  if (module === 'cmdb' && version === '6.1') {
    const path = getCmdb61Path(page, section);
    console.log('CMDB 6.1 path:', path);
    return path;
  }
  
  // Special handling for Admin in version 6.1
  if (module === 'admin' && version === '6.1') {
    const path = getAdmin61Path(page, section);
    console.log('Admin 6.1 path:', path);
    return path;
  }
  
  // Special handling for ITAM in version 6.1
  if (module === 'itam' && version === '6.1') {
    const path = getITAM61Path(page, section);
    console.log('ITAM 6.1 path:', path);
    return path;
  }
  
  // Special handling for ITSM in version 6.1
  if (module === 'itsm' && version === '6.1') {
    const path = getITSM61Path(page, section);
    console.log('ITSM 6.1 path:', path);
    return path;
  }
  
  // Special handling for other modules in version 6.1
  if (version === '6.1') {
    const path = getOtherModule61Path(module, page, section);
    console.log('Other Module 6.1 path:', path);
    return path;
  }
  
  console.log('No special handling - returning null');
  
  // For now, only return paths for files that actually exist in contentLoader
  // This prevents attempting to load non-existent MDX files
  // Other content will fall back to the default hardcoded content
  
  // Return null to indicate no MDX file is available
  // The component will fall back to hardcoded content
  return null;
}

/**
 * Check if a specific module/version combination has custom file structure
 */
export function hasCustomFileStructure(_module: string, version: string): boolean {
  return version === '6.1';
}