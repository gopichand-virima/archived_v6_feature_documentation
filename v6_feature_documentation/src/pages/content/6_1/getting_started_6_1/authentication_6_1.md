---
title: "Authentcation"
description: "The Authentication module secures access to the Virima Platform. It includes registration, login, password management, account lockout protection, multi-factor authentication (MFA), and Single Sign-On (SSO) integration."
version: ""
module: "Getting Started"
section: "Authentcation"
page: "Authentcation"
breadcrumbs:
  - "Home"
  - "My Dashboard"
  - "Getting Started"
  - "Authentcation"
---

# Authentication

The Authentication module secures access to the Virima Platform. It includes registration, login, password management, account lockout protection, multi-factor authentication (MFA), and Single Sign-On (SSO) integration.

This guide explains how to register, sign in, manage credentials, and configure authentication settings.

# User Authentication

## Register a new user

You can register a **New User** through the Virima registration process.

### Prerequisites

*   Organizational email address (e.g., `user@yourdomain.com`).
    
*   Your organization must be registered in the Virima system.
    
*   An administrator may restrict direct registration.
    

**Steps**

1.  Open the Virima Platform, and then click on **Go to Application.**
    
2.  On the Registration page, enter your organizational email address (e.g., `user@yourdomain.com`).
    
    *   If invalid, an error displays.
        
    *   If already registered, select **Sign In**.
        

![Registration](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_1.png)

4.  Complete the required fields in the registration form to create an account.
    
    *   First name
        
    *   Last name
        
    *   Email Address
        
    *   Password (must meet security requirements)
        
    *   Confirm password
        
5.  Select **Create account**.
    

![Create an account](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_2.png)

6.  Check your inbox for a verification code.
    
7.  Enter the code and select **Verify Code**.
    

![Verify your email](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_3.png)

8.  Your account activates when verification succeeds.
    
9.  The system displays a "Verification successful" message.
    

![Verification successful](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_4.png)

## Sign in

### Standard Sign in

1.  On the Registration page, click **Sign in.**
    

![Sign in](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_5.png)

2.  On the sign in page, enter your **Email** address and click **Continue**.
    

![Sign in email](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_6.png)

3.  Enter the Password, and then Click **Login**.
    

![Login](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_7.png)

4.  (Optional) Select **Remember me** to save the address.
    
5.  The system directs you to the Virima Application.
    

### Sign in with SSO (OIDC or SAML)

1.  On the Virima login page, select your authentication method:
    
    *   **Auth0 (OIDC)**
        
    *   **auth0Saml (SAML)**
        
2.  You are redirected to the identity provider login screen.
    

![Auth0 (OIDC)](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_8.png)

3.  Enter your **Email address**.
    
4.  Enter your **Password**.
    
5.  Select **Continue**.
    
6.  (Optional) If enabled, choose an alternative login such as **Continue with Google**.
    
7.  After successful authentication, you are redirected back to the Virima Platform.
    

## Reset a Forgotten Password

1.  On the login to your account page, select **Forgot Your Password**.
    

![Forgot password](/assets/images/6_1/getting_started_6_1/authentication/user_authentication_9.png)

2.  To recover your account, Enter your email address.
    
3.  Check your inbox for a recovery code.
    
4.  Enter the code and select **Verify Code**.
    
5.  Enter the **New Password** and **Re-enter New Password** to confirm your new password.
    
6.  Select **Update Password.**
