---
title: "Discovered item view overview"
description: "Primary Details (left panel) Quick facts about the CI:"
version: ""
module: "Discovery"
section: "Import From Azure"
page: "Discovered item view overview"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Azure"
  - "Discovered Item View Overview"
  - "Discovered item view overview"
---

# Discovered item view overview

**Primary Details (left panel)**  
Quick facts about the CI:

- **Asset ID** – Virima's unique identifier for the discovered CI (e.g., DSC69303). Use this to search or reference the record.
- **Blueprint** – The discovery blueprint that matched the resource (e.g., Azure Virtual Network, Azure Neo4j). It indicates the CI's class/type.
- **Created On** – Timestamp when the CI was first created in the CMDB from discovery.
- **Last Modified On** – The most recent time the CI's data was updated (any field change or enrichment).
- **Last Seen On** – The last successful discovery of assets. If this gets old, the asset may be offline or unreachable.
  - The "Last Seen On" field is not available for assets imported from Cloud sources.
- **IP Address** – Last known IP detected for the CI (blank for types that don't expose an IP).
- **Host Name** – Host/endpoint name captured by discovery (for cloud services, often the workload/task name).
- **Authorization status** – A badge indicating **Authorized** or **This CI is unauthorized**:
  - Authorized = the CI is recognized/approved to exist in the CMDB; surfaced from Authorize tab of Import from AZURE import records view.
  - An authorized asset always has an associated CMDB ID, such as "**Update to **".
  - Unauthorized = the CI is new or not yet approved; typically surfaced from the Unauthorized tab in import views.
- **Tags** – If any  
  Tags are AZURE metadata key-value pairs attached to resources (like EC2 instances, S3 buckets, etc.).
