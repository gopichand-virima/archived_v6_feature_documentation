---
title: "View Scan Logs"
description: "The Log tab provides detailed information about scan execution."
version: ""
module: "Discovery"
section: "Recent Scans"
page: "View Scan Logs"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Recent Scans"
  - "View Scan Logs"
  - "View Scan Logs"
---

# View Scan Logs

The **Log** tab provides detailed information about scan execution.

## Log Information Includes:

### Scan Initialization
- Scan start time and configuration
- Client connection status
- Credential validation results
- IP range parsing and validation

### Scan Execution
- Progress through IP address ranges
- Host discovery results (up/down status)
- Authentication attempts and results
- Data collection for each discovered host
- Component and software discovery details

### Scan Completion
- Summary of discovered assets
- Total hosts scanned vs. discovered
- Execution time statistics
- Success and failure counts

### Error Information (if applicable)
- Connection errors
- Authentication failures
- Timeout issues
- Permission or credential problems
- Specific error messages with timestamps

### Performance Metrics
- Scan rate (hosts per minute)
- Network latency measurements
- Response time for different probe types

The logs are essential for troubleshooting scan issues, optimizing scan performance, and verifying that discovery processes are working correctly. Administrators can use this information to identify credential problems, network connectivity issues, or configuration errors that may prevent successful asset discovery.
