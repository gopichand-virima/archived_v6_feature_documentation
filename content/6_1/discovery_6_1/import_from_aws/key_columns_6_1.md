---
title: "Key columns"
description: "Blueprint Name – The discovery blueprint that matched the resource (e.g., AWS FARGATE, AWS ECS, AWS EKS)."
version: ""
module: "Discovery"
section: "Import From Aws"
page: "Key columns"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import From Aws"
  - "Key Columns"
  - "Key columns"
---

# Key columns

- **Blueprint Name** – The discovery blueprint that matched the resource (e.g., AWS FARGATE, AWS ECS, AWS EKS).
- **Asset Name**– Thediscovered resource name (cluster/service/task/instance, etc.).
  - The asset name is the AWS instance ID.
- **Status**: Indicates the current state of the CI imported from AWS. When a CI is newly imported (does not exist in CMDB), the status is shown as "New."
- **Asset ID**: A unique, sequential identification number assigned to each discovered AWS record. The ID shall have a prefix "DSC"+ 6 digits Unique sequential number.

Users can select which columns to display when importing AWS and sort the grid by any column.
