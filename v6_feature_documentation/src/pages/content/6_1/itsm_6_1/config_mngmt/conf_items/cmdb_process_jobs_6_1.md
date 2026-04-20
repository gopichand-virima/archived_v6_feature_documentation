---
title: "CMDB Process Jobs"
description: "&#160;"
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "CMDB Process Jobs"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Cmdb Process Jobs"
  - "CMDB Process Jobs"
---

# CMDB Process Jobs

When any of the these actions are chosen in the Configuration Items *Select Actions* drop-down list, the following occurs:

- A confirmation message displays.

Click **Yes** (to start processing). If **Yes** is selected, a Success Message displays, indicating the process has started and will work in the background. Click **OK**.

or **No** (to cancel the action).

- As the processing takes place, a message scrolls across the menu.
- When processing is complete, an email notification is sent to the user who initiated the process, confirming the process is complete.

Process Cloud Hierarchy

**Purpose**: Creates relationship between the cloud imported CIs: -

**Limitation/Usage**: This cannot be processed for single/multiple selected CIs. This process will run for the entire CMDB when triggered.

### Azure Instances

#### Azure SQL Server Contains Database

- Relationship Type: Contains
- Source: Azure SQL Server
- Target: Database

### AWS Instances

#### AWS Load Balancer Contains Target Group

- Relationship Type: Contains
- Source: AWS Load Balancer
- Target: Target Group

#### AWS Load Balancer Secured By AWS Security Group

- Relationship Type: Secured By
- Source: AWS Load Balancer
- Target: AWS Security Group

#### AWS VPC Contains AWS Load Balancer

- Relationship Type: Contains
- Source: AWS VPC
- Target: AWS Load Balancer

#### AWS EC2 Instance Secured By AWS Security Group

- Relationship Type: Secured By
- Source: AWS EC2 Instance
- Target: AWS Security Group

#### AWS EC2 Instance Instantiates "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"

- Relationship Type: Instantiates
- Source: AWS EC2 Instance
- Target: "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"

#### AWS EC2 Instance Attached To AWS EBS

- Relationship Type: Attached To
- Source: AWS EC2 Instance
- Target: AWS EBS

#### AWS EC2 Instance Belongs To AWS VPC

- Relationship Type: Belongs To
- Source: AWS EC2 Instance
- Target: AWS VPC

#### AWS EC2 Instance Contains Target Group

- Relationship Type: Contains
- Source: AWS EC2 Instance
- Target: Target Group

#### AWS NAT Gateways Contains AWS Subnet

- Relationship Type: Contains
- Source: AWS NAT Gateways
- Target: AWS Subnet

#### AWS Subnet Contains AWS Route Table

- Relationship Type: Contains
- Source: AWS Subnet
- Target: AWS Route Table

#### AWS EC2 Instance Parts Of AWS Subnet

- Relationship Type: Parts Of
- Source: AWS EC2 Instance
- Target: AWS Subnet

#### AWS Network ACL Contains AWS Subnet

- Relationship Type: Contains
- Source: AWS Network ACL
- Target: AWS Subnet

#### AWS Internet Gateway Used By Route

- Relationship Type: Used By
- Source: AWS Internet Gateway
- Target: Route

#### AWS Database Cluster Secured By AWS Security Group

- Relationship Type: Secured By
- Source: AWS Database Cluster
- Target: AWS Security Group

#### AWS DocumentDB Used By Route

- Relationship Type: Used By
- Source: AWS DocumentDB
- Target: Route

#### AWS Neptune Used By Route

- Relationship Type: Used By
- Source: AWS Neptune
- Target: Route

#### AWS RDS Used By Route

- Relationship Type: Used By
- Source: AWS RDS
- Target: Route

#### AWS Internet Gateway Used By Route

- Relationship Type: Used By
- Source: AWS Internet Gateway
- Target: Route

Process Software Installation

**Purpose**: Creates relationship for Software

**Limitation/Usage**: This cannot be processed for single/multiple selected CIs. This process will run for the entire CMDB when triggered.

#### Software License Key Component Of Software

- Relationship Type: Component Of
- Source: Software License Key
- Target: Software

#### Software Installed On "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"

- Relationship Type: Installed On
- Source: Software
- Target: "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"

Process ADM

**Purpose**: Creates relationship between various Software and CI's.

**Limitation/Usage**: This can be processed for single/multiple selected CIs. If no CI is selected then this process will run for the entire CMDB when triggered.

