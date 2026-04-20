# Download the Discovery Application

In the main window, clickAdmin>Discovery>Download Application.

Select the type of the Application OS and clickDownload.

Perform any of the following installations: [Windows](/admin_discovery/installation_windows_6_1.md)

## Minimum Hardware Requirements

The following are the minimum hardware requirements to install the Discovery Application.

### **Computer requirements**

- Standalone server or VMware instance
- Windows OS
- 64-bit Machine
- 8 GB RAM
- Java Runtime 21

### **Communication to Virima Cloud Instance**

The Discovery Server listens on port 8081 for all communication from the application.

### **Discovery Application Communication within Network**

| Port | Device Type | Authentication |
|------|-------------|----------------|
| 22(SSH) | Unix, Linux, Solaris<br>MAC | SSH Username,<br>Password and Private keys |
| 135,137,138,139 (WMI) and<br>445 (File and Printer Sharing) | Windows | Windows |
| Port 5985 | Windows | Windows Username/<br>Password |
| **161(SNMP)** | Network Device,<br>Router and Switches | Community String (v1, v2),<br>UserID/Password (v3) |

- [Configuring Services Account](/admin_discovery/config_services_account_6_1.md)
- [Installing and Running the Windows Application](/admin_discovery/installation_windows_6_1.md)
- [Uninstalling the Discovery Application](/admin_discovery/installation_uninstall_6_1.md)
