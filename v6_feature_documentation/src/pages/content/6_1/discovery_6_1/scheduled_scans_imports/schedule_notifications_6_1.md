---
title: "Schedule Notifications"
description: "Configure and manage notifications for scheduled discovery operations."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Schedule Notifications"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Schedule Notifications"
  - "Schedule Notifications"
---

# Schedule Notifications

Configure and manage notifications for scheduled discovery operations.

## Email Notifications

### Scan Report Recipients
When configuring a scheduled scan:
1. Click the **+ (plus)** icon next to **Send Scan Report To**
2. Select users who should receive scan reports
3. Multiple recipients can be added
4. Recipients receive email when scan completes

### What Recipients Receive:
- **Scan completion notification**: Email when scan finishes
- **Summary information**: Count of discovered items, duration, status
- **Download link**: Link to detailed scan report
- **Direct access**: Link to view scan results in Virima

### Import Completion Notifications:
- Similar to scan reports
- Sent when scheduled imports complete
- Includes count of imported items
- Status of import operation (Completed/Failed)

## Alert Configuration

### Failure Alerts:
Configure alerts for failed scheduled operations:
- Navigate to Admin > Alerts/Notifications
- Create alert rules for schedule failures
- Define recipients for failure notifications
- Set escalation paths for persistent failures

### Success Confirmations:
- Optional success notifications
- Useful for critical schedules
- Confirms expected execution occurred
- Can be configured per schedule or globally

## Notification Best Practices

### Recipient Selection:
- **Discovery administrators**: Always include for all schedules
- **Infrastructure owners**: Include for specific network segments
- **Security team**: Include for security-related discovery
- **Compliance team**: Include for audit-related scans
- **Application owners**: Include for specific application infrastructure

### Avoid Notification Overload:
- Don't send all notifications to everyone
- Use role-based recipient lists
- Consolidate related schedules
- Consider daily/weekly summaries instead of per-execution emails
- Use distribution lists for team notifications

### Critical vs. Routine:
- **Critical schedules**: Real-time notifications
- **Routine schedules**: Summary notifications
- **Failed schedules**: Immediate alerts
- **Successful schedules**: Optional confirmations

## Notification Content

### Typical Scan Report Email Includes:
- **Scan name and identifier**
- **Execution time and duration**
- **Status** (Completed/Failed/Stopped)
- **Discovered items count**
- **New assets detected**
- **Updated assets count**
- **Client used**
- **IP range scanned**
- **Link to detailed results**

### Typical Import Notification Includes:
- **Import name and identifier**
- **Cloud provider**
- **Execution time**
- **Status** (Completed/Failed)
- **Imported items count**
- **New resources**
- **Updated resources**
- **Link to detailed results**

### Failure Alert Includes:
- **Schedule name**
- **Failure time**
- **Error message**
- **Affected systems**
- **Troubleshooting link**
- **Contact information**

## Managing Notifications

### Updating Recipients:
1. Open schedule details
2. Modify **Send Scan Report To** list
3. Add or remove recipients
4. Click **Update** to save

### Disabling Notifications:
- Remove all recipients to disable
- Or configure "quiet hours" in admin settings
- Consider using distribution lists that can be managed separately

### Testing Notifications:
- Create test schedule with near-term timing
- Add yourself as recipient
- Verify email delivery
- Check email formatting and links
- Confirm appropriate information included

## Troubleshooting Notifications

### Emails Not Received:
- **Check spam/junk folders**
- **Verify email address correct** in user profile
- **Confirm SMTP settings** in Virima configuration
- **Check email server logs** for delivery issues
- **Test email connectivity** from Virima server

### Incorrect Recipients:
- **Review recipient list** in schedule configuration
- **Update schedule** to correct recipients
- **Check user profiles** for valid email addresses
- **Verify distribution lists** if used

### Missing Information:
- **Review email templates** in admin settings
- **Check notification configuration** for schedule type
- **Verify all required fields** populated in schedule
- **Contact support** if template issues persist

## Advanced Notification Configuration

### Custom Email Templates:
(If supported)
- Customize notification email format
- Add company branding
- Include additional context
- Tailor information to audience

### Integration with Ticketing:
- Configure automatic ticket creation for failures
- Include schedule details in ticket
- Assign to appropriate team
- Track resolution in ITSM system

### Dashboard Widgets:
- Display schedule status on dashboards
- Show recent execution results
- Highlight failures
- Provide quick access to details

Proper notification configuration ensures the right people are informed about discovery operations, enabling quick response to issues and maintaining stakeholder awareness of automated asset management activities.
