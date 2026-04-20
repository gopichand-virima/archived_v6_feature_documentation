---
title: "About Configuration Management"
description: ""
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "About Configuration Management"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "About Conf Mngt"
  - "About Configuration Management"
---

# About Configuration Management

The purpose of **Service Asset and Configuration Management** (SACM) is to ensure that the assets required to deliver services are properly controlled, and that accurate and reliable information about those assets is available when and where it is needed. This information includes details of how the assets have been configured and the relationships between assets.

SACM supports the business by providing the information needed to manage all CIs across the whole of the service lifecycle. This contributes to the success of all service management processes, as well as providing IT management and the business with the information needed to get maximum value from service assets.

The scope of SACM may extend to non-IT assets and to internal and external service providers, where shared assets need to be controlled. To manage large and complex IT services and infrastructures, SACM requires the use of a supporting system known as the Configuration Management System (CMS).

## Overview

The **Configuration Management Database (CMDB)** is a series of tables containing all the assets and business services controlled by a company and their configurations. This includes, for example, computers and devices on the network, software contracts and licenses, business services. The IT desk can use the CDMB to understand better their network users' equipment, and the relationships between them. The CMDB can also be referenced by other processes within the system.

The CMDB can be populated by using the Discovery agent. Discovery searches the network for all attached computers and devices, then populates the CMDB with information on each computer/device configuration, provisioning, and current status. Discovery also reports on any software which is running, and the IP connections between the systems, thereby establishing their relationships.

## Definition of a CI

Any component or other service asset that needs to be managed in order to deliver an IT service.

In Virima, every CI is derived from a Blueprint.

Every CI has components, these components can be Network Adapters, Storage Disks or Software Instance, etc.

Each CI component is associated to the parent CI using Relationships--for example, Installed On, Component Of, Hosted On, Virtualized On etc.

Each CI/CI Component in the application has a unique Asset ID.

In Virima, CI's are added in three ways:

- CI's are added into CMDB manually.
- CI's discovered by the Discovery application are moved into CMDB.
- CI's details can be imported from a file (xls,xlsx.csv).

## Definition of a Blueprint

Blueprint defines the skeletal structure of a CI which includes properties and relations of a CI.

## Functions

This module contains the following functions:

- [Dashboard](/msp/dashboard_6_1.md)
- [CMDB](/itsm/config_mngmt/config_items/config_item_details/config_items_6_1.md)
- [Sync Logs](/itsm/config_mngmt/sync_logs_6_1.md)
- [Tags](/itsm/config_mngmt/tags_6_1.md)
- [Audits](/itsm/config_mngmt/audits/audits_6_1.md)
