/**
 * Sample Content Registration
 * 
 * This file demonstrates how to register MDX content manually.
 * This is a workaround for Figma Make's limitation where it cannot
 * serve raw .md files.
 * 
 * TO USE YOUR ACTUAL CONTENT:
 * 1. Copy the content from your physical .md files
 * 2. Register them here using registerContent()
 * 3. Make sure the file paths match exactly
 * 
 * Example for one of your files:
 */

import { registerContent } from './mdxContentRegistry';

// Example: Register the departments file
registerContent('/content/6_1/admin_6_1/admin_org_details/departments_6_1.md', `# Departments

Learn how to create and manage Departments in Virima.

## Overview

Departments help you organize your organizational structure effectively.

## Creating a Department

1. Navigate to Admin > Organizational Details > Departments
2. Click the "Add Department" button
3. Fill in the required information
4. Save your changes

## Managing Departments

You can edit, delete, or archive departments as needed.

### Edit a Department

Click the edit icon next to the department name.

### Delete a Department

Click the delete icon and confirm your action.

## Best Practices

- Use clear, descriptive department names
- Maintain a logical hierarchy
- Regular review and updates
`);

// Example: Register the members file
registerContent('/content/6_1/admin_6_1/admin_org_details/members_6_1.md', `# Members

Manage team members and their organizational assignments.

## Overview

The Members section allows you to add, edit, and manage all users in your organization.

## Adding a Member

1. Go to Admin > Organizational Details > Members
2. Click "Add Member"
3. Enter member details:
   - Full Name
   - Email
   - Department
   - Role
4. Click "Save"

## Member Permissions

Configure member access levels:

- **Admin**: Full system access
- **Manager**: Department-level access
- **User**: Limited access

## Bulk Operations

You can perform bulk actions:
- Import members from CSV
- Export member list
- Bulk update permissions
`);

// TODO: Add more content registrations for your other files
// You can copy this pattern for all 610 files

console.log('✅ [Sample Content] Registered sample MDX content');

// Export a function to register all content
export function registerAllContent() {
  // This is where you would register all 610 files
  // For now, we've registered 2 examples above
  
  console.log('📚 [Sample Content] All sample content registered');
}
