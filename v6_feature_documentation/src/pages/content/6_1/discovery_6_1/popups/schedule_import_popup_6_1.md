---
title: "Schedule Import Popup"
description: "When you schedule an import, a schedule configuration popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Schedule Import Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Schedule Import Popup"
  - "Schedule Import Popup"
---

# Schedule Import Popup

When you schedule an import from cloud sources, a schedule configuration popup displays.

**Required Fields:**
- **Name**: A user-defined name to identify this scheduled import
- **Credential**: Select the appropriate cloud credential
- **Services to Import**: Select which services or resource types to import
- **Import Frequency**: Select how often the import should run (e.g., Every Day, Every 2 Days, Weekly)
- **Timezone**: Select the timezone for the schedule
- **Schedule Parameters**: Configure the exact timing (Seconds, Minutes, Hours, Days, Months, Weekdays)

**Optional Fields:**
- **Active**: Checkbox to enable/disable the scheduled import
- **Is Recurring**: Checkbox to specify if the import should repeat

**Actions:**
- **Add** / **Save**: Creates the scheduled import with the configured parameters
- **Update**: Updates an existing scheduled import (when editing)
- **Cancel**: Closes the popup without saving changes

**After Clicking Add:**
- The scheduled import is created and will run automatically according to the configured frequency
- Users can view, edit, or disable the schedule from the Scheduled Scans/Imports page
- Import records will appear in the respective import list page after each execution
