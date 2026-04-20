---
title: "Service Financial Plan"
description: "Use this function to"
version: ""
module: "Itam"
section: "Service Financial Plan"
page: "Service Financial Plan"
breadcrumbs:
  - "Home"
  - ""
  - "Itam"
  - "Service Financial Plan"
  - "Service Financial Plan"
---

# Service Financial Plan

Use this function to

In the navigation pane, select **ITAM > Financial Management > Service Financial Plan**.

![service financial plan main old](
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

Add Service Financial Plan

From the *Select Actions* drop-down list, choose **New Service Financial Management Plan.**

Enter a *Name* and *Description*.

Enter the *Record Details*.

Enter the *Financial Details*.

To enter a *Service Catalog Item*, click **Add**. Then, in the Service Catalog item dialog box, search for and select the applicable service item.

When all selections/entries are made, click **Add**.

Edit Service Financial Plan Delete Service Financial Plan

 
