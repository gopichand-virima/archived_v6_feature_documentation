---
title: "Exporting Meraki Records"
description: "Exports data for the selected imported Meraki record as an Excel spreadsheet and sends an email notification when the spreadsheet is ready for download."
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Exporting Meraki Records"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "Export Meraki Records"
  - "Exporting Meraki Records"
---

# Exporting Meraki Records

Exports data for the selected imported Meraki record as an Excel spreadsheet and sends an email notification when the spreadsheet is ready for download.

- From the **Select Actions** drop-down list, choose **Export**.

- Click **Continue.**

- The system downloads an Excel (.xlsx) file of the list with the details,
  - **Unique ID** – The Virima import record ID (e.g., Meraki000578).
  - **Credential** – The credential set used (e.g., Meraki, Meraki\_Credential).
  - **Imported By** – The user who initiated the import (e.g., Admin Virima).
  - Manual Import: The logged-in user who initiated a manual import.
  - Scheduled Import: The logged-in user who initiated a scheduled import.
  - **Name** – The Meraki service or resource type imported (e.g., nat, load, Meraki Batch, ECS, Meraki EKS6).
  - **Imported On** – The timestamp when that record was imported (as displayed in the UI).
