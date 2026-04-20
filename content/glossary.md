# Glossary

A centralized reference of terminology, acronyms, and abbreviations for Virima V6.1, organized by module to mirror the product navigation cards.

**Modules covered:** Platform & General · My Dashboard · CMDB · Discovery Scan · ITSM · ITAM · Vulnerability Management · Program/Project Management · Self-Service · Risk Register · Reports · MSP · Admin

> **Quick tip:** Use your browser's Find (Ctrl+F / Cmd+F) to locate any term instantly across all modules.

---

## Platform & General

Terms that apply across all Virima modules — not specific to a single area.

### Advanced Search

Extended search functionality allowing multiple criteria for finding records or users across any module

### API (Application Programming Interface)

A programmatic interface used by Virima to authenticate against cloud platforms (Meraki, AWS, Azure) and expose REST endpoints for CMDB and discovery operations

### AR Permission (Accountable-Responsible)

Combined Accountable and Responsible permission type in the RACI model for scenarios requiring dual accountability

### Auto Refresh

Feature that automatically updates a list or grid display at specified intervals without a manual page reload

### Background Processing

Asynchronous execution of export or import operations that allows users to continue working while the task completes

### Bulk Operations

Administrative actions performed on multiple records simultaneously — such as importing, editing, or enabling MFA across users

### Bulk Template Operations

Administrative functions that allow multiple templates to be processed simultaneously through checkbox selection

### Column Personalization

The ability for users to customize which data columns appear in list views according to their role and preferences

### Comment System

A collaborative feature that allows users to add text comments and file attachments to any record for documentation and communication

### CRUD (Create, Read, Update, Delete)

The four fundamental database operations; Virima's SQL probe workflows execute CRUD operations against database servers to collect configuration data

### CSV (Comma-Separated Values)

A flat-file format used for bulk importing users, configuration items, and CI relationships into the Virima CMDB

### GUI (Graphical User Interface)

The visual desktop or web interface through which administrators interact with the Discovery Application or the Virima web application

### HTTP (Hypertext Transfer Protocol)

The application protocol for data communication on the web; Virima stores read-only HTTP settings as a component attribute on CI records

### ITIL (Information Technology Infrastructure Library)

The globally recognised framework of IT service management best practices that underpins Virima's change, incident, problem, release, and SACM processes

### JSON Property Mapping (JSON)

Template storage format using oldValue/newValue pairs to define relationships between source file columns and target CMDB fields

### Mandatory Field Validation

System enforcement that certain fields must be completed before a record can be saved

### OS (Operating System)

The base software platform (Windows, Unix/Linux, macOS) of a discovered host, recorded as a CI attribute and used to filter discovery workflows and blueprint assignments

### Reporter

User role responsible for ticket management and survey administration in the service management workflow

### REST (Representational State Transfer)

The architectural style used by Virima's API for CMDB operations, discovery scan management, and webhook integrations with external systems

### Saved Filter

User-defined filter criteria that can be saved, named, and reused to display specific subsets of records in any list view

### SSL (Secure Sockets Layer)

Secure Sockets Layer — an encryption protocol that establishes a secure connection between server and client; legacy predecessor to TLS

### Task Assignment

The process of creating workflow-related tasks and assigning them to users or groups with due dates, status tracking, and progress monitoring

### Template Metadata

Additional information stored with templates including creation date, template name, and ownership details

### TLS (Transport Layer Security)

Transport Layer Security — the cryptographic protocol that secures Virima's communications with SMTP servers, LDAP/AD servers, and client connections

### Used By Tab

Interface section that displays all service management functions where a specific survey is currently configured

### VIP User

Special user designation that causes ITSM tickets submitted by this user to default to Priority 1 (Very High) for expedited support

### Visual Validation

Real-time feedback system using color-coded highlighting (green/red) to indicate mapping status and validation results

---

## My Dashboard

Authentication, SSO configuration, user settings, and organizational setup.

### Access Key

AWS credential identifier (20-character alphanumeric) used with Secret Key for programmatic access to AWS resources

### Access Management

The system module that manages user accounts, permissions, and authentication within Virima

### ACS (Assertion Consumer Service)

The SAML endpoint URL in Virima to which the identity provider posts its signed authentication assertion after a user authenticates; configured under Admin > Users > SAML Configuration

### Activate User Account

Import option that automatically activates imported user accounts upon synchronization

### Active Directory (AD)

Microsoft's directory service that provides authentication and authorization services in Windows domain networks

### AD Authentication (Active Directory Authentication)

Authentication method that integrates with Active Directory for user login credentials

### AD Configuration

A set of connection parameters and settings that define how Virima connects to and synchronizes with an Active Directory server

### AD Host

