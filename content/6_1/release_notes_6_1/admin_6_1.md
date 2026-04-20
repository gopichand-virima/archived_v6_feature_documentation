# Admin

## New Features

### Enhanced Audit Logging

Introduced comprehensive audit logging that tracks all administrative actions including user management changes, configuration updates, and security policy modifications with full before/after state capture.

### Role-Based Dashboard Access

Added the ability to configure dashboard visibility and widget access permissions at the role level, ensuring users see only the information relevant to their responsibilities.

## Enhancements

### User Provisioning

Enhanced user provisioning workflows with support for bulk user creation from CSV, automated role assignment based on organizational attributes, and configurable welcome email templates.

### System Configuration

Improved the system configuration interface with grouped settings categories, configuration change history, and the ability to export/import configuration profiles across environments.

## Bug Fixes

### Permission Inheritance

Fixed an issue where role permission changes were not immediately reflected for users with multiple role assignments until their next login session.

### Email Notification Templates

Resolved a formatting issue in email notification templates that could cause broken layouts when the notification body contained tables with more than five columns.
