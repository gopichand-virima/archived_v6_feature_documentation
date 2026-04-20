# Process Network Virtualization Hierarchy

The **Process Network Virtualization Hierarchy** action organizes and updates the hierarchical structure of VMware vCenter resources for selected Configuration Items (CIs). This process maps virtual machines, hosts, clusters, data stores, and networks into a structured vCenter hierarchy within the CMDB.

To run the **Process Network Virtualization Hierarchy** job, ensure that scanned discovery data is available in the CMDB. Without this data, the vCenter hierarchy cannot be generated accurately.

1. Open the **CMDB** module in Virima.

2. Select the CIs for which you want to identify vCenter resources.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Process Network Virtualization Hierarchy** from the dropdown.

1. The system retrieves Network Virtualization resource relationships and structure for the selected CIs. It maps them into the correct hierarchy (e.g., data centers → clusters → hosts → VMs).

2. The updated Network Virtualization hierarchy is stored in the CMDB.

3. Review the structure in the **Network Virtualization Hierarchy** view or relevant virtualization dashboards.

4. Monitor progress and completion via the **Sync Logs** page if processing runs in the background.
