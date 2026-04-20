---
title: "Discovered item view"
description: "Primary Details (left panel) Quick facts about the CI:"
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Discovered item view"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "Discovered Item View"
  - "Discovered item view"
---

# Discovered item view

**Primary Details (left panel)**  
Quick facts about the CI:

- **Asset ID**: Virima's unique identifier for the discovered CI.
- **Blueprint**: The discovery blueprint that matched the resource (e.g., Meraki Switch, Meraki Access Point, Meraki Security Appliance).
- **Created On**: Timestamp when the CI was first created in the CMDB from discovery.
- **Last Modified On**: The most recent time the CI's data was updated.
- **Authorization status**: Badge indicating **Authorized** or **This CI is unauthorized**.
- **Tags**: Meraki metadata key-value pairs attached to resources.

**Top-right actions:**
- **Move to CMDB**: Promotes this discovered item into the CMDB.
- **Rescan Now**: Runs a targeted re-discovery for this single asset.

**Tabs (main panel):**
- **Details**: A complete inventory of the Configuration Item (CI) is captured, with the specific details shown depending on the blueprint associated with the asset.
