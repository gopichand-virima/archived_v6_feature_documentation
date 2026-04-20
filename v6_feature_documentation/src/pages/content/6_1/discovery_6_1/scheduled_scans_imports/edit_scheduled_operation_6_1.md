---
title: "Edit Scheduled Operation"
description: "Click on any scheduled operation to open its details."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Edit Scheduled Operation"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Edit Scheduled Operation"
  - "Edit Scheduled Operation"
---

# Edit Scheduled Operation

Click on any scheduled operation to open its details.

## Editable Fields:

### For Scheduled Scans:
- **Name**: Update the scan identifier
- **Probe**: Change the scan type
- **Client**: Switch discovery client
- **IP Range**: Modify target IPs
- **Exclude IP Range**: Update exclusions
- **Scan Frequency**: Adjust timing
- **Is Active**: Enable/disable
- **Is Recurring**: Change recurrence setting
- **Timezone**: Update timezone
- **Schedule Parameters**: Modify timing details
- **Location**: Add/remove locations
- **Send Scan Report To**: Update recipients

### For Scheduled Imports:
- **Name**: Update the import identifier
- **Credential**: Change cloud credential
- **Services to Import**: Modify resource types
- **Import Frequency**: Adjust timing
- **Active**: Enable/disable
- **Timezone**: Update timezone
- **Schedule Parameters**: Modify timing details

## Additional Tabs:
- **Related Scans**: View previous executions (read-only)
- **Tasks**: Manage associated tasks
- **Comments**: Add notes and collaboration
- **Attachments**: Upload supporting documents
- **Log**: View execution history

## Saving Changes:
1. Make your desired modifications
2. Click **Update** to save changes
3. The schedule will use the new configuration for future executions

**Note:** Changes do not affect scans/imports that are currently running. Only future executions will use the updated configuration.
