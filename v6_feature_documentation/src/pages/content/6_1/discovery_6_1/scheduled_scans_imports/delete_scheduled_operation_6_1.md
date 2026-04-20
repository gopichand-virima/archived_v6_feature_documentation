---
title: "Delete Scheduled Operation"
description: "Select one or more scheduled operations from the list."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Delete Scheduled Operation"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Delete Scheduled Operation"
  - "Delete Scheduled Operation"
---

# Delete Scheduled Operation

1. Select one or more scheduled operations from the list.

2. From the **Select Actions** drop-down, choose **Delete**.

3. A confirmation popup displays. Type "**Delete**" in the text box to confirm.

4. Click **Delete** to permanently remove the scheduled operation.

**Important Notes:**
- Deleting a schedule only removes the scheduled configuration
- Previous scan/import records from that schedule will remain in Recent Scans and import history
- Assets already moved to CMDB are not affected
- This action cannot be undone
- The schedule will stop executing immediately

**After Deletion:**
- The schedule no longer appears in the Scheduled Scans/Imports list
- No future automatic scans/imports will occur for that schedule
- To resume automated discovery, create a new schedule
