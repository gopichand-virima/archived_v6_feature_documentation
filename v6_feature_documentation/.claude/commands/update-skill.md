---
name: update-skill
description: Audit and update stale Claude commands, hooks, and prompts to match current repo architecture and governance
---

# /update-skill — Skill & Command Maintainer

**Invoke with:** `/update-skill`

**Purpose:** Keep all Claude operating assets — slash commands, hooks, and prompts — aligned with the current repo architecture, deployment model, and governance contracts. Run this after any session that changes architecture, CI/CD, base paths, pipelines, or security contracts.

**When to invoke:**
- After architecture changes (base path, build output, deployment model)
- After CI/CD workflow changes (added, removed, or renamed workflows)
- After pipeline changes (new pipeline stages, new validation gates)
- After navigation/publishing contract changes
- After security model changes
- After memory schema changes that affect what Claude should know
- When `/repo-auditor` flags command files as stale
- When a command references a file, path, or command that no longer exists

**Do NOT invoke for:**
- Routine feature work (adding new content, styling changes)
- Memory-only drift (use `/update-memory` instead)
- Changes that only affect generated files (`src/data/`, `src/pages/content/`)

---

## Step 1 — Load the current architecture contract

Read the canonical memory before inspecting any command files. This is your ground truth for what is correct:

```bash
pnpm memory:update --section repo_contracts
pnpm memory:update --section ci_cd_contracts
pnpm memory:update --section generation_pipeline
pnpm memory:update --section validation_gates
```

Key contract facts that commands commonly reference:
- `repo_contracts.base_path` — Vite base path (must be `/v6_feature_documentation/`)
- `repo_contracts.build_output_dir` — must be `dist/` not `build/`
- `repo_contracts.package_manager` — always `pnpm`
- `ci_cd_contracts.ci_workflow` — `.github/workflows/ci.yml`
- `ci_cd_contracts.deploy_workflow` — `.github/workflows/deploy-pages.yml`
- `ci_cd_contracts.deploy_target` — GitHub Pages URL
- `generation_pipeline` — pipeline stage order and script names

---

## Step 2 — Inventory all Claude operating assets

List all command files and settings:

```bash
ls -la /c/github/v6_feature_documentation/.claude/commands/
cat /c/github/v6_feature_documentation/.claude/settings.json
```

For each command file, note its **stated purpose** and **key facts it references** (paths, commands, base URLs, workflow names).

---

## Step 3 — Check each command file for staleness

Read each `.claude/commands/*.md` file and check for:

### 3a. Stale path references
Search for outdated base paths, route patterns, or file locations:

```bash
grep -rn "FeatureDocsite\|ci-cd\.yml\|ECR\|EKS\|Kubernetes\|kubernetes\|aws ecr\|aws eks" /c/github/v6_feature_documentation/.claude/commands/
```

Any match is a stale reference — update it.

### 3b. Stale command references
Check that every `pnpm <command>` referenced in commands still exists in `package.json`:

```bash
grep -n '"scripts"' /c/github/v6_feature_documentation/package.json
# Then compare against commands that reference pnpm scripts
```

### 3c. Stale file path references
Check that every file path mentioned in commands actually exists:

```bash
# Example: check workflow file references
grep -rn "workflows/" /c/github/v6_feature_documentation/.claude/commands/ | grep "\.yml"
# Verify each mentioned workflow file exists
ls /c/github/v6_feature_documentation/.github/workflows/
```

### 3d. Stale contract values
Check that values stated in commands match the current repo_contracts in memory:

Key checks:
- Any command saying "base path is `/FeatureDocsite/`" → update to `/v6_feature_documentation/`
- Any command referencing `ci-cd.yml` → update to `ci.yml` + `deploy-pages.yml`
- Any command referencing Docker/ECR deployment as production → update to GitHub Pages
- Any command referencing `build/` output → update to `dist/`

---

## Step 4 — Check hooks for staleness

Read `.claude/settings.json` and verify each hook:

```bash
cat /c/github/v6_feature_documentation/.claude/settings.json
```

**PreToolUse hooks to verify:**
- `Bash` hook: blocks `npm`, `yarn`, `npx` — should still be present and active
- `Edit|Write|MultiEdit` hook 1: warns on `src/pages/content/` edits — should still be present
- `Edit|Write|MultiEdit` hook 2: warns on `/v6_1/` legacy path usage — should use `/v6_1/` (correct, no `v` prefix is the contract)

**Stop hook to verify:**
- Reminds to run `pnpm memory:check`, `pnpm validate`, `pnpm build`
- Should mention the current memory commands

If a hook references a stale command, script, or path — update it.

---

## Step 5 — Check the CLAUDE.md for stale command references

```bash
grep -n "base.*path\|ci-cd\|ECR\|EKS\|Kubernetes\|/FeatureDocsite" /c/github/v6_feature_documentation/CLAUDE.md
```

`CLAUDE.md` should not contain specific deployment implementation details (those live in memory). But it must not contain actively wrong facts either.

---

## Step 6 — Update stale content

For each stale item found:

1. Edit the command file directly — change only the stale value
2. Do NOT restructure a command just because something is stale — minimal targeted edits only
3. Do NOT add new content unless a real gap exists
4. Do NOT delete commands — only update them

**What counts as a real gap (add, don't just update):**
- A new validation gate that commands should reference but don't
- A new workflow that deployment commands don't mention
- A new anti-pattern that session commands should enforce

---

## Step 7 — Verify no duplicates exist

After updates, scan for duplicate commands that cover the same purpose:

```bash
ls /c/github/v6_feature_documentation/.claude/commands/
```

If two commands cover the same use case with different names:
- Keep the more specific/accurate one
- Update the other to be a clear pointer/alias
- Never silently delete a command — always leave a forwarding note or alias

**Known intentional overlaps (these are correct, not duplicates):**
- `/update-memory` + `/sync-repo-memory` — `/update-memory` is the user-facing entry point; `/sync-repo-memory` has the full detail
- `/update-memory` + `/memory-maintainer` — different depths (patch vs. structural)

---

## Step 8 — Validate and commit

```bash
pnpm validate
pnpm build
```

Both must pass. Then commit:

```bash
git add .claude/commands/ .claude/settings.json CLAUDE.md
git commit -m "chore(skills): update stale command references — <brief description>"
```

---

## Escalation: when command changes require memory updates too

If during this review you discover that the commands were stale because memory itself was wrong, run `/update-memory` first, then re-run this command. Memory is the ground truth — commands must match memory, not the other way around.

---

## Quick staleness checklist

| Check | Correct value |
|-------|--------------|
| Base path in commands | `/v6_feature_documentation/` |
| Build output dir | `dist/` |
| CI workflow | `ci.yml` (validate + build) |
| Deploy workflow | `deploy-pages.yml` (GitHub Pages) |
| Production deployment | GitHub Pages — `https://virima-products.github.io/v6_feature_documentation/` |
| Package manager | `pnpm` — never `npm` or `yarn` |
| Memory check command | `pnpm memory:check` |
| Memory update command | `pnpm memory:update` |
| Full validation | `pnpm validate` |
| TypeScript check | `pnpm typecheck` |
| Build command | `pnpm build` |
