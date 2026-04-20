---
title: "Bulk Operations on Scheduled Operations"
description: "Perform actions on multiple scheduled operations simultaneously."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Bulk Operations on Scheduled Operations"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Bulk Operations"
  - "Bulk Operations on Scheduled Operations"
---

# Bulk Operations on Scheduled Operations

Perform actions on multiple scheduled operations simultaneously.

## Available Bulk Operations:

### Bulk Delete
1. Select multiple schedules using checkboxes
2. From **Select Actions**, choose **Delete**
3. Confirm deletion by typing "Delete"
4. Click **Delete** to remove all selected schedules

**Use Cases:**
- Clean up obsolete schedules
- Remove test schedules after validation
- Decommission discovery for retired infrastructure
- Consolidate redundant schedules

### Bulk Export
1. Select multiple schedules (or use filters)
2. From **Select Actions**, choose **Export**
3. Click **Continue** in the confirmation dialog
4. Receive email with Excel download link

**Use Cases:**
- Backup schedule configurations
- Document current discovery operations
- Audit discovery coverage
- Report to stakeholders

### Bulk Enable/Disable
(If supported in your version)
1. Select multiple schedules
2. From **Select Actions**, choose **Enable** or **Disable**
3. All selected schedules updated simultaneously

**Use Cases:**
- Temporarily pause discovery during maintenance
- Quickly disable failing schedules
- Re-enable schedules after maintenance
- Seasonal adjustments (e.g., disable during holidays)

## Selection Methods:

### Checkbox Selection
- Click individual checkboxes to select specific schedules
- Use header checkbox to select all on current page
- Combine with pagination to select across multiple pages

### Filter-Based Selection
- Apply filters to show only desired schedules
- Perform bulk operation on all filtered results
- Efficient for large-scale operations

### Select All
- Some implementations allow "Select All" across all pages
- Use caution with this option
- Verify filters are correct before performing bulk operations

## Best Practices:

### Before Bulk Delete:
- **Export first**: Always export schedules before bulk deletion
- **Verify selection**: Carefully review selected schedules
- **Check dependencies**: Ensure no other processes depend on these schedules
- **Team notification**: Inform team members of planned deletions
- **Backup review**: Check that backups are current

### Before Bulk Export:
- **Apply appropriate filters**: Ensure you're exporting the right set
- **Clear naming**: Use descriptive filter names when saving
- **Regular backups**: Schedule regular exports for disaster recovery
- **Version control**: Keep historical exports for reference

### Before Bulk Enable/Disable:
- **Impact assessment**: Understand impact of enabling/disabling multiple schedules
- **Communication**: Notify stakeholders of schedule changes
- **Timing**: Plan bulk changes during appropriate windows
- **Rollback plan**: Know how to revert if needed

## Common Bulk Operation Scenarios:

### Maintenance Window Preparation:
1. Filter for schedules that run during maintenance window
2. Bulk export for backup
3. Bulk disable affected schedules
4. After maintenance: Re-enable schedules

### Infrastructure Decommissioning:
1. Filter schedules by location or IP range
2. Export for documentation
3. Bulk delete obsolete schedules
4. Update remaining schedules if needed

### Credential Rotation:
1. Filter schedules using old credential
2. Edit each to update credential (individual operation)
3. Test updated schedules
4. Re-enable if disabled during update

### Seasonal Adjustments:
1. Filter schedules that need seasonal changes
2. Bulk disable for off-season
3. Export configurations for next season
4. Bulk enable when season resumes

### Audit Compliance:
1. Filter all active schedules
2. Bulk export for audit documentation
3. Review for compliance requirements
4. Adjust individual schedules as needed

## Error Handling:

### Partial Failures:
- Some systems may partially complete bulk operations
- Review completion messages for failed items
- Manually address failed operations
- Check logs for error details

### Validation Errors:
- System may prevent bulk operations with validation errors
- Review error messages
- Correct issues before retrying
- May need to perform operations individually

### Rollback:
- Bulk deletion cannot be undone
- Restore from export if needed
- Recreate schedules manually
- Test thoroughly after restoration

## Monitoring Bulk Operations:

- Monitor system performance during bulk operations
- Check for completion notifications
- Review audit logs for bulk changes
- Verify expected outcomes
- Address any unexpected results promptly

Bulk operations significantly improve efficiency when managing many scheduled discovery operations, but should be used carefully with proper planning, backups, and verification.
