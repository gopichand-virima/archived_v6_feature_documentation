---
title: "Sync Popup"
description: "When you sync from Infoblox, a sync configuration popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Sync Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Sync Popup"
  - "Sync Popup"
---

# Sync Popup

When you sync IPAM data from Infoblox, a sync configuration popup displays.

**Sync Options:**
- **Instant Sync**: Import records from Infoblox immediately
- **Schedule Sync**: Configure automated sync at scheduled intervals

**For Scheduled Sync:**
- **Schedule Report Frequency**: Select how often to sync (e.g., Every Hour, Every Day)
- **Schedule Parameters**: Configure the exact timing by selecting:
  - Second
  - Minute
  - Hour
  - Day
  - Month
  - Weekday

**Actions:**
- **Sync Now** / **Add**: Initiates the sync operation (Instant) or saves the schedule (Scheduled)
- **Cancel**: Closes the popup without syncing

**After Clicking Sync Now:**
- The sync process begins and imports subnet and IP address data from Infoblox
- Progress can be monitored in the IPAM Networks page
- New networks and IP addresses appear in the list after sync completes
- A notification confirms successful sync completion