The Active Directory server or domain that authenticates users when AD Authentication is enabled

### Auth (Authentication)

Authentication mechanism that verifies SMTP server credentials before allowing email transmission

### Authentication Method

The method used to verify user identity; Virima supports LDAP, AD, SAML, OIDC, or Normal (local) authentication

### Azure AD (Azure Active Directory)

Microsoft Azure Active Directory — used by Virima for cloud-based SSO and bulk user import/sync operations

### Azure AD Configuration

Connection settings that enable integration between Azure Active Directory and Virima for identity management and user synchronization

### Base DN (Base Distinguished Name)

The root node in the Active Directory hierarchy where user searches begin, specified in LDAP distinguished name format

### Bind DN (Bind Distinguished Name)

The distinguished name of the account used to authenticate and bind to the Active Directory server

### BYOD (Bring Your Own Device)

A policy allowing employees to use personal devices for work; Virima tracks BYOD-managed devices through Microsoft Intune MDM/MAM integration

### Certificate

An X.509 certificate used as an alternative authentication method for Azure Active Directory connections

### Custom Mode

SMTP configuration using an external email server with full control over connection parameters and security settings

### Default Mode

SMTP configuration using predefined Virima mail services that requires only username and password authentication

### Department

An organizational unit within Virima that represents a business department, containing members, tasks, and documentation

### Department ID

Unique identifier for department records following the pattern UDT000021

### Department Lifecycle (CRUD)

Complete process of creating, reading, updating, and deleting department records

### From Field

The sender's email address that appears as the source of outgoing system-generated emails

### Group Association

The connection between a user role and an organizational group (Internal, Service Operation, or External) that aligns permissions with organizational structure

### Group Email

Email address associated with a user group for communication and notification purposes

### Group Manager

A designated user responsible for overseeing a user group, who must belong to the same department as the group

### Import Logs

Audit records that track user import operations and synchronization activities between AD / Azure AD and the system

### Import Schedule

Automated configuration that defines when and how frequently user data should be synchronized from AD or Azure AD

### Import Type

The scope of a user import: All Users (complete import), New Users (newly created only), or New & Modified Users

### Landing Page

The default page displayed immediately after a user logs in, such as Dashboard, Tickets, or CMDB

### LDAP (Lightweight Directory Access Protocol)

The directory protocol used by Virima to bind to and query Active Directory or other directory servers for user authentication and attribute synchronization

### Login Attribute

The Active Directory attribute mapped to Virima's login field for user authentication (commonly `userPrincipalName`)

### MAM (Mobile Application Management)

Microsoft Intune's capability to manage mobile applications on corporate and BYOD devices; Virima imports MAM-managed app data as CIs

### MDM (Mobile Device Management)

Microsoft Intune's capability to enrol and manage mobile devices; Virima imports MDM device records into the CMDB to maintain mobile fleet visibility

### Member Association

The assignment of users and groups to specific departments for organizational alignment and access control

### Members Tab

Interface section displaying all users assigned to a specific group with options to add or remove members

### MFA (Multi-Factor Authentication)

Multi-Factor Authentication — requires an additional verification factor beyond username and password; Virima supports email codes and TOTP authenticator apps

### Module Assignment

The specification of which Virima system modules or functional areas a user role can access

### Multi-Factor Authentication (MFA)

Enhanced security feature that requires users to authenticate using two methods: email-delivered code or authenticator app

### OIDC (OpenID Connect)

An identity layer built on OAuth 2.0 used by Virima for SSO integration with providers such as Auth0, Okta, and Ping Identity

### Organizational Association

Assignment of users to roles, departments, groups, and reporting structures that define their access and hierarchy

### Permission Grid

The table interface showing role-task mappings where each row is a role and each column is a task with its permission assignment

### Permission Inheritance

The automatic assignment of permissions to users through their role assignments or group membership

### Primary Details

Metadata section showing record creation and modification history including dates and responsible users

### Proxy Server

An intermediary server that routes email requests between the client and SMTP server, used for additional security or network routing

### RACI (Responsible, Accountable, Consulted, Informed)

The responsibility assignment matrix used in Virima's Role Access module to assign each role a permission type (R, A, C, or I) for every task in each module

### RBAC (Role-Based Access Control)

Role-Based Access Control — the security model whereby permissions are assigned to named roles and users inherit access by being assigned to those roles

### Reflect AD Account Status

Import option that synchronizes Azure AD account status (enabled/disabled) to corresponding Virima user accounts

### Reply To Field

The email address where responses to system-generated emails should be directed

### Role Access

The configuration module that manages role-based permissions using RACI methodology across system modules

### Role Access Matrix

A grid-based interface that displays the mapping of roles to tasks with their assigned RACI permissions

