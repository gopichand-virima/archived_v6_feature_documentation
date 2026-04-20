---
title: "Status Update"
description: "Use this function to select one or more networks (subnet) from the IPAM Networks page, one or more IP Addresses from the IPAM Network's IP list tab, then perform a status update scan."
version: ""
module: "Discovery"
section: "Ipam Networks"
page: "Status Update"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Ipam Networks"
  - "Status Update"
  - "Status Update"
---

# Status Update

Use this function to select one or more networks (subnet) from the IPAM Networks page, one or more IP Addresses from the IPAM Network's IP list tab, then perform a status update scan. This pings every IP Address in the network's IP List, and updates its status to *Used* or *Unused*. All pingable IPs are set to *Used* and non-pingable to *Unused*.

1. Select a line item.

2. Click **Status Update**.

3. Enter the *Probe* to scan.

4. In the *Client* field, click the drop-down list and select the applicable client.

5. Enter an *IP Range*.

6. Select if the update should be *Immediate* or *Scheduled*. If *Scheduled* is selected, configure the *Scan Frequency*.

7. When all selections/entries are made, click **Status Update**.
