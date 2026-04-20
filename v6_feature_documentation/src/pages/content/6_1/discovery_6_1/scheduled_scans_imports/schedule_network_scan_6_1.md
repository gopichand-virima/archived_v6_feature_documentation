---
title: "Scheduling a Network Scan"
description: "In Scheduling Scans and Imports landing page"
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Scheduling a Network Scan"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Schedule Network Scan"
  - "Scheduling a Network Scan"
---

# Scheduling a Network Scan

1. In Scheduling Scans and Imports landing page

2. Select "Scans" Radio Button

3. From the "Select Actions" drop down

4. Select Option "New Scan"

1. The **Run A Scan** page opens.

1. Enter Required Details:

  1.  **Name**\* – Enter the display name. This is a name to identify the schedule scan

  2.  **Probe**\* – choose the scan probe (e.g., Deep Host Scan (WMIC | SSH | SNMP)).

  3.  **Client**\* – Select the Discovery Application that has access to the IP Range / hostname to be scanned

  4.  **Scan Through** – choose **IP Address** or **Host Name**.

  5.  **IP Range**\* – enter targets. Supported formats:

  - Single IP: 192.168.48.1
  - Multiple across subnets (space-separated): 192.168.48.1 192.168.49.2
  - Same-subnet list: 192.168.48.1,2,3,4
  - Range: 192.168.48.1-50
  - CIDR (one or more): 192.168.48.0/24 192.168.49.0/24

  6.  **Exclude IP Range** – Enter IP address that has to be excluded from the scan. The format is the same IP Range

  7.  For Hostname based scans enter comma separated hostnames

  8.  **Location**

  - Click **Add** to select the Location the discovered devices will be associated with

  9.  **Send Scan Report To**

  - Click **Add** → pick one or more users from the Virima **User** directory.
  - Recipients get email when the scan report is generated. (Make sure their email + role are set in Users.)

  10. **Timezone**

  - Choose the time zone **where you want the schedule to be interpreted**.  
  Tip: If times look off, confirm this first.

  11. **Scan Frequency**

  - Leave **Current Time Settings** to drive the schedule entirely from the wheels, or—if your environment exposes presets—choose a preset here.

  12. **Active / Recurring**

  - **Active**: must be ON for the job to run.
  - **Recurring**:
  - **On** → runs indefinitely by your wheels; turns on Yearly occurrence
  - **Off** → Execute at scheduled times only for current year

  13. **Time wheels (what actually sets the schedule)**

  - Tick a unit to include it, then select values:
  - **Second** – default 0 if not changed (start at top of the minute).
  - **Minute, Hour, Day, Month, Weekday** – choose one or multiple values per column.
  - The combination you pick becomes the schedule.

  14. **Certificate** Required when “Certificate Scan” Probe is selected. Attach a file path/certificate/location artifact needed by the probe. Click **Add** to supply/update the path.

  15. **Port Range: **Required when “Port Scan” Probe is selected  

  16. **URL** Required when “Website Discovery” Probe is selected

**Port list rules**

- Port range can be specified as mentioned below, by default all popular ports will be scanned if no ports are provided.
- Only maximum of **1000** ports can be specified per scan.
- Accepted formats:
  - Comma-separated list: 2001,2002,2003
  - Range with a hyphen: 2001-2003
  - Mixed list and range: 2001,2002,2003-2009

1. Click **Save**.

2. Confirm the Schedule

- You’ll be redirected to **Scheduled Scans and Imports → Scans**.
- Your newly created job will be listed with **IsActive = true** and a **NextTriggerTime** displayed, confirming that the schedule is active and set.
