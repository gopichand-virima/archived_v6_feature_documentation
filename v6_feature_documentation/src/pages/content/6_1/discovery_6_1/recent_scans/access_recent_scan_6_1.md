---
title: "Accessing Recent Scan"
description: "From the left navigation, go to Discovery Scan → Recent Scans."
version: ""
module: "Discovery"
section: "Recent Scans"
page: "Accessing Recent Scan"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Recent Scans"
  - "Access Recent Scan"
  - "Accessing Recent Scan"
---

# Accessing Recent Scan

1. From the left navigation, go to **Discovery Scan** → **Recent Scans.**

1. The page displays the most recent scan runs (newest first) with the columns: Id, Name, Status, Run By, Triggered, Completed, Scan Duration, Location, Client, HostName, and Probe.

# Column Details

1. **Scan ID**: The unique identifier for a scan.

2. **Scan name**: A unique identifier for each scan, often descriptive based on location, scan type, or schedule.

3. **Status**: Indicates the outcome of each scan. Possible values include:

  - **Discovery agent completed the scan (successful)**: The master scan is marked **Completed** only after every child scan finishes and no hosts or sub lists remain pending.
  - **Scan aborted**: The user manually stopped the scan.
  - **Scan in Progress**: The scan is in progress.
  - The master scan is marked **In Progress**, if the child scan has not completed or has not been assigned a status (Success, Partial, or Failed).


1. **Triggered at**: Indicates when the scan started.

2. **Completed time**: The timestamp when the scan finished or failed. This helps track duration and performance.

3. **Duration**: The total time taken for the scan to complete. This helps identify unusually short (failed) or long (delayed) scans.

4. **Run by**: Shows which user or system triggered the scan.

5. **Rescan/Stop Scan**: Allows users to manually reinitiate or repeat a scan for a specific entry. Each row corresponds to a discovery scan, providing a shortcut to run that scan again, regardless of previous success. This column also allows users to abort an ongoing scan and initiate a rescan.

  - Rescans appear as the top entry in the recent scans table with the same Name.
