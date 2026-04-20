---
title: "Installed Software"
description: "Use this function to add and manage the software installed on a host."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "Installed Software"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Components"
  - "Install Sw"
  - "Installed Software"
---

# Installed Software

Use this function to add and manage the software installed on a host.

Components are categorized based on publishers. When the Discovery application detects more than one application from the same publisher on a host, they are grouped under Installed Software. A single instance of a publisher is grouped as **Uncategorized**.

## Add Installed Software

In the selected record configuration window, click **Components**.

In the secondary group of tabs, click **Installed Software**.

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

Click **Add**. The Installed Software dialog box displays.

! !

Do one of the following:

- Click **New Installed Software** and complete all the fields. All fields are required.
- Click **Existing Installed Software** and make any applicable changes.

When all selections/entries are made, click **Add**. A unique ID is assigned.

## Edit Installed Software

In the selected record configuration window, click **Components**.

In the secondary group of tabs, click **Installed Software**.

From the list of records, select the applicable software to edit.

Make the applicable edits on the appropriate tab.

To add a Software License Key, click the **Add** button.

[About Configuration Item Components](/itsm/config_mngmt/components/ci_comp_list_6_1.md)

- [Records per page](/common_topics/records_per_page_6_1.md)
- [Items per Page](/common_topics/items_per_page_6_1.md)
- [Delete](/common_topics/delete_remove_6_1.md)
- [Personalize Columns](/common_topics/personalize_columns_6_1.md)
- [Saved Filters](/common_topics/saved_filters_6_1.md)
