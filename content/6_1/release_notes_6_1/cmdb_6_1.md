# CMDB

## New Features

### CI Lifecycle Management

Introduced a comprehensive CI lifecycle tracking system that automatically records state transitions (Planned, Active, Retired, Decommissioned) with full audit trail support.

### Relationship Visualization

Added an interactive relationship map view that displays CI dependencies as a navigable graph, making it easier to understand impact chains before making changes.

## Enhancements

### Bulk CI Operations

Enhanced the bulk operations interface to support mass updates to CI attributes, relationships, and classification fields with preview and rollback capabilities.

### Search and Filtering

Improved the CMDB search engine with support for complex attribute-based queries, saved filters, and configurable result column layouts.

## Bug Fixes

### Relationship Import

Fixed an issue where importing CI relationships from CSV could create duplicate entries when the source and target CIs had similar naming patterns.

### Attribute Validation

Resolved a validation error that prevented saving CIs with custom attribute types containing special characters in their names.
