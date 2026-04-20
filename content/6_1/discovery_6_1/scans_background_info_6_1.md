---
title: "Background Information on Scans"
description: "There are three components related to scanning:"
version: ""
module: "Discovery"
section: "Scans Background Info"
page: "Background Information on Scans"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scans Background Info"
  - "Background Information on Scans"
---

# Background Information on Scans

There are three components related to scanning:

- Probes executes a set of scripts on the target hosts to retrieve information. Each host type will have a different probe.
- **Probe Workflows** executes a script when a scan is created. The workflow calls the set of the probes required to discover the information about the hosts on which the scan is performed.
- Sensors. Scripts that are applied to the output of the respective probes. The sensors give the data JSON output.

The basic work flow is as follows:

- Find up and running Hosts.
- Get Host Types for each host.
- If Host Type is **Unix**, find the Unix OS flavor and, depending on the OS, send the probes to the Discovery Server, which retrieves the information of the host.
- If Host Type is Windows or **Network device**, send probes to the the Discovery Server that retrieves the information of the host.

For discovering Windows machines in a workgroup, the admin shared folder should be remotely accessible. Enable this folder by following these steps:

Run **regedit**.

Navigate to this directory : HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System

Right-click on the right pane and choose New > DWORD ** (32-bit) Value**.

Fill LocalAccountTokenFilterPolicy for the Value name and press **Enter**.

Double-click LocalAccountTokenFilterPolicy value and modify the "Value Data" from "0" to "1".

Click OK .

To verify whether the admin share is accessible, run the following on the command line:

net use \\remoteIP\admin$ /user: \* Example: net use \\111.222.333.444\admin$ /user:win7-2\admin \*

## Workflows

Discovery has several work flows:

- **Basic Scan**
- **Nmap Enabled Host Scan**
- **Deep Host Scan with Application and Package Information**
- **Basic Host Type Scan**
- **Host Scan for Windows**

Basic Scan

Determines the Host Type (Unix/Windows/Network Device).

**Nmap Enable Host Scan**

Determines the HOST TYPE , OPEN PORT and MAC Address .

Deep Host Scan for Windows/Linux/Network Devices

A Deep Host Scan discovers the following:


| Type | Description |

| LINUX | - System information , such as Operating System details, Processor details, etc.

- Network Adapter information , such as IP Address, MAC Address, etc.
- Storage information, such as Disk size, Free Memory, etc.
- Unclassified Processes information - Process Name, Port, Command and Arguments.
- Installed package information.
- Running Applications information (If it's a known Application). |

| Windows | - System information , such as Operating System details, Processor details, etc.

- Network Adapter information, such as IP Address, MAC Address, etc.
- Storage information, such as Disk size, Free Memory, etc.
- Installed Software details , Services details and Running Process .
- Running Applications information (If it's a known Application) |

| ESXi Host | - System information, such as Operating System details, Processor details, etc.

- Network Adapter information , such as IP Address, MAC Address, etc.
- Storage information, such as Disk size, Free Memory, etc.
- Virtual Machines information . |

| Switch | - Switch details, such as Manufacturer, Serial Number, Model, etc.

- IPV4 Addresses , VLANs and Network Interfaces details . |

| HyperV | - System information, such as Host Name, IP Address, Operating System details, etc.

- Basic virtual machine information installed on HyperV. |


Note : Default Known Applications areApache Webserver, MySQL Database Server,Apache Tomcat Application Server,Lighttpd server,Postgresql,Jboss Application Server,Jboss Portal,Glassfish Server,and IBM WebSphere server.

The applicable can discover more applications by creating [Patterns](/admin_discovery/patterns_6_1.md) using process commands and arguments.


AS/400 Host SNMP Scan


| Method | MIB Values | OID |

| getDeviceInfo* | SNMPv2-MIB::sysDescr.0 SNMPv2-MIB::sysName.0 | 1.3.6.1.2.1.1.1.0 1.3.6.1.2.1.1.5.0 |

| getHostInfo* | HOST-RESOURCES-MIB::hrSystemUptime.0 HOST-RESOURCES-MIB::hrMemorySize.0 | 1.3.6.1.2.1.25.1.1.0 1.3.6.1.2.1.25.2.2.0 |

| getInterfaceList* | IP-MIB::ipAddrTable [ ipAdEntAddr, ipAdEntIfIndex, ipAdEntNetMask ] IF-MIB::ifTable [ ifIndex, ifDescr, ifSpeed, ifPhysAddress ] | 1.3.6.1.2.1.4.20.1 [ .1, .2, .3 ] 1.3.6.1.2.1.2.2.1 [ .1, .2, .5, .6 ] |

| getNetworkConnectionList | TCP-MIB::tcpConnTable [ tcpConnState, tcpConnLocalAddress, tcpConnLocalPort, tcpConnRemAddress, tcpConnRemPort ] UDP-MIB::udpConnTable [ udpLocalAddress, udpLocalPort ] | 1.3.6.1.2.1.6.13.1 [ .1, .2, .3, .4, .5 ] 1.3.6.1.2.1.7.5.1 [ .1, .2 ] |

| getPackageList | HOST-RESOURCES- MIB::hrSWInstalledTable [hrSWInstalledName ] | 1.3.6.1.2.1.25.6.3.1 [ .2 ] |

| getProcessList | HOST-RESOURCES- MIB::hrSWRunTable [hrSWRunIndex, hrSWRunName, hrSWRunPath, hrSWRunParameters] | 1.3.6.1.2.1.25.4.2.1 [ .1, .2, .4, .5 ] |


Basic Host Type Scan


| Type | Description |

| LINUX | - System information, such as Operating System details, Processor details, etc.

- Network Adapter information , such as IP Address, MAC Address, etc.
- Storage information, such as Disk size, Free Memory, etc.
- Unclassified Processes information, such as Process Name, Port, Command and Arguments. |

| Windows | - System information , such as Operating System details, Processor details, etc.

- Network Adapter information , such as IP Address, MAC Address, etc.
- Storage information , such as Disk size, Free Memory, etc.
- Installed Software details , Services Details and Running Process. |

| ESXi Host | - System information, such as Operating System details.

- Processor details, etc.
- Network Adapter information, such as IP Address and MAC Address.
- Storage information, such as Disk size, Free Memory, etc.
- Virtual Machines information. |

| Switch | - Switch details, such as Manufacturer, Serial Number, Model, etc.

- IPV4 Addresses.
- Network Interfaces details. |


Host Scan for Windows


| Type | Description |

| **Windows** | - System information, such as Operating System details, Processor details, etc.

- Network Adapter information, such as IP Address, MAC Address, etc.
- Storage information, such as Disk size, Free Memory, etc.
- Installed Software details, Services details and Running Process details, |
