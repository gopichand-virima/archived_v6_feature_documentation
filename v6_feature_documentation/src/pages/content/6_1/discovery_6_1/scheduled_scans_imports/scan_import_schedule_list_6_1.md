---
title: "Scan and Import Schedule List"
description: "The main area displays a grid listing all scheduled scans and imports."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Scan and Import Schedule List"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Scan Import Schedule List"
  - "Scan and Import Schedule List"
---

# **Scan and Import Schedule List**

- The main area displays a grid listing all scheduled scans and imports.
- Each row represents a job, showing details such as Id, Name, Client, Is Active, Previous Trigger Time, Next Trigger Time, Credential, Hostname and Probe.

**Field Name**

**Description**

ID

The application automatically generates a unique ID for each job.

Taxonomy is based on job type:

- AWS: Prefix with "AWS" + 6-digit sequential number (e.g., AWS897789)
- AZURE: Prefix with "AZURE" + 6-digit sequential number (e.g., AZURE028538)
- MERAKI: Prefix with "MERAKI" + 6-digit sequential number (e.g., MERAKI345678)
- Scans: Prefix with "SCH" + 6-digit sequential number (e.g., SCH578673)

Name

The user inputs the name when creating a job.

Client

Applies only to scans. Refers to the Discovery Application (Client) the user selected when creating a scan.

IsActive

True: The scheduled scan or import is active and triggers at the scheduled time.

False: The scheduled scan or import is inactive and does not trigger at the scheduled time.

PreviousTriggerTime

Displays the last run time of this schedule. This information populates after the initial execution.

NextTriggertime

Shows the next run time. Recalculates immediately upon **Save**, or after a scheduled job has been completed

Credential

Credentials for imports. Applicable only to AWS, Azure, and Meraki.

Probe

Probe to execute during the scan. Applicable only to scheduled scans.

Hostname

Hostname selected when initiating a scan. Applicable only to scheduled scans.

Note: If you do not see any particular field in the table, use the personalized column option to select the fields to display.
