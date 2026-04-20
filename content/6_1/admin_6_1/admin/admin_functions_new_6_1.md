---
title: "Admin Functions"
description: "Admin functions are only available to System Administrators. If you do not have system administrative persons, the gear icon to access the admin functions will not be displayed in the application window."
version: ""
module: "Admin"
section: "Admin Functions New"
page: "Admin Functions"
breadcrumbs:
  - "Home"
  - ""
  - "Admin"
  - "Admin Functions New"
  - "Admin Functions"
---

# Admin Functions

Admin functions are only available to System Administrators. If you do not have system administrative persons, the gear icon to access the admin functions will not be displayed in the application window.

With admin permissions:

![with admin icon](
        param($match)
        $prefix = $match.Groups[1].Value
        $path = $match.Groups[2].Value
        $ext = $match.Groups[3].Value
        
        # Convert path
        $newPath = $path -replace '%20', '_' -replace '-', '_'
        $newPath = $newPath.ToLower()
        $newExt = $ext.ToLower()
        
        $fileReplacements++
        return "$prefix$newPath$newExt"
    )

Without admin permissions:

![no admin icon](
        param($match)
        $prefix = $match.Groups[1].Value
        $path = $match.Groups[2].Value
        $ext = $match.Groups[3].Value
        
        # Convert path
        $newPath = $path -replace '%20', '_' -replace '-', '_'
        $newPath = $newPath.ToLower()
        $newExt = $ext.ToLower()
        
        $fileReplacements++
        return "$prefix$newPath$newExt"
    )


This module includes the following functions.

- [Organizational Details](/admin_org_details/about_org_details_6_1.md)
- [Discovery](/admin_discovery/admin_discovery_6_1.md)
- [SACM](/admin_sacm/admin_sacm_6_1.md)
- [Users](/msp/admin_users_6_1.md)
- Management Functions

[Change](/itsm/change_mngmnt/about_change_mngmnt_6_1.md)

[Events](/admin_event_mngmnt/about_event_mngmnt_6_1.md)

[Incident](/itsm/incident_mngmt/about_incident_mngmnt_6_1.md)

[Knowledge](/itsm/knowledge_mngmt/about_knowledge_mngmnt_6_1.md)

[Problem](/itsm/problem_mngmt/about_problem_mngmnt_6_1.md)

[Project](/admin_project_mngmnt/about_project_mngmnt_6_1.md)

[Release](/itsm/release_mngmt/about_release_mngmnt_6_1.md)

[Request](/admin_request_mngmnt/about_request_mngmnt_6_1.md)

- [Integrations](/admin_integrations/about_integrations_6_1.md)
- [Others](/admin_other/admin_other_6_1.md)
