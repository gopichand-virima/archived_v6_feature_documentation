---
title: "Run Report"
description: "The Run Reports tab provides a variety of options, including the following:"
version: ""
module: "Reports"
section: "Reports Run"
page: "Run Report"
breadcrumbs:
  - "Home"
  - ""
  - "Reports"
  - "Reports Run"
  - "Run Report"
---

# Run Report

You must configure the [Report Properties and Conditions](/reports/reports_props_conds_6_1.md) before this step in the report generation process.


The Run Reports tab provides a variety of options, including the following:

- Generating or re-generating
- [Exporting](/discovery/import_data_files/export_6_1.md)
- Publishing
- Save as Canned
- Save as Image
- View Data

Refer to the sections below for more details.

Generate/Re-generate Report

### Example Scenario

The **Run Report** tab fields selected in this example are:

- **Type**: Pie Chart  
  *Other options include Tabular, Bar Chart, Line Chart, and Donut Chart.*

- **Group by:** Users - Last Name  
  *Other options based on the Type of report include Group By, Columns, X-Axis, and Y-Axis.*

The generated report would look similar to the following:


#### Generate a New Report

To generate a new report, do the following:

Enter and save the [Report Properties](/reports/reports_props_conds_6_1.md). The window refreshes, and the **Details** and **Run** report tabs display.

In the *Type* field, click the drop-down list and select a report. The type of report selected - for example, Tabular, Pie Chart, and so forth - determines what additional fields display.

In the *Group by* field, click the drop-down list and select how to group the results.

When all sections are made, click **Generate**. If a report:

- *Can* be generated, the results display in the window.
- *Cannot* be generated, an information message displays. Click the **Details** tab and modify the [Report Properties](/reports/reports_props_conds_6_1.md) parameters.

The generated report is sent via email to the user roles specified.


***For System Administrators**: Refer to***Admin > Users > Users > Access Management > Email Preferences***.to configure user roles.*


#### Re-Generate an Existing Report

If the report has been generated previously, and the *Report Properties* are changed on the **Details** Tab, the report must be re-generated.

To regenerate the report, do the following:

Repeat steps 1-3 above (under *Generate a New Report*).

At Step 4, click the **Re-generate** button.

Publishing

Use this function to publish the report, making it visible to selected users and available for placement in defined locations (such as on the user's dashboard).

While viewing the Run Reports tab, from the *Select Actions* drop-down list choose **Publish**. The Select Entity to Publish on Dashboard dialog box displays.

While viewing the Run Reports tab, click the **Publish** button. The Select Entity to Publish on Dashboard dialog box displays.

Select one or more items.

When all selections are made, click **Done**.

Save as Canned

Use this function to save the report configuration so it can be used again without starting from scratch. The canned report is automatically saved to the Canned Reports list.

While viewing the Run Reports tab, from the *Select Actions* drop-down list, choose **Save as Canned**. A success message displays containing the canned report number.

Click **OK**.

Click on the X to close the message.

! ! Save as Image

Use this function to save the current visual report as an image.

While viewing the Run Reports tab, from the *Select Actions* drop-down list, choose **Save as Image**. The image is saved based on your image configuration settings, such as file type and location (for example, automatically saves to the Windows Downloads folder).

View Data

Use this function to view the data related to data gathered when generating the report.

While viewing the Run Reports tab, from the *Select Actions* drop-down list, choose **View Data**. The Access Management window displays and shows a list of relevant data.

To view additional details for an item, click on it. The applicable window displays. For example, when a user is selected from the list above, the Access Management window displays containing the user's information.  

- [Personalize Columns](/common_topics/personalize_columns_6_1.md)
- [Saved Filters](/common_topics/saved_filters_6_1.md)
- [Items per Page](/common_topics/items_per_page_6_1.md)
- [Auto Refresh](/common_topics/auto_refresh_6_1.md)
- [Export](/discovery/import_data_files/export_6_1.md)
- [Delete](/common_topics/delete_remove_6_1.md)
- [Resource Chart](/admin_users/users_6_1.md#ResourceChart)


- [About Reports](/reports/reports_6_1.md)
- [About Canned Reports](/reports/reports_canned_6_1.md)
- [About Ad Hoc Reports](/reports/reports_ad_hoc_6_1.md)
