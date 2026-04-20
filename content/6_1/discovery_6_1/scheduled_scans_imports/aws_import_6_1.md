---
title: "AWS Import"
description: "Click AWS at the top, then Select Actions → Add."
version: ""
module: "Discovery"
section: "Scheduled Scans Imports"
page: "AWS Import"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Scheduled Scans Imports"
  - "Aws Import"
  - "AWS Import"
---

# AWS Import

# Adding a schedule

1. Click **AWS** at the top, then **Select Actions → Add**.

1. Fill the following details:

  - **Name**\*: e.g., “AWS EKS6 Nightly”
  - **Credential**\*: pick your **AWS\_ACCOUNT**.
  - **Timezone**: choose the right region.
  - **Import Frequency**: “Current Time Settings” (then use the pickers below), or leave as default and set the wheels.
  - Toggle **Active** (must be on to trigger a scan) and optionally **Recurring**.

1. **Select what has to be imported from AWS**\* (at least one):  
  EC2 Instance, EBS, AMI, Snapshot, Security Group, VPC, Load Balancer, Network ACLs, Auto Scaling, NAT Gateways, Databases and Clusters, S3, DynamoDB, ECR, EKS, Lambda, Batch, AppRunner, etc.

  Tip: Only tick what you need; fewer services = faster imports.

2. **Schedule** in the time wheels (Second / Minute / Hour / Day / Month / Weekday).

3. Click **Save**.

4. The job appears in the AWS list

5. If **IsActive=true** , **NextTriggerTime** is calculated and displayed

# Importing a AWS Schedule

- Select the desired rows, open **Select Actions**, and click **Import**.

- You’ll see the **Import  Schedule** popup with a **Browse** button and a link to Click here to download the sample file.
- (Optional) Download the template. The format of the template file is as below

# **Prepare Your File**

- **Download template:** In the **Import AWS Schedule** popup, click the link to download the sample file.
- **Headers:** Keep the headers exactly as shown in the sample file.
- **Fill in mandatory fields:**
  - **Name** Must contain a string.
  - **Credentials Enter Credential Name or Credential ID of AWS Account**
  - **Imported** Items to be imported, must be separated by commas
  - **Timezone**
  - **Schedule fields:** second, minute, hour, day, month, weekday
- **Fill in optional/additional fields as required:**
  - **Active:** true/false
  - **Recurring:** true/false

# **Import the File**

1. Click **Select Actions → Import**.

2. In the popup:

  - Click **Browse**.
  - Select your prepared file.
  - Click **Upload**.

3. Close the dialog.

# **Verify Imported Schedule**

- The scheduled jobs will appear in the list/grid.
- If **IsActive = true**, the system will automatically calculate and display **NextTriggerTime**.
- All other relevant columns (including credentials) will be populated.

# Deleting a AWS Schedule

- Select the checkbox in the leftmost column for each schedule you want to remove.
- From the **Select Actions **dropdown, click **Delete**.

- A **Delete Confirmation** modal appears.
- In the confirmation box, type **Delete** (exactly as shown), then click **Delete**.  
  The selected schedule(s) are removed and disappear from the grid.

- No imports will be executed from the point of delete
- If an active import is currently running, The import will be completed
