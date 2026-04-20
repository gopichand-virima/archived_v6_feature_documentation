# Process Network Connections

The **Process Network Connections** action identifies and updates network connectivity details for selected Configuration Items (CIs). This includes mapping connections between devices, servers, switches, and other network components to ensure the CMDB accurately reflects the physical and logical network topology.

To run the **Process Network Connections** job, scanned discovery data must be available in the CMDB. Without this data, network connection details cannot be generated accurately.

1. Open the **CMDB** module in Virima.

2. Select the CIs for which you want to identify network connections.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Process Network Components** from the dropdown.

1. The system collects network connection data for the selected CIs.

2. It maps connectivity between devices, including both direct physical links and logical network paths.

3. Updated network connection details are stored in the CMDB.

4. Review them in the network topology or dependency views.

5. Monitor progress and completion via the Sync Logs page if processing runs in the background.
