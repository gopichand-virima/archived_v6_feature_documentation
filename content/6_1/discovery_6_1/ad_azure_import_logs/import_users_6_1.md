---
title: "Import Users"
description: "While importing users into Virima, the system checks if the user already exists. If not, Virima creates a new user."
version: ""
module: "Discovery"
section: "Ad Azure Import Logs"
page: "Import Users"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Ad Azure Import Logs"
  - "Import Users"
  - "Import Users"
---

# Import Users

While importing users into Virima, the system checks if the user already exists. If not, Virima creates a new user.

For consecutive AD imports, the value of a user gets updated if the value has been modified in the AD.

After configuring AD, follow these steps:

1. Click the Import icon located to the right of the selected entry.

1. The **AD Import** dialog box displays.

2. From the **Type of Import** drop-down list, select an option.

1. Select the other options, as necessary.

  1.  **Reflect AD Account Status** – Enable to match user login status with Azure AD.

  2.  **Activate User Account** – Enable to make imported users active by default.

  3.  **Send Activation Notification** – Enable to email users upon account activation.

2. When all selections/entries are made, click **Import**.

3. A confirmation message displays. Click **OK**.
