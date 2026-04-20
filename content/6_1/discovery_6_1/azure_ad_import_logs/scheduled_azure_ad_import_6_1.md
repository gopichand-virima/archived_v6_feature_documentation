---
title: "Scheduled Azure AD Import"
description: "After Azure AD configuration, follow these steps:"
version: ""
module: "Discovery"
section: "Azure Ad Import Logs"
page: "Scheduled Azure AD Import"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Azure Ad Import Logs"
  - "Scheduled Azure Ad Import"
  - "Scheduled Azure AD Import"
---

# Scheduled Azure AD Import

After Azure AD configuration, follow these steps:

1. Click the **Schedule Import icon** to the right of the selected line item.

2. The **Schedule Azure AD Import** dialog box displays.

1. Select **Enable Schedule Import** to turn on the import function.

2. Select**Reflect AD Account Status**to match user login status with Azure AD.

3. Select **Activate User Account** to activate all users.

4. Select **Send Activation notification** to the applicable users when the import is complete.

- **Reflect AD Account Status** – Enable to match user login status with Azure AD.
- **Activate User Account** – Enable to make imported users active by default.
- **Send Activation Notification** – Enable to email users upon account activation.

1. In the **Azure AD Import Frequency** field, click the drop-down list and select the applicable import frequency, such as **Every Day, Every 2 days**, and so forth.

2. In the schedule area, select **Timezone** and the appropriate schedule timing.

3. When all selections/entries are made, click **Add**. (If you are editing the existing information, the Add button changes Update.)

4. After import completion, view import records in the **Azure AD User Import Logs**.