### Role Configuration

The complete setup of a user role including its name, description, group association, and module assignments

### Role Export

The process of extracting role data into Excel spreadsheet format for reporting, auditing, or backup purposes

### Role-Based Access Control (RBAC)

Security approach where user permissions are managed through predefined roles rather than individual user assignments

### SAML (Security Assertion Markup Language)

Security Assertion Markup Language — the XML-based SSO protocol used by Virima to federate authentication with enterprise identity providers, exchanging signed assertions via ACS and SLO URLs

### Secret Key

A confidential authentication credential used to establish a secure connection to Azure Active Directory

### SLO (Single Logout)

The SAML endpoint URL Virima exposes for federated logout; when a user signs out, the identity provider terminates their SSO session across all connected applications

### SMTP (Simple Mail Transfer Protocol)

Simple Mail Transfer Protocol — the network protocol used for sending outbound system notifications; configured under Admin > Others > SMTP Configuration

### SSO (Single Sign-On)

An authentication feature allowing users to log in once via an external identity provider (SAML or OIDC) and gain access to Virima without re-entering credentials

### Tenant ID

Azure Active Directory tenant identifier in GUID or domain format for organization-specific authentication

### TOTP (Time-based One-Time Password)

Time-based One-Time Password authentication using authenticator apps such as Google Authenticator; one of Virima's MFA options

### TTLS (Start TLS)

A method to upgrade an existing unencrypted LDAP connection to TLS before transmitting credentials

### Unlink

Operation to remove users from a group while preserving their records in the User module

### UPN — userPrincipalName

A common Active Directory attribute used for user identification, typically in email format (e.g., `user@domain.com`); commonly mapped to Virima's login field

### URO

A unique role identifier prefix used with a 6-digit code to form a unique role ID (e.g., URO000001)

### User Group

A collection of users that can be assigned roles collectively, enabling efficient permission management at scale

### User Groups

Collections of users organized for access control and collaboration based on roles, departments, or responsibilities

### User Profile Module

Centralized interface for administrators to view, edit, and manage individual user records within the Access Management system

### User Role

A collection of permissions and access rights that can be assigned to users to control their capabilities within Virima

---

## CMDB

Configuration Management Database — configuration items, relationships, business service mapping, and SACM.

### ADM Process (Application Dependency Mapping)

Application Dependency Mapping — back-end processes analyzed to build visual dependency relationships between configuration items in the CMDB

### BSM (Business Service Map)

A visual topology map showing how CIs relate to and support business services, with historical snapshot support and downloadable views; configurable via Admin > SACM > Custom BSM Views

### CI (Configuration Item)

Any component of the IT infrastructure (server, software, network device, cloud resource) that is tracked and managed in the Virima CMDB

### CI Import Templates

Reusable configuration files that define how spreadsheet columns map to CMDB CI fields for bulk data imports

### CI Properties

Configuration Item properties in the CMDB that can be populated from discovery data or manual entry

### CI Relationships

Connections and dependencies between Configuration Items — visualized in the BSM and browsable on the Relationships tab of each CI record

### CIDR notation (Classless Inter-Domain Routing)

IP address range notation (e.g., `192.168.48.0/24`) used in Virima to define network scope for credentials and discovery scans

### CMDB (Configuration Management Database)

The centralised repository that stores all configuration items, their attributes, and the relationships between them

### CMDB Integration

The process of populating the CMDB with structured data collected from probe workflow executions or cloud imports

### CMDB Properties

Predefined CI attributes that can be used as matching criteria for device identification and correlation

### CMDB Sync

The process of synchronising discovery results with the CMDB to update asset records

### CMS (Configuration Management System)

The broader ITIL-defined system — of which the CMDB is a component — that Virima implements to support the full SACM process, integrating knowledge, change, and configuration data

### Column Mapping

The process of associating columns from an uploaded data file with specific CMDB CI fields

### Configuration Item

A component of IT infrastructure under the control of Configuration Management, such as servers, software, or network devices

### Configuration Lifecycle

The complete management process for a configuration including creation, editing, deletion, and export

### Configuration Management Database (CMDB)

A repository that stores information about Configuration Items and their relationships throughout their lifecycle

### Correlation

The process of identifying and reconciling applications and devices discovered across networks to prevent duplicate CMDB entries

### Correlator Properties

Mandatory CI fields that must be mapped during import to ensure proper identification and deduplication of configuration items

### DML (Definitive Media Library)

A secure, centralised tab on CI records in Virima where authoritative software media and license files are stored

### EBS (Elastic Block Store)

AWS's persistent block storage service for EC2 instances, tracked as a CMDB CI with storage-provision relationships

### EC2 (Elastic Compute Cloud)

