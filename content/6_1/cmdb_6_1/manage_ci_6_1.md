# Manage CI (Select Action inside CI)

Within the CI record, the **Select Actions** menu provides several advanced tools and functions:

**Action**

**Description**

**Add Property**

Add a new custom property field to the CI

**Copy to Ivanti**

Transfer the CI, its components, and relationships to Ivanti for external ITSM management

**Copy to Jira**

Send the CI, its components, and relationships to Jira for tracking and integration

**Copy to ServiceNow**

Sync the CI, its components, and relationships with ServiceNow ITSM

**Delete**

Permanently remove the CI from the CMDB

**Disable Editing**

Locks the CI from being manually modified (typically used for syncing assets)

**Mark As Knowledge**

Convert the CI into a reusable knowledge asset

**Merge CI**

Merge duplicate or related CIs into a single record

**Release Hierarchy**

View or manage release-related dependencies

**Rescan Now**

Trigger an immediate re-scan of the CI via the available probe

# Add Property

Use this to add additional fields to a Configuration Item.

1. In the CI, Click **Select Actions**, and then select **Add Property**.

1. In the **Add Property** dialog:

  - Use **Search for properties** to find a field.
  - Expand a group (e.g., Application Details) and **check** the properties you want.

1. Click **Add**, then **Save** on the CI.

# Copy to Ivanti

Copy a CMDB record from Virima to **Ivanti Service Manager** as an Asset/CI.  
If the CI already exists in Ivanti (based on your mapping key), it's **updated**; otherwise, a **new** record is created.

1. Click **Select Actions, **and then select **Copy to Ivanti**.

2. In the confirmation dialog, click **Yes** to proceed.


1. The system displays the **Success** message: "**Records will be moved in the background**."


1. Open Ivanti Service Manager and confirm the Asset/CI was **created/updated** with mapped fields.

# Copy to Jira

Copy a CMDB record from Virima to **Jira** as a tracked asset/CI.  
If the CI already exists in Jira (based on your mapping key), it's **updated**; otherwise, a **new** record is created.

1. Click **Select Actions, **and then select **Copy to Jira**.

1. In the confirmation dialog, click **Yes** to proceed.

  - A "Processing, please wait" indicator appears; the job runs **in the background**.


1. The system displays the **Success** message: "**Records will be moved in the background**."


1. Open Jira and confirm the Asset/CI was **created/updated** with mapped fields.

# Copy to Service Now

Copy a CMDB record from Virima to **Service Now** as a tracked asset/CI.  
If the CI already exists in Jira (based on your mapping key), it's **updated**; otherwise, a **new** record is created.

1. Click **Select Actions, **and then select **Copy to ServiceNow**.

2. In the confirmation dialog, click **Yes** to proceed.

3. The system displays the **Success** message: "**Records will be moved in the background**."


1. Open ServiceNow and confirm the Asset/CI was **created/updated** with mapped fields.

# Delete

Permanently remove a Configuration Item (CI) from the **CMDB**

1. Click **Select Actions, **and then select **Delete**.

1. In the confirmation dialog, review the warning and click **Delete **to proceed.

2. A success message confirms the request. The CI and all its CMDB relationships are removed from the active CMDB view and cannot be used in further operations.

# Disable Editing

Lock a CI so its fields can't be modified (read-only). Use this to preserve a validated record or prevent unauthorized changes.

1. Click ****Select Actions**, **and then select** Disable Editing**.

1. In the confirmation dialog, review the message and click **Yes **to confirm.


1. The CI switches to **read-only**: form fields, attachments, and properties cannot be edited or saved.

1. The record remains visible in searches, reports, BSM, and relationships (nothing is deleted).

2. To make changes later, use **Select Actions ▸ Enable Editing**.

# Mark as Knowledge

Publish the current CI as a knowledge entry so it can be referenced in Knowledge Management. The CI stays in CMDB; this action creates/updates a linked knowledge record.

1. Click **Select Actions, **and then select** Mark As Knowledge**.

