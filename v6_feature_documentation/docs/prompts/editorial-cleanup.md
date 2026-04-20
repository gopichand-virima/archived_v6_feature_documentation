# Prompt: Editorial Cleanup

**Purpose:** Rewrite auto-generated feature docs to read as human-authored product documentation.
**Use when:** Generated docs feel mechanical, repetitive, or contain AI-generated filler phrases.

---

## Instructions

Review the provided feature doc and rewrite it to:

1. **Remove filler phrases** such as:
   - "This feature allows users to..."
   - "The system provides the ability to..."
   - "Leveraging the power of..."
   - "Seamlessly integrates with..."

2. **Use active voice** throughout:
   - ❌ "Records can be deleted by clicking..."
   - ✅ "To delete a record, click..."

3. **Simplify procedures** — each step should be one action:
   - ❌ "Navigate to the module and locate the item you want to delete, then click the delete button"
   - ✅ Step 1: Navigate to [Module]. Step 2: Select the item. Step 3: Click **Delete**.

4. **Preserve all technical accuracy** — do not change field names, button labels, or navigation paths.

5. **Maintain all required sections** — Overview, Adding, Editing, Deleting, Field Reference.

6. **Keep GFM formatting** — no frontmatter, no HTML, no Confluence syntax.

---

## Do NOT change
- Field names or technical identifiers
- Navigation paths
- Table structure and column names
- Section structure (add/edit/delete coverage)