AWS's virtual machine service whose instances are imported into the Virima CMDB as CIs related to EBS volumes, VPCs, AMIs, and security groups

### ECR (Elastic Container Registry)

AWS's managed Docker container image registry, imported as a CI into the Virima CMDB during AWS cloud discovery

### ECS (Elastic Container Service)

AWS's container orchestration service; the discovery blueprint label used in Virima to classify imported containerised workload CIs

### EKS (Elastic Kubernetes Service)

AWS's managed Kubernetes service, imported and catalogued as a CI in the Virima CMDB via AWS cloud import

### AMI (Amazon Machine Image)

An AWS snapshot template used to launch EC2 instances, tracked as a CMDB CI with relationships to the instances it creates

### AKS (Azure Kubernetes Service)

Microsoft's managed Kubernetes container orchestration service, discoverable and tracked as a CI through Virima's Azure import feature

### ESXi

VMware vSphere Hypervisor platform for virtualisation infrastructure; discovered and tracked as a CI in the CMDB

### HyperV

Microsoft's virtualisation platform for creating and managing virtual machines; discovered and tracked as a CI in the CMDB

### Key Identifiers

Essential fields required for CI identification and correlation (e.g., CI Name and CI Type) that must be present in import data

### NAT (Network Address Translation)

The technique of remapping IP addresses in packet headers; AWS NAT Gateways enable private subnets to access the internet and are imported as CIs in the Virima CMDB

### NLB (Network Load Balancer)

Microsoft's built-in Windows Server load balancing feature; Virima tracks NLB-enabled hosts and their dedicated IP relationships as CMDB CI connections

### OS Type

Operating system specification for software entries — supports Windows, Unix/Linux, or Both platforms

### Output Mapping

Configuration that maps pattern discovery results to specific CI properties in the CMDB

### Property Mappings

JSON-formatted configuration that defines the relationship between source file columns and target CI fields

### RDS (Relational Database Service)

AWS's managed relational database service; imported as a CI into the Virima CMDB with route and subnet relationship support

### Relationship Type

The type of relationship established between two CIs in the CMDB (e.g., Hosted On, Depends On, Connected To)

### SACM (Service Asset and Configuration Management)

Service Asset and Configuration Management — the ITIL process that maintains authoritative records of all service assets and CIs throughout their lifecycle; managed under Admin > SACM in Virima

### Skip Column

A mapping option that excludes specific columns from the import process

### Software Instance

A record in the CMDB representing a discovered software application or process running on a specific system

### UCS (Unified Computing System)

Cisco's integrated infrastructure platform combining compute, networking, and storage; tracked in the Virima CMDB with Chassis and Blade Server component relationships

### UUID (Universally Unique Identifier)

The globally unique identifier assigned to a virtual machine or cloud resource, stored on CI records for unambiguous asset identification

### VLAN (Virtual Local Area Network)

A logically segmented network partition tracked as a CI in the Virima CMDB with relationships to routers, switches, and Layer 3 devices

### VMSS (Virtual Machine Scale Set)

An Azure resource type grouping identically configured VMs for horizontal scaling; tracked in Virima as a component on Azure CI records

### VPC (Virtual Private Cloud)

AWS's isolated virtual network environment; imported as a CI in the Virima CMDB with relationships to EC2 instances, load balancers, subnets, and security groups

---

## Discovery Scan

Discovery scans, agents, probes, graphical workflows, credentials, IPAM, and cloud imports.

### Active Connection

A live communication path between Virima discovery components, displayed as dark dotted lines in the Application Map

### Active Status

Boolean flag indicating whether a credential participates in discovery authentication (active) or is temporarily disabled (inactive)

### Agent Schedule

Automated task configuration that triggers discovery scans on remote machines at specified intervals using cron expressions

### Agent-based Discovery

Discovery method that uses distributed agents deployed on remote machines for local data gathering

### Agentless Discovery

Discovery method that collects IT asset information without requiring software installation on target machines

### Atomic Probe

A single-step probe definition that performs one specific discovery or operational check action

### Blueprint

A predefined template or category for discovered devices that determines their type and associated correlation rules

### Blueprint Association

Configuration that links workflows to specific CI blueprints for targeted discovery execution

### Blueprint Correlator

A correlation rule specific to a blueprint type (e.g., DMZ, Router, Website) that defines how devices of that type should be matched and deduplicated

### Build Agent

Function that generates customized installation packages for Windows or Linux Discovery Agents

### Cascade Execution

Workflow setting that enables discovery to extend to systems related to the primary discovery target

### Client ID

Unique identifier assigned to each Discovery Application instance for tracking and update management

### Community String

Password-like authentication token used in SNMP v1/v2c for network device access

### Component Palette

