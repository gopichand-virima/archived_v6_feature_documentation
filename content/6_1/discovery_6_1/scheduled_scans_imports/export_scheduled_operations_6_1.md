---
title: "Export Scheduled Operations"
description: "Export schedule configurations for documentation and reporting."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Export Scheduled Operations"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Export Scheduled Operations"
  - "Export Scheduled Operations"
---

# Export Scheduled Operations

Export schedule configurations for documentation and reporting.

## How to Export:
1. (Optional) Select specific schedules or apply filters
2. From **Select Actions**, choose **Export**
3. A confirmation popup displays
4. Click **Continue**
5. System generates Excel file
6. Download link sent via email

## Export Contents:
- **Name**: Schedule identifiers
- **Type**: Scan or Import
- **Source**: Cloud provider (for imports)
- **Probe/Services**: Configured scan type or import services
- **Client/Credential**: Discovery client or cloud credential
- **Frequency**: Execution frequency
- **Is Active**: Enabled/disabled status
- **Is Recurring**: Recurrence setting
- **Next Run**: Calculated next execution time
- **Last Run**: Most recent execution time
- **Last Status**: Most recent execution status
- **Created By**: Creator username
- **Created On**: Creation timestamp
- **Modified By**: Last modifier username
- **Modified On**: Last modification timestamp

## Export Behavior:
- **No selection + no filters**: Exports ALL schedules
- **With selection**: Exports only selected schedules
- **With filters**: Exports all schedules matching current filters
- **Both selection and filters**: Exports selected schedules (selection takes precedence)

## Use Cases:

### Documentation:
- Maintain records of scheduled discovery operations
- Document discovery strategy and coverage
- Audit trail for compliance requirements

### Analysis:
- Review schedule distribution across infrastructure
- Identify gaps in discovery coverage
- Optimize schedule timing and frequency

### Backup:
- Keep configuration backups before major changes
- Document settings for disaster recovery
- Transfer configurations between environments

### Reporting:
- Provide stakeholders with discovery schedule overview
- Demonstrate automated asset management practices
- Support audit and compliance reviews

### Planning:
- Analyze current scheduling patterns
- Identify opportunities for consolidation
- Plan new schedule additions

The exported Excel file provides a comprehensive snapshot of all scheduled discovery operations, enabling effective management, analysis, and documentation of automated discovery activities.
