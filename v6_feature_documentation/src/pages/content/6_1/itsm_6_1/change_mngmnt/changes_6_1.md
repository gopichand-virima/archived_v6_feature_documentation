---
title: "Changes"
description: "Use this function to create a change."
version: ""
module: "Itsm"
section: "Change Mngmnt"
page: "Changes"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Change Mngmnt"
  - "Changes"
  - "Changes"
---

# Changes

Use this function to create a change.


Roles with relevant access as per role access of Change and RFC can view, add, edit, approve, reject, resolve and close a change.


In the navigation pane, select **ITSM > Change Management** > **Changes**. The Changes window displays.


New Change

From the *Select Actions* drop-down list, choose **New Change**.

Click **New**.

Complete the fields, referring to the table below.

When all selections/entries are made, click **Add**.


Once a Change is created, a notification mail is sent to the Requester, Assignee and other Roles as per Role Access of Change and RFC, and individual users email preferences.


## Change Request Fields

| Field | Description |

| **Select Change Model** | Click the drop-down list and select the model for this change. |

| Title | The title for the change. |

| Requester Details | - *Requester*. The name of the person requesting the change. Click **Addthe plus + sign** and search for and select the applicable person.

- *Requester Department*. The department associated with the Requestor. This field is automatically populated if a department is associated with the selected Requestor.
- *Requestor Location*. The location associated with the Requestor. This field is automatically populated if there is a location associated with the selected Requestor.
- *Group Requester*. The group associated with the Requestor. Click **Addthe plus + sign** and search for and select the applicable group.
- *Callback Method*. The communication method to use--either *Phone* or *Email*.
- *Contact Info*. The information related to the Callback Method, such as phone number or email address. |

| Record Details | For each of the following fields, click the **drop-down list**, and select the applicable option.

- CI Category
- CI SubCategory
- Category
- Type
- Impact Level
- Urgency
- Priority (This is a required field and a selection must be made before you can Add the change.)
- Risk
- Stage
- State
- Error Code

For each of these fields, click **Add**, and search for and select the applicable information.

For each of these fields, click the **plus + sign**, and search for and select the applicable information.

- Assignee/Group Assignee
- Department Assignee
- Approver
- Approval Group
- Associated CIs
- Internal Stakeholders
- External Stakeholder Email ID
- Runbook

For these fields, enter the relevant information:

- Description
- UserName |

| Associated Records | Displays all the records associated with this request. |

| Schedule Details | The schedule for completing this change request: Planned Start/End and Work Start/End. |

| Change Review | Uploads a document containing information relevant to this change. Click **Upload**, search for and select the applicable document, then click **OK**. |

| Related Records (tab) | Select the records to associate with this change request. Click the plus + sign next to the applicable category. |

| Notes (tab) | Details for this change include Change Plan, Back Out Plan, Test Plan, Approval Notes, and Scope. Enter the applicable text and/or upload the text from a different file. |

| Resolution Information (tab) | Details on how the change was resolved or closed. |

| Closure Information (tab) | Details related to the closure of the change.

- In the *Closure Code* field, click the drop-down list and select a *Closure Code*.
- In the *Closure Notes* field, enter any details. |


If a model has a priority (expect 1- Very High) and assigned to all three support levels, the following occurs:

- When creating a Change, if the priority is changed to 1-very High (based on Impact and Urgency), the change will be assigned directly to the Third level assignee.
- The Response and the Resolution times are applicable only to the Third level.


When selecting a record, an option may be shown to Add that item. For example, when Associate Problem is selected, the dialog box includes an option to **Add Problem**.


### Existing Changes

Two functions can be performed in the Add Change panel shown on the left side of the window: (1) search for an existing change, OR(2) select an existing change from the list of Recent Changes.

- To search for an existing change, display the left panel and enter the search criteria in the Search field. The results are displayed
- To view a recent change, scroll the list under *Recent Changes*.

! Details  

### Risks

Use this function to associate risks with this change request.

While viewing the Details window, click **Risks**. The Risks window displays.

! !

Click **New Risk**.  The Risks dialog box displays.

Search for and select the risk item to add to this change request.

If the required item does not exist, click **Add New Risk**.

! !

The window refreshes and the Risk window displays. *Refer to* **[Risk Register > Risks](/risk_register/risks_6_1.md)** *for details on completing the Risk window.*

Click **Save**.

### Outages

Use this function to view a CI associated with this change request.

While viewing the Details window, select Outages.

Set the *Outage Start Date* and *Outage End Date*. Then click **Save**. This outage will also display in the Outages calendar on the dashboard.

Click **Save**.

### Risk Assessments

Based on the overall score as assigned in the Risk Assessment Threshold (as configured through [Admin > Change Management > Risk Assessments](/admin_change_mngmnt/change_risks_6_1.md)), the Risk of a change will get updated automatically.

While viewing the Details window, select **Risk Assessments**. The Risk Assessments information displays (which are view only).

### Surveys

### CAB Meetings

Use this function to enter CAB meeting details.

While viewing the Details window, click **CAB Meetings**. The CAB Meetings window displays.

! !

Click **New Change CAB Meeting.**

Enter the CAB meeting details.

When all selections/entries are made, click **Add**.

### Reviews

Use this function to enter review details and upload relevant documents.

While viewing the Details window, click **Reviews**. The Reviews window displays.

! !

Click **Add Review**. The Add Review dialog box displays.

Enter a *Description*.

To upload a document, click **Upload**, then Browse for and select the document.

Click **Apply**.

Click **Add**.

! !

### Time Tracking

Primary Details

### Related Records

### Notes

### Resolution Information

### Closure Information

Edit Change Delete Change

- [About Change Management](/itsm/change_mngmnt/about_change_mngmnt_6_1.md)
- [Change Proposals](/itsm/change_mngmnt/change_proposals_6_1.md)
- [Change Requests](/itsm/change_mngmnt/changes_6_1.md)
- [Outages](/itsm/change_mngmnt/outages_6_1.md)
