---
title: "Best Practices for Scheduled Operations"
description: "Follow these best practices to optimize automated discovery operations."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "Best Practices for Scheduled Operations"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Best Practices Scheduled Operations"
  - "Best Practices for Scheduled Operations"
---

# Best Practices for Scheduled Operations

Follow these best practices to optimize automated discovery operations.

## Scheduling Strategy

### Timing Optimization
- **Schedule during off-hours**: Run intensive scans outside business hours to minimize network impact
- **Avoid peak usage times**: Don't schedule multiple large scans simultaneously
- **Stagger schedules**: Distribute scan execution across time periods
- **Consider time zones**: Account for global operations when scheduling
- **Maintenance windows**: Adjust schedules around planned maintenance

### Frequency Selection
- **Balance currency vs. load**: More frequent = more current data, but higher resource usage
- **Match criticality**: Critical systems may need daily scans, others weekly or monthly
- **Cloud imports**: Daily or bi-daily for cloud resources that change frequently
- **Static infrastructure**: Less frequent scanning for stable on-premises infrastructure
- **Test before production**: Start with longer intervals, then increase frequency as needed

## Configuration Best Practices

### Scan Configuration
- **Appropriate probe selection**: Use Basic Host Scan for quick checks, Deep Host Scan when detailed data needed
- **Targeted IP ranges**: Scan only necessary network segments
- **Use exclusions**: Exclude sensitive or problematic systems
- **Client distribution**: Distribute scans across multiple clients for load balancing
- **Credential management**: Ensure credentials have minimum necessary permissions

### Import Configuration
- **Service selection**: Import only needed cloud services to reduce execution time
- **Credential security**: Rotate credentials regularly
- **Multi-account strategy**: Create separate schedules for different cloud accounts
- **Error handling**: Review failed imports promptly and adjust configuration

## Monitoring and Maintenance

### Regular Reviews
- **Weekly**: Review failed executions and address issues
- **Monthly**: Analyze schedule effectiveness and execution trends
- **Quarterly**: Evaluate overall discovery strategy and adjust schedules
- **Annually**: Comprehensive review of all automated operations

### Performance Monitoring
- **Track execution duration**: Identify schedules taking longer over time
- **Discovery counts**: Monitor for unexpected changes in discovered asset counts
- **Resource utilization**: Ensure discovery clients have adequate resources
- **Network impact**: Monitor bandwidth usage during scans

### Documentation
- **Purpose documentation**: Document why each schedule exists and its coverage
- **Change tracking**: Document schedule modifications and reasons
- **Runbook maintenance**: Keep troubleshooting procedures current
- **Stakeholder communication**: Inform teams of schedule changes

## Security Considerations

### Credential Management
- **Least privilege**: Use credentials with minimum necessary permissions
- **Regular rotation**: Rotate credentials on defined schedule
- **Secure storage**: Ensure Virima credential vault is properly secured
- **Access control**: Limit who can create/modify schedules
- **Audit trail**: Regularly review schedule creation and modification logs

### Data Protection
- **Sensitive systems**: Handle scans of sensitive systems with care
- **Compliance**: Ensure discovery operations meet regulatory requirements
- **Data retention**: Follow organizational policies for scan data retention
- **Encryption**: Verify all discovery communications are encrypted

## Optimization

### Resource Optimization
- **Right-size scans**: Don't over-scan with unnecessary detail
- **Client optimization**: Ensure discovery clients are properly configured
- **Network optimization**: Use local clients when possible to reduce WAN traffic
- **Database maintenance**: Keep Virima database optimized for performance

### Coverage Optimization
- **Gap analysis**: Regularly identify unscanned infrastructure
- **Overlap elimination**: Remove duplicate coverage from multiple schedules
- **Dynamic adjustment**: Update schedules as infrastructure changes
- **Cloud automation**: Leverage cloud-native discovery features where possible

## Disaster Recovery

### Backup Strategy
- **Export configurations**: Regularly export all schedule configurations
- **Document dependencies**: Record client, credential, and network dependencies
- **Test recovery**: Periodically test schedule restoration procedures
- **Version control**: Maintain history of schedule configurations

### Redundancy
- **Multiple clients**: Configure backup clients for critical scans
- **Failover procedures**: Document steps if primary client fails
- **Alert configuration**: Set up notifications for schedule failures
- **Escalation procedures**: Define who to contact for persistent failures

## Team Collaboration

### Roles and Responsibilities
- **Schedule ownership**: Assign owners for each schedule
- **Change management**: Require approval for schedule modifications
- **Communication**: Notify teams of significant schedule changes
- **Training**: Ensure team members understand schedule management

### Knowledge Sharing
- **Documentation**: Maintain comprehensive schedule documentation
- **Best practices**: Share successful approaches across team
- **Lessons learned**: Document troubleshooting experiences
- **Regular reviews**: Conduct team reviews of discovery operations

Following these best practices ensures reliable, efficient, and effective automated discovery operations that maintain accurate CMDB data while minimizing resource consumption and operational overhead.
