---
title: "Filter Scheduled Operations"
description: "Use filters to narrow down the list of scheduled operations."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Filter Scheduled Operations"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Filter Scheduled Operations"
  - "Filter Scheduled Operations"
---

# Filter Scheduled Operations

Use filters to narrow down the list of scheduled operations.

## Filter Options:

### By Type:
- **All**: Show both scans and imports
- **Scans Only**: Show only scheduled network scans
- **Imports Only**: Show only scheduled cloud imports

### By Status:
- **Active**: Show only enabled schedules
- **Inactive**: Show only disabled schedules
- **All**: Show regardless of active status

### By Source (for imports):
- **AWS**: Show only AWS imports
- **Azure**: Show only Azure imports
- **Intune**: Show only Intune imports
- **Meraki**: Show only Meraki imports

### By Frequency:
- Filter by specific frequency patterns
- Example: "Every Day", "Every Week"

### By Next Run:
- Filter by date range of next execution
- Find schedules running soon
- Identify long-term schedules

### By Last Status:
- **Completed**: Last execution succeeded
- **Failed**: Last execution failed
- **Running**: Currently executing

### Column Filters:
- Use filter fields at top of each column
- Search by name, client, credential
- Partial text matching supported

## Save Filters:
1. Apply your desired filter combination
2. Click **Save Filter**
3. Enter a descriptive name
4. Access saved filters quickly in future sessions

## Common Filter Scenarios:

### Find All Active Daily Scans:
- Type: Scans Only
- Status: Active
- Frequency: Every Day

### Find Failed Imports:
- Type: Imports Only
- Last Status: Failed

### Find AWS Schedules Running Today:
- Source: AWS
- Next Run: Today's date range

### Find Inactive Schedules:
- Status: Inactive
- (Useful for cleanup or re-activation review)

Filters help administrators quickly locate specific schedules for monitoring, troubleshooting, or management purposes, especially in environments with many automated discovery operations.
