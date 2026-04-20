---
title: "IPAM Networks"
description: ""
version: ""
module: "Discovery"
section: "Ipam Networks"
page: "IPAM Networks"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Ipam Networks"
  - "IPAM Networks"
---

# IPAM Networks

Use this function to enable planning, tracking, and managing the information associated with an Internet Protocol address existing in the monitored network environment. It updates the following details to the application user:

- Total number of subnets existing with its user details.
- Total number of IP address(s)present in each subnet.
- Name of the host associated with an IP address.
- Specific hardware/software associated with an IP address.


Infoblox delivers essential technology to enable customers to manage, control, and optimize DNS, DHCP, and IPAM (DDI). Infoblox technology helps businesses automate complex network control functions to reduce costs and increase security and up time – building bulletproof, scalable, and efficient networks.


## IPAM Procedure

The procedure to perform IPAM is as below:

- Infoblox Configuration
- IPAM

Infoblox Configuration

Use this function to configure Infoblox on the installed machine.


A [client](/admin_discovery/client_6_1.md) needs to be created to associate a client with an Infoblox credential.


In the navigation pane, select **Admin > Integration > Infoblox Configuration**. The Infoblox Credential dialog box displays. By default, the Add New Infoblox Credential option is selected.


### Add New Infoblox Credential

In the InfoBlox Credential dialog box, select **Add New Infoblox Credential.**

In the *Username* field, enter the user name of the Infoblox installed on the machine.

In the *Password* field, type the related password associated with the Username.

To change the password, click **Change Password**. The InfoBlox Credential dialog box updates and displays the **Show Password checkbox** and the **Cancel Change** option.

In the *Show Password* field, click the checkbox to show the entered password.

Click **Cancel Change** to cancel the password change.

! !

In the *Host* field, enter the IP address of the InfoBlox machine installed on the Host box.

In the *Client* field, click the drop-down list and select the applicable client. You can search in this field by typing the first few letters of the client name to display a list of possible matches.


The name of the client displays only if it is functionally "up."


When all selections/entries are made, click **Save**.

### Auto Pick Credential from Discovery Application

In the Infoblox Credential dialog box, select **Auto pick credential from Discovery application**.

! !

In the *Host* field, enter the **IP Address** of the machine on which Infoblox is installed.

In the *Client* field, click the drop-down list and select the client's name. The list only contains the name of those clients in "up" status.

Click **Save**.

IPAM

Use this function to monitor and sync the Internet Protocol address from Infoblox that exists in the monitored network environment.

In the navigation pane, select **Discovery Scan >****IPAM Networks**. The IPAM window displays.

! !

Refer to the sections below for details on each function.

### Scan

Use this function to identify the devices that are connected and communicating in a network. The Discovery application identifies the Device Types, Host Name, and Other Information of the device based on the probe selected for the scan. Users can initiate a scan Immediately or Schedule a Scan based on the requirement.


Start the Discovery Application before initiating a scan.


### Sync (Instant and Schedule)

Use this function to plan, track, and manage information associated with an Internet Protocol address in the monitored network environment.

In the IPAM Networks window, click**Sync**. The Sync From InfoBlox window displays.

! !

SelectInstant Syncto import the records from the Infoblox server.

SelectSchedule Syncto import the records at a scheduled time.

In the *Schedule Report Frequency* drop-down list, select the required value.

Check "Second" and/or "Minute" and/or "Hour" and/or "Day" and/or "Month" and/or "Weekday" option(s) according to the time selected for the Schedule Report Frequency.

ClickAddto update the schedule details accordingly.

ClickSync Nowto enable the operation.

### Status Update

Use this function to select one or more networks (subnet) from the IPAM Networks page, one or more IP Addresses from the IPAM Network's IP list tab, then perform a status update scan. This pings every IP Address in the network's IP List, and updates its status to *Used* or *Unused*. All pingable IPs are set to *Used* and non-pingable to *Unused*.

Select a line item.

Click **Status Update**.

Enter the *Probe* to scan.

In the *Client* field, click the drop-down list and select the applicable client.

Enter an *IP Range*.

Select if the update should be *Immediate* or *Scheduled*. If *Scheduled* is selected, configure the *Scan Frequency*.

When all selections/entries are made, click **Status Update**.

### Regular Scan

Use this function to perform a full-fledged scan based on the probe selected by the user.

Select an item in the list.

Click **Regular Scan**.

Enter a *Name* for this network.

In the *Probe* field, click the drop-down list and select the applicable probe.

In the *Client* field, click the drop-down list and select the applicable client.

Enter an IP Range to include or exclude.

Click the **plus + sign** to add a *Location* and *Send Scan Report To* recipient(s).

Select if the scan should be *Immediate* or *Scheduled*. If *Scheduled* is selected, configure the *[Scan Frequency](/discovery/scans_frequency_6_1.md)*.

When all selections/entries are made, click **Run**.

Edit IPAM Network

To view details for the selected IP, click the **Details** tab.

To view schedule details, click the **Schedule Details** tab.

To view the history of activity, such as when changes were made, click the **History** tab.

Delete IPAM Network

- [Records per Page](/common_topics/records_per_page_6_1.md)
- [Personalize Columns](/common_topics/personalize_columns_6_1.md)
- [Saved Filters](/common_topics/saved_filters_6_1.md)
- [Items per Page](/common_topics/items_per_page_6_1.md)
