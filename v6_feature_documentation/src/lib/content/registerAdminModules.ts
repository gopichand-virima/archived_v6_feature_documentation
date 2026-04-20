/**
 * Admin Modules Content Registration - Part 3
 * 
 * This file registers all remaining Admin module subsections
 */

import { registerContent } from './mdxContentRegistry';

function createDocContent(title: string, module: string, description: string): string {
  return `# ${title}

${description}

## Overview

This section provides detailed information about ${title.toLowerCase()} in Virima ${module}.

## Key Features

- Comprehensive management capabilities
- Intuitive user interface
- Integration with other Virima modules
- Real-time updates and notifications

## Getting Started

To begin using ${title}:

1. Navigate to the ${module} module
2. Access the ${title} section
3. Review the available options and features
4. Configure settings as needed

## Best Practices

- Regularly review and update ${title.toLowerCase()} settings
- Follow organizational policies and procedures
- Maintain accurate and up-to-date information
- Utilize automation features where applicable

## Additional Resources

For more information, refer to:
- Virima User Guide
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
 * Register Admin Change Management content
 */
function registerAdminChangeManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/about_change_mngmnt_6_1.md', createDocContent(
    'About Change Management Admin',
    'Admin - Change Management',
    'Configure change management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/add_change_model_6_1.md', createDocContent(
    'Add Change Model',
    'Admin - Change Management',
    'Create new change models for standardized processes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/add_changes_6_1.md', createDocContent(
    'Add Changes',
    'Admin - Change Management',
    'Add new change types and categories.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_category_6_1.md', createDocContent(
    'Change Category',
    'Admin - Change Management',
    'Define change categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_ci_category_6_1.md', createDocContent(
    'Change CI Category',
    'Admin - Change Management',
    'Configure CI categories affected by changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_closure_code_6_1.md', createDocContent(
    'Change Closure Code',
    'Admin - Change Management',
    'Define closure codes for completed changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_error_code_6_1.md', createDocContent(
    'Change Error Code',
    'Admin - Change Management',
    'Configure error codes for failed or problematic changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_model_6_1.md', createDocContent(
    'Change Model',
    'Admin - Change Management',
    'Manage pre-defined change models and templates.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_priority_calculator_6_1.md', createDocContent(
    'Change Priority Calculator',
    'Admin - Change Management',
    'Configure automatic priority calculation for changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_risk_assesments_6_1.md', createDocContent(
    'Change Risk Assessments',
    'Admin - Change Management',
    'Configure risk assessment criteria for changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_risk_assessments_6_1.md', createDocContent(
    'Change Risk Assessments',
    'Admin - Change Management',
    'Define risk assessment parameters and thresholds.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_risks_6_1.md', createDocContent(
    'Change Risks',
    'Admin - Change Management',
    'Identify and manage risks associated with changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_stage_state_6_1.md', createDocContent(
    'Change Stage State',
    'Admin - Change Management',
    'Configure change stages and states.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_state_workflow_6_1.md', createDocContent(
    'Change State Workflow',
    'Admin - Change Management',
    'Define state transition workflows for changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_timescale_6_1.md', createDocContent(
    'Change Timescale',
    'Admin - Change Management',
    'Configure timescale settings for change processes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/change_types_6_1.md', createDocContent(
    'Change Types',
    'Admin - Change Management',
    'Define and manage different types of changes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/changes_6_1.md', createDocContent(
    'Changes Admin',
    'Admin - Change Management',
    'Overall change management configuration.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/request_changes_6_1.md', createDocContent(
    'Request Changes Admin',
    'Admin - Change Management',
    'Configure change request settings and approval workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_change_mngmnt/risk_assessments_6_1.md', createDocContent(
    'Risk Assessments',
    'Admin - Change Management',
    'Manage risk assessment frameworks for changes.'
  ));

  console.log('✅ [Admin Change Management] Registered 19 files');
}

/**
 * Register Admin Incident Management content
 */
function registerAdminIncidentManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/about_incident_mngmnt_6_1.md', createDocContent(
    'About Incident Management Admin',
    'Admin - Incident Management',
    'Configure incident management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_auto_escalation_6_1.md', createDocContent(
    'Incident Auto Escalation',
    'Admin - Incident Management',
    'Configure automatic incident escalation rules.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_category_6_1.md', createDocContent(
    'Incident Category',
    'Admin - Incident Management',
    'Define incident categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_error_code_6_1.md', createDocContent(
    'Incident Error Code',
    'Admin - Incident Management',
    'Configure error codes for incidents.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_model_6_1.md', createDocContent(
    'Incident Model',
    'Admin - Incident Management',
    'Create incident models for recurring issues.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_priority_calculator_6_1.md', createDocContent(
    'Incident Priority Calculator',
    'Admin - Incident Management',
    'Configure automatic priority calculation based on impact and urgency.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_states_substates_6_1.md', createDocContent(
    'Incident States & Substates',
    'Admin - Incident Management',
    'Define incident states and substates for workflow management.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_incident_mngmnt/incident_timescale_6_1.md', createDocContent(
    'Incident Timescale',
    'Admin - Incident Management',
    'Configure timescale settings for incident resolution.'
  ));

  console.log('✅ [Admin Incident Management] Registered 8 files');
}

/**
 * Register Admin Problem Management content
 */
function registerAdminProblemManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/about_problem_mngmnt_6_1.md', createDocContent(
    'About Problem Management Admin',
    'Admin - Problem Management',
    'Configure problem management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/problem_category_6_1.md', createDocContent(
    'Problem Category',
    'Admin - Problem Management',
    'Define problem categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/problem_closure_code_6_1.md', createDocContent(
    'Problem Closure Code',
    'Admin - Problem Management',
    'Configure closure codes for resolved problems.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/problem_priority_calculator_6_1.md', createDocContent(
    'Problem Priority Calculator',
    'Admin - Problem Management',
    'Configure automatic priority calculation for problems.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/problem_states_substates_6_1.md', createDocContent(
    'Problem States & Substates',
    'Admin - Problem Management',
    'Define problem states and substates for workflow management.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_problem_mngmnt/problem_timescale_6_1.md', createDocContent(
    'Problem Timescale',
    'Admin - Problem Management',
    'Configure timescale settings for problem resolution.'
  ));

  console.log('✅ [Admin Problem Management] Registered 6 files');
}

/**
 * Register Admin Release Management content
 */
function registerAdminReleaseManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/about_release_mngmnt_6_1.md', createDocContent(
    'About Release Management Admin',
    'Admin - Release Management',
    'Configure release management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_category_6_1.md', createDocContent(
    'Release Category',
    'Admin - Release Management',
    'Define release categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_closure_code_6_1.md', createDocContent(
    'Release Closure Code',
    'Admin - Release Management',
    'Configure closure codes for completed releases.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_priority_calculator_6_1.md', createDocContent(
    'Release Priority Calculator',
    'Admin - Release Management',
    'Configure automatic priority calculation for releases.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_states_substates_6_1.md', createDocContent(
    'Release States & Substates',
    'Admin - Release Management',
    'Define release states and substates for workflow management.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_timescale_6_1.md', createDocContent(
    'Release Timescale',
    'Admin - Release Management',
    'Configure timescale settings for release processes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_release_mngmnt/release_types_6_1.md', createDocContent(
    'Release Types',
    'Admin - Release Management',
    'Define and manage different types of releases.'
  ));

  console.log('✅ [Admin Release Management] Registered 7 files');
}

/**
 * Register Admin Request Management content
 */
function registerAdminRequestManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/about_request_mngmnt_6_1.md', createDocContent(
    'About Request Management Admin',
    'Admin - Request Management',
    'Configure service request management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/request_category_6_1.md', createDocContent(
    'Request Category',
    'Admin - Request Management',
    'Define request categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/request_closure_code_6_1.md', createDocContent(
    'Request Closure Code',
    'Admin - Request Management',
    'Configure closure codes for fulfilled requests.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/request_priority_calculator_6_1.md', createDocContent(
    'Request Priority Calculator',
    'Admin - Request Management',
    'Configure automatic priority calculation for service requests.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/request_states_substates_6_1.md', createDocContent(
    'Request States & Substates',
    'Admin - Request Management',
    'Define request states and substates for workflow management.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_request_mngmnt/request_timescale_6_1.md', createDocContent(
    'Request Timescale',
    'Admin - Request Management',
    'Configure timescale settings for request fulfillment.'
  ));

  console.log('✅ [Admin Request Management] Registered 6 files');
}

/**
 * Register Admin Knowledge Management content
 */
function registerAdminKnowledgeManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_knowledge_mngmnt/about_knowledge_mngmnt_6_1.md', createDocContent(
    'About Knowledge Management Admin',
    'Admin - Knowledge Management',
    'Configure knowledge management settings and workflows.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_knowledge_mngmnt/article_categories_6_1.md', createDocContent(
    'Article Categories',
    'Admin - Knowledge Management',
    'Define categories for knowledge base articles.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_knowledge_mngmnt/article_templates_6_1.md', createDocContent(
    'Article Templates',
    'Admin - Knowledge Management',
    'Create templates for standardized article creation.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_knowledge_mngmnt/knowledge_approval_workflow_6_1.md', createDocContent(
    'Knowledge Approval Workflow',
    'Admin - Knowledge Management',
    'Configure approval workflows for knowledge articles.'
  ));

  console.log('✅ [Admin Knowledge Management] Registered 4 files');
}

/**
 * Register Admin Service Catalog content
 */
function registerAdminServiceCatalogContent() {
  registerContent('/content/6_1/admin_6_1/admin_service_catalog/about_service_catalog_6_1.md', createDocContent(
    'About Service Catalog Admin',
    'Admin - Service Catalog',
    'Configure service catalog settings and offerings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_service_catalog/catalog_categories_6_1.md', createDocContent(
    'Catalog Categories',
    'Admin - Service Catalog',
    'Define service catalog categories.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_service_catalog/service_offerings_6_1.md', createDocContent(
    'Service Offerings',
    'Admin - Service Catalog',
    'Manage available service offerings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_service_catalog/service_request_items_6_1.md', createDocContent(
    'Service Request Items',
    'Admin - Service Catalog',
    'Configure individual service request items.'
  ));

  console.log('✅ [Admin Service Catalog] Registered 4 files');
}

/**
 * Register Admin Contract Management content
 */
function registerAdminContractManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_contract_mngmnt/about_contract_mngmnt_6_1.md', createDocContent(
    'About Contract Management Admin',
    'Admin - Contract Management',
    'Configure contract management settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_contract_mngmnt/contract_types_6_1.md', createDocContent(
    'Contract Types',
    'Admin - Contract Management',
    'Define different types of contracts.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_contract_mngmnt/contract_states_6_1.md', createDocContent(
    'Contract States',
    'Admin - Contract Management',
    'Configure contract lifecycle states.'
  ));

  console.log('✅ [Admin Contract Management] Registered 3 files');
}

/**
 * Register Admin Vendor Management content
 */
function registerAdminVendorManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_vendor_mngmnt/about_vendor_mngmnt_6_1.md', createDocContent(
    'About Vendor Management Admin',
    'Admin - Vendor Management',
    'Configure vendor management settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_vendor_mngmnt/vendor_categories_6_1.md', createDocContent(
    'Vendor Categories',
    'Admin - Vendor Management',
    'Define vendor categories and classifications.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_vendor_mngmnt/vendor_rating_system_6_1.md', createDocContent(
    'Vendor Rating System',
    'Admin - Vendor Management',
    'Configure vendor rating and evaluation criteria.'
  ));

  console.log('✅ [Admin Vendor Management] Registered 3 files');
}

/**
 * Register Admin Procurement content
 */
function registerAdminProcurementContent() {
  registerContent('/content/6_1/admin_6_1/admin_procurement/about_procurement_6_1.md', createDocContent(
    'About Procurement Admin',
    'Admin - Procurement',
    'Configure procurement process settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_procurement/approval_workflows_6_1.md', createDocContent(
    'Approval Workflows',
    'Admin - Procurement',
    'Configure approval workflows for procurement requests.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_procurement/procurement_categories_6_1.md', createDocContent(
    'Procurement Categories',
    'Admin - Procurement',
    'Define procurement item categories.'
  ));

  console.log('✅ [Admin Procurement] Registered 3 files');
}

/**
 * Register Admin Hardware Asset Management content
 */
function registerAdminHardwareAssetContent() {
  registerContent('/content/6_1/admin_6_1/admin_hardware_asset_mngmnt/about_hardware_asset_mngmnt_6_1.md', createDocContent(
    'About Hardware Asset Management Admin',
    'Admin - Hardware Asset Management',
    'Configure hardware asset management settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_hardware_asset_mngmnt/asset_states_6_1.md', createDocContent(
    'Asset States',
    'Admin - Hardware Asset Management',
    'Define hardware asset lifecycle states.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_hardware_asset_mngmnt/asset_categories_6_1.md', createDocContent(
    'Asset Categories',
    'Admin - Hardware Asset Management',
    'Configure hardware asset categories and types.'
  ));

  console.log('✅ [Admin Hardware Asset Management] Registered 3 files');
}

/**
 * Register Admin Event Management content
 */
function registerAdminEventManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_event_mngmnt/about_event_mngmnt_6_1.md', createDocContent(
    'About Event Management Admin',
    'Admin - Event Management',
    'Configure event management settings and monitoring.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_event_mngmnt/event_categories_6_1.md', createDocContent(
    'Event Categories',
    'Admin - Event Management',
    'Define event categories for classification.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_event_mngmnt/event_rules_6_1.md', createDocContent(
    'Event Rules',
    'Admin - Event Management',
    'Configure rules for event processing and correlation.'
  ));

  console.log('✅ [Admin Event Management] Registered 3 files');
}

/**
 * Register Admin Project Management content
 */
function registerAdminProjectManagementContent() {
  registerContent('/content/6_1/admin_6_1/admin_project_mngmnt/about_project_mngmnt_6_1.md', createDocContent(
    'About Project Management Admin',
    'Admin - Project Management',
    'Configure project management settings and templates.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_project_mngmnt/project_templates_6_1.md', createDocContent(
    'Project Templates',
    'Admin - Project Management',
    'Create and manage project templates.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_project_mngmnt/project_stages_6_1.md', createDocContent(
    'Project Stages',
    'Admin - Project Management',
    'Define project lifecycle stages.'
  ));

  console.log('✅ [Admin Project Management] Registered 3 files');
}

/**
 * Register Admin SACM (Service Asset & Configuration Management) content
 */
function registerAdminSACMContent() {
  registerContent('/content/6_1/admin_6_1/admin_sacm/about_sacm_6_1.md', createDocContent(
    'About SACM Admin',
    'Admin - SACM',
    'Configure Service Asset and Configuration Management settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_sacm/ci_types_6_1.md', createDocContent(
    'CI Types',
    'Admin - SACM',
    'Define Configuration Item types and attributes.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_sacm/relationship_types_6_1.md', createDocContent(
    'Relationship Types',
    'Admin - SACM',
    'Configure CI relationship types and rules.'
  ));

  console.log('✅ [Admin SACM] Registered 3 files');
}

/**
 * Register Admin Other subsections content
 */
function registerAdminOtherSubsectionsContent() {
  // Admin general settings
  registerContent('/content/6_1/admin_6_1/admin/email_notifications_6_1.md', createDocContent(
    'Email Notifications',
    'Admin',
    'Configure email notification settings and templates.'
  ));

  registerContent('/content/6_1/admin_6_1/admin/system_preferences_6_1.md', createDocContent(
    'System Preferences',
    'Admin',
    'Manage global system preferences and settings.'
  ));

  registerContent('/content/6_1/admin_6_1/admin/custom_fields_6_1.md', createDocContent(
    'Custom Fields',
    'Admin',
    'Create and manage custom fields across modules.'
  ));

  // Admin Other
  registerContent('/content/6_1/admin_6_1/admin_other/data_retention_6_1.md', createDocContent(
    'Data Retention',
    'Admin',
    'Configure data retention policies and archiving.'
  ));

  registerContent('/content/6_1/admin_6_1/admin_other/backup_restore_6_1.md', createDocContent(
    'Backup & Restore',
    'Admin',
    'Manage system backups and restoration procedures.'
  ));

  console.log('✅ [Admin Other] Registered 5 additional admin files');
}

/**
 * Register Admin Overview content
 */
function registerAdminOverviewContent() {
  registerContent('/content/6_1/admin_6_1/overview_6_1.md', createDocContent(
    'Admin Module Overview',
    'Admin',
    'Admin functions are only available to System Administrators. The Admin module provides administrative capabilities for managing and configuring various aspects of the Virima application.'
  ));

  registerContent('/content/NG/admin_ng/overview_ng.md', createDocContent(
    'Admin Module Overview',
    'Admin',
    'Admin functions are only available to System Administrators. The Admin Module includes various administrative functions for system configuration.'
  ));

  registerContent('/content/5_13/overview_5_13.md', createDocContent(
    'Admin Module Overview',
    'Admin',
    'Admin functions are only available to System Administrators. The Admin module provides administrative capabilities for managing and configuring various aspects of the Virima application.'
  ));

  registerContent('/content/6_1_1/overview_6_1_1.md', createDocContent(
    'Admin Module Overview',
    'Admin',
    'Admin functions are only available to System Administrators. The Admin module provides administrative capabilities for managing and configuring various aspects of the Virima application.'
  ));

  console.log('✅ [Admin Overview] Registered 4 overview files');
}

/**
 * Main registration function
 */
export function registerAdminModulesContent() {
  console.log('🚀 [Admin Modules] Starting registration of Admin module files...');
  
  registerAdminOverviewContent();
  registerAdminChangeManagementContent();
  registerAdminIncidentManagementContent();
  registerAdminProblemManagementContent();
  registerAdminReleaseManagementContent();
  registerAdminRequestManagementContent();
  registerAdminKnowledgeManagementContent();
  registerAdminServiceCatalogContent();
  registerAdminContractManagementContent();
  registerAdminVendorManagementContent();
  registerAdminProcurementContent();
  registerAdminHardwareAssetContent();
  registerAdminEventManagementContent();
  registerAdminProjectManagementContent();
  registerAdminSACMContent();
  registerAdminOtherSubsectionsContent();
  
  console.log('✅ [Admin Modules] Successfully registered 84 admin module files');
  console.log('📊 [Admin Modules] Running total: 360 files (2 sample + 188 main + 86 nested + 4 overview + 80 admin)');
}

// Auto-execute registration on import
registerAdminModulesContent();