1. In the confirmation dialog (or metadata form, if prompted), review and click **Yes **to confirm.

2. A knowledge article is created or updated and linked to the CI.

# Merge CI

Combine duplicate CIs into a single "master" record so relationships, history, and other references are consolidated, and you don't manage the same asset twice.

1. Open the CI you want to keep (the master) in CMDB.

2. Click **Select Actions, **and then select **Merge CI**.  
  The **Merge CI** dialog opens.

3. Choose how to merge:

  - **Merge Into** (recommended) – Merge **another** CI **into the currently open** CI (this record stays as master).
  - **Merge From** – Merge **the current CI** into **another** CI (the other record becomes master).

4. In the **Search** box (or **Advanced Search**), find and select the counterpart CI to merge.

5. Click **Add**, then confirm when prompted.

6. The system displays a success message.

7. The **master** CI is retained; its **Asset ID** and primary identity remain unchanged.

  - Where supported, **relationships, references, and other mergeable data** from the secondary CI are consolidated into the master.
  - The **secondary** (merged-from) CI is removed from active CMDB views and can no longer be used in operations.

# Release Hierarchy

Visualize how the current CI participates in a Release. The view lays out the end-to-end chain (CI → Release → Phase → Activity → Task). You can confirm scope, ownership, and impact without drilling through multiple records.

1. Click **Select Actions **and then Choose **Release Hierarchy**.

1. If your browser blocks pop-ups, allow the new tab/window.  
  The hierarchy opens in a separate tab.

1. A read-only diagram showing nodes such as:

- **CI** (the record you started from)
- **Release** (RLSxxxxx)
- **Phase** (RPHxxxxx)
- **Activity** (RL Axxxxx)
- **Task** (RLTxxxxx)
- Lines represent the relationships between those records.

**Creating and Associating a Release Record with a Configuration Item (CI) in Virima ITSM**

To manage releases and track their impact on specific assets within Virima, follow this workflow:

1. **Navigate to the Release Section in the ITSM Module**  
  Begin by accessing the **Release** under the ITSM module. Here, you can initiate a new release record to plan and manage changes or deployments.

2. **Create a Release Record**  
  Fill in the required details to create a new release. This record serves as the central entity for tracking all phases, activities, and tasks related to the release process.

3. **Associate Phases, Activities, and Tasks**  
  Within the release record, define and link the necessary **phases** (major stages of the release), **activities** (specific actions within each phase), and **tasks** (granular work items under each activity). This hierarchical structure ensures that every step of the release is documented and traceable.

4. **Associate the Release with a Configuration Item (CI)**  
  Link the release to the relevant Configuration Item (e.g. **AST0004**) by assigning it as an associated CI. This establishes a direct relationship between the release and the asset it impacts, enabling end-to-end traceability.

5. **View Release Hierarchy from the CI Record**  
  After association, navigate to the CI record for **AST0004** in the CMDB.

  - In the CI's **Related Records** or **ITSM** tab, you will see the linked release(s).
  - Use the **Release Hierarchy** view (accessible via the "**Select Actions**" menu inside the CI) to visualize the full structure:  
  **CI → Release → Phase → Activity → Task**  
  This read-only diagram provides a clear, end-to-end view of how the CI is involved in the release process, including all related phases, activities, and tasks.

# Rescan Now

Run an on-demand discovery against the currently open CI to refresh its attributes and components (useful after a config change or when the last scan is stale). The action triggers a single scan; it doesn't edit data directly—updates are applied when the scan completes.

1. Open the CI in CMDB.

2. Click **Select Actions,** and then select **Rescan Now**.

1. A **Rescan Now** dialog opens.

1. Review **IP Address** (pre-filled from the CI). Adjust only if needed.

2. Choose a **Client** from the drop down.

3. Select the **Type of scan** (e.g., Certificate scan, Host Ping Scan), as supported in your environment.

4. Click **Scan**.

5. The system automatically redirects you to the recent scan page, where you can monitor the progress and results of the scan.
