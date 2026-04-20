/**
 * Context-Aware Error Message Service
 * 
 * Provides accurate, version-specific error messages with correct file paths
 * and registration file suggestions based on the actual module and version context.
 */

export interface ContentErrorContext {
  filePath: string;
  version?: string;
  module?: string;
  section?: string;
  page?: string;
}

/**
 * Maps version display names to file path codes
 */
function versionToPathCode(version: string): string {
  const mapping: Record<string, string> = {
    'NextGen': 'NG',
    '5.13': '5_13',
    '6.1': '6_1',
    '6.1.1': '6_1_1',
  };
  return mapping[version] || version;
}

/**
 * Extracts module name from file path
 */
function extractModuleFromPath(filePath: string): string | null {
  // Pattern: /content/{version}/{module}_... or /content/{version}/{module}/
  const modulePatterns = [
    /\/content\/[^\/]+\/([^\/_]+)[_\/]/,
    /\/content\/[^\/]+\/([^\/]+)\//,
  ];
  
  for (const pattern of modulePatterns) {
    const match = filePath.match(pattern);
    if (match && match[1]) {
      const module = match[1].toLowerCase();
      
      // Map common module variations
      const moduleMap: Record<string, string> = {
        'my_dashboard': 'dashboards',
        'my-dashboard': 'dashboards',
        'discovery_ng': 'discovery',
        'discovery_6_1': 'discovery',
        'discovery_6_1_1': 'discovery',
        'discovery_5_13': 'discovery',
        'cmdb_ng': 'cmdb',
        'cmdb_6_1': 'cmdb',
        'cmdb_6_1_1': 'cmdb',
        'cmdb_5_13': 'cmdb',
        'admin_ng': 'admin',
        'admin_6_1': 'admin',
        'admin_6_1_1': 'admin',
        'admin_5_13': 'admin',
        'itam_ng': 'itam',
        'itam_6_1': 'itam',
        'itam_6_1_1': 'itam',
        'itam_5_13': 'itam',
        'itsm_ng': 'itsm',
        'itsm_6_1': 'itsm',
        'itsm_6_1_1': 'itsm',
        'itsm_5_13': 'itsm',
        'vulnerability_managment_ng': 'vulnerability-management',
        'vulnerability_managment_6_1': 'vulnerability-management',
        'vulnerability_managment_6_1_1': 'vulnerability-management',
        'vulnerability_managment_5_13': 'vulnerability-management',
        'prog_proj_mngmnt_ng': 'program-project-management',
        'prog_proj_mngmnt_6_1': 'program-project-management',
        'prog_proj_mngmnt_6_1_1': 'program-project-management',
        'prog_proj_mngmnt_5_13': 'program-project-management',
        'risk_register_ng': 'risk-register',
        'risk_register_6_1': 'risk-register',
        'risk_register_6_1_1': 'risk-register',
        'risk_register_5_13': 'risk-register',
        'reports_ng': 'reports',
        'reports_6_1': 'reports',
        'reports_6_1_1': 'reports',
        'reports_5_13': 'reports',
      };
      
      return moduleMap[module] || module;
    }
  }
  
  return null;
}

/**
 * Extracts version from file path
 */
