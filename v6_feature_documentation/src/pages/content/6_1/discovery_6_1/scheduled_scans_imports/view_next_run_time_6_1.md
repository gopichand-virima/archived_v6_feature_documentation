---
title: "View Next Run Time"
description: "The Next Run column shows when each scheduled operation will execute next."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "View Next Run Time"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "View Next Run Time"
  - "View Next Run Time"
---

# View Next Run Time

The **Next Run** column shows when each scheduled operation will execute next.

## Next Run Calculation:
- Automatically calculated based on:
  - Current date and time
  - Configured frequency
  - Schedule parameters (hour, day, weekday, etc.)
  - Selected timezone
  - Whether the schedule is active

## Display Format:
- Shows date and time in format: MM/DD/YYYY HH:MM:SS AM/PM
- Updates automatically as time progresses
- Blank if schedule is inactive

## Understanding Next Run:
- **Near-term execution**: Shows the very next scheduled run
- **Timezone aware**: Displayed in the schedule's configured timezone
- **Active schedules only**: Inactive schedules show no next run time
- **Post-execution update**: After a run completes, next run time updates automatically

## Planning and Coordination:
Use Next Run information to:
- **Avoid conflicts**: Ensure multiple scans don't run simultaneously
- **Plan maintenance**: Schedule system maintenance between scan windows
- **Verify schedules**: Confirm timing matches expectations
- **Coordinate teams**: Inform stakeholders of upcoming discovery operations
- **Resource planning**: Prepare systems for scan execution

## Troubleshooting:
If Next Run shows unexpected timing:
1. Check schedule frequency configuration
2. Verify timezone setting
3. Confirm schedule parameters (day, hour, weekday)
4. Ensure schedule is active
5. Review Is Recurring setting

## Sort and Filter:
- Sort by Next Run to see which schedules execute soonest
- Filter to find schedules running within specific timeframes
- Identify schedules that may need timing adjustments

The Next Run column provides essential visibility for managing automated discovery operations and ensuring optimal execution timing across all scheduled activities.
