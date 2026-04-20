---
title: "Accessing the Import Intune Window"
description: "In the navigation pane, select Discovery Scan › Import from Intune."
version: ""
module: "Discovery"
section: "Import From Intune"
page: "Accessing the Import Intune Window"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Intune"
  - "Access Import Intune Window"
  - "Accessing the Import Intune Window"
---

# Accessing the Import Intune Window

1. In the navigation pane, select **Discovery Scan › Import from Intune**.

2. The **Import From Intune** window appears, displaying any records you've already imported.

The page displays a list of **imported runs** from your Intune accounts. Each row represents a single import run.

- **Key columns:**
  - **Id**: Unique identification ID of the import run (e.g., INTUNE000559), records imported from Intune will have the prefix "INTUNE" followed by a six-digit sequential number.
  - **Name**: User-provided name used to identify the import run.
  - **Tenant Id**: The unique identifier for the Microsoft Intune tenant.
  - **Imported On**: The date and time when the import was completed.
  - **Status**: Current state (e.g., Importing, Completed, Failed).
  - **Importing**: The import process from Intune is currently running and in progress.
  - **Completed**: The import from Intune has finished successfully.
  - **Failed**: The import has failed due to errors.
  - **Imported By**: The logged-in user who initiated the import.
  - **Credential**: Virima credential profile used to connect to Intune.
  - **Select Actions**: Perform bulk operations on selected or filtered rows.

- From the **Select Actions** drop-down list, choose the operation you want to perform.
  - **Delete**: Remove selected import record
  - **Export**: Download grid contents to Excel
  - **Import**: Initiate a new Import from Intune
