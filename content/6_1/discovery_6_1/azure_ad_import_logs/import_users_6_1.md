---
title: "Import Users"
description: "While importing users into Virima, the system checks if the user already exists. If not, Virima creates a new user."
version: ""
module: "Discovery"
section: "Azure Ad Import Logs"
page: "Import Users"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Azure Ad Import Logs"
  - "Import Users"
  - "Import Users"
---

# Import Users

While importing users into Virima, the system checks if the user already exists. If not, Virima creates a new user.

For consecutive Azure AD imports, the value of a user gets updated if the value has been modified in the Azure AD.

After configuring Azure AD, follow these steps:

1. Click the **Import** **icon** located to the right of the selected entry.

1. The **Azure AD Import** dialog box displays.

  1.  In the **Azure AD Import** dialog box:

  1.  **Reflect AD Account Status** – Enable to match user login status with Azure AD.

  2.  **Activate User Account** – Enable to make imported users active by default.

  3.  **Send Activation Notification** – Enable to email users upon account activation.

1. When all selections/entries are made, click **Import**.

2. A confirmation message displays. Click **OK**.
