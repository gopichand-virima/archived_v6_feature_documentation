---
title: "Troubleshoot Failed Schedules"
description: "When schedules fail to execute or produce errors, systematic troubleshooting can identify and resolve issues."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Troubleshoot Failed Schedules"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Troubleshoot Failed Schedules"
  - "Troubleshoot Failed Schedules"
---

# Troubleshoot Failed Schedules

When schedules fail to execute or produce errors, systematic troubleshooting can identify and resolve issues.

## Common Issues and Solutions:

### Schedule Not Executing

**Check 1: Is Active Status**
- Verify the **Is Active** checkbox is enabled
- Disabled schedules will not execute

**Check 2: Next Run Time**
- Verify Next Run shows a future date/time
- If blank, schedule may be inactive or misconfigured

**Check 3: Schedule Parameters**
- Review frequency and timing configuration
- Ensure parameters are valid (e.g., Day 31 may not exist in all months)

**Check 4: System Issues**
- Verify Virima application is running
- Check if scheduler service is active
- Review system logs for errors

### Failed Scan Executions

**Check 1: Client Status**
- Verify discovery client is online and reachable
- Test client connectivity from Virima server
- Restart client if necessary

**Check 2: Credentials**
- Verify scan credentials are valid and current
- Check credential permissions on target systems
- Test credentials manually if possible

**Check 3: Network Connectivity**
- Verify network access to target IP ranges
- Check firewall rules and security policies
- Verify VPN connections if needed

**Check 4: Target Availability**
- Confirm target systems are online
- Check if services are running on target systems
- Verify no maintenance windows conflict

### Failed Import Executions

**Check 1: Cloud Credentials**
- Verify API credentials are valid and not expired
- Check credential permissions in cloud console
- Regenerate credentials if necessary
- Test credentials with cloud provider tools

**Check 2: API Access**
- Verify Virima server can reach cloud API endpoints
- Check proxy and firewall settings
- Verify no rate limiting from cloud provider

**Check 3: Service Availability**
- Confirm cloud services are accessible
- Check for cloud provider service outages
- Review cloud provider status pages

**Check 4: Permission Issues**
- Verify credential has permissions for selected services
- Check for organizational policies blocking access
- Review audit logs in cloud console

### Performance Issues

**Check 1: Schedule Conflicts**
- Review if multiple large scans run simultaneously
- Stagger schedule timing to distribute load
- Consider system resource availability

**Check 2: Scope Too Large**
- Break large IP ranges into smaller scheduled scans
- Reduce number of services in cloud imports
- Optimize probe selection for required data only

**Check 3: System Resources**
- Monitor CPU, memory, and network utilization
- Consider upgrading discovery client hardware
- Optimize client configuration

## Review Execution Logs:

1. Open the failed schedule
2. Navigate to **Related Scans** tab
3. Click the failed execution
4. Review **Log** tab for detailed error messages
5. Look for specific error codes or messages

## Common Error Messages:

- **"Authentication failed"**: Credential issue
- **"Connection timeout"**: Network connectivity issue
- **"Permission denied"**: Authorization issue
- **"Service unavailable"**: Target or cloud service unavailable
- **"Rate limit exceeded"**: Too many API calls (for imports)
- **"Invalid parameter"**: Configuration error in schedule

## Preventive Measures:

- **Regular testing**: Periodically verify schedules execute successfully
- **Credential rotation**: Update credentials before expiration
- **Monitoring**: Set up alerts for failed executions
- **Documentation**: Maintain runbooks for common issues
- **Maintenance windows**: Adjust schedules during planned outages
- **Health checks**: Regularly verify client and credential status

## Getting Help:

If troubleshooting doesn't resolve the issue:
1. Document all troubleshooting steps taken
2. Gather execution logs and error messages
3. Export schedule configuration
4. Contact Virima support with collected information

Systematic troubleshooting combined with proactive monitoring helps maintain reliable automated discovery operations.
