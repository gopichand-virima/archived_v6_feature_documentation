# Process ADM

The **Process ADM** action allows users to process Application Dependency Mapping (ADM) for selected Configuration Items (CIs). This operation analyzes network traffic, service dependencies, and application connections for the chosen assets, creating a visual and data-driven map of relationships between applications, services, and infrastructure components.

To run the **Process ADM** job, scanned discovery data must be available in the CMDB. Without this data, the ADM process cannot generate accurate dependency mappings.

1. Open the **CMDB** module in Virima.

2. Select the CIs for ADM processing.

3. Click the **Select Actions** dropdown at the top-right of the CMDB list.

4. Choose **Process ADM** from the dropdown.

1. The system collects dependency data for the selected CIs.

2. It analyzes communication patterns, service relationships, and supporting infrastructure components.

3. Once processed, the ADM relationship data updates in the CMDB.

4. Monitor progress through the **Sync Logs** page.
