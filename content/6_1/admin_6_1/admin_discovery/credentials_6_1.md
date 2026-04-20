# Credentials

Use this function to enable the definition of authentication of the Server or other network components that helps to confirm their identity in a monitored network environment.

When Discovery attempts to access a device, it tries all available credentials until the correct ones are located. After identifying the credentials for a device, Discovery creates a mapping between the credentials and the device. All subsequent discovery activities attempt to match the credentials with a device for which an mapping exists. If credentials for a device change, Discovery tries all available credentials again until a new mapping is created.

In the main window, click **Admin > Discovery > Credentials**. The Credentials window displays. !

New Credential

- From the *Select Actions* drop-down list, choose **New Credentials**.
- To add a new credential, click [New Credentials](/admin_discovery/credentials_new_6_1.md).

Activate Credential

- Select one or more credentials to activate.
- From the *Select Actions* drop-down list, choose **Activate Credentials**.
- In the confirmation dialog box, Click **Yes** to proceed or **No** to cancel.

Deactivate Credential

- Select one or more credentials to activate.
- From the *Select Actions* drop-down list, choose **Deactivate Credentials**.
- In the confirmation dialog box, Click **Yes** to proceed or **No** to cancel.

Flush Credential

- Select the credential you wish to flush.
- From the *Select Actions* drop-down list, choose **Flush Credentials**.
- In the confirmation dialog box, Click **Yes** to proceed or **No** to cancel.

Import Credentials

- From the *Select Actions* drop-down list, choose **Import Credentials**.
- Attach credential data files pop-up appears.
- Click **Click here to download the sample file** to download the sample and prepare your data.
- Click **Browse** and select your file.
- The Preview data to be imported and map columns window opens.
- Map your columns to app properties (the row preview helps you verify).
- Use the dropdown above each column to select the matching app property (e.g., Credential Name, Credential Type, IP Range, User Name, Password, SSH Pass, etc.).
- Click **Submit** to import (or **Cancel** to abort).
- Click **Upload** to upload the file.

Edit Credential

Refer to [Credential Details](/admin_discovery/credentials_details_6_1.md) for information on additional options.

Delete Credential

- [Credential Details](/admin_discovery/credentials_details_6_1.md)
- [Credentials File Backup](/admin_discovery/credentials_backup_file_6_1.md)
- [Flush Credential](/admin_discovery/credentials_flush_6_1.md)
