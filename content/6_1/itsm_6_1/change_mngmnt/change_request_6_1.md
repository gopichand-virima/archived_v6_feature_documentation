---
title: "New Change Request"
description: "Use this function to create a change request."
version: ""
module: "Itsm"
section: "Change Mngmnt"
page: "New Change Request"
breadcrumbs:
  - "Home"
  - ""
  - "Itsm"
  - "Change Mngmnt"
  - "Change Request"
  - "New Change Request"
---

# New Change Request

Use this function to create a change request.


Roles with relevant access as per role access of Change and RFC can view, add, edit, approve, reject, resolve and close a change.


From the navigation pane, select **ITSM > Change Management**. The Changes window displays.

Complete the fields according to the table below.

When all selections/entries are made, click **Add**.

## Change Request Fields

| Field | Description |

| Title | The title for the change. |

| Change State Workflow | The predefined workflow. Click the plus + sign and select a workflow. |

| Requester Details | - *Requester*. The name of the person requesting the change. Click the plus + sign and search for and select the applicable person.

- *Requester Department*. The department associated with the Requestor. Click the plus + sign and search for and select the applicable person.
- *Requestor Location*. The location associated with the Requestor.
- *Group Requester*. The group associated with the Requestor.
- *Callback Method*. The communication method to use--either *Phone* or *Email*.
- *Contact Info*. The information related to the Callback Method such as phone number or email address. |

| Record Details | For each of the following fields, click the drop-down list, and select the applicable option.

- CI Category
- CI SubCategory
- Category
- Type
- Impact Level
- Urgency
- Priority
- Risk
- Stage
- State
- Error Code

For each of these fields, click the plus + sign and search for and select the applicable information.

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

| Related Records | Select the records to associate with this change request. Click the plus + sign next to the applicable category. |

| Notes | Details for this change such as Change Plan, Back Out Plan, Test Plan, Approval Notes, and Scope. Enter the applicable text and/or upload the text from a different file. |

| Resolution Information | Details on how the change was resolved or closed. |

| Closure Information | Details related to the closure of the change. Select a *Closure Code* and enter any relevant details. |


The workflow choices are configured through [Admin > Change Management > Change State Workflow](/admin_change_mngmnt/change_state_workflow_6_1.md).


When selecting a record, an option may be shown to Add that item. For example, when Associate Problem is selected, the dialog box includes an option to **Add Problem**.


[Overview of Change Management](/itsm/change_mngmnt/overview_change_mngmnt_6_1.md)
