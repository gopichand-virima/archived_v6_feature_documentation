---
title: "Projects"
description: "Use this function to create a project, which is the first step in Project Management process. A project can be created manually (by selecting a project template) or importing a project file."
version: ""
module: "Prog Proj Mngmnt"
section: "Projects"
page: "Projects"
breadcrumbs:
  - "Home"
  - ""
  - "Prog Proj Mngmnt"
  - "Projects"
  - "Projects"
---

# Projects

Use this function to create a project, which is the first step in Project Management process. A project can be created manually (by selecting a project template) or importing a project file.


To create/edit projects, users must have appropriate role access.


In the navigation pane, select **Program and Project Management > Projects**. The Projects window displays.

New Project

From the *Select Actions* drop-down list, choose **New Project**. The Add Project dialog box displays

Enter a *Project Name* and the *Duration* for the project in Days.

In the *Template* field, click the drop-down list and select the applicable template.

When all selections/entries are made, click **Add**. A window opens containing the selected Project Template. When created, the ID (assigned by the system) and the *Name* entered are displayed. Also, as this is an existing template, some field information may be populated, such as dates.

Complete the fields, referring to the table below.

When all selections/entries are made, click **Save**.

### Project Template Fields

| Field | Description |

| Description | Description of the project. |

| Planned Start Date | Defaults to the date the project was created; however, it can be changed to a past/future date. |

| Planned End Date | Specifies the date when the last phase is to be completed. The date can be changed to a past/future date. |

| Baseline Planned

Start Date | Defaults to the date the project was created; however, it can be changed to a past/future date. |

| Baseline Planned

End Date | Defaults to the date based on the duration set in the project template; however, it can be changed to a past/future date. |

| Actual Start Date | *This field is not editable.* It is set to the date and time when the project status is changed to Active. |

| Actual End Date | *This field is not editable.* It is set to the date and time when the project status is changed to Complete. |

| Status | Indicates the current stage of the project. A project status can be interchanged at any point of time before it is set to Completed. The statuses are:
**Not Started**: It is the default stage of the project.
**Active**: When status is set to active, the actual start date is set and the first phase of the project is be changed to Active automatically.
**Suspended**: Selected when we need to suspend the project due to certain reasons.

**Completed**: This is the final stage of the project. A project is set to be complete when all its phases and tasks are completed. Note: A notification email is sent to the project manager(s) associated with the project for every status change. |

| Project Manager | Role of the User responsible for the project. Click **Add** then search for and select the applicable user. Only one user can be assigned as Project Manager. |

| Cost Center | Cost center for this project. Used for accounting purposes. |

| Percentage Complete | Numeric value for the percent of the project that's complete. |

| Duration | Number of days that the project will take. |

| Billing Code | Code to assign to this project. Used for accounting purposes. |

| Associated CI's | CI's associated with the project. Click **Add** then search for and select the relevant CIs. |

| Created on | The date on which the project was created. Either type the date or select if from the calendar. |

| Programs | An associated program, if any. |


Suspending any of the phases (be it a hard gate or soft phase, even if its associated tasks are not started) will set the project state to suspend. A project can also be suspended, even if it's associated phases (hard or soft gates) are not active/completed.


Phases and Tasks

While viewing the Details window, click the **Phases** Tab.

To add a new **Phase**, from the Select Actions drop-down list, choose **Add Phase**. [Refer to Project Template: Phase Information Fields.](/admin_project_mngmnt/project_template_6_1.md#PhaseInfoFields)

To add a new **Task**, move to a line item containing the applicable phase, and click the **plus + sign**. [Refer to Project Template: Task Information Fields.](/admin_project_mngmnt/project_template_6_1.md#TaskInfoFields)

When all selections/entries are made, click **Save**.

Project Gantt Chart

Use this option to display a visual representation of a project timeline that shows start and end dates of phases and tasks. Use this chart to add/delete a phase/task, change phases/task dates, and assess the progress of overall project.

To view the chart, do the following:

If not already displayed, click the **Phases** tab.

Move to the right side of the window.

Click the left-facing arrow.

A window slides open and the Project Chart is displayed. It includes the status of each phase/task.

In this window, the icons provide the following functionality:

- The **plus + sign** displays either the [Phase Information](/admin_project_mngmnt/project_template_6_1.md#PhaseInfoFields) dialog box or the [Task Information](/admin_project_mngmnt/project_template_6_1.md#TaskInfoFields) dialog box, depending on which type is selected.
- The **up and down arrows** move the task up or down in the hierarchy.
- The **trash can** deletes the task.

v6 IMAGE - NOT WORKING on 2/1

Resource Chart

Use this function to display all the users assigned to tasks along with *Start Date*, *End Date*, and *Time Spent*.

To view the chart, do the following:

If not already selected, click the **Phases** tab.

Move to the right side of the window.

Click the left-facing arrow.

Click the **Resource Chart** button.

v6 IMAGE - NOT WORKING on 2/1

The list of Assignees is displays in alphabetical order.

The blue bar corresponding to the assignee is the sum of all the tasks (Start date of the earlier task + End date of the latest task).

Import Project

In the navigation pane, select **Program and Project Management > Projects**. The Projects window displays.

From the *Select Actions* drop-down list, choose **Import Project**. The Import Project File dialog box displays

Click the **Browse** button, then search for and select the applicable project file to import.

Use **Click here to download the sample file** to view what a file should look like.

Click **Upload**.

Edit Project  
Delete Project
