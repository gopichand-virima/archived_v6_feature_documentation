# Copy to Ivanti

The **Copy to Ivanti** action transfers all CIs, components, and relationships from the CMDB to Ivanti. The system retrieves records, checks them against blueprint conditions on the Ivanti Mapping page, and maps data to Ivanti properties. Data is sent in the following order to maintain dependencies:

- Main configuration items (CIs)
- Relationships
- Components
- JSON components

1. Open the CMDB module in Virima.

2. Select the CIs from the CMDB list to copy to Ivanti.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Copy to Ivanti** from the dropdown.

1. A confirmation dialog appears, asking, "**Are you sure you want to move the Asset**?"

  1.  Click **Yes** to proceed or **No** to cancel.

1. The system processes the selected records.

2. A success message appears: "**Records will be moved in the background**." Click **OK** to close the message.

1. Monitor progress and status on the **Sync Logs** page.
