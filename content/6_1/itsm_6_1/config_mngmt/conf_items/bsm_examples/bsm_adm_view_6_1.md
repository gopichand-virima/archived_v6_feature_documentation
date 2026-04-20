---
title: "Service Map: ADM&#160;View"
description: "In the example figure below:"
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "Service Map: ADM&#160;View"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Bsm Examples"
  - "Bsm Adm View"
  - "Service Map: ADM&#160;View"
---

# Service Map: ADM View

In the example figure below:

- Both the **Source** and the **Target** CI's are of type Software Instance.
- The Apache Tomcat application is communicating with Redis Server and MySQL Database.

Hover the pointer on any of the streams to know the Port numbers through which they are communicating.

Right-click on the CI to view its details:

If any of the above relationships are deleted and if they are found to be communicating again during another scan, then the relationship will be established.

If any one of the assets is not communicating during the scan, then the relationship will not be established.
