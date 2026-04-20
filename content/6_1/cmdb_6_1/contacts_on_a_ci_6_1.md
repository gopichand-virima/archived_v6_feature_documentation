# Contacts on a CI

Use these cards to record who owns and supports the CI. Each card shows a profile avatar, **Name**, **Email**, and **Phone**.  
Common controls:

- **Edit** (pencil) — opens a picker to select a user or type details.
- **Remove** (×) — clears the current assignment.
- **Collapse** (–) — hides/shows the card body.

**Validation**

- Email must be a valid format (e.g., name@domain.com).
- Phone must follow standard numbering (digits, +, spaces, dashes).
- When selecting from the directory, only active users can be assigned.

**Owner**

The system assigns the logged-in user as the CI owner when adding or moving a CI record from Discovered Items to CMDB.

If the discovery process provides a user list and that user exists in the Admin → User Management directory, Virima assigns that user as the CI Owner instead of the logged-in user.

After the CI is in the CMDB, you can manually update the Owner field at any time by editing the CI record.

- **Name** – Owner's full name (can be chosen from the user directory).
- **Email / Phone** – Auto-filled from the user record; can be edited if needed.
- **Remove** – Unassigns the owner; the CI will have no owner until one is set.

**First-Level Support **(if enabled in your environment)

The help desk or primary support group for end-user issues.

- **Name / Email / Phone** – Primary contact for initial triage and ticket intake.
- Use **Edit** to assign a person or shared mailbox/account.

**Second Level Support**

The technical team that handles escalations from first level.

- **Name / Email / Phone** – Escalation contact(s) for deeper investigation.
- Assign an individual or the lead for a support group.

**Third Level Support**

Specialist/vendor team for complex or product-specific issues.

- **Name / Email / Phone** – Expert contact or vendor support liaison.
- Use for OEM, platform, or engineering escalations.

When a Service Level Agreement (SLA) is triggered for a Configuration Item (CI) in the Virima CMDB, the system automatically assigns the First-Level, Second-Level, and Third-Level Support contacts to the CI. These assignments are based on the support contacts defined in the CI's profile

# Manager

The line manager for the CI Owner or support team.

- **Name / Email / Phone** – Used for escalations that require managerial action.
- Often auto-suggested when you pick an Owner (pulls org data if available).

# How to update a contact (any card)

1. Click the **pencil** on the card.

2. In the picker, search and select a **User** **or** type **Name/Email/Phone**.

3. Click **Save**. The fields populate and the avatar syncs from the user profile.

4. To clear an assignment, click the **×** on the card.
