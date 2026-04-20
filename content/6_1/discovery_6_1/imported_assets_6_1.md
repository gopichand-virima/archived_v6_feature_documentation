---
title: "Imported Assets"
description: "Use this function to view the results of data imported during the data files import operation and move them (if applicable) to CMDB. An asset can also be rescanned through this function."
version: ""
module: "Discovery"
section: "Imported Assets"
page: "Imported Assets"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Imported Assets"
  - "Imported Assets"
---

# Imported Assets

Use this function to view the results of data imported during the data files import operation and move them (if applicable) to CMDB. An asset can also be rescanned through this function.

In the navigation pane, select **Discovery Scan > Imported Assets**. The Imported Assets window displays.

![A screenshot of a computer Description automatically generated](
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

Select at least one or more records. (When rescanning, the asset must have an IP address.)

From the *Select Actions* drop-down list, choose either [Move to CMDB](/discovery/move_cmdb_6_1.md) or [Re-Scan](/discovery/discovered_items/re_scan_6_1.md).

At the prompt, click **Yes**.

[Import Data Files](/discovery/import_data_file_6_1.md)