Panel in the Graphical Workflow designer containing node types: Start/End, Action, Decision, Parallel, and Integration

### Component Status

The real-time operational state of individual Virima components as displayed in the Discovery Application Map

### Condition Block

Workflow element that implements decision and branching logic based on specified criteria

### Credential

Authentication information (username, password, keys, certificates) required to access IT systems during discovery

### Credential Type

The authentication protocol category (SSH, Windows, SNMP, AWS, Azure, etc.) that determines required credential fields and scope

### Credential-to-Device Mapping

Stored association between a credential and a device after successful authentication, used to optimise future discovery

### Current State

Boolean status indicating whether the Discovery Application is currently running (true) or stopped (false)

### Custom Patterns

Rule-based signatures that detect applications from process commands and arguments on target hosts during discovery

### CyberArk

Enterprise password vault system that provides dynamic credential retrieval during discovery operations

### DAKeyStoreManager

Command-line interface for advanced Discovery Application configuration with property file upload and key-value management capabilities

### DDI (DNS, DHCP, and IPAM)

The combined suite of network services (DNS, DHCP, and IP Address Management) provided by Infoblox that Virima integrates with to track enterprise IP allocations

### Decision Node

Workflow component providing conditional branching based on result evaluation, threshold checking, or pattern matching

### Dependency Mapping

The process of identifying and visualising relationships between applications, services, and infrastructure components

### DHCP (Dynamic Host Configuration Protocol)

The network protocol that dynamically assigns IP addresses to devices; Virima surfaces DHCP lease data for discovered assets via Infoblox DDI integration

### Discovered Items

Software items identified through discovery scans, correlated with Major Software definitions and managed through the discovery integration process

### Discovery Agent

Software component installed on a target machine that performs asset discovery scans and reports back to the Virima Client

### Discovery Application

A desktop application that orchestrates discovery tasks and collects system-level data including OS details, hardware specs, installed applications, and running services

### Discovery Application Map

A visual representation tool providing real-time insights into the Virima discovery ecosystem's infrastructure topology and communication patterns

### Discovery Correlation

The automated process of matching discovered software items with existing Major Software definitions based on name, version, and configuration criteria

### Discovery Cycle

A scheduled or on-demand discovery operation that scans network assets and applies port configurations to create relationships

### Discovery Engine

The Virima component that performs automated network and asset discovery, integrating with port configurations to create CMDB relationships

### Discovery Graphical Workflows

Visual drag-and-drop designer for creating automated discovery processes with conditional logic and parallel execution paths

### Discovery Monitoring Profile

A configuration that automates monitoring of systems based on predefined conditions and executes actions when trigger criteria are met

### Discovery Node

Workflow component for performing network, host, service, or custom discovery operations

### Discovery Scan

An automated process that detects and catalogs IT assets, software, and network connections within an organisation's infrastructure

### Discovery Scan Configuration

Administrative interface for configuring port priorities, credential strategies, and advanced discovery settings

### Discovery Server (DS)

Acts as a bridge between the Virima Web Application and Discovery Application, providing a secure communication channel and request forwarding

### DNS (Domain Name System)

The network naming service that resolves hostnames to IP addresses; used in Virima for host identification and as part of the Infoblox DDI integration

### End Node

Workflow termination point that defines completion status and final actions

### File Monitor

A monitoring type that tracks file attributes including size, modified date, and content changes

### Flush

Operation that clears stored credential-to-device mappings, forcing fresh authentication during the next discovery run

### FQDN (Fully Qualified Domain Name)

The complete hostname plus domain suffix (e.g., `server.example.com`) used to address the Discovery Application or target devices in Virima network scans

### Group Probe

An orchestrated multi-step discovery scan that arranges one or more probes in sequence for repeatable, auditable execution

### Ignore Process Names

A feature that allows administrators to exclude specified software processes from being detected as software instances during discovery scans

### IIS (Internet Information Services)

Microsoft's web server platform — discoverable by Virima's Windows OS scan workflow and tracked as a software CI in the CMDB

### Import Templates

Predefined, reusable configurations that specify how to map data columns from uploaded files to Virima CI fields during bulk imports

### Inactive Connection

A non-functioning communication path between discovery components, displayed as faded dotted lines in the Application Map

### Infrastructure Topology

The arrangement and interconnection of Virima discovery components showing their relationships and data flow patterns

### Integration Node

Workflow component for connecting to external systems and making API calls during a discovery workflow

### IP Connections

Network dependency data tracked for monitored software to identify system connections and communication patterns

### IP Range

Network scope definition (CIDR, range, or individual IPs) that determines which devices a credential targets

### IPAM (IP Address Management)

