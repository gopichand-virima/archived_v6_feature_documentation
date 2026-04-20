---
title: "Import CIs"
description: "Use this function to upload Excel files containing CI details."
version: ""
module: "Discovery"
section: "Import Cis"
page: "Import CIs"
breadcrumbs:
  - "Home"
  - ""
  - "Discovery"
  - "Import Cis"
  - "Import CIs"
---

# Import CIs

Use this function to upload Excel files containing CI details.

In the navigation pane, select **Discovery Scan > Import Data Files**. The Import Data Files window displays.

In the *Select Actions* drop-down list, choose **Import CIs**. The Attach CI Data Files dialog box displays.

! !

For *Select Mapping Type*, select either **Choose from Template** or **None**.

- If *Choose from Template* is selected, the *Choose Template* field displays. Click the drop-down list and select the applicable template. To view a sample file, select **Click here to download the sample file**.
- If **None** is selected, continue with the next step.

In the *Upload CI Data* field, click **Browse** and select an allowed file type (such as .xls, .xlsx, .csv). The name of the selected file is shown in the field.

Click **Upload**. The *Preview data to be imported and map columns* dialog box displays.

[!](
        param($match)
        $prefix = $match.Groups[1].Value
        $path = $match.Groups[2].Value
        $ext = $match.Groups[3].Value
        
        # Convert path
        $newPath = $path -replace '%20', '_' -replace '-', '_'
        $newPath = $newPath.ToLower()
        $newExt = $ext.ToLower()
        
        $fileReplacements++
        return "$prefix$newPath$newExt"
    )

## Preview data to be imported and map columns

The data imported from the spreadsheet populates this window. The column names and associated properties are displayed.


All properties must be mapped before you can Submit the data. Properties cannot be deleted as they may be in use elsewhere in the application.


To change the property for a column, click the drop-down list arrow and choose a property from the list. Note the following:

The red and green column headings indicate if the data is properly mapped.

The name of a property in this dialog box cannot be deleted or changed. The spreadsheet containing the data must be edited then reimported.

When all selections are made, click **Submit**.

If a property is not mapped, an Alert message displays. Map the remainder of the properties.

## Add New Property

While viewing the *Preview data to be imported and map columns dialog box*, click **Add New Property**. The *Add New Field dialog box* displays.

[!](
        param($match)
        $prefix = $match.Groups[1].Value
        $path = $match.Groups[2].Value
        $ext = $match.Groups[3].Value
        
        # Convert path (hyphens to underscores, lowercase)
        $newPath = $path -replace '-', '_'
        $newPath = $newPath.ToLower()
        $newExt = $ext.ToLower()
        
        $fileReplacements++
        return "$prefix$newPath$newExt"
    )

In the *Property Name* field, enter a name for this property.

In the *Property Group* field, click the drop-down list and select from the groups shown.

In the *Property Type* field, click the drop-down list and select from the types shown.

Click **Add**. The property is now available as an option in the applicable drop-down menus.

- [Import Asset/CI Relations](/discovery/import_data_file_asset_ci_relations_6_1.md)
- [Import Data Files](/discovery/import_data_file_6_1.md)
