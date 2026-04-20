---
title: "Source and Target Blueprint Relationship Types"
description: "Refer to CI - Relationships and Blueprints for details on using this information."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "Source and Target Blueprint Relationship Types"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Source Target Blueprint Do Not Use"
  - "Source and Target Blueprint Relationship Types"
---

# Source and Target Blueprint Relationship Types

Refer to [CI - Relationships](/itsm/config_mngmt/config_items/config_item_details/config_items_relationships_6_1.md) and [Blueprints](/admin_sacm/blueprints_6_1.md) for details on using this information.


| Source Blueprint | Relationship Type | Target Blueprint |

| Software Instance | Runs On | Windows Server/Windows Host/Unix Server/Linux Server |

| Installed Software | Installed On | Windows Server/Windows Host |

| VLAN | Configured On | Router/Switch |

| NetScaler | Runs | Load Balancer |

| NetScaler | Load Balances | NetScaler Service Group |

| NetScaler | Load Balances | NetScaler Service |

| NetScaler | Contains | NetScaler Node |

| F5/NetScaler | Runs | Virtual Server |

| F5/NetScaler | Load Balances | Pool |

| F5/NetScaler | Contains | F5 Node |

| AWS EC2 Instance | Created By | AWS AMI |

| AWS EC2 Instance | Secured By | AWS Security Group |

| AWS EC2 Instance | Storage Provided By | AWS EBS |

| AWS EC2 Instance | Belongs To | AWS VPC |

| AWS EBS | Created By | AWS Snapshot |

| AWS Snapshot | Created Using | AWS EBS |

| AWS Security Group | Secured By | AWS VPC |

| AWS Load Balancer | Secured By | AWS VPC |

| **Docker** | Installed On | Windows Server/Windows Host/Unix Server/Linux Server |


## Process ADM Relationship Type

| Source Blueprint | Relationship Type | Target Blueprint |

| Software Instance | Communicates with | Software Instance |

| Software Instance | Communicates with | CI |

| CI | Communicates with | Software Instance |


## Process Vcenter Hierarchy Relationship Type

| Source Blueprint | Relationship Type | Target Blueprint |

| VMWare Vcenter | Contains | Vcenter Folder |

| Vcenter Folder | Contains | Vcenter Datacentre |

| Vcenter Datacentre | Contains | Esxi Host |


## Process License Keys Relationship Type

| Source Blueprint | Relationship Type | Target Blueprint |

| **Software** | Component Of | Software License Key |


## Process DevOps Relationship Type

The types of Process Devops Source Blueprint are:

- Software Installed On
- IIS Website
- Website
- Apache web server, Tomcat Server, application CI and MySQL server
- MSSQL Cluster
- Oracle SQL Cluster

### Software **Installed On**

| Relationship Type | Target Blueprint |

| **Software** | Installed On Windows Server/Windows Host |


### IIS Website

| Relationship Type | Target Blueprint |

| IIS Website | Hosts-Application |

| IIS Website | Load Balances- Windows Server/Windows Host |

| Windows Server/Windows Host | Runs On-IIS Website |


### Website

| Relationship Type | Target Blueprint |

| **Website** | Hosted On-Any CI having Website IP |


### **Apache web-server**, **Tomcat Server**, **application CI** and **MySQL server**

| Relationship Type | Target Blueprint |

| Apache Webserver (Software Instance) | Load Balances - Apache Tomcat Application server (Software Instance) |

| Apache Tomcat Application server (Software Instance) | Hosts-Application |

| Database | Hosted On -MYSQL Database Server (Software Instance |

| Application | Reads Data From, Writes/Reads Data From-Database |


### MSSQL Cluster

| Relationship Type | Target Blueprint |

| Windows Cluster | Cluster- Windows Cluster Node |

| Windows Cluster Node | Hosted On-Windows Server/Windows Host |


### Oracle SQL Cluster

| Relationship Type | Target Blueprint |

| Windows Server/Windows Host/Unix Server/Linux Server | Hosts - Oracle Cluster |

| Oracle Cluster | Cluster Of- Oracle Database Server (Software Instance) |


## Process Network Connections Relationship Type

| Source Blueprint | Relationship Type | Target Blueprint |

| L2 Device | End Machine (Any Machine which has IP address and MAC address) | Connected to - VLAN |

| L3 Device | VLAN | Connected to - VLAN |
