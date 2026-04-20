---
title: "Configure Infoblox"
description: "Navigate to Admin > Integration > Infoblox Configuration."
version: ""
module: "Discovery"
section: "Ipam Networks"
page: "Configure Infoblox"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Ipam Networks"
  - "Configure Infoblox"
  - "Configure Infoblox"
---

# Configure Infoblox

Navigate to **Admin > Integration > Infoblox Configuration**.

The Infoblox Credential dialog box displays. By default, the **Add New Infoblox Credential** option is selected.

## Add New Infoblox Credential

1. In the InfoBlox Credential dialog box, select **Add New Infoblox Credential**.

2. In the *Username* field, enter the user name of the Infoblox installed on the machine.

3. In the *Password* field, type the related password associated with the Username.

4. To change the password, click **Change Password**. The InfoBlox Credential dialog box updates and displays the **Show Password checkbox** and the **Cancel Change** option.

5. In the *Show Password* field, click the checkbox to show the entered password.

6. Click **Cancel Change** to cancel the password change.

7. In the *Host* field, enter the IP address of the InfoBlox machine installed on the Host box.

8. In the *Client* field, click the drop-down list and select the applicable client. You can search in this field by typing the first few letters of the client name to display a list of possible matches.

**Note:** The name of the client displays only if it is functionally "up."

9. When all selections/entries are made, click **Save**.

## Auto Pick Credential from Discovery Application

1. In the Infoblox Credential dialog box, select **Auto pick credential from Discovery application**.

2. In the *Host* field, enter the **IP Address** of the machine on which Infoblox is installed.

3. In the *Client* field, click the drop-down list and select the client's name. The list only contains the name of those clients in "up" status.

4. Click **Save**.
