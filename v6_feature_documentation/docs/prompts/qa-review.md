# Prompt: QA Review of Feature Documentation

**Purpose:** Review a generated feature doc for quality, accuracy, and completeness.
**Use when:** A PR contains new or updated feature docs that need quality review.

---

## Review Checklist

### Structure (required)
- [ ] H1 title present (feature name, not PRD title)
- [ ] Overview section present (2–4 sentences)
- [ ] Adding/Creating section present with numbered steps
- [ ] Editing/Updating section present with numbered steps
- [ ] Deleting/Removing section present with numbered steps
- [ ] Field reference table present (if the feature has configurable fields)

### Content quality
- [ ] No PRD language: "Business Requirement", "Epic", "User Story", "Acceptance Criteria"
- [ ] No filler phrases: "leveraging", "seamlessly", "powerful", "robust"
- [ ] Active voice used consistently
- [ ] Steps are atomic (one action per step)
- [ ] Field names match actual UI labels
- [ ] Navigation paths are specific (e.g., "Navigate to **ITSM > Incidents**")

### Technical accuracy
- [ ] Feature name matches the UI (not the PRD title)
- [ ] Field names are accurate and consistently cased
- [ ] No Confluence macro syntax remaining
- [ ] No `<!-- comment -->` blocks in output
- [ ] File is pure GFM (no frontmatter, no HTML)

### Metadata
- [ ] `.generation-manifest.json` exists alongside the doc
- [ ] Manifest `deliverables` array matches sections present in the doc
- [ ] File size > 200 bytes

---

## Severity Levels

- **BLOCK** — Missing required section, PRD language present, broken structure
- **WARN** — Suboptimal phrasing, passive voice, overly long section
- **INFO** — Suggestions for improvement

---

## Output Format

Report each finding as:
```
[SEVERITY] {section}: {issue description}
```

Conclude with: APPROVED, APPROVED WITH WARNINGS, or BLOCKED (with list of blocking issues).
