---
title: "Create Scheduled Import"
description: "From the Select Actions drop-down, choose New Scheduled Import."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Create Scheduled Import"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Create Scheduled Import"
  - "Create Scheduled Import"
---

# Create Scheduled Import

From the **Select Actions** drop-down, choose **New Scheduled Import**.

1. Select the import source:
   - AWS
   - Azure
   - Intune
   - Meraki

2. Complete the required fields:
   - **Name**: Identify the scheduled import
   - **Credential**: Select cloud credential
   - **Services to Import**: Choose resource types

3. Configure schedule settings:
   - **Import Frequency**: How often to run
   - **Active**: Enable/disable the schedule
   - **Timezone**: Select appropriate timezone
   - **Schedule Parameters**: Set exact timing

4. Click **Add** to save the scheduled import.

The scheduled import will execute automatically according to the configured frequency and results will appear in the respective import pages (Import from AWS, Import from Azure, etc.).
