# Actions Required

Review the following sections carefully before and after upgrading to Virima 6.1. These actions ensure a smooth transition and full access to new capabilities.

---

## Application Upgrade

### Pre-Upgrade Checklist

1. Back up your current Virima database and application configuration
2. Verify that your environment meets the updated system requirements
3. Review the Compatibility Matrix for supported browser and database versions
4. Notify all users of the planned maintenance window
5. Document any custom configurations or integrations that may require post-upgrade validation

### Upgrade Process

1. Download the Virima 6.1 installation package from the support portal
2. Stop all Virima application services
3. Run the database migration scripts included in the upgrade package
4. Deploy the updated application binaries
5. Start the application services and verify the startup logs for errors
6. Run the post-upgrade validation checks

---

## Database Changes

### Schema Updates

The Virima 6.1 upgrade includes database schema changes that are applied automatically during the migration step. Key changes include:

- New tables for CI lifecycle tracking and audit logging
- Updated indexes for improved query performance on CMDB relationship lookups
- Additional columns for enhanced asset cost tracking fields

### Data Migration Notes

- Existing CI records are automatically assigned the "Active" lifecycle state
- Historical audit data is preserved; new audit entries use the expanded format
- No manual data migration steps are required

---

## Configuration Changes

### Security Settings

- Review and update role permissions to take advantage of the new role-based dashboard access controls
- SSO configurations should be validated after upgrade if using SAML-based identity providers
- API keys issued prior to this version remain valid; new rate limiting policies apply

### System Settings

- Review email notification templates for compatibility with the updated template engine
- Validate scan schedules if you have configured maintenance window blackout periods
- Check integration webhook configurations for the new event types

---

## Notes

- Users may need to clear their browser cache after the upgrade to ensure all UI changes are loaded correctly
- Custom reports created in the previous version will continue to work; review them for new field and filter options
- Contact Virima Support if you encounter any issues during the upgrade process
