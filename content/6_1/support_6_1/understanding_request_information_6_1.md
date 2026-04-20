# Understanding request information

The request table is the primary interface for viewing and assessing support requests.

## Request table columns

The main columns include:

**Request Type**

- Category or classification of the request. Available options are **Ask a question**, **New feature request**, and **Technical issue**.
- Sortable: No.

**Key**

- Unique identifier for each support request, in the format NS-XXX.
- Example values: NS-571, NS-570, NS-569.
- Sortable: Yes.

**Title**

- Short subject or name for the request.
- Sortable: No.

**Description**

- Brief description or summary of the issue.
- Long text may be truncated with an ellipsis.
- Sortable: No.

**Reporter**

- Email address of the user who created the request.
- Example values: "admin_virima@demo.com".
- Sortable: No.

**Created At**

- Date and time when the request was created, in DD/MM/YYYY HH:MM:SS format.
- Example values: 12/01/2026 18:52:20, 02/01/2026 18:25:15.
- Sortable: Yes.

**Severity**

- Priority level indicating business impact or urgency.
- Example values: **Low**, **Medium**, **High**, and **Blocker**.
- Sortable: No.

**Status**

- Current workflow state of the request.
- Example values: **Open**, **Triage**, **New Requirement**, **In Progress**, **Pending**, **Done**, **Reopened**, and **Duplicate**.
- Sortable: No.

**Notes**

- Long titles, descriptions, and email addresses may be truncated with an ellipsis (…) to maintain readability.
- Hovering over a value or opening the request (depending on UI behavior) may reveal full text.
- You can drag the column borders within the table to increase or decrease the column size.
- Sort indicators (up/down arrows) display on sortable columns such as **Key**, and **Created At**.

## Understanding request status

Status values describe where a request is in its lifecycle:

- **Open** – The request has been created and is awaiting initial action or assignment.
- **Triage** – The request is under initial review and analysis to determine its priority, assignment, and appropriate solution approach.
- **New Requirement** – Ticket represents a new feature or enhancement request.
- **In Progress** – Active work has started on the request.
- **Pending** – The request is on hold, waiting for information, approval, or another dependency.
- **Done** – The request work is complete and all deliverables have been finalized.
- **Reopened** – The request was previously closed but has been reopened due to new information or unresolved issues.
- **Duplicate** – Ticket is a duplicate of another existing ticket.

## Understanding severity levels

Severity values indicate business impact and priority:

- **Blocker** – Critical issue that blocks functionality.
- **High** – Significant issue requiring prompt attention.
- **Medium** – Moderate issue that should be addressed in due course.
- **Low** – Minor issue with lower priority.

## Understanding request types

Request Type values categorize the nature of the support request:

- **Ask a question** – A question or inquiry that requires information or clarification.
- **New feature request** – A request for a new feature or functionality to be added to the system.
- **Technical issue** – A report of a technical problem, bug, or issue that needs to be resolved.

## Date and time format

Request creation timestamps use the format **DD/MM/YYYY HH:MM:SS**.

Example: **02/01/2026 18:25:15** means:

- Date: 2 January 2026.
- Time: 6:25:15 PM.
