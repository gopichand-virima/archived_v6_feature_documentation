---
title: "CI: Versioning"
description: "The versioning of a configuration item starts from Production status and from there on changes made in the CI increments the version by 0.1."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "CI: Versioning"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Config Items Versioning"
  - "CI: Versioning"
---

# CI: Versioning

The versioning of a configuration item starts from Production status and from there on changes made in the CI increments the version by 0.1.


You cannot set a version as a baseline which was versioned due to one of its components.


Below are the conditions that versions a configuration item:

- Changing one or more property values of a CI
- [Adding a New Property](/admin_sacm/add_new_property_6_1.md)
- Adding a [new CI component](/itsm/config_mngmt/conf_items/config_items_new_6_1.md), for example, a Software Instance, Network Adapter, etc.
- Removing a component from a CI

If the first two conditions (mentioned above) happen in any of the CI components, both the CI Component and the CI are versioned.
