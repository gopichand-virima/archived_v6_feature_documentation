---
title: "Scan Popup"
description: "When you initiate a new scan, a scan configuration popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Scan Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Scan Popup"
  - "Scan Popup"
---

# Scan Popup

When you initiate a new discovery scan, a scan configuration popup displays.

**Required Fields:**
- **Name**: A user-defined name to identify this scan
- **Probe**: Select the type of scan/probe to execute (e.g., Deep Host Scan, Basic Host Scan, vCenter Scan)
- **Client**: Select the discovery client that will execute the scan
- **IP Range**: Specify IP addresses to scan (supports multiple formats):
  - Single IP: 192.168.1.10
  - Multiple IPs: 192.168.1.10 192.168.1.20
  - IP Range: 192.168.1.1-50
  - CIDR: 192.168.1.0/24
  - Comma-separated: 192.168.1.10,11,12

**Optional Fields:**
- **Exclude IP Range**: Specify IP addresses to exclude from the scan
- **Location**: Add location tags (click + to add multiple)
- **Send Scan Report To**: Select users who should receive the scan report (click + to add multiple)

**Timing Options:**
- **Immediate**: Run the scan immediately
- **Scheduled**: Configure the scan to run on a schedule
  - If Scheduled is selected, configure Scan Frequency parameters

**Actions:**
- **Run** / **Scan**: Initiates the scan operation
- **Cancel**: Closes the popup without running the scan

**After Clicking Run:**
- The scan starts and appears in the Recent Scans page
- Progress can be monitored in real-time
- Results appear in Discovered Items when the scan completes
