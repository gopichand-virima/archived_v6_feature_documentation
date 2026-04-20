---
title: "View Execution History"
description: "Click the Related Scans tab to view all previous executions of a scheduled operation."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "View Execution History"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "View Execution History"
  - "View Execution History"
---

# View Execution History

Click the **Related Scans** tab to view all previous executions of a scheduled operation.

## Execution History Information:

### For Scheduled Scans:
- **Scan Name**: Auto-generated name for each execution
- **Started On**: When the scan began
- **Completed On**: When the scan finished
- **Duration**: Total execution time
- **Status**: Completed, Failed, or Stopped
- **Discovered Items**: Number of assets found
- **Client**: Discovery client that executed the scan
- **IP Range**: Targets that were scanned

### For Scheduled Imports:
- **Import Name**: Auto-generated name for each execution
- **Imported On**: When the import completed
- **Status**: Importing, Completed, or Failed
- **Imported Items**: Number of resources imported
- **Credential**: Cloud credential used
- **Services**: Which services were imported

## Analyzing History:
- **Identify trends**: Compare discovery counts over time
- **Spot anomalies**: Detect unusual changes in asset counts
- **Troubleshoot failures**: Review failed executions and error patterns
- **Verify execution**: Confirm schedules are running as expected
- **Performance monitoring**: Track execution duration trends

## Accessing Detailed Results:
- Click on any execution record to view:
  - Complete scan/import details
  - Discovered/imported items list
  - Execution logs and messages
  - Tasks and comments
  - Associated attachments

## Common Use Cases:
- **Audit compliance**: Demonstrate regular discovery activities
- **Change tracking**: Review when assets were first discovered
- **Troubleshooting**: Identify when a schedule started failing
- **Capacity planning**: Analyze scan duration trends to optimize timing
- **Validation**: Verify new schedules are executing correctly

The Related Scans tab provides read-only access to historical data, preserving an audit trail of all automated discovery activities.
