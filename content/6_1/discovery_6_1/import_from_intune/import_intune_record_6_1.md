---
title: "Importing Intune Record"
description: "Use this function to import the required Intune managed devices into the Discovery application."
version: ""
module: "Discovery"
section: "Import From Intune"
page: "Importing Intune Record"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Intune"
  - "Import Intune Record"
  - "Importing Intune Record"
---

# Importing Intune Record

Use this function to import the required Intune managed devices into the Discovery application.

1. Open the Import From Intune page.

2. From the **Select Actions** drop-down list, choose **Import**. The Import From Intune dialog box displays.

3. In the **Name** field, enter a name for the import action.

4. In the **Credential** field, click the drop-down list and select the appropriate credential to access the Intune service.
   - If no credentials are listed in the dropdown, add credentials by navigating to **Admin > Discovery > Credentials**.

5. Select all required device types to be imported from the listed Intune resources.

6. Click **Add** to import the Intune devices to Virima.
   - User will be redirected to the Import from Intune page, where the new import record will be shown with the Status as "**Importing**".
   - Once the status is "**Completed**", click on the imported record to view the imported Intune resources.
   - To view the details of the CI, click on the CI. This redirects you to the discovered item page, where you can view the imported CI details.

**Note:** If you do not have the necessary permissions to import—such as lacking access to authenticate with proper credentials—the system will display an error message: **"Please check your Intune credentials."**
