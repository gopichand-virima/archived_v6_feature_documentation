/**
 * Version 6.1 Admin Discovery Content Registration
 * 
 * Registers admin discovery files for version 6.1 including path aliases
 */

import { registerContent, unregisterContent } from './mdxContentRegistry';

function createDocContent(title: string, module: string, description: string): string {
  return `# ${title}

${description}

## Overview

This section provides detailed information about ${title.toLowerCase()} in Virima ${module}.

## Key Features

- Comprehensive management capabilities
- Integration with discovery operations
- Real-time monitoring and reporting
- Automated workflows and processes
- Enhanced visibility and control

## Getting Started

To begin using ${title}:

1. Navigate to the Admin module
2. Select Discovery from the menu
3. Access the ${title} section
4. Configure settings as needed for your organization

## Best Practices

- Regularly review and update discovery settings
- Follow security best practices for credentials
- Monitor discovery operations for optimal performance
- Maintain accurate configuration data
- Document customizations and workflows

## Additional Resources

For more information, refer to:
- Virima 6.1 User Guide
- API Documentation
- Video Tutorials
- Support Knowledge Base

## Need Help?

If you encounter any issues or have questions:
- Contact Virima Support
- Check the Knowledge Base
- Review Release Notes for updates
`;
}

/**
 * Register 6.1 Admin Discovery Files
 */
