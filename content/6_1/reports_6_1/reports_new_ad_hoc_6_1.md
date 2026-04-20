---
title: "New Ad Hoc Reports"
description: "Use this function to create view and modify Ad Hoc reports and save Canned Reports."
version: ""
module: "Reports"
section: "Reports New Ad Hoc"
page: "New Ad Hoc Reports"
breadcrumbs:
  - "Home"
  - ""
  - "Reports"
  - "Reports New Ad Hoc"
  - "New Ad Hoc Reports"
---

# New Ad Hoc Reports

Use this function to create view and modify Ad Hoc reports and save [Canned Reports](/reports/reports_canned_6_1.md).

There are three steps in the process:

Step 1. Specify the **Identifying Information** such as visibility and frequency. *See below*.

Step 2. Select the **Report Properties** and set the **Conditions**. *Refer to* [Report Properties and Conditions](/reports/reports_props_conds_6_1.md)*.*

Step 3. **Run** (or Generate) the report. *Refer to* [Run Report](/reports/reports_run_6_1.md)*.*


To *edit* a report, following the same steps as outlined above.


## Identifying Information

In the navigation pane, select **Reports > Ad Hoc Reports**. The Reports window displays.

From the *Select Actions* drop-down list, select **New Report**.

The report window updates.

Complete the fields in the upper portion of the window, referring to the information below.


| Field | Description |

| Name | Name to identify the report. |

| Is Private | Marks the report as private so only visible to those designated in the *Visible* field. |

| Visibility | The names of the users, group, roles or departments who can see the report. This field Is only displayed when the *Is Private* option is selected.

To select those who can see the report, do the following:.

Click the **Add** button. Click **+**icon.The Send Report To dialog box displays.

Select the applicable recipients (users, roles, etc.).

![send report to dialog box](
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

When all selections/entries are made, click **Save**. |

| Is Scheduled | The frequency at which the report is generated. |

| Send Report To | The names of the users, group, roles or departments to whom the report is sent. This field is only displayed when the *Is Scheduled* option is selected. To select those who will receive the report, follow the instructions above for Visibility. |

| Schedule Report Frequency | Specifies the frequency at which the scan should run. There are two ways to set a frequency.
**Option 1**
To designated a *predefined* frequency (for example, every 30 minutes, every hour, etc.), click the drop-own list and select the applicable time based on the Scan Frequency selection. The Second, Minute, Hour, Day, Month and Weekday fields are updated appropriately to match the section.
**Option 2**
To configure a specific frequency:

Click the drop-down list and select **Current Time Settings**.

In the displayed columns (Second, Minute and so forth), select the applicable times. In the example below, the report will generate **every hour** on **Tue** and **Thu** only.

![schedule report frequency](
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


To remove the data currently entered, move to the *Select Actions* drop-down list and choose **Clear Query**.

To remove the data currently entered, click **Clear All Query**

When all selections/entries are made, click **Save and Continue**.

To continue the process, follow the instructions for [Report Properties and Conditions](/reports/reports_props_conds_6_1.md).

- [About Reports](/reports/reports_6_1.md)
- [About Canned Reports](/reports/reports_canned_6_1.md)
