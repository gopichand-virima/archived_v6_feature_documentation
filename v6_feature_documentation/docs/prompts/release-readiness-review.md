# Prompt: Release Readiness Review

**Purpose:** Assess whether the documentation repo is ready for a production release.
**Use when:** Before deploying to GitHub Pages or after a major content update.

---

## Release Readiness Checklist

### Code quality gates
- [ ] `pnpm typecheck` exits 0 (no TypeScript errors)
- [ ] `pnpm check:security` exits 0 (no hardcoded secrets)
- [ ] `pnpm check:setup` exits 0 (repo structure complete)
- [ ] `pnpm eval` exits 0 (no RED documentation findings)
- [ ] `pnpm build` exits 0 (Vite build succeeds)

### Documentation quality
- [ ] All PRD features have corresponding generated docs
- [ ] No feature docs missing add/edit/delete sections
- [ ] No manifest files missing or corrupted
- [ ] Navigation TOC matches generated content

### Repository hygiene
- [ ] `pnpm-lock.yaml` committed and up to date
- [ ] No `package-lock.json` present
- [ ] No root-level `.js` files (converted to TypeScript)
- [ ] Git working tree is clean
- [ ] On correct branch (or main)

### Infrastructure
- [ ] GitHub Actions CI passes on the PR/commit
- [ ] No known broken links in content
- [ ] No `.mdx` files in generated output (must be `.md`)

---

## Instructions

Run the following and report results:
```bash
pnpm install
pnpm typecheck
pnpm check:security
pnpm check:setup
pnpm eval
pnpm build
git status
```

For each failing gate: describe what failed and the recommended fix.

## Verdict
Return one of:
- **READY FOR RELEASE** — all gates pass, documentation is complete
- **RELEASE BLOCKED** — one or more critical gates failed (list blocking issues)
- **RELEASE WITH CAUTION** — non-critical warnings present (list them)
