---
title: "Exporting AZURE Records"
description: "Exports data for the selected imported AZURE record as an Excel spreadsheet and sends an email notification when the spreadsheet is ready for download."
version: ""
module: "Discovery"
section: "Import From Azure"
page: "Exporting AZURE Records"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Azure"
  - "Export Azure Record"
  - "Exporting AZURE Records"
---

# Exporting AZURE Records

Exports data for the selected imported AZURE record as an Excel spreadsheet and sends an email notification when the spreadsheet is ready for download.

- From the **Select Actions** drop-down list, choose **Export**.

- Click **Continue.**

- The system downloads an Excel (.xlsx) file of the list with the details,
  - **Unique ID** – The Virima import record ID (e.g., AZURE000578).
  - **Subscription Id** – "Subscription Id" column displays the value you entered for either a Subscription Id or a Management Group Id when adding Azure credentials.
  - **Credential** – The credential set used (e.g., AZURE, AZURE\_ACCOUNT).
  - **Imported By** – The user who initiated the import (e.g., Admin Virima).
  - Manual Import: The logged-in user who initiated a manual import.
  - Scheduled Import: The logged-in user who initiated a scheduled import.
  - **Name** – The AZURE service or resource type imported (e.g., nat, load, AZURE Batch, ECS, AZURE EKS6).
  - **Imported On** – The timestamp when that record was imported (as displayed in the UI).
