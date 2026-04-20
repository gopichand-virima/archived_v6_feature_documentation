---
title: "Scheduled Scans"
description: "Use this function to enable the execution of scan functionality according to a configured date and time."
version: ""
module: "Discovery"
section: "Scans Scheduled"
page: "Scheduled Scans"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scans Scheduled"
  - "Scheduled Scans"
---

# Scheduled Scans

Use this function to enable the execution of scan functionality according to a configured date and time.

In the navigation pane, select **Discovery Scan > Scheduled Scan**. The Scheduled Scans window displays.


New Scheduled Scan

From the *Select Actions* drop-down list, choose **New Scan**. The Run a Scan dialog box displays.

Click **New**. The New Schedule Scan dialog box displays

Complete the fields, referring to the table below.

When all selections/entries are made, click **Run**.

## Scheduled Scan Fields

| Field | Description |

| Name | Name of the scan. |

| Probe | The required probe. Refer to [Probe Types](/discovery/probe_types_6_1.md). |

| Client | Name of the Client, which can be selected in the drop-down list. |

| IP Range | Specifies an IP Range to *include* in the scan. Click the icon to scan the entire subnet mask of the corresponding IP address.

When adding an IP address, the IP range can be specified in various formats:

- 192.168.48.1 (Single IP)
- 192.168.48.1 192.168.49.2 (Multiple IPs of Different Subnets)
- 192.168.48.1,2,3,4 (Multiple IPs of Same Subnet)
- 192.168.48.1-50 (A wide Range of IPs in a Subnet)
- 192.168.48.0/24 (Single Subnet/CIDR Notation)
- 192.168.48.0/24 192.168.49.0/24 (Multiple Subnets/CIDR Notation) |

| Exclude IP Range | Specifies an IP Range to *exclude* from the scan (optional). See *IP Range*, above, for a list of valid formats. |

| Location | The location (path) for the Certificate. Click **Add** to update the Location.

The location (path) for the Certificate. Click the **plus + sign**. |

| Send Scan Report to | Users to whom the report should be sent. Click **Add** and select the applicable users. An email is sent to the user that the scan report is available.

Users to whom the report should be sent. Click **the plus + sign** and select the applicable users. An email is sent to the user that the scan report is available. |

| Immediate | Select if the scan should be run immediately instead of following a schedule. |

| Scheduled | Select if the scan should run at a set interval. *Refer to* [Scan Frequency](/discovery/scans_frequency_6_1.md)*.* |


Edit Scheduled Scan

To view scans related to this scan, click the **Related Scans** tab.

Delete Scheduled Scan

- [Run Scan](/discovery/run_a_scan/run_a_scan_6_1.md)
- [Recent Scans](/discovery/recent_scans/scans_recent_6_1.md)
- [Scan Frequency](/discovery/scans_frequency_6_1.md)
- [Background Scan Information](/discovery/scans_background_info_6_1.md)
