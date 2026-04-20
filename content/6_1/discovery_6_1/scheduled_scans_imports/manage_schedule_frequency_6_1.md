---
title: "Manage Schedule Frequency"
description: "The schedule frequency determines when and how often automated discovery operations run."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Manage Schedule Frequency"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Manage Schedule Frequency"
  - "Manage Schedule Frequency"
---

# Manage Schedule Frequency

The schedule frequency determines when and how often automated discovery operations run.

## Frequency Options:
- **Every Day**: Runs once daily at specified time
- **Every 2 Days**: Runs every other day
- **Every 3 Days**: Runs every third day
- **Every Week**: Runs weekly on specified day
- **Every 2 Weeks**: Runs bi-weekly
- **Every Month**: Runs monthly on specified date
- **Custom**: Define precise schedule using parameters

## Schedule Parameters:

### Seconds (0-59)
- Specify exact second(s) for execution
- Use for very precise timing

### Minutes (0-59)
- Specify exact minute(s) for execution
- Can select multiple minutes

### Hours (0-23)
- Specify hour(s) in 24-hour format
- Can select multiple hours for multiple daily executions

### Day (1-31)
- Specify day(s) of the month
- Not all months have 31 days

### Month (1-12)
- Specify month(s) of the year
- Can select multiple months

### Weekday (0-6, where 0=Sunday)
- Specify day(s) of the week
- Can select multiple weekdays

## Example Configurations:

### Every Weekday at 2 AM:
- Frequency: Custom
- Hours: 2
- Weekday: 1,2,3,4,5 (Monday-Friday)

### First Day of Every Month at Midnight:
- Frequency: Every Month
- Hours: 0
- Minutes: 0
- Day: 1

### Every 6 Hours:
- Frequency: Every Day
- Hours: 0,6,12,18

### Every Sunday at 3 AM:
- Frequency: Custom
- Hours: 3
- Weekday: 0 (Sunday)

## Timezone Considerations:
- Always select the appropriate timezone for your schedule
- Schedules execute based on the selected timezone, not the user's local timezone
- Consider daylight saving time changes when scheduling
- For distributed teams, use UTC for consistency

## Best Practices:
- **Avoid peak hours**: Schedule intensive scans during off-hours
- **Stagger schedules**: Don't schedule multiple large scans at the same time
- **Consider network impact**: Deep scans consume more network bandwidth
- **Balance frequency vs. load**: More frequent = more current data, but higher resource usage
- **Test schedules**: Create a test schedule with near-term timing to verify configuration before setting long-term schedules
