---
title: "Run a Scan"
description: "Use this function to scan devices connected and communicating in a network."
version: ""
module: "Discovery"
section: "Run A Scan"
page: "Run a Scan"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Run A Scan"
  - "Run A Scan"
  - "Run a Scan"
---

# Run a Scan

Use this function to scan devices connected and communicating in a network. The Discovery application identifies the Device Types, Host Name, and Other Information of the device based on the probe selected for the scan. Users can initiate a scan Immediately or Schedule a Scan based on the requirement.


Start the Discovery Application before initiating a scan.


In the navigation pane, select **Discovery Scan > Run a Scan**. The Run a Scan window displays.

Complete the fields referring to the information below.

When all selections/entries are made, click **Run**.

## Run a Scan Fields

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

| Location | The location (path) for the scan. Click the **plus + sign** to add locations. |

| Send Scan Report to | Users to whom the report should be sent. Click the **plus + sign** and select the applicable users. An email is sent to the user that the scan report is available. |

| Immediate | Select if the scan should be run immediately instead of following a schedule. |

| Scheduled | Select if the scan should run at a set interval. *Refer to* [Scan Frequency](/discovery/scans_frequency_6_1.md)*.* |


- [Recent Scans](/discovery/recent_scans/scans_recent_6_1.md)
- [Scheduled Scans](/discovery/scans_scheduled_6_1.md)
- [Scan Frequency](/discovery/scans_frequency_6_1.md)
- [Background Scan Information](/discovery/scans_background_info_6_1.md)
- [Probe Types](/discovery/probe_types_6_1.md)
