---
title: "Importing Meraki Record"
description: "Use this function to import the required Meraki devices into the Discovery application."
version: ""
module: "Discovery"
section: "Import From Meraki"
page: "Importing Meraki Record"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Meraki"
  - "Import Meraki Record"
  - "Importing Meraki Record"
---

# Importing Meraki Record

Use this function to import the required Meraki devices into the Discovery application.

1. Open the Import From Meraki page.
2. From the **Select Actions** drop-down list, choose **Import**. The Import From Meraki dialog box displays.
3. In the **Name** field, enter a name for the import action.
4. In the **Credential** field, click the drop-down list and select the appropriate credential to access the Meraki service.
   - If no credentials are listed in the dropdown, add credentials by navigating to **Admin > Discovery > Credentials**.
5. Select all required device types to be imported from the listed Meraki resources.
6. Click **Add** to import the Meraki devices to Virima.
   - User will be redirected to the Import from Meraki page, where the new import record will be shown with the Status as "**Importing**".
   - Once the status is "**Completed**", click on the imported record to view the imported Meraki resources.
   - To view the details of the CI, click on the CI. This redirects you to the discovered item page, where you can view the imported CI details.

**Note:** If you do not have the necessary permissions to import—such as lacking access to authenticate with proper API credentials—the system will display an error message: **"Please check your Meraki credentials."**