function extractVersionFromPath(filePath: string): string | null {
  // Pattern: /content/{version}/
  const versionMatch = filePath.match(/\/content\/([^\/]+)\//);
  if (versionMatch && versionMatch[1]) {
    const pathCode = versionMatch[1];
    const versionMap: Record<string, string> = {
      'NG': 'NextGen',
      '5_13': '5.13',
      '6_1': '6.1',
      '6_1_1': '6.1.1',
    };
    return versionMap[pathCode] || pathCode;
  }
  return null;
}

/**
 * Gets the correct TOC file path for a version
 */
function getTocFilePath(version: string): string {
  const pathCode = versionToPathCode(version);
  return `/content/${pathCode}/index.md`;
}

/**
 * Gets the accurate registration file based on version and module
 */
export function getAccurateRegistrationFile(context: ContentErrorContext): string {
  const { filePath, version: providedVersion, module: providedModule } = context;
  
  // Extract version and module from filePath if not provided
  const version = providedVersion || extractVersionFromPath(filePath) || 'NextGen';
  const module = providedModule || extractModuleFromPath(filePath) || 'unknown';

  // Version-specific registration file mapping
  const registrationMap: Record<string, Record<string, string>> = {
    'NextGen': {
      'dashboards': '/content/registerNextGenContent.ts',
      'my-dashboard': '/content/registerNextGenContent.ts',
      'discovery': '/content/registerNextGenContent.ts',
      'cmdb': '/content/registerNextGenContent.ts',
      'admin': '/content/registerNextGenContent.ts',
      'itam': '/content/registerNextGenContent.ts',
      'itsm': '/content/registerNextGenContent.ts',
      'vulnerability-management': '/content/registerNextGenContent.ts',
      'program-project-management': '/content/registerNextGenContent.ts',
      'risk-register': '/content/registerNextGenContent.ts',
      'reports': '/content/registerNextGenContent.ts',
      'application-overview': '/content/registerNextGenContent.ts',
    },
    '6.1': {
      'admin': '/content/registerAdminModules.ts',
      'discovery': '/content/registerAllContent.ts',
      'cmdb': '/content/registerAllContent.ts',
      'itam': '/content/registerAllContent.ts',
      'itsm': '/content/registerNestedContent.ts',
      'dashboards': '/content/registerAllContent.ts',
      'vulnerability-management': '/content/registerAllContent.ts',
      'program-project-management': '/content/registerAllContent.ts',
      'risk-register': '/content/registerAllContent.ts',
      'reports': '/content/registerAllContent.ts',
    },
    '6.1.1': {
      'admin': '/content/registerAdminModules.ts',
      'discovery': '/content/registerAllContent.ts',
      'cmdb': '/content/registerAllContent.ts',
      'itam': '/content/registerAllContent.ts',
      'itsm': '/content/registerNestedContent.ts',
      'dashboards': '/content/registerAllContent.ts',
      'vulnerability-management': '/content/registerAllContent.ts',
      'program-project-management': '/content/registerAllContent.ts',
      'risk-register': '/content/registerAllContent.ts',
      'reports': '/content/registerAllContent.ts',
    },
    '5.13': {
      'admin': '/content/registerAdminModules.ts',
      'discovery': '/content/registerAllContent.ts',
      'cmdb': '/content/registerAllContent.ts',
      'itam': '/content/registerAllContent.ts',
      'itsm': '/content/registerNestedContent.ts',
      'dashboards': '/content/registerAllContent.ts',
      'vulnerability-management': '/content/registerAllContent.ts',
      'program-project-management': '/content/registerAllContent.ts',
      'risk-register': '/content/registerAllContent.ts',
      'reports': '/content/registerAllContent.ts',
    },
  };
  
  // Get the registration file for this version and module
  const versionMap = registrationMap[version];
  if (versionMap) {
    const registrationFile = versionMap[module] || versionMap['unknown'];
    if (registrationFile) {
      return registrationFile;
    }
  }
  
  // Fallback based on version
  if (version === 'NextGen') {
    return '/content/registerNextGenContent.ts';
  } else if (module === 'admin') {
    return '/content/registerAdminModules.ts';
  } else if (module === 'itsm') {
    return '/content/registerNestedContent.ts';
  } else {
    return '/content/registerAllContent.ts';
  }
}

/**
 * Generates accurate, context-aware error message
 */
export function generateAccurateErrorMessage(context: ContentErrorContext): {
  title: string;
  filePath: string;
  version: string;
  tocFilePath: string;
  registrationFile: string;
  instructions: string[];
} {
  const { filePath, version: providedVersion } = context;
  
  // Extract version from filePath if not provided
  const version = providedVersion || extractVersionFromPath(filePath) || 'NextGen';

  // Get accurate registration file
  const registrationFile = getAccurateRegistrationFile(context);
  
  // Get TOC file path
  const tocFilePath = getTocFilePath(version);
  
  // Generate instructions
  const instructions = [
    `Create the MDX file at: \`${filePath}\``,
    `Update the TOC structure in: \`${tocFilePath}\``,
    `Register the content in: \`${registrationFile}\``,
  ];
  
  return {
    title: 'Content Not Available',
    filePath,
    version,
    tocFilePath,
    registrationFile,
    instructions,
  };
}
