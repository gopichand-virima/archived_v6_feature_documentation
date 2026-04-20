---
title: "Core Functionality"
description: ""
version: ""
module: "Vulnerability Managment"
section: "Core Functionality"
page: "Core Functionality"
breadcrumbs:
  - "Home"
  - ""
  - "Vulnerability Managment"
  - "Core Functionality"
  - "Core Functionality"
---

# Core Functionality

## Automated Vulnerability Detection

### NVD Integration

- **Data Source**:  
  The system is directly integrated with the National Vulnerability Database (NVD), a comprehensive government-maintained repository of known software vulnerabilities. This ensures that the vulnerability data is authoritative, up-to-date, and standardized.

- **Scheduling**:  
  Vulnerability scans are automated and run on a configurable schedule (e.g., every Saturday). This scheduling is managed by the backend management server, allowing organizations to set scan frequencies that align with their security policies (weekly, bi-weekly, etc.).

- **Configuration**:  
  The timing and frequency of these scans are set within the management server's configuration. Administrators can adjust scan intervals as needed to balance performance and security needs.

- **Vulnerability Filtering and Identification**:  
  Based on the configured vulnerability filters—such as software name, version, or other identifying attributes—the system analyzes the available software inventory to identify those that match known vulnerabilities. If a specific software instance (for example, a certain version of Apache, OpenSSL, or Java) is found to have an associated vulnerability, the system will retrieve and display only that particular software entry.

Each asset type uses specific identifying attributes (filters) to detect and retrieve items associated with known vulnerabilities.

- **Windows Host** → filtered using Operating System, Display Version, and OS Architecture
- **Windows Server** → filtered using Operating System and OS Architecture
- **Software** → filtered using Software Name and Software Version
- **Installed Software** → filtered using Software Name, Software Version, and Manufacturer

Based on these filters, the system matches the asset data against known vulnerabilities. If a match is found (e.g., a specific OS version or software version is vulnerable), only those affected assets are fetched and displayed for analysis or remediation.

- **Updates**:  
  Each scheduled scan fetches the latest vulnerability data from the NVD. The system automatically identifies and flags new vulnerabilities that affect both existing Configuration Items (CIs) and any newly added assets in the CMDB. This ensures continuous protection and up-to-date risk awareness.

## Vulnerability Data Structure

The system organizes vulnerability information in a clear, hierarchical manner for intuitive navigation and analysis:

1. **Products Level**:  
  At the top level, the system lists all products for which vulnerabilities are known. This provides a broad overview of the threat landscape across the organization's software inventory.

2. **Version Level**:  
  For each software product, the system displays all discovered versions. This granularity allows users to pinpoint which specific versions are affected, supporting targeted remediation.

3. **Vulnerability Level**:  
  Drilling down further, users can view individual vulnerabilities (CVE entries) associated with each software version. Each CVE entry includes detailed information such as severity, description, affected configurations, and remediation references.

This multi-level structure enables users to quickly move from a high-level overview to specific, actionable vulnerability details.

## CMDB Integration

- **Asset Correlation**:  
  The system automatically links vulnerabilities to the relevant assets (CIs) in the Configuration Management Database (CMDB). This correlation is based on software inventory and version data, ensuring that each asset's risk profile is accurate and current.

- **Bidirectional Navigation**:
  - From the Vulnerability Management module, users can navigate directly to the details of affected CMDB assets.
  - Conversely, from any asset's detail page in the CMDB, users can view all associated vulnerabilities. This seamless navigation supports both vulnerability-centric and asset-centric workflows.
- **Real-time Validation**:  
  When a new CI is created in the CMDB, the system immediately checks the NVD for any known vulnerabilities affecting the asset's software and versions. If vulnerabilities are found, they are instantly linked to the asset, and the information is made available in the asset's vulnerability tab. This ensures that new assets are not introduced into the environment with unrecognized risks.
