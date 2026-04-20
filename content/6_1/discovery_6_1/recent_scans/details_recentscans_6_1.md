---
title: "Details Panel (Main Scan Summary)"
description: ""
version: ""
module: "Discovery"
section: "Recent Scans"
page: "Details Panel (Main Scan Summary)"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Recent Scans"
  - "Details Recentscans"
  - "Details Panel (Main Scan Summary)"
---

# Details Panel (Main Scan Summary)

**General Information:**

- **Name**: Scan name
- **Client**: Discovery application used to execute the scan
- **Probe**: Probe type used for the scan (Deep Host Scan (WMIC|SSH|SNMP))
- **Activity**: Status update on completed actions (e.g., Discovery agent completed the scan)

**IP Range**

- The IP address or range targeted by the scan (e.g., 172.16.5.187)

**Host Details:**

- Summary of discovered devices:
  - **Total Scan Hosts (255):** Number of targets included in this scan (from your IP range).
  - **Total Discovered Hosts (255):** Total number discovered hosts for a given IP range.
  - **Windows Hosts (17):** Successfully fingerprinted as Windows.
  - **Unix/Linux Hosts (26):** Successfully fingerprinted as Unix/Linux.
  - **Network Devices (4):** Routers/switches/firewalls, etc.
  - **Unknown Hosts (18):** The targets are reachable, but none of the supplied credentials authenticated, so the OS couldn't be identified.
  - **Unknown Devices (190):** Devices discovered but not fully classified (often due to missing credentials/ports).

# Execution Info

- **Run by**: Name of the user who initiated the scan (e.g.,Admin Virima). Logged in User
- **Status**: Final scan result, such as "Scan completed" or "Scan in progress."
- **Triggered at / Completed at:** Timestamps indicating when the scan started and finished.
- **Scan duration**: How long the scan took (e.g., 1 minute 20 seconds).
