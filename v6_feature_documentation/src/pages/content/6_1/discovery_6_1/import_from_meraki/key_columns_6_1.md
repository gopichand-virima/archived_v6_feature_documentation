---
title: "Key columns"
description: "Blueprint Name – The discovery blueprint that matched the resource (e.g., Meraki Switch, Meraki Access Point, Meraki Security Appliance)."
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Key columns"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "Key Columns"
  - "Key columns"
---

# Key columns

- **Blueprint Name**: The discovery blueprint that matched the resource (e.g., Meraki Switch, Meraki Access Point, Meraki Security Appliance).
- **Asset Name**: The discovered device name.
- **Status**: Indicates the current state of the CI imported from Meraki. When a CI is newly imported (does not exist in CMDB), the status is shown as "New."
- **Asset ID**: A unique, sequential identification number assigned to each discovered Meraki record. The ID shall have a prefix "DSC" + 6 digits Unique sequential number.
- **Serial Number**: The device serial number from Meraki.
- **Model**: The Meraki device model (e.g., MR33, MS220-8P, MX64).
- **Network Name**: The Meraki network to which the device belongs.

Users can select which columns to display when importing Meraki and sort the grid by any column.
