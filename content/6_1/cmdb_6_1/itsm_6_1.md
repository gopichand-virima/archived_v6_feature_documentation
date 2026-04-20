# ITSM

- The ITSM (IT Service Management) tab displays all ITSM records associated with a Configuration Item (CI).
- This view allows you to track the CI's involvement in service-related activities across various ITSM modules.
- This integration supports platforms like Virima, ServiceNow, Ivanti, and Jira, with toggles to filter records based on the selected source.

Modules included in the ITSM tab

**Module**

**Purpose**

Incidents

Shows incidents linked to the CI for impact analysis.

Requests

Displays service requests involving this CI.

Changes

Lists change records affecting or triggered by this asset.

Problems

Shows problem investigations involving the CI.

Known Errors

Tracks documented root causes tied to recurring incidents.

Releases

Displays planned releases that deploy or affect this CI.

Knowledge

Links related knowledge base articles or procedures to the asset.

**Creating new ITSM records**

You can initiate a new record directly from this tab:

- Use the platform toggles (Virima, ServiceNow, Ivanti, Jira) in the ITSM tab to select the desired source for incident creation.
- If you select Virima (or another platform) and click **New Incident**, you will be redirected to the respective domain page to create a new incident.


- Enter the details, then click **Add** to create a new incident.
- The selected Configuration Item (CI) will be **automatically linked** to the new record.
