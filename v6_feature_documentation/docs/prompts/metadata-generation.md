# Prompt: Metadata / Manifest Generation

**Purpose:** Generate or update a `.generation-manifest.json` file for a feature doc.
**Use when:** A feature doc was created or updated and needs a fresh manifest.

---

## Manifest Schema

```json
{
  "sourceFile": "relative/path/from/v6_prds/root/to/prd.md",
  "generatedAt": "2026-03-29T00:00:00.000Z",
  "model": "claude-sonnet-4-20250514",
  "contentHash": "sha256-...",
  "deliverables": ["overview", "add", "edit", "delete"],
  "version": "1.0",
  "featureSlug": "incident_management",
  "module": "itsm"
}
```

---

## Instructions

Given:
- The source PRD file path
- The generated feature doc content

Generate a manifest JSON with:
1. `sourceFile` — relative path from v6_prds root to the PRD
2. `generatedAt` — current ISO-8601 timestamp
3. `model` — the Claude model ID used for generation
4. `contentHash` — SHA-256 of the generated doc content (hex string, prefixed with "sha256-")
5. `deliverables` — list of sections present: add `"overview"` if Overview section exists, `"add"` if Adding section exists, etc.
6. `featureSlug` — the folder/file name slug (e.g., `incident_management`)
7. `module` — the parent module slug (e.g., `itsm`, `itam`, `admin`)

---

## Output
A valid JSON file saved as `{feature_slug}.generation-manifest.json` alongside the generated `.md` file.