The Virima feature for planning, tracking, and managing enterprise IP address allocations, integrated with Infoblox DDI and accessible under Discovery > IPAM Networks

### JDK (Java Development Kit)

Oracle's Java SDK; Virima's discovery audits all JDK installations on target hosts for version compliance and security posture

### JRE (Java Runtime Environment)

The Java runtime that must be present on discovery targets; Virima's discovery audits JRE installations for version and security compliance

### Linux System Probe

A probe type that executes shell commands for OS-level information gathering on Linux systems

### Linux System Workflow

A workflow type that uses shell commands to collect OS, hardware, and configuration data from Linux hosts

### Listening Processes

Processes actively listening on network ports for incoming connections; discovered and tracked in the CMDB

### MAC (Media Access Control)

The unique hardware identifier of a network adapter (e.g., `00:1A:2B:3C:4D:5E`), captured by Virima and stored on CI records for network mapping and device identification

### Major Software

Business-critical software entries defined in the centralised repository for tracking and monitoring across the organisation

### MIB (Management Information Base)

The structured database of SNMP object identifiers (OIDs) defining what information can be queried from network devices; Virima's SNMP probes reference standard MIBs such as HOST-RESOURCES-MIB and IF-MIB

### Monitoring Frequency

Configurable time intervals that control how often the system evaluates trigger conditions in a monitoring profile

### MSSQL (Microsoft SQL Server)

Microsoft's relational database server; Virima's SQL scan workflow executes CRUD queries against MSSQL instances to collect configuration data and build CI relationships

### Nmap Probe (Network Mapper)

A probe type that performs network discovery and port scanning operations

### Nmap Workflow (Network Mapper)

A workflow type that performs automated port scanning and network discovery using the Nmap tool

### OID (Object Identifier)

The unique numeric identifier within an SNMP MIB tree (e.g., `1.3.6.1.2.1.1.1.0`) that addresses a specific data object on a network device during Virima SNMP discovery

### PAExec

Third-party tool for remote Windows machine access and probe execution with configurable options for enhanced Windows discovery

### Parallel Node

Workflow component that enables concurrent execution paths for simultaneous discovery operations

### Port Configuration

A configuration rule linking a process name, port number, and relationship type to automatically create CMDB relationships during discovery

### Port Priority

Configurable ranking (1–3) that determines the order in which discovery protocols are attempted during network scans

### Priority

Numeric ordering (lower = higher priority) that determines credential testing sequence for overlapping IP ranges

### Probe

A reusable discovery action that collects system information or performs operational checks on IT infrastructure

### Probe Workflow

Automated scripts that execute on remote hosts to collect system information and configuration data across different platform types

### Process Exclusion

Configuration to exclude specific system or application processes from dependency mapping analysis

### Process Monitoring

Real-time tracking of software processes to collect usage statistics and availability data across monitored systems

### Process Name

The name of a software process or service running on a specific port, used for discovery matching and port configuration rules

### Process-Host Relationship

A CMDB relationship automatically created between a discovered process and its host system based on port configuration rules

### Processing Node

Workflow component for data transformation, filtering, validation, and enrichment operations

### Property Mapping

Configuration that defines how Virima device properties (IP, Domain, Subnet) align with CyberArk vault organisation (Safe, Folder, Object)

### Rank-Based Discovery Flow

Sequential protocol testing process that follows configured port priority order, proceeding to the next protocol only when the current attempt fails

### Remote Install

Capability to deploy Discovery Agents across IP address ranges or specific hostnames without physical access to target machines

### Scan Through Agent

Configuration option that enables the Client to utilise installed Discovery Agents during scanning operations

### Sensor

An execution context that determines how and where probes execute, providing the runtime environment for probe operations

### Sensor Script

Custom processing logic that converts raw probe output into structured, CMDB-compatible data

### Site Code

Three-character identifier for SCCM primary or secondary sites used in System Center Configuration Manager credential configuration

### SMB (Server Message Block)

The Windows file-sharing protocol used by Virima's discovery for OS fingerprinting and service banner collection alongside WMI credentials

### SNMP (Simple Network Management Protocol)

Network management protocol used for device monitoring with community strings (v1/v2c) or user-based authentication (v3)

### SNMP Probe

A probe type that uses SNMP communication for network device data collection

### SNMP Workflow

A workflow type that gathers hardware and configuration data from network devices using SNMP

### SNMPv3 (Simple Network Management Protocol version 3)

Secure version of SNMP with authentication and encryption capabilities using three security levels (noAuthNoPriv, authNoPriv, authPriv)

### Software Usage Reports

Analytics reports showing software utilisation patterns, usage statistics, and time-based filtering across discovered software

### SQL Probe (Structured Query Language)

A probe type that executes database queries for configuration and status information

