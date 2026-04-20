# New Credentials

This function enables the addition of credentials for SSH/SNMP/Windows components by entering values for the parameters present in the New Credentials window. Credentials are encrypted and stored in the Virima customer database.

## Credential Types

The following are the types of available credentials.

- **AWS\_Account.** Used for importing AWS Resources.
- **AZURE\_Account**. Used for importing Azure Resources.
- EMC\_VNX.Used to scan the EMC storage server.
- **Kubernetes**. Used for scanning Kubernetes Clusters.
- **Meraki**. Used to import Meraki devices such as Access Points, Switches, Firewalls, and Routers.
- SNMPandSNMP\_v3.Used to scan SNMP device.
- **SQL\_Server.** Used for scanning the databases running inside MSSQL Server.
- SSH.Provided for SSH Probes (mainlyUnixHosts andESXiHosts). Specify theUsername,PasswordandPriority.
- SSH\_PRIVATEKEY.Provided SSH Probes (for Hosts with a PRIVATE KEY).
- VCenter. Used to scan Vcenter's through API.
- **VMWare**. Used for scanning VMWare vCenter & vSphere servers.
- Windows.Used for application dependency Discovery in windows hosts.
- Windows\_AD**\_Domain\_Controller.** Used to scan domain networks. It is recommended to provide domain controller credentials.
- **XtremIO**. Used for scanning XtremIO storage servers.

## New Credential

In the main window, click **Admin > Discovery > Credentials**. The Credentials window displays.

From the *Select Actions* drop-down list, chooseNew Credentials. A new window displays!

In the *Name* field, enter a name for this credential.

In the *Credential Type* field, click the drop-down list select an available type.  

Based on the type of credential selected, the fields in the window change.

Provide the required details for the type selected (refer to the list above).

If an *IP Range* field is shown, enter the IP Address information in one of the below formats. (This field is not required.)

- 192.168.48.1 (Single IP)
- 192.168.48.1 192.168.49.2 (Multiple IPs of Different Subnets)
- 192.168.48.1,2,3,4 (Multiple IPs of Same Subnet)
- 192.168.48.1-50 (A wide Range of IPs in a Subnet)
- 192.168.48.0/24 (Single Subnet/CIDR Notation)
- 192.168.48.0/24 192.168.49.0/24 (Multiple Subnets/CIDR Notation)

In the *Priority* field, Assign a numeric value to prioritize this credential over others. Lower numbers have higher priority. Useful when multiple credentials are associated with overlapping IP ranges.

In the *Active* field, When checked, the credential is enabled and will be used during discovery attempts. If unchecked (inactive), the credential will be ignored during discovery.

When all selections/entries are made, click **Add**.

To successfully add a new credential, the following details are mandatory based on the credential type:

| Credential Type | Required Information |
|----------------|---------------------|
| **SSH** | Username and Password |
| **SSH (Private Key)** | Username and Private Key |
| **Windows** | Username and Password |
| **Windows AD Domain Controller** | Domain Name, Username, Password, Base DN, and DC IP |
| **SNMP** | Community String |
| **SNMP v3** | Username |
| **VMware** | Username and Password |
| **MXC_VNX** | Username and Password |
| **AWS Account** | Account ID, Access Key, and Secret Key |
| **Azure Account** | Subscription ID, Client ID, Tenant ID, and Secret Key |
| **vCenter SSO** | Username and Password |
| **SQL Server** | Username and Password |
| **XtremIO** | Username and Password |
| **Kubernetes** | Port, Key, Certificate, and CA Certificate |
| **Meraki** | Endpoint and API Key |
| **CyberArk** | Endpoint |
| **Microsoft Intune** | Client ID, Tenant ID, and Secret Key |
| **SCCM Host** | Username, Password, and Site Code |

- [Credential Details](/admin_discovery/credentials_details_6_1.md)
- [Credentials](/admin_discovery/credentials_6_1.md)
- [Credentials File Backup](/admin_discovery/credentials_backup_file_6_1.md)
- [Flush Credentials](/admin_discovery/credentials_flush_6_1.md)
