# Installing and Running the Linux Application

The Linux Application can performUnix System DiscoveryandNetwork Device Discoveryin a Network.

Once the application is downloaded, follow the below installation steps:

Push the *tar* file onto a Linux Machine.

Untar the file by running the following:  
command:tar -xvf VirimaLinuxAgent.tar

Install the Virima Linux Application into the folder /opt/virima.as a service by running the following:  
command:bash install.sh

In the confirmation.xml file found at /opt/virima/config/, enter your **Virima User Name,** **Password,** and the preferred **Application**.

To start the service, from the main window, select **[**Admin > Client**](/admin_discovery/client_6_1.md)**.

If the Client state is *false*, try restarting the service.

## Commands to Run the Application on Linux

- **Starting** application command:service: virimadiscoveryagent start
- **Stopping** application command:service: virimadiscoveryagent stop
- **Restarting** application command:service: virimadiscoveryagent restart
- **Uninstall** application command:service: virimadiscoveryagent uninstall
