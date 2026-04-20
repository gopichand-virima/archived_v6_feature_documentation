---
title: "Scan Frequency"
description: "Use this function to set the details for a scan, such as frequency, status, and occurrence."
version: ""
module: "Discovery"
section: "Scans Frequency"
page: "Scan Frequency"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scans Frequency"
  - "Scan Frequency"
---

# Scan Frequency

Use this function to set the details for a scan, such as frequency, status, and occurrence.


The Scan Frequency window displays in different layout configurations throughout the application; however, the functionality remains the same across the application.


In the navigation pane, select **Discovery Scans > Scheduled Scans**. The window displays a list of all currently scheduled scans.

Select a scheduled scan for which the frequency should be modified. The Detail window displays.

Do any of the following:

- Modify any of the existing details, such as the scan frequency. *Refer to the table below.*
- Click **Related Scans** to view all scans associated with this scan.
- Manage any [Tasks](/itsm/release_mngmt/tasks_6_1.md), [Comments](/discovery/comments_6_1.md), or [Attachments](/discovery/attachments_6_1.md).
- View the **Log** to see any hosts.
- To export the scan information, click **Export Scan Report**. The report is emailed to the user logged into the application.

When all selections/entries are made, click **Update**.

### Scan Frequency Fields

| Field | Description |

| Client | Indicates the client to which the scan applies. |

| Scan Frequency | The time interval at which the scan runs. When a predefined time is selected from the drop-down list, the timetable columns update accordingly. For example, if the **Scan Frequency** is every **3 days**, the selections and shading in the table automatically adjust.

![scan frequency example](
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

![scan frequency new](
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
    ) |

| Is Active | Indicates if the scan is active. When unchecked, the scan does not run. |

| Is Recurring | Specifies if the scan should be repeated at the predefined time. If unchecked, the scan will run one time once the frequency setting is reached. |


- [Background Scan Information](/discovery/scans_background_info_6_1.md)
- [Scheduled Scans](/discovery/scans_scheduled_6_1.md)
- [Run a Scan](/discovery/run_a_scan/run_a_scan_6_1.md)
- [Recent Scans](/discovery/recent_scans/scans_recent_6_1.md)