### SQL Workflow (Structured Query Language)

A workflow type that executes database configuration and status queries to collect information from SQL database systems

### SSH (Secure Shell)

Encrypted network protocol used by Virima as the primary credential type for discovering and managing Unix/Linux hosts

### Start Node

Workflow entry point that defines scheduling and trigger conditions for workflow execution

### Step-based Editor

A visual interface that allows users to configure workflow execution steps and script parameters in sequential order

### String-based Matching

Process identification method that requires exact process names including file extensions for exclusion rules

### System Monitor

A monitoring type that tracks system metrics such as CPU, Memory, and Disk usage

### TCP (Transmission Control Protocol)

The connection-oriented transport protocol; referenced in Virima's SNMP OID table (TCP-MIB::tcpConnTable) for collecting active TCP connection data from network devices

### Trigger Condition

Criteria defining when workflow or monitoring profile actions should execute based on discovery results or system properties

### Trigger Conditions

Predefined rules that evaluate system or file properties using comparison operators to determine when automated actions execute

### Triggered RunBook

An automated procedure that can be executed as part of a discovery workflow or monitoring profile action

### Try All Credentials

Credential strategy that tests all available credentials for a platform type during discovery authentication

### Try Matching Credentials

Credential strategy that tests only platform-specific matching credentials during discovery authentication

### UDP (User Datagram Protocol)

The connectionless transport protocol; referenced in Virima's SNMP OID table (UDP-MIB::udpConnTable) for collecting active UDP port data from network devices

### Unknown Device

A discoverable asset that responds to ping but has no open ports; can optionally be created as a pingable asset for further investigation

### vCenter SSO (vCenter Single Sign-On)

VMware's native SSO authentication system for vSphere environments, supported as a credential type in Virima discovery for scanning ESXi and vCenter-managed infrastructure

### Virima Agents

Software components installed on remote machines that collect discovery data and communicate with the Discovery Application

### Virima Client

A Discovery Application instance installed in a data centre that serves as the hub for orchestrating local discovery operations

### Virima Discovery Server (DS)

The bridge component that coordinates communication between the Virima Web Application and Discovery Application

### VPN (Virtual Private Network)

A secured network tunnel; referenced in Virima's discovery troubleshooting guidance for validating connectivity when agents cannot reach target hosts across network boundaries

### WAN (Wide Area Network)

Long-distance enterprise network links; Virima's architecture recommends deploying local Clients at each site to reduce WAN traffic during distributed discovery operations

### Windows OS Probe (WMI)

A probe type that uses PowerShell/WMI for Windows system data collection

### Windows OS Workflow (Windows Management Instrumentation)

A workflow type that leverages PowerShell and WMI probes to gather system information from Windows hosts

### WMIC (Windows Management Instrumentation Command-line)

Windows Management Instrumentation Command-line tool using port 135 for remotely discovering and inventorying Windows servers and workstations

### Workflow Assignment

The process of linking probe workflows to sensors with specific trigger conditions and execution parameters

### Workflow Designer

Visual interface containing toolbar, component palette, and canvas for building discovery workflows

---

## ITSM

IT Service Management — incidents, change management, problem management, release management, knowledge, service requests, SLA, and surveys.

### Auto-close Survey

Special survey configuration that enables automated ticket closure based on customer satisfaction responses

### CAB (Change Advisory Board)

The authorised governance body that reviews, prioritises, and approves or rejects Requests for Change (RFCs) before implementation

### CMS (Configuration Management System)

See also: CMDB section. The broader ITIL system that integrates CMDB, knowledge, and change data under a single service management store

### ECAB (Emergency Change Advisory Board)

The subset of the CAB that convenes urgently to review and authorise emergency changes that cannot wait for the standard CAB review cycle

### End Notes

Optional text field in survey configuration providing a closing message displayed after survey completion

### KB (Knowledge Base)

Virima's repository of KB articles — authored documentation covering known errors, solutions, and procedures — linked to incidents, problems, and CIs

### Mean Time to Detection (MTTD)

The average time between when an issue occurs and when it is detected by the monitoring system

### MTRS (Mean Time to Restore Service)

An ITIL service reliability metric measuring the average time taken to restore normal service after a disruption

### Question Library

Repository of reusable survey questions that can be shared across multiple surveys to maintain consistency

### RFC (Request for Change)

The formal document submitted in Virima's Change Management module to propose and seek CAB approval for a change to the IT environment

### RFI (Request for Information)

A change workflow sub-state in Virima indicating that additional information has been requested from the submitter before a change can progress

### SKMS (Service Knowledge Management System)

The ITIL-defined system — implemented in Virima — that integrates alerts, incidents, problems, changes, and knowledge articles into a unified, versioned service management knowledge store

