# V6 Feature Documentation — Emergency Rollback Runbook

> **Prefer `git revert` for all rollback scenarios.** It preserves history and is safe to run without maintainer coordination. Use `reset --hard` + `--force-with-lease` only as a last resort with explicit maintainer approval.

---

## Scenario 1: Revert the last commit on main (most common)

```bash
git checkout main
git pull origin main
git revert HEAD --no-edit
git push origin main
```

Use this when: the most recent auto-generated commit introduced bad content and GREEN gate was wrong.

---

## Scenario 2: Revert a specific commit (not the last one)

```bash
git revert <commit-sha> --no-edit
git push origin main
```

Use this when: a commit from earlier in the run history is the source of a problem and subsequent commits are clean.

---

## Scenario 3: Emergency hard reset (last resort only)

> ⚠️ **Destructive.** Requires explicit maintainer approval. Rewrites public history. Prefer Scenario 1 or 2 when possible.

```bash
git checkout main
git pull origin main
git reset --hard <last-known-good-commit>
git push origin main --force-with-lease
```

Use `--force-with-lease` (not `--force`) — it refuses if the remote has advanced since your last fetch, preventing accidental overwrite of concurrent work.

---

## Scenario 4: Recover content from an AMBER/RED auto-branch

If a review branch was created but content from it is needed on main:

```bash
# Option A: Cherry-pick specific commits
git checkout main
git cherry-pick <branch-commit-sha>
git push origin main

# Option B: Merge after fixing validation issues
git checkout <branch-name>
# Fix the validation issues, push to branch
# Then merge via PR (do not force-push to main)
```

---

## After any rollback — verify

```bash
# 1. Confirm src/pages/content/ matches expected state
git log --oneline -5

# 2. Dry-run validation (always safe — exits 0 regardless)
cd /path/to/v6_feature_documentation
npx tsx scripts/validate-generation.ts --content-dir src/pages/content --dry-run

# 3. Check manifests are consistent
find src/pages/content -name '.generation-manifest.*.json' | head -20
```

---

## Finding auto-branches for reference

```bash
# List all auto-generated branches (remote)
git branch -r | grep auto-v6feature-docs

# Compare an auto-branch against main
git diff main...<branch-name> -- src/pages/content/
```

---

## Quick reference: exit codes

| Exit code | Meaning |
|-----------|---------|
| 0 | GREEN — all checks passed |
| 1 | RED — high-risk issues |
| 2 | AMBER — low-risk issues, needs review |
