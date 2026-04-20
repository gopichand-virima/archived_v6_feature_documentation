---
title: "Software License Keys"
description: "Use this function to configure a license key for a specific software asset."
version: ""
module: "Itam"
section: "Sw Asset Mngmt"
page: "Software License Keys"
breadcrumbs:
  - "Home"
  - ""
  - "Itam"
  - "Sw Asset Mngmt"
  - "Sw License Key"
  - "Software License Keys"
---

# Software License Keys

Use this function to configure a license key for a specific software asset.

In the navigation pane, select **ITAM > Software Asset Management > Software License Keys**. The Software License Keys window displays.

New Software License Key

In the *Select Actions* drop-down list, choose **New**. The Software License Key dialog box displays.

Enter the *Asset Name* and *License Key* for the software asset.

Click **Add**.

Edit Software License Key

The following information and sub-functions are shown in this window:

- **Used On**. Lists the assets with the corresponding Software License key.
- **ITSM**. Displays and allows for the creation of [Incidents](/itsm/incident_mngmt/incidents_6_1.md), [Requests](/itsm/request_fulfillment/requests_6_1.md), [Changes](/itsm/change_mngmt/changes_6_1.md), [Problems](/itsm/problem_mngmt/problems_6_1.md), [Known Errors](/itsm/problem_mngmt/known_errors_6_1.md), [Releases](/itsm/release_mngmt/releases_6_1.md), and [Knowledge](/itsm/knowledge_mngmt/about_knowledge_mngmnt_6_1.md).
- **Relationships**. Relates the software asset to an existing *Source* and *Target* and view the Business Service Map.

Click the **Add Source** or **Add Target** button. The Add Relation dialog box displays.

Select the blueprint, and search for the applicable asset.

In the *Choose Relation* field, click the drop-down list and choose the relation.

Click **Add**.

- **SLA**. Configures response and resolution times for the Software License Key if marked as Incident, Requests, Changes, or Problems for resolution. Specify the *Response* and *Resolution Time* as well as the *Support* Levels. Then, configure the *Escalate* parameters.

- **Maintenance**. Set of activities defined to conserve an asset in its original condition. *Refer to [CI: Maintenance](/itsm/config_mngmt/config_items/config_item_details/config_items_maintenance_6_1.md).*
- **Audits**. Analyzes the product or its process to assess compliance with defined specifications or the standards of the deliverable.  
  
  To add an Audit:

Click the **Add Audit** button.

Enter a *Name* and *Description*.

In the *Auditor* field, click **Add,** then search for and select a user to function as the Auditor.

Select the *Recurring Frequency*.

Enter the *Duration (in days)* to indicate the length of time for the audit.

When all selections/entries are made, click **Add**.

Delete Software License Key Import Software License Key

From the *Select Actions* drop down, click **Import**. The New dialog box displays.

Click *Click here to download the sample file* to download the sample file.

Click **Browse** and select the file to import.

Click **Import**.

- [Auto Refresh](/common_topics/auto_refresh_6_1.md)
- [Outage Calendar](/common_topics/outage_calendar_6_1.md)
- [Delete](/common_topics/delete_remove_6_1.md)
- [Import](/common_topics/import_6_1.md)
- [Export](/discovery/import_data_files/export_6_1.md)
- [Saved Filters](/common_topics/saved_filters_6_1.md)
- [Personalize Columns](/common_topics/personalize_columns_6_1.md)
- [Items per Page](/common_topics/items_per_page_6_1.md)
