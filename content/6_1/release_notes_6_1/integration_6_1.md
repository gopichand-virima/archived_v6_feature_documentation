# Integration

## New Features

### REST API Expansion

Extended the Virima REST API with new endpoints for CMDB operations, discovery scan management, and reporting data export, enabling deeper third-party system integration.

### Webhook Support

Added outbound webhook support for key platform events including ticket status changes, CI updates, scan completions, and threshold alerts.

## Enhancements

### SSO Configuration

Enhanced Single Sign-On configuration to support additional identity providers and improved SAML attribute mapping for automated user provisioning.

### Data Import/Export

Improved the data import framework with support for additional file formats (JSON, XML), field-level mapping templates, and dry-run validation before committing changes.

## Bug Fixes

### API Rate Limiting

Fixed an issue where API rate limit counters were not properly resetting at the configured interval boundaries for certain endpoint groups.

### Integration Logging

Resolved a logging gap where failed outbound integration calls were not consistently recorded in the integration activity log.
