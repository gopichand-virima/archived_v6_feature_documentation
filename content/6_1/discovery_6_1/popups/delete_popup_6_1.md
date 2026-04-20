---
title: "Delete Popup"
description: "When you click Delete, a confirmation popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Delete Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Delete Popup"
  - "Delete Popup"
---

# Delete Popup

When you click **Delete**, a confirmation popup displays.

**Message:** "Are you sure you want to delete the selected record(s)?"

**Additional Requirement:**
- Type "**Delete**" in the text box to confirm the deletion.

**Actions:**
- **Delete**: Permanently deletes the selected record(s). This action cannot be undone.
- **Cancel**: Cancels the delete operation and closes the popup.

**Important Notes:**
- Deletion is permanent and cannot be reversed.
- Understand the potential effects before deleting items.
- In some cases (such as import records), deleting may also remove associated discovered items if they haven't been moved to CMDB.
- Records that have been moved to CMDB will remain in CMDB even if the original import record is deleted.
