---
title: "Import Popup"
description: "When you initiate an import from cloud sources, an import configuration popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Import Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Import Popup"
  - "Import Popup"
---

# Import Popup

When you initiate an import from cloud sources (AWS, Azure, Intune, Meraki), an import configuration popup displays.

**Required Fields:**
- **Name**: A user-defined name to identify this import operation
- **Credential**: Select the appropriate cloud credential from the dropdown
  - If no credentials are available, navigate to Admin > Discovery > Credentials to add them

**Optional Fields (varies by cloud provider):**
- **Services to Import**: Select which cloud services or resource types to import (checkboxes)

**Actions:**
- **Add** / **Import**: Initiates the import operation with the selected parameters
- **Cancel**: Closes the popup without performing the import

**Validation:**
- If credentials are invalid or expired, an error message displays: "Please check your [Provider] credentials"

**After Clicking Add/Import:**
- User is redirected to the import list page
- The new import record appears with Status "Importing"
- Once completed, the status changes to "Completed"
- If errors occur, the status shows "Failed" and logs can be reviewed
