---
title: "Upload File Popup"
description: "When you import CIs or Asset/CI Relations from files, an upload popup displays."
version: ""
module: "Discovery"
section: "Popups"
page: "Upload File Popup"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Popups"
  - "Upload File Popup"
  - "Upload File Popup"
---

# Upload File Popup

When you import CIs or Asset/CI Relations from files, an upload configuration popup displays.

## For CI Import:

**Mapping Options:**
- **Choose from Template**: Use a predefined field mapping template
  - If selected, choose a template from the dropdown
- **None**: Map fields manually during preview

**Required Fields:**
- **Upload CI Data**: Click Browse to select a file (.xls, .xlsx, or .csv)

**Optional:**
- Click "Click here to download the sample file" to see the expected format

**Actions:**
- **Upload**: Proceeds to the field mapping preview screen
- **Cancel**: Closes the popup without uploading

## For Asset/CI Relations Import:

**Required Fields:**
- **Upload Data**: Click Browse to select a file (.xls, .xlsx, or .csv)

**Sample File Available:**
- Click "Click here to download the sample file" to see the required format

**Required Columns:**
- Source Asset Id
- Relationship
- Target Asset ID
- Source Port (optional)
- Target Port (optional)

**Actions:**
- **Upload**: Proceeds to the relationship mapping preview
- **Cancel**: Closes the popup

**After Upload:**
- A preview window displays showing the data and field mappings
- Users can adjust mappings before final submission
- Option to save field mappings as templates for future use
