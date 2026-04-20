---
title: "Key Columns"
description: "Name: User-defined name for the scheduled operation"
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Key Columns"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Key Columns Scheduled"
  - "Key Columns"
---

# Key Columns

- **Name**: User-defined name for the scheduled operation
- **Type**: Indicates whether it's a Scan or Import operation
- **Source**: For imports, shows the cloud provider (AWS, Azure, Intune, Meraki)
- **Probe/Service**: For scans, shows the probe type; for imports, shows the services being imported
- **Client**: Discovery client executing the scan (for scans only)
- **Frequency**: How often the operation runs (e.g., Every Day, Every 2 Days, Weekly)
- **Is Active/Active**: Indicates if the schedule is currently enabled
- **Is Recurring**: Whether the operation repeats automatically
- **Next Run**: Calculated date/time of the next scheduled execution
- **Last Run**: Date/time of the most recent execution
- **Last Status**: Status of the most recent execution (Completed, Failed, Running)
- **Created By**: User who created the schedule
- **Created On**: Date/time when the schedule was created
- **Modified By**: User who last modified the schedule
- **Modified On**: Date/time of the last modification
