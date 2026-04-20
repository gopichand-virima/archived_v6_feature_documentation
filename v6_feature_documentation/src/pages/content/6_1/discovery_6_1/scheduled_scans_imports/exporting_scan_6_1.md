---
title: "Exporting a Scan"
description: "(Optional) Filter the grid or Select specific row(s) to export."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Exporting a Scan"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Exporting Scan"
  - "Exporting a Scan"
---

# Exporting a Scan

1. (Optional) Filter the grid or Select specific row(s) to export.

  1.  If specific scans are selected

  1.  Exported file will contain only selected row.

  2.  If no rows are selected

  1.  All scan schedules are exported.

2. Click **Select Actions **→** Export**.

1. An excel file is downloaded with following column headers

1. Id is the last three digits of the Schedule ID

2. IsActive indicates if the schedule is active (true) or not(false)

3. NextTriggerTime, if Schedule is active

4. Client is discovery application name this schedule is applicable to

5. Probe is the probe to be executed when the scan is triggered

6. Name of the scan

7. PreviousTriggertime the last scan execution time, will be blank if the scan is triggered first time or not triggered at all

8. Credential: Applicable for Meraki, AWS, Azure import only
