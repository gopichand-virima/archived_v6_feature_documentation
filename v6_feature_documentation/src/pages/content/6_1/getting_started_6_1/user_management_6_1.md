---
title: "User Management"
description: ""
version: ""
module: "Getting Started"
section: "User Management"
page: "User Management"
breadcrumbs:
  - "Home"
  - "My Dashboard"
  - "Getting Started"
  - "User Management"
  - "User Management"
---

# User Management

The **User Management** module in Virima provides administrators with centralized control over user accounts and access. From this page, admins can invite new users, assign or change roles, monitor account status, and enforce authentication policies such as Single Sign-On (SSO) and Multi-Factor Authentication (MFA). This ensures secure access to the platform while allowing flexibility in managing individual users or entire teams.

Use this procedure to view, manage, and update user accounts in the Virima Platform.

## Prerequisites

*   Administrator access to the Virima Platform.
    
*   Valid email addresses for new users (must match the organization’s registered domain).
    

## View and Manage Users

1.  In the left navigation pane, under **Setup**, select **User Management**.
    

![User Management](/assets/images/6_1/getting_started_6_1/user_management/user_management_1.png)

2.  On the **User Management** page, review the **Active Users** and **Invited Users** tabs.
    
3.  Use the search bar to locate a user by email.
    
4.  Review details in the table:
    
    *   **Email** – User’s registered email address.
        
    *   **Role** – User’s role (_Admin_ or _User_).
        
    *   **Status** – Account status (_Active_, _Deactivated_, _Inactive_).
        
    *   **Name** – Full name of the user.
        
    *   **SSO Login** – Toggle SSO access on or off.
        
    *   **MFA** – Toggle Multi-Factor Authentication on or off.
        

## Enable MFA Globally

1.  At the top of the page, under **Authentication Mode**, select the **MFA** checkbox.
    

![MFA enable](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_1.png)

2.  MFA is now enforced for all users in the tenant.
    
3.  The system displays a notification: **“MFA updated successfully.”**
    

![MFA updated Successfully](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_2.png)

## Invite New Users

1.  On the **User Management** page, select **Invite Users**.
    

![Invite users](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_3.png)

### Invite Users by Bulk Import (CSV)

1.  On the **User Management** page, select **Invite Users**.
    
2.  From the drop-down, select **Bulk import using CSV**.
    

![Invite user Bulk Import](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_4.png)

3.  In the **Import Users** dialog:
    
    *   Select **Download Template** to get the correct CSV format.
        
    *   Enter user details (Email ID, Role, etc.) in the CSV file.
        
    *   Drag and drop the completed CSV file into the upload area or click to browse files.
        
4.  Select **Send Invite(s)**.
    

![Import Users Bulk Import](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_5.png)

5.  All listed users receive invitation emails automatically.
    

### Invite a User by Email

1.  On the **User Management** page, select **Invite Users**.
    
2.  From the drop-down, select **Invite using Email**.
    

![Invite user Invite using Email](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_6.png)

3.  In the **Invite Users** dialog, enter the following:
    
    *   **Email ID** – Enter the user’s organizational email address.
        
    *   **Role** – Select the role (_Admin_ or _User_).
        
4.  Select **Add User** to include multiple entries if needed.
    
5.  When finished, select **Send Invite(s)**.
    

![Invite users email](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_7.png)

6.  The user appears under the **Invited Users** tab until registration is complete.
    

![Invited users list](/assets/images/6_1/getting_started_6_1/user_management/user_management_1_8.png)

### Deactivate or Reactivate Users

1.  Locate the user in the list.
    
2.  In the **Status** column, check the current status.
    
3.  Use the options menu (**…**) to deactivate or reactivate the account.
    
4.  Select **Enable** to activate or **Disable** to deactivate.
    
5.  Confirm the action when prompted.