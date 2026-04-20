---
title: "Rescan Popup"
description: "When you click Re-Scan or Rescan Now, a rescan configuration popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Rescan Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Rescan Popup"
  - "Rescan Popup"
---

# Rescan Popup

When you click **Re-Scan** or **Rescan Now**, a rescan configuration popup displays.

**Required Fields:**
- **IP Address**: The asset's IP address (may be auto-filled but editable)
- **Client**: Select the discovery client that will execute the scan
- **Type of Scan**: Select the scan type/probe (e.g., Deep Host Scan, Basic Host Scan, vCenter Scan)

**Actions:**
- **Scan**: Initiates the re-scan operation with the selected parameters
- **Cancel**: Closes the popup without performing a rescan

**Validation:**
- If no client is selected, the system displays: "Please select a client"
- If no scan type is selected, the system displays: "Please select a scan type"
- The asset must have a valid IP address to be rescanned

**After Clicking Scan:**
- A progress message displays briefly: "Scan is in progress"
- The user is redirected to the Recent Scans page
- The new scan run appears at the top with a name like "Rescan on [date/time]"
- Refresh the page to view the latest status updates
