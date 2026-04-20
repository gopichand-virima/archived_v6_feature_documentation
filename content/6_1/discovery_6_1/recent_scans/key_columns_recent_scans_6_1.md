---
title: "Key Columns"
description: "Scan Name: User-defined name or auto-generated name for the scan (e.g., 'Rescan on [date]')"
version: ""
module: "Discovery"
section: "Recent Scans"
page: "Key Columns"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Recent Scans"
  - "Key Columns Recent Scans"
  - "Key Columns"
---

# Key Columns

- **Scan Name**: User-defined name or auto-generated name for the scan (e.g., "Rescan on [date]")
- **Status**: Current state of the scan:
  - **Running**: Scan is currently in progress
  - **Completed**: Scan finished successfully
  - **Failed**: Scan encountered errors
  - **Stopped**: Scan was manually stopped
- **Started On**: Date and time when the scan began
- **Completed On**: Date and time when the scan finished (blank if still running)
- **Duration**: Total time taken to complete the scan
- **Client**: The discovery client that executed the scan
- **Probe Type**: Type of scan performed (e.g., Deep Host Scan, Basic Host Scan)
- **IP Range**: The IP addresses that were scanned
- **Discovered Items**: Number of assets discovered during the scan
