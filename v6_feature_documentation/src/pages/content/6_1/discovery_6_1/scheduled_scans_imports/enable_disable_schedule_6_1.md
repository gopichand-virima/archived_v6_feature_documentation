---
title: "Enable or Disable Schedule"
description: "Use the Is Active or Active checkbox to enable or disable a scheduled operation."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Enable or Disable Schedule"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Enable Disable Schedule"
  - "Enable or Disable Schedule"
---

# Enable or Disable Schedule

Use the **Is Active** or **Active** checkbox to enable or disable a scheduled operation.

## To Disable a Schedule:
1. Click on the scheduled operation to open its details
2. Uncheck the **Is Active** / **Active** checkbox
3. Click **Update** to save

When disabled:
- The schedule remains in the system but does not execute
- Previous scan/import history is preserved
- The schedule can be re-enabled at any time
- No new scan/import operations will be triggered

## To Enable a Schedule:
1. Click on the scheduled operation to open its details
2. Check the **Is Active** / **Active** checkbox
3. Click **Update** to save

When enabled:
- The schedule will execute according to its configured frequency
- Next execution time is calculated based on current date/time and frequency settings
- Email notifications (if configured) will be sent

## Use Cases for Disabling:
- **Maintenance periods**: Temporarily pause discovery during infrastructure maintenance
- **Resource management**: Reduce system load during peak hours
- **Credential rotation**: Disable while updating authentication credentials
- **Testing**: Pause production schedules while testing new configurations
- **Seasonal operations**: Disable during periods when discovery is not needed

## Quick Toggle:
Some implementations may allow checkbox toggle directly from the list view without opening details. This provides a quick way to enable/disable multiple schedules efficiently.
