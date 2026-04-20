---
title: "Discovered Items"
description: "Use this function to view the details for a successful scan, configured items for each record, and the number of new changes discovered for the CI present in the CMDB."
version: ""
module: "Discovery"
section: "Discovered Items"
page: "Discovered Items"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Discovered Items"
  - "Discovered Items"
---

# Discovered Items

Use this function to view the details for a successful scan, configured items for each record, and the number of new changes discovered for the CI present in the CMDB.


The number of change can increase when the asset inside the discovered items is scanned multiple times. With every scan, new changes for that CI are found inside CMDB. Once the asset is moved into the CMDB, all the changes are applied to CI, and the asset gets deleted as a Discovered Item.


In the navigation pane, select **Discovery Scan > Discovered Items**. The Discovered Items window displays.


## Filter By

To filter the list, from the *Filter By* drop-down list, select one of the following:

- **Show All**. Displays the Asset ID for the assets already present in the CMDB. Click the ID to open the CI record page in CMDB. An encircled number shown next to the blueprint indicates the new updates (found in the recent scan) which are not present in CMDB.
- **New**. Displays new assets (Unauthorized Assets). *Refer to* [Unauthorized Assets](/discovery/unauthorized_assets_6_1.md)*.*
- **Updated**. Displays existing CIs (Authorized Assets).


For a record containing a *hyperlink* in the CI column, this asset exists in the CMDB.

For a record with *no hyperlink* in the CI column, the asset has not been imported and is considered an "unauthorized asset."


## Correlation of Records

- The Discovery Inventory keeps only one copy of record for a particular Host. Even if the host is scanned multiple times, uniqueness in a record is maintained.
- Different factors are used for correlation, which is user configurable. The Correlation logic can be edited at [Admin > Correlation](/admin_discovery/correlation_6_1.md).

View, Move or Re-Scan Discovered Items

From the *Select Actions* drop-down list, choose an action: [Move to CMDB](/discovery/move_cmdb_6_1.md), [Move to ServiceNow](/discovery/move_servicenow_6_1.md)**,** or **[Re-Scan](/discovery/rescan_now_6_1.md)**.

From the *Select Actions* drop-down list, choose an action: [Move to CMDB](/discovery/move_cmdb_6_1.md), [Move to ServiceNow](/discovery/move_servicenow_6_1.md)**,** or **[Re-Scan](/discovery/rescan_now_6_1.md).**

Edit Discovered Items  

On the Details tab, the details cannot be edited. However, the following can be done:

- [Move to CMDB](/discovery/move_cmdb_6_1.md)
- [Rescan](/discovery/rescan_now_6_1.md)
- View [Tasks](/itsm/release_mngmt/tasks_6_1.md), [Comments](/discovery/comments_6_1.md), and [History](/common_topics/history_6_1.md)
- View [Updates](/common_topics/updates_6_1.md)

Other information may be shown, and varies by asset. For example:

- If the asset is *Software*, the *[Components](/itsm/config_mngmt/config_items/config_item_components/component_tab_options_6_1.md)* option (if shown) may contain sub-components, such as *Software License Keys* and *IP Connections*. This information is view only.
- If the asset is *Windows Host*, the *[Components](/itsm/config_mngmt/config_items/config_item_components/component_tab_options_6_1.md)* option (if shown) may contain sub-components, such as *Network Adapters* and *IP Connections*. This information is view only.

Delete Discovered Items

[Discovered Items Updates](/discovery/discovered_items_updates_6_1.md)
