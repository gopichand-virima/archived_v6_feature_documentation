# Prompt: Structure Normalization

**Purpose:** Normalize a feature doc's structure to match the standard template.
**Use when:** A generated doc has wrong section order, missing sections, or non-standard headings.

---

## Standard Structure (canonical order)

```markdown
# {Feature Name}

## Overview

## Key capabilities

## Adding {feature}

## Editing {feature}

## Deleting {feature}

## Field reference

## Related features
```

---

## Instructions

Given a feature doc that deviates from the standard structure:

1. **Identify missing sections** and add placeholder content if absent
2. **Reorder sections** to match canonical order above
3. **Normalize heading levels** — H1 for title, H2 for main sections, H3 for sub-steps only
4. **Rename non-standard headings** to match the canonical names:
   - "Create {feature}" → "Adding {feature}"
   - "Update {feature}" / "Modify {feature}" → "Editing {feature}"
   - "Remove {feature}" → "Deleting {feature}"
   - "Fields" / "Attributes" → "Field reference"
5. **Do not change content** — only structure and heading names

---

## Output
Return the full normalized document with the same content but corrected structure.
