# Process Cloud Hierarchy

The **Process Cloud Hierarchy** action builds and updates the hierarchical view of cloud resources for selected Configuration Items (CIs). This process maps cloud assets to their parent-child relationships, service dependencies, and resource group structures, providing a visual representation of cloud infrastructure within the CMDB.

To run the **Process Cloud Hierarchy** job, scanned discovery data or AWS imported data must be available in the CMDB. Without this data, the cloud hierarchy cannot be generated accurately.

1. Open the **CMDB** module in Virima.

2. Select the CIs (cloud-related assets) for hierarchy mapping.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Process Cloud Hierarchy** from the dropdown.

1. The system retrieves cloud metadata and relationship details for the selected CIs.

2. It maps them into a hierarchical structure (e.g., accounts → resource groups → services → instances).

3. The processed hierarchy updates in the CMDB.

4. Review the structure in the **Cloud Hierarchy** view or other relevant visualization modules.

5. Track progress via the **Sync Logs** page if processing runs in the background.
