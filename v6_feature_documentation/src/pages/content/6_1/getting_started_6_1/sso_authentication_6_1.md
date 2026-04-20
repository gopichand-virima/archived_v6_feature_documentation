---
title: "SSO and Authentication"
description: "Use this procedure to configure and manage enterprise identity providers for authentication."
version: ""
module: "Getting Started"
section: "Configure Sso And Authentication"
page: "Configure SSO and Authentication"
breadcrumbs:
  - "Home"
  - "My Dashboard"  
  - "Getting Started"
  - "SSO and Authentication
---

# SSO and Authentication

The **SSO & Authentication** feature in Virima enables organizations to integrate external identity providers for secure and seamless user authentication. By connecting providers such as **Okta**, **Ping Identity**, and **Auth0**, administrators can centralize access management, enforce organizational security policies, and simplify the login experience for users. This section also allows you to add new configurations, edit existing ones, test connectivity, and manage multiple authentication methods within the platform.

# Configure SSO and Authentication

Use this procedure to configure and manage enterprise identity providers for authentication.

## Prerequisites

*   Administrator access to the Virima Platform.
    
*   Active account with your chosen identity provider (Okta, Auth0, Ping Identity, etc.).
    
*   Provider credentials such as **Application ID**, **Client Secret**, and **Issuer URL**.
    

## SSO and Auth: OIDC

1.  In the left navigation pane, under **Setup**, select **SSO and Auth**.
    
2.  Select the authentication type:
    
    *   **OIDC** for providers like Auth0, Okta, or Ping.
        

![SSO and Auth](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_1.png)

3.  On the **SSO & Authentication** page, select **Add Configuration**.
    

### Configure an Identity Provider (Example: Okta)

Use this procedure to configure Okta as an identity provider for Single Sign-On (SSO).

#### Steps

1.  On the **SSO & Authentication** page, select **Add Configuration**.
    
2.  From the list, select **Okta**.
    

![Okta](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_2.png)

3.  In the **Configure Okta** dialog, enter the following details:
    
    *   **Configuration Name** – Provide a unique name (example: _Okta_).
        
    *   **Application ID (Client ID)** – Enter the Client ID from your Okta application.
        
    *   **Client Secret Key** – Enter the Client Secret Key from your Okta application.
        
    *   **Issuer URL** – Enter the issuer URL provided by Okta.
        
4.  Locate the **Callback URL** displayed in the dialog.
    
    *   Copy this URL.
        
    *   Paste it into the “Callback URL” or “ACS URL” field in your Okta application settings.
        
5.  Select **Test Connection** to validate the setup.
    
    1.  If the connection is successful, the system displays **“Test Connection is Successful.”**
        
    2.  If the connection fails, the system displays **“Test Connection is Failed.”**
        
6.  If the test is successful, select **Save** to apply the configuration.
    

![Configure Okta](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_3.png)

7.  Confirm that the new provider appears in the **Active Identity Provider** list with status **Active**.
    

### Edit Configuration

Use this procedure to edit an existing identity provider configuration.

#### Steps

1.  In the left navigation pane, under **Setup**, select **SSO and Auth**.
    
2.  Select the authentication type (**OIDC**)
    
3.  On the **SSO & Authentication** page, locate the provider you want to edit.
    
4.  Next to the provider, select **Edit**.
    

![Edit Configuration](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_4.png)

5.  In the **Edit Configuration** dialog, update the following fields as needed:
    
    *   **Configuration Name** – Update the display name if required.
        
    *   **Application ID (Client ID)** – Enter the new Client ID.
        
    *   **Client Secret Key** – Enter the updated secret key.
        
    *   **Issuer URL** – Update the URL provided by the identity provider.
        
6.  (Optional) If the callback URL has changed, update it in your identity provider’s application settings.
    
7.  Select **Test Connection** to validate the changes.
    
    *   If the connection is successful, the system displays **“Test Connection is Successful.”**
        
    *   If the connection fails, the system displays **“Test Connection is Failed.”**
        
8.  When the test is successful, select **Update** to save the configuration.
    

## SSO and Auth: SAML

1.  In the left navigation pane, under **Setup**, select **SSO and Auth**.
    
2.  Select the authentication type:
    
    *   **SAML** for SAML 2.0–compliant providers.
        

![SSO and Auth SAML](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_5.png)

3.  On the **SSO & Authentication** page, select **Add Configuration**.
    

### Configure an Identity Provider (Example: Auth0)

Use this procedure to configure **Auth0** as an identity provider for Single Sign-On (SSO).

#### Steps

1.  On the **SSO & Authentication** page, select **Add Configuration**.
    
2.  From the list, select **Auth0**.
    

![Configure SAML](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_6.png)

3.  In the **SAML Configuration** dialog, enter a **Configuration Name**.
    
4.  Copy the **Assertion Consumer Service (ACS) URL** displayed on the screen.
    
    *   Paste this value into the **Application Callback URL** (or ACS field) in your identity provider settings.
        
5.  (Optional) Copy the **Single Logout (SLO) URL** if supported by your provider.
    
6.  Select **Next**.
    
7.  Verify the new provider appears in the **Active Identity Provider** list with status **Active**.
    

### Edit Configuration

Use this procedure to edit an existing identity provider configuration.

#### Steps

1.  In the left navigation pane, under **Setup**, select **SSO and Auth**.
    
2.  Select the authentication type (**SAML**)
    
3.  On the **SSO & Authentication** page, locate the provider you want to edit.
    
4.  Next to the provider, select **Edit**.
    

![Edit Configure SAML](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication_7.png)

5.  In the **SAML Configuration** dialog, update the following fields:
    
    *   **Configuration Name** – Update the display name if needed.
        
    *   **Assertion Consumer Service (ACS) URL** – Review the auto-generated ACS URL and, if changed, copy it into your identity provider’s **Application Callback URL** field.
        
    *   **Single Logout (SLO) URL** – Review or update the auto-generated SLO URL if required.
        
6.  Follow the instructions to copy and paste the ACS URL into your identity provider’s configuration.
    
7.  After making the updates, select **Next** to continue to the next step in the configuration process.
    

### Test Connection

1.  Select **Test** to validate the connection.
    

![Test Connection](/assets/images/6_1/getting_started_6_1/sso_and_authentication/configure_sso_and_authentication.png)

2.  If the connection is successful, the system displays **“Test Connection is Successful.”**
    
3.  If the connection fails, the system displays **“Test Connection is Failed”.**