---
title: "Move to CMDB Popup"
description: "When you click Move to CMDB, a confirmation popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Move to CMDB Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Move To Cmdb Popup"
  - "Move to CMDB Popup"
---

# Move to CMDB Popup

When you click **Move to CMDB**, a confirmation popup displays.

**Message:** "Are you sure you want to move the Asset?"

**Actions:**
- **Yes** / **Continue**: Proceeds with moving the selected asset(s) to the CMDB. The asset will be promoted from the discovered items or imported assets list into the Configuration Management Database.
- **No** / **Cancel**: Cancels the move operation and closes the popup.

**Important Notes:**
- Once an asset is moved to CMDB, it cannot be retrieved back to the discovered items list.
- The move operation runs in the background.
- The selected record will appear grayed out during processing.
- After successful move, the record will be removed from the source list and will be available in the CMDB.