- *Source Blueprints*: "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"/ "Software Instance"
- *Target Blueprints*: "Software Instance"

####  Communicates With

- Relationship Type: Communicates With
- Source: 
- Target: 

Process VCenter Hierarchy

**Purpose**: Creates relationship for VCenter

**Limitation/Usage**: This cannot be processed for single/multiple selected CIs. This process will run for the entire CMDB when triggered.

#### Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server" Esxi virtualises host ESXi Host

- Relationship Type: Esxi virtualises host
- Source: "Windows Server"/ "Windows Host"/ "Unix Server"/ "Linux Server"
- Target: ESXi Host

Process Network Connections

**Purpose**: Creates relationship for Switch, Routers and Vlans

**Limitation/Usage**: This cannot be processed for single/multiple selected CIs. This process will run for the entire CMDB when triggered.

### VLAN Connected To VLAN

- Relationship Type: Connected To
- Source: VLAN
- Target: VLAN

### VLAN Connected To

- Relationship Type: Connected To
- Source: VLAN
- Target: Any Blueprint

### VLAN Connected To "Switch"/ "Router"

- Relationship Type: Connected To
- Source: VLAN
- Target: "Switch"/ "Router"

###  Connected To "Switch"/ "Router"

- Relationship Type: Connected To
- Source: Any Blueprint
- Target: "Switch"/ "Router"

Process Dev Ops

**Purpose**: Creates relationship between the cloud imported CIs: -

**Limitation/Usage**: This cannot be processed for single/multiple selected CIs. This process will run for the entire CMDB when triggered.

#### Website Hosted On

- Relationship Type: Hosted On
- Source: Website
- Target: 

#### Application Hosts Software Instance

- Relationship Type: Hosts
- Source: Application
- Target: Software Instance

#### Software Instance Load Balancer For Software Instance

- Relationship Type: Load Balancer For
- Source: Software Instance
- Target: Software Instance

#### Database Load Balancer For Application

- Relationship Type: Load Balancer For
- Source: Database
- Target: Application

#### Database Hosts Application

- Relationship Type: Hosts
- Source: Database
- Target: Application

#### Database Hosted On Software Instance

- Relationship Type: Hosted On
- Source: Database
- Target: Software Instance

### IIS Websites

#### IIS Website HOSTED ON Application

- Relationship Type: Hosts
- Source: IIS Website
- Target: Application

#### Windows Server / Windows Host Runs IIS Website

- Relationship Type: Runs
- Source: Windows Server / Windows Host
- Target : IIS Website

#### Windows Server / Windows Host \[Relationship mentioned in port configuration\]

- Relationship Type: Relationship mentioned in port configuration
- Source: Windows Server / Windows Host
- Target: Any Main Blueprint

#### Windows Server / Windows Host Load Balances Windows Server / windows Host with Microsoft NLB's Dedicated IP

- Relationship Type: Load Balances
- Source: Windows Server/ windows Host
- Target: Windows Server / Windows Host with Microsoft NLB's Dedicated IP

### MSSQL Instance

#### Windows Server RUNS MSSQL Instance

- Relationship Type: Runs
- Source: Windows Server
- Target: MSSQL Instance

#### Software Instance Instantiates MSSQL Instance

- Relationship Type: Instantiates
- Source: Software Instance
- Target: MSSQL Instance

### Windows Cluster

#### Windows Cluster Cluster Of Windows Cluster Node

- Relationship Type: Cluster Of
- Source: Windows Cluster
- Target: Windows Cluster Node

#### Windows Cluster Node Hosted On Windows Server/Windows Host

- Relationship Type: Windows Cluster
- Source: Windows Cluster Node
- Target: Windows Server/Windows Host

### Oracle Cluster

#### Linux Server Hosts Oracle Cluster

- Relationship Type: Hosts
- Source: Linux Server
- Target: Oracle Cluster

#### Oracle Cluster Cluster Of Software Instance

- Relationship Type: Cluster Of
- Source: Oracle Cluster
- Target: Software Instance

### Cisco

#### Cisco UCS Contains Cisco UCS Chassis

- Relationship Type: Contains
- Source: Cisco UCS
- Target: Cisco UCS Chassis

#### Cisco UCS Chassis Contains Cisco Blade Server

- Relationship Type: Contains
- Source: Cisco UCS
- Target: Cisco UCS Chassis

### HyperV

#### HyperV Virtualizes Windows Server/Windows Host

- Relationship Type: Virtualizes
- Source: HyperV
- Target: Windows Server/Windows Host

 
