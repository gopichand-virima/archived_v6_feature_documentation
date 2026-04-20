---
title: "CI: Details - DML (Digital Media Library)"
description: "Use this function to upload an executable (.exe) file for a software or add a link to the location where the software can be downloaded."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "CI: Details - DML (Digital Media Library)"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Config Items Dml"
  - "CI: Details - DML (Digital Media Library)"
---

# CI: Details - DML (Digital Media Library)

Use this function to upload an executable (.exe) file for a software or add a link to the location where the software can be downloaded.


Configuring a download link is useful when software is required for installation on many clients.


From the navigation pane, select **ITSM >** **Configuration Management > Configuration Items**. The Configuration Items window displays.

From the navigation pane, select **Configuration Management > Configuration Items**. The Configuration items window displays.

Select a record in the list. A new window opens and the **Details** tab displays.

Click the **DML** tab.

! !

Perform any of the following actions.

## Add Software

Click **Add Software**. The Attach Software File dialog box displays.

[!](../../
        param($match)
        $prefix = $match.Groups[1].Value
        $path = $match.Groups[2].Value
        $ext = $match.Groups[3].Value
        
        # Convert path (hyphens to underscores, lowercase)
        $newPath = $path -replace '-', '_'
        $newPath = $newPath.ToLower()
        $newExt = $ext.ToLower()
        
        $fileReplacements++
        return "$prefix$newPath$newExt"
    )

In the *Upload Document* field, click the **Browse** button and select the applicable file.

In the *Description* field, enter details to describe the software.

Click **Upload**. If the upload is successful, the software is shown on the DML tab. By default, an ID is assigned.

## Add Link

Only one link at a time can be configured.


A version of the software must be configured before the link can be saved. Any changes to the version can be made under the Software License Key Details on the **Details** tab for the asset.


Click **Add Link**. The Add Link dialog box displays.

! !

In the *Name* field, type the name of the software.

In the *Link* field, enter the path where the software is located and from where it can be downloaded.

In the *Description* field, enter details to describe the software.

Click **Add**. The software is shown on the DML tab. By default, an ID is assigned.

## Downloading the Software

To download the software, locate it in the list, and click the **Download** icon.

## Deleting the Software

Once you have updated a version of a specific software, the older version cannot be deleted.


To delete a software, locate it in the list, and click the **Delete** icon.
