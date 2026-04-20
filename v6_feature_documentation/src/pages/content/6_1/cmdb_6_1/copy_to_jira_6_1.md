# Copy to Jira

The **Copy to Jira** action transfers all CIs, components, and relationships from the CMDB to Jira. The system retrieves records, validates them against blueprint conditions on the Jira Mapping page, maps data to Jira properties, and sends it in the following order:

- Main CIs
- Relationships
- Components
- JSON components

1. Open the CMDB module in Virima.

2. Select the CIs from the CMDB list to copy to Jira.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Copy to Jira** from the dropdown.

5. A confirmation dialog appears, asking, "**Are you sure you want to move the Asset?**"

6. Click **Yes** to proceed or **No** to cancel.

7. The system processes the selected records.

8. A success message appears: "**Records will be moved in the background**." Click **OK** to close the message.


1. Monitor progress and sync details from the **Sync Logs** page under Configuration Management.

2. After completion, check the CMDB page. If the copy is successful, the Ivanti sync flag will be set to **true**; if unsuccessful, it will be set to **false**.