### SLA (Service Level Agreement)

A contractual commitment defining response and resolution time targets for incidents, changes, or requests; Virima enforces multiple SLA policies per ticket type with business-hours calculations

### Survey Notification

Notification type generated from workflows to alert stakeholders about completion or status of a survey

### Survey Tab

Interface section on service tickets that displays survey data, only visible when the associated record is closed

### Survey Threshold

Frequency configuration controlling how often surveys are distributed (e.g., every nth ticket closure) to prevent survey fatigue

### Threshold (OR)

Numeric value indicating survey distribution frequency — surveys are sent on every nth record closure based on OR logic

---

## ITAM

IT Asset Management — hardware assets, software assets, license keys, certificate management, contracts, procurement, and vendor management.

### CPI (Cost Price Index)

A contract cost adjustment type in Virima's ITAM module that allows fixed or manual percentage-based price escalation when renewing vendor contracts

### DML (Definitive Media Library)

See also: CMDB section. The secure storage tab on CI records where authoritative software media and license files are held

### ITAM (IT Asset Management)

The Virima module that manages the full lifecycle of IT assets including hardware, software licensing, procurement, contracts, and vendor relationships

### OEM (Original Equipment Manufacturer)

The hardware or software manufacturer of a product; referenced in Virima for vendor escalation paths when platform issues require manufacturer-level support

### PO (Purchase Order)

A formal procurement document in Virima's ITAM module linking vendor orders to contracts, with fields for PO number, line items, and cost tracking

### Software Usage Reports

Comprehensive analytics showing software utilisation patterns and usage statistics across the organisation's software estate

---

## Vulnerability Management

CVE tracking, NVD integration, and vulnerability posture management across CMDB assets.

### CPE (Common Platform Enumeration)

A standardised URI-based naming scheme for software and hardware platforms used by Virima to match discovered software versions against NVD vulnerability records

### CVE (Common Vulnerabilities and Exposures)

A unique identifier (e.g., `CVE-2024-XXXX`) assigned to a publicly disclosed security vulnerability; Virima surfaces CVEs by matching CMDB software versions against the NVD

### NVD (National Vulnerability Database)

The US government (NIST) maintained repository of CVE vulnerability records; Virima integrates with the NVD to automatically flag vulnerabilities affecting discovered software CIs

---

## Program/Project Management

Programs, projects, dashboards, and PMO governance.

### PMO (Project Management Office)

The organisational unit responsible for overseeing project portfolios and change governance; referenced in Virima's Change Management and Project Management modules for cross-project dependency management

---

## Self-Service

Service catalog, self-service incident and request submission for end users.

### Service Catalog

A curated menu of available IT services that end users can browse and request through the Virima Self-Service portal

---

## Risk Register

Risk identification, scoring, and dashboard management.

### Risk Score Calculator

Configurable formula in Virima's Admin module that computes a numeric risk score from likelihood and impact inputs, used to prioritise entries in the Risk Register

---

## Reports

Ad hoc reports, canned reports, and report management.

### Ad Hoc Reports

User-defined reports built on-demand in Virima by selecting CI types, properties, and filter conditions without a predefined template

### Canned Reports

Prebuilt, ready-to-run report templates shipped with Virima covering standard IT views such as software inventory, hardware assets, and SLA compliance

---

## MSP

Managed Service Provider module — multi-tenant console for managing multiple client environments.

### Customer ID

Organisation identifier used for multi-tenant data isolation and access control validation in the MSP module

### MSP (Managed Service Provider)

The Virima module providing a multi-tenant console for MSP administrators to manage, monitor, and report across multiple client environments from a single dashboard

---

## Admin

Administration — organisational details, discovery configuration, SACM settings, users, integrations, SMTP, and system rules.

### Action Details

Configuration section that defines what automated responses occur when trigger conditions are met, including ITSM module integration and template usage

### Action Node

Workflow component for executing operations like CMDB updates, notifications, report generation, and integrations

### Action Type Block

Workflow element that performs executable actions like record updates, deletions, or notifications

### Asset ID

Unique identifier assigned to discovered software items, either correlating with existing CI records or generating new identifiers

### Auto-refresh

Configurable automatic updating of workflow status displays at specified intervals (20s, 40s, 60s, or custom)

### Comparison Operators

Matching criteria for pattern conditions including Equals, Contains, and Starts With; used in monitoring profile trigger configurations

### Configuration Management Interface

Grid-based interface for viewing and modifying role-task permission mappings in the Role Access module

### Select Actions

Dropdown menu providing bulk operations and configuration management functions across admin interfaces

### Saved Filters

Customisable filter settings that can be preserved and reapplied to display specific subsets of records in admin list views
