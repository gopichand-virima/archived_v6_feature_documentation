# Discovery Application

## New Features

### Application Dependency Mapping

Added automated application dependency mapping that discovers runtime connections between application components, services, and infrastructure elements to build a comprehensive application topology view.

### Application Group Management

Introduced application group management for organizing discovered applications into logical business service groups with configurable membership rules and health aggregation.

## Enhancements

### Application Discovery Accuracy

Improved application identification algorithms to reduce false positives and enhance detection of containerized and cloud-native application components.

### Application Relationship Visualization

Enhanced the application relationship graph view with interactive filtering, zoom controls, and the ability to highlight specific dependency chains for impact analysis.

## Bug Fixes

### Application Component Deduplication

Fixed an issue where application components discovered through multiple scan methods could appear as duplicate entries in the application inventory.

### Topology Refresh

Resolved a caching issue that could cause the application topology view to display stale relationship data after a new discovery scan completed.
