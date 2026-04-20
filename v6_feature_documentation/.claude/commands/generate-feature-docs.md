# /generate-feature-docs → /add-doc-page

> **Note:** This command has been renamed. Use `/add-doc-page` for adding new documentation pages.
> The old PRD-to-doc generation pipeline has been retired. Content is now manually curated.

---

# /add-doc-page

Add a new documentation page to the site.

## Purpose

Create a new `.md` content file and register it in the master TOC so it appears in navigation.

---

## Steps

1. **Create the content file**
   - Path: `src/pages/content/6_1/{module}/{section}/{page-slug}.md`
   - Format: GFM markdown, no frontmatter
   - Must include: Overview, Add, Edit, Delete sections (for feature docs)
   - Headings: sentence case

2. **Register in the master TOC**
   - Open `src/pages/content/6_1/index.md`
   - Add a line under the correct `### Section` heading:
     ```
     - Page Title → /content/6_1/{module}/{section}/{page-slug}.md
     ```

3. **Sync navigation**
   ```bash
   pnpm sync-toc
   ```
   Regenerates `src/data/navigationData.ts` and `src/utils/indexContentMap.ts`.

4. **Validate and build**
   ```bash
   pnpm validate
   pnpm build
   ```

5. **Verify the TOC structure**
   ```bash
   pnpm check:toc
   ```

---

## Path convention

```
src/pages/content/6_1/{module_dir}/{feature_dir}/{feature-slug}.md
```

Example:
- Module dir: `admin_6_1`
- Feature dir: `admin_users`
- File: `user-management-guide.md`
- TOC entry: `- User Management Guide → /content/6_1/admin_6_1/admin_users/user-management-guide.md`

---

## Success Criteria

- File exists at the correct path
- Master TOC (`index.md`) has the new entry
- `pnpm sync-toc` runs cleanly (no warnings about missing modules)
- `pnpm check:toc` exits 0 (all TOC paths resolve to files)
- `pnpm validate` passes
- `pnpm build` completes without errors
- New page appears in sidebar navigation
