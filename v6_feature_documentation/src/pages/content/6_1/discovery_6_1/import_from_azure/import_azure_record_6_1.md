---
title: "Importing AZURE Record"
description: "Use this function to import the required AZURE resources into the Discovery application."
version: ""
module: "Discovery"
section: "Import From Azure"
page: "Importing AZURE Record"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Azure"
  - "Import Azure Record"
  - "Importing AZURE Record"
---

# Importing AZURE Record

Use this function to import the required AZURE resources into the Discovery application.

- Open the Import From AZURE page.
- From the **Select Actions** drop-down list, choose **Import**. The Import From AZURE dialog box displays.

- In the Name field, enter a name for the import action.
- In the Credential field, click the drop-down list and select the appropriate credential to access the AZURE service.
  - If no credentials are listed in the dropdown, add credentials by navigating to **Admin > Discovery > Credentials**.
- Select all required services to be imported from the listed AZURE services.

- Click **Add** to import the AZURE services to virima.
  - User will be redirected to the import From AZURE page, where the new import record will be shown with the Status as "**Importing**".
  - Once the status is "**Completed**", Click on the imported record to view the imported AZURE resources.
  - To view the details of the CI, click on the CI. This redirects you to the discovered item page, where you can view the imported CI details.

If you do not have the necessary permissions to import—such as lacking access to authenticate with a certificate or Secret Key —the system will display an error message:  
**"Please check your Azure credentials."**