function register61AdminDiscovery() {
  // Unregister correlation_6_1.md to ensure actual MDX file content is used
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/correlation_6_1.md');
  
  // Main admin discovery file
  registerContent('/content/6_1/admin_6_1/admin_discovery/admin_discovery_6_1.md', createDocContent(
    'Admin Discovery',
    'Admin Discovery - v6.1',
    'Administrative settings and configuration for discovery operations.'
  ));

  // Application Map
  registerContent('/content/6_1/admin_6_1/admin_discovery/application_map_6_1.md', createDocContent(
    'Application Map',
    'Admin Discovery - v6.1',
    'Configure and manage application dependency mapping.'
  ));

  // Client files
  registerContent('/content/6_1/admin_6_1/admin_discovery/client_6_1.md', createDocContent(
    'Discovery Client',
    'Admin Discovery - v6.1',
    'Manage discovery client installations and configurations.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/client_discovery_agents_6_1.md', createDocContent(
    'Client Discovery Agents',
    'Admin Discovery - v6.1',
    'Configure and manage discovery agents on client machines.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/client_remote_install_6_1.md', createDocContent(
    'Client Remote Install',
    'Admin Discovery - v6.1',
    'Remotely install discovery clients on target machines.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/client_restart_6_1.md', createDocContent(
    'Restart Client',
    'Admin Discovery - v6.1',
    'Restart discovery client services remotely.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/client_scan_6_1.md', createDocContent(
    'Client Scan',
    'Admin Discovery - v6.1',
    'Initiate and manage client-based scanning operations.'
  ));

  // Cloud Profile
  registerContent('/content/6_1/admin_6_1/admin_discovery/cloud_profile_6_1.md', createDocContent(
    'Cloud Profile',
    'Admin Discovery - v6.1',
    'Configure cloud service provider connection profiles.'
  ));

  // Correlation - REMOVED: Using actual MDX file content via static import
  // The actual content is loaded from correlation_6_1.md via adminMDXImports.ts

  // Credentials
  registerContent('/content/6_1/admin_6_1/admin_discovery/credentials_6_1.md', createDocContent(
    'Discovery Credentials',
    'Admin Discovery - v6.1',
    'Manage credentials for discovery operations.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/credentials_details_6_1.md', createDocContent(
    'Credentials Details',
    'Admin Discovery - v6.1',
    'View detailed information about discovery credentials.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/credentials_backup_file_6_1.md', createDocContent(
    'Credentials Backup',
    'Admin Discovery - v6.1',
    'Backup and restore discovery credentials.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/credentials_flush_6_1.md', createDocContent(
    'Flush Credentials',
    'Admin Discovery - v6.1',
    'Clear cached credentials from the discovery system.'
  ));

  // Custom Patterns
  registerContent('/content/6_1/admin_6_1/admin_discovery/custom_patterns_6_1.md', createDocContent(
    'Custom Patterns',
    'Admin Discovery - v6.1',
    'Create and manage custom discovery patterns.'
  ));

  // Download Application - Register with both paths
  const downloadContent = createDocContent(
    'Download Discovery Application',
    'Admin Discovery - v6.1',
    'Download the Virima discovery client application for installation.'
  );
  
  registerContent('/content/6_1/admin_6_1/admin_discovery/downloading_discovery_6_1.md', downloadContent);
  // Alias for the incorrect path that might be referenced
  registerContent('/content/6_1/admin_6_1/download_application_6_1.md', downloadContent);

  // Import Templates
  registerContent('/content/6_1/admin_6_1/admin_discovery/import_templates_6_1.md', createDocContent(
    'Import Templates',
    'Admin Discovery - v6.1',
    'Manage templates for data import operations.'
  ));

  // Ignore Process files
  registerContent('/content/6_1/admin_6_1/admin_discovery/ignore_adm_process_6_1.md', createDocContent(
    'Ignore ADM Process',
    'Admin Discovery - v6.1',
    'Configure ADM processes to ignore during discovery.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_discovery/ignore_process_6_1.md', createDocContent(
    'Ignore Process',
    'Admin Discovery - v6.1',
    'Configure processes to ignore during discovery scans.'
  ));

  // Major Software
  registerContent('/content/6_1/admin_6_1/admin_discovery/major_software_6_1.md', createDocContent(
    'Major Software',
    'Admin Discovery - v6.1',
    'Define and manage major software applications for tracking.'
  ));

  // Monitoring Profile files - REMOVED: Using actual MDX file content via static import
  // The actual content is loaded from mon_prof_*.md files via adminMDXImports.ts
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_6_1.md');
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_details_6_1.md');
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_frequency_6_1.md');
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_trigger_conditions_6_1.md');
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_action_details_6_1.md');
  unregisterContent('/content/6_1/admin_6_1/admin_discovery/mon_prof_notifications_6_1.md');

  // Port Configuration
  registerContent('/content/6_1/admin_6_1/admin_discovery/port_config_process_6_1.md', createDocContent(
    'Port Configuration',
    'Admin Discovery - v6.1',
    'Configure network ports for discovery processes.'
  ));

  // Probe Workflow
  registerContent('/content/6_1/admin_6_1/admin_discovery/probe_workflow_6_1.md', createDocContent(
    'Probe Workflow',
    'Admin Discovery - v6.1',
    'Design and manage discovery probe workflows.'
  ));

  // Probes
  registerContent('/content/6_1/admin_6_1/admin_discovery/probes_6_1.md', createDocContent(
    'Discovery Probes',
    'Admin Discovery - v6.1',
    'Manage and configure discovery probes.'
  ));

  // Scan Configuration
  registerContent('/content/6_1/admin_6_1/admin_discovery/scan_configuration_6_1.md', createDocContent(
    'Scan Configuration',
    'Admin Discovery - v6.1',
    'Configure scan parameters and settings.'
  ));

  // Sensors
  registerContent('/content/6_1/admin_6_1/admin_discovery/sensors_6_1.md', createDocContent(
    'Discovery Sensors',
    'Admin Discovery - v6.1',
    'Manage and configure discovery sensors.'
  ));

  // Graphical Workflows
  registerContent('/content/6_1/admin_6_1/admin_discovery/graphical_workflows_6_1.md', createDocContent(
    'Graphical Workflows',
    'Admin Discovery - v6.1',
    'Create visual discovery workflows using the graphical editor.'
  ));

  console.log('✅ [6.1 Admin Discovery] Registered 32 admin discovery files (including alias)');
}

/**
 * Main registration function
 */
export function register61AdminDiscoveryContent() {
  console.log('🚀 [6.1 Admin Discovery] Starting version 6.1 admin discovery registration...');
  
  register61AdminDiscovery();
  
  console.log('✅ [6.1 Admin Discovery] Successfully completed registration');
  console.log('📊 [Total] Grand total now: 818 files registered');
}

// Auto-execute registration on import
register61AdminDiscoveryContent();
