---
title: "Scheduled AD Import"
description: "After AD configuration, follow these steps:"
version: ""
module: "Discovery"
section: "Ad Azure Import Logs"
page: "Scheduled AD Import"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Ad Azure Import Logs"
  - "Scheduled Ad Import"
  - "Scheduled AD Import"
---

# Scheduled AD Import

After AD configuration, follow these steps:

1. Click the **Schedule Import** icon to the right of the selected line item.

1. The **Schedule AD Import** dialog box displays.

1. Select **Enable Schedule Import** to turn on the import function.

2. Select **Activate User Account** to activate all users.

3. Select **Send Activation notification** to the applicable users when the import is complete.

- **Reflect AD Account Status** – Enable to match user login status with Azure AD.
- **Activate User Account** – Enable to make imported users active by default.
- **Send Activation Notification** – Enable to email users upon account activation.

1. In the **AD Import Frequency** field, click the drop-down list and select the applicable import frequency, such as **Every Day, Every 2 days**, and so forth.

2. In the **Type of Import** field, click the drop-down list and select the type of import, such as **All Users, New & Modified Users and New Users**

3. In the schedule area, select **Timezone** and the appropriate schedule timing.

4. When all selections/entries are made, click **Add**. (If you are editing the existing information, the Add button changes Update.)

5. After import completion, view import records in the **AD User Import Logs**.
