---
title: "Scan Execution Process"
description: "After clicking Run, the scan execution process begins."
version: ""
module: "Discovery"
section: "Run A Scan"
page: "Scan Execution Process"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Run A Scan"
  - "Scan Execution Process"
  - "Scan Execution Process"
---

# Scan Execution Process

After clicking **Run**, the scan execution process begins:

## 1. Scan Initialization
- The system validates scan parameters
- Selected discovery client is contacted
- Credentials are verified
- IP range is parsed and validated

## 2. Host Discovery
- Ping sweep identifies active hosts
- Port scanning determines host types
- Operating system detection initiated
- Network connectivity verified

## 3. Detailed Scanning
- Selected probe executes against discovered hosts
- Authentication attempts using configured credentials
- Data collection based on probe type:
  - System information (OS, hardware specs)
  - Network configuration (adapters, IPs, MACs)
  - Installed software and packages
  - Running processes and services
  - Storage and disk information
  - Virtual machine details (if applicable)

## 4. Data Processing
- Collected data is normalized and structured
- Correlation with existing CMDB records
- New assets identified
- Changed assets detected
- Results stored in Discovered Items

## 5. Scan Completion
- Scan status updated to "Completed"
- Summary statistics generated
- Email notifications sent (if configured)
- Scan report available in Recent Scans

## Monitoring Scan Progress
- View real-time status in Recent Scans
- Use Auto Refresh to update scan status
- Check scan logs for detailed execution information
- Review discovered items as they are found

## After Scan Completion
- Review discovered assets in Discovered Items
- Move validated assets to CMDB
- Schedule follow-up scans if needed
- Export scan reports for documentation
