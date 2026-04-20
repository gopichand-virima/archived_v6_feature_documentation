# Correlation

This function finds the applications and devices on the network, then updates the CMDB with the information it finds. In order to avoid duplicate issues, unique properties must be configured for each blueprint. A single copy of every host is kept, even after multiple scans.

New Blueprint Co-relator

In the main window, clickAdmin>Discovery** > Correlation**. The Correlation window displays.

Click **Add Blueprint Co-relator**. A new row is added to the bottom of the list that allows you to add a rule.

In the *Select Blueprint* field, click the drop-down list, and choose the applicable Blueprint.

Only one blueprint can be selected. If an existing blueprint is chosen from the list, an alert displays. Return to the list and select an unused blueprint.

Click **Add Rule**. The Add Rule dialog box displays.

Click the drop-down list and select the *Property*.

To add additional properties, click the **plus** icon, and select the additional property or properties.

To delete a selected property, click the **red x** icon.

To delete a selected property, click the **-** (minus) icon.

To remove all the property selections, click **Clear**.

When all selections or deletions are made, click **Done**. The selected properties are moved to the blueprint.

Add Rule to an Existing Blueprint

Use this function to add a rule to a blueprint.

In the Correlation window, locate an existing blueprint.

Click the **pencil** icon.

In the Add Rule dialog box, make the applicable changes.

Click **Done**.

Delete Rule from an Existing Blueprint

Use this function to delete a rule from a blueprint.

If a rule is deleted. the blueprint reverts to the default. For example, if a server is deleted, the default is the IP address.

In the Correlation window, locate an existing blueprint.

Click the **Delete** icon. The rule is removed.

There is no confirmation window. Therefore, ensure this rule should be deleted before clicking the icon as you cannot undo a removal.
