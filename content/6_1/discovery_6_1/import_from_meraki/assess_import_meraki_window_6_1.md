---
title: "Assessing Import Meraki Window"
description: "In the navigation pane, select Discovery Scan › Import from Meraki."
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Assessing Import Meraki Window"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "Assess Import Meraki Window"
  - "Assessing Import Meraki Window"
---

# Assessing Import Meraki Window

1. In the navigation pane, select **Discovery Scan › Import from Meraki.**

1. The **Import From Meraki** window opens and displays list of imported records. Each row represents a single import run.

- **Key columns:**
  - **Id**: Unique identification ID of the import run (e.g., Meraki005553), records imported from Meraki will have the prefix “Meraki” followed by a six-digit sequential number.
  - **Name:**
  - Manual Import: The user provided name used to identify the import run.
  - Scheduled imports: The user-provided schedule name appears under the "Name" column.
  - **Status**: Current state (e.g., Importing, Completed, Failed).
  - **Importing**: The import process from Meraki is currently running and in progress.
  - **Adding Data**: The imported information from Meraki is currently being processed and added to your system.
  - **Completed:** The import from Meraki has finished successfully.
  - **Failed: **The import has failed due to some unknown errors
  - View failed details in Meraki Logs
  - **No Data Found**: The import completed, but no data was found to import.
  - **Imported On**: The date and time when the import was completed.
  - **Imported By**:
  - Manual Import: The logged-in user who initiated a manual import.
  - Scheduled Import: The logged-in user who configured scheduled import.
  - **Credential**: Virima credential profile used to connect to Meraki.
  - **Select Actions**: Perform bulk operations on selected or filtered rows.
- From the **Select Actions** drop-down list, choose the operation you want to perform.

- **Delete**: Remove selected import record
  - Selected import record(s) will be deleted.
  - CI(s) imported during the selected import will be removed from Discovered Items.
  - CI(s) moved to CMDB will still appear under CMDB after deleting the Meraki import record.
- **Export** – Download grid contents (selected or filtered rows) to Excel.
  - If you have selected rows, only the selected rows are exported.
  - If you have applied filters, all rows that match the current filters are exported.
  - If no filters are applied and no rows are selected, exporting will include all records from all pages.
  - The file includes the grid columns (e.g., **Unique ID**, **Name**, **Status**, **Imported By**, **Imported On **and **Credential**) (Refer Exported Excel Column Details)

This downloads the import records NOT the CI(s).

- **Import** – Initiate a new Import from Meraki.
