# Credentials Backup File

This file stores the credentials (which are encrypted) and is used by the application to scan the assets. These credentials are entered manually through one of the following ways:

- From the Virima application GUI.
- From the Discovery application GUI.
- An Excel import from the Discovery application.

Before reinstalling the application, take a backup of the existing credentials file (cat.json) to avoid re-entering the credentials in the newer version of the Discovery application. Making a backup of the credentials file is an optional.

## Backup Credentials File

Navigate to the installed location of the previously installed Discovery application (usuallyC:\Program Files\Virima Discovery Application\\).

Locate the**cat.json** file.

Backupcat.jsonto a different location.

## Reuse Backup Credentials File (cat.json)

Replace the existing cat.json file with the backup file copy in the installed root directory:C:\Program Files\Virima Discovery Application\cat.json.

Restart the application to apply the changes.
