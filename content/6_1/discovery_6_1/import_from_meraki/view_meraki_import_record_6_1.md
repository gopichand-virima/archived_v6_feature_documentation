---
title: "Viewing Meraki Import Record"
description: "Use this function to view the imported Meraki devices (Regardless of manual import or scheduled import)."
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Viewing Meraki Import Record"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "View Meraki Import Record"
  - "Viewing Meraki Import Record"
---

# Viewing Meraki Import Record

Use this function to view the imported Meraki devices (Regardless of manual import or scheduled import).

1. Select an import record to open its details.

2. The report window displays imported CI(s) in these categories:
   - All
   - Authorized
   - Unauthorized
   - Logs

- **All**: Every device returned by the import.
- **Authorized**: Assets that are already present in the CMDB.
- **Unauthorized**: New assets not yet listed in the CMDB.
- **Logs**: The import run's messages (timings, successes, errors).

**Common controls (top-right of the grid)**
- **Move to CMDB**: Promote the selected records to CMDB.
- **Auto Refresh**: Refresh the grid on set periodic interval. Use this when import is still in progress so that the imported items show up without manual refresh.
