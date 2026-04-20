---
title: "Merge CI"
description: "Use this function to merge data between CIs having the same blueprint."
version: ""
module: "Itsm"
section: "Config Mngmt"
page: "Merge CI"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Config Mngmt"
  - "Conf Items"
  - "Details Merge Ci"
  - "Merge CI"
---

# Merge CI

Use this function to merge data between CIs having the same blueprint.

From the navigation pane, select **ITSM > Configuration Management > Configuration Items**. The Configuration Items window displays.

Select the record for which you want to add a detail property. A new window displays.

From the *Select Actions* drop-down list, select **Merge CI**. The Merge CI dialog box displays.

Click either **Merge Into** or **Merge From**.

If **Merge Into** is selected:

- The current CI properties are copied to the selected CI properties IF the selected the CI properties don't have a value.
- All the components and attachments of the current CI will be copied to the selected CI and the current CI will be archived.

If **Merge From** is selected:

- The selected CI properties are copied to the current CI properties IF the current CI properties don't have a value.
- All the components and attachments of the selected CI will be copied to the current CI and the selected CI will be archived.

In the field, type the applicable asset number.

Click **Save**.
