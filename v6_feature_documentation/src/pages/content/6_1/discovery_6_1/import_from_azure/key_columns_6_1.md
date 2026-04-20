---
title: "Key columns"
description: "Blueprint Name – The discovery blueprint that matched the resource (e.g., Azure Virtual Network, Azure Neo4j)"
version: ""
module: "Discovery"
section: "Import From Azure"
page: "Key columns"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Azure"
  - "Key Columns"
  - "Key columns"
---

# Key columns

- **Blueprint Name** – The discovery blueprint that matched the resource (e.g., Azure Virtual Network, Azure Neo4j)
- **Asset Name** – The discovered resource name (cluster/service/task/instance, etc.).
  - The asset name is the AZURE instance ID.
- **Status**: Indicates the current state of the CI imported from AZURE. When a CI is newly imported (does not exist in CMDB), the status is shown as "New."
- **Asset ID**: A unique, sequential identification number assigned to each discovered AZURE record. The ID shall have a prefix "DSC"+ 6 digits Unique sequential number.
- **Host Name: **The host or endpoint name captured by discovery.
- **Subscription Id**: The unique identifier for the Azure subscription or management group associated with the asset. In Virima, this column displays the value entered for either a Subscription Id or a Management Group Id when adding Azure credentials.

Users can select which columns to display when importing AZURE and sort the grid by any column.
