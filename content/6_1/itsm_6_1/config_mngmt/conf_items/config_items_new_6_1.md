---
title: "New Configuration Item (CI)"
description: "Use this function to configure a new CI by entering values for the parameters present."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "New Configuration Item (CI)"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Config Items New"
  - "New Configuration Item (CI)"
---

# New Configuration Item (CI)

Use this function to configure a new CI by entering values for the parameters present.

In the navigation pane, select **ITSM > Configuration Management > Configuration Items**. The Configuration Items window displays.

In the navigation pane, select **ITAM > Configuration Management > CMDB**. The Configuration Items window displays.

! !

From the *Select Actions* drop-down list, choose **New**. The Add New CI dialog box displays.

! !

From the *Blueprint* drop-down list, select the applicable type of configuration item. Based on the selection, the fields in the dialog box change.

Add the required (\*) information.


**Allow Edit Without Change Request**
If this option *is* checked, the CI can be edited after it's created.

If this option *is not* checked, and an edit is required, either of the following must occur:

A change request must be created. HOW IS THIS DONE?

The user must have a role with relevant access (as per SACM Role Access)

If a user has the ability to edit the CI, this option can be enabled/disabled on-the-fly by doing the following:

While viewing the Configuration Items window, select the applicable item.

In the resulting window, from the *Select Actions* drop-down list, do one of the following:

To allow editing, select **Enable Editing**.

![enable editing](../../
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

To disallow editing, select **Disable Editing**.

![disable editing ci](../../
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


When all selections/entries are made, click **Add**. A notification email is sent to the configured user regarding CI creation.

- [About Configuration Items](/itsm/config_mngmt/config_items/config_item_details/config_items_6_1.md)
- [Edit Configuration Items](/itsm/config_mngmt/conf_items/config_items_edit_6_1.md)
- [Configuration Item Options](/itsm/config_mngmt/conf_items/config_items_options_6_1.md)
