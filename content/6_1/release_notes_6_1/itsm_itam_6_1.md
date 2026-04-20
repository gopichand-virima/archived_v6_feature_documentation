# ITSM and ITAM

## New Features

### Automated Ticket Routing

Introduced intelligent ticket routing that automatically assigns incoming incidents and service requests to the appropriate team based on configurable rules, CI associations, and historical patterns.

### Asset Lifecycle Workflows

Added configurable workflow automation for asset lifecycle events including procurement, deployment, maintenance, and retirement with approval chains and notification triggers.

## Enhancements

### SLA Management

Enhanced SLA tracking with support for multiple SLA policies per ticket type, business hours calculations, and escalation path customization.

### Change Management

Improved the change management module with enhanced risk assessment scoring, impact analysis integration with the CMDB relationship map, and streamlined approval workflows.

### Asset Cost Tracking

Enhanced cost tracking capabilities to support multiple cost categories per asset, including licensing, maintenance, support, and depreciation calculations.

## Bug Fixes

### Ticket Priority Calculation

Fixed an issue where ticket priority was not recalculated when the associated CI's criticality level changed after ticket creation.

### Asset Import

Resolved a data mapping issue during bulk asset import that could incorrectly assign assets to the wrong organizational unit when department names contained accented characters.
