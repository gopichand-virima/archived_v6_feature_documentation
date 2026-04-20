# Pipeline Governance Sync — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the GREEN gate to always create branch+PR (never commit directly to main), and correct all stale governance artifacts across both repos to reflect the actual current pipeline state.

**Architecture:** Single-step replacement of the two-path commit logic in `generate-v6feature-docs.yml` with a unified branch+PR step. Parallel governance updates to 5 files containing stale assumptions. Memory version bump after all changes.

**Tech Stack:** GitHub Actions YAML, Bash, pnpm, TypeScript, GFM Markdown

---

## Context: Confirmed stale items to fix

| File | What is stale |
|------|--------------|
| `.github/workflows/generate-v6feature-docs.yml` | GREEN gate commits directly to `main` — must become branch+PR |
| `.claude/commands/repo-auditor.md:262,277` | References ECR/Kubernetes as production deployment |
| `.claude/commands/repo-maintainer.md:19` | References `/v6_feature_documentation/` as base path |
| `.claude/commands/update-skill.md:101` | Correct grep pattern but stale description text |
| `CLAUDE.md:320` | "Generates docs → commits to `main` → triggers deploy" |
| `CLAUDE.md:336-337` | ECR/EKS retirement note — still mentions it as if recent news |
| `CLAUDE.md:345` | "prevents bad generations from auto-merging to main" — stale model |
| `docs/memory/repo-memory.json:467,469` | `gate_green: "auto-merge allowed"` — no longer true |

---

## Task 1: Fix GREEN gate — unified branch+PR step

**Files:**
- Modify: `.github/workflows/generate-v6feature-docs.yml`

### Step 1: Confirm the stale step exists

```bash
grep -n "GREEN: Commit to main\|commit_green\|push.*main" \
  .github/workflows/generate-v6feature-docs.yml
```
Expected: lines referencing `"GREEN: Commit to main"`, `id: commit_green`, `git push ... main`

### Step 2: Read the full commit section to understand exact line range

```bash
grep -n "GREEN: Commit\|AMBER/RED\|commit_green\|commit_review\|commit_pr\|Post job summary" \
  .github/workflows/generate-v6feature-docs.yml
```

Note the line numbers for: start of GREEN step, start of AMBER/RED step, start of Post job summary step.

### Step 3: Replace the two commit steps with one unified step

Remove the entire `"GREEN: Commit to main"` step block and replace the `"AMBER/RED: Create branch + PR"` step `if:` condition and content with the unified version below.

**Remove** this block entirely:
```yaml
      # ── GREEN: Commit directly to main ───────────────────────────────────────
      - name: "GREEN: Commit to main"
        if: steps.gate.outputs.result == 'GREEN' && steps.generate.outputs.has_generated == 'true'
        id: commit_green
        env:
          GITHUB_TOKEN: ${{ github.token }}
        run: |
          set -euo pipefail
          SOURCE_SHA="${{ steps.evt.outputs.source_commit }}"
          SHORT_SHA="${SOURCE_SHA:0:8}"
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/pages/content/
          if git diff --cached --quiet; then
            echo "No changes to commit"
            echo "committed=false" >> "$GITHUB_OUTPUT"
            exit 0
          fi
          git commit -m "docs(v6): auto-generate feature docs from PRD updates ($SHORT_SHA)"
          git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${{ github.repository }}.git" main
          echo "committed=true" >> "$GITHUB_OUTPUT"
          echo "target=main" >> "$GITHUB_OUTPUT"
```

**Replace** the entire `"AMBER/RED: Create branch + PR"` step with:
```yaml
      # ── All gates: Create branch + PR ───────────────────────────────────────
      # Enterprise policy: every gate creates a branch + PR. No direct-to-main.
      # GREEN = safe to merge; AMBER = review required; RED = blocking (fails workflow).
      - name: "Create branch + PR"
        if: steps.generate.outputs.has_generated == 'true'
        id: commit_pr
        env:
          GITHUB_TOKEN: ${{ github.token }}
          GH_TOKEN: ${{ github.token }}
        run: |
          set -euo pipefail
          SOURCE_SHA="${{ steps.evt.outputs.source_commit }}"
          SHORT_SHA="${SOURCE_SHA:0:8}"
          GATE="${{ steps.gate.outputs.result }}"
          TIMESTAMP=$(date +%d%m%Y-%H%M%S)
          BRANCH="autofeature-featuredocs-6_1-${TIMESTAMP}"
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git checkout -b "$BRANCH"
          git add src/pages/content/
          if git diff --cached --quiet; then
            echo "No changes to commit"
            echo "committed=false" >> "$GITHUB_OUTPUT"
            exit 0
          fi
          git commit -m "docs(v6): auto-generate feature docs ($SHORT_SHA) [${GATE}]"
          git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${{ github.repository }}.git" "$BRANCH"

          case "$GATE" in
            GREEN) PR_TITLE="docs(v6): ✅ [GREEN] auto-generated docs ready to merge ($SHORT_SHA)" ;;
            AMBER) PR_TITLE="docs(v6): ⚠️ [AMBER] review required — auto-generated docs ($SHORT_SHA)" ;;
            RED)   PR_TITLE="docs(v6): 🔴 [RED] blocking issues — auto-generated docs ($SHORT_SHA)" ;;
            *)     PR_TITLE="docs(v6): auto-generated docs ($SHORT_SHA) [${GATE}]" ;;
          esac

          case "$GATE" in
            GREEN) GATE_NOTE="✅ **All validation checks passed.** Safe to review and merge." ;;
            AMBER) GATE_NOTE="⚠️ **Warnings detected.** Reviewer judgment required before merging." ;;
            RED)   GATE_NOTE="🔴 **Blocking issues detected.** Fix required before merge. Workflow has failed." ;;
            *)     GATE_NOTE="Gate result: ${GATE}" ;;
          esac

          gh pr create \
            --title "$PR_TITLE" \
            --body "## Validation Gate: **${GATE}**

          ${GATE_NOTE}

          **Source commit**: \`${SHORT_SHA}\`
          **Pipeline run**: [View](${PIPELINE_URL})
          **Branch**: \`${BRANCH}\`

          ### Review steps

          1. Download the **\`validation-report-${{ github.run_id }}\`** artifact from the pipeline run link above.
          2. Review the generated docs in this branch.
          3. **GREEN**: verify content looks correct, then merge.
          4. **AMBER**: review warnings — merge when satisfied.
          5. **RED**: fix blocking issues before merging." \
            --base main \
            --head "$BRANCH" || echo "::warning::PR creation failed — branch pushed, create PR manually"

          echo "committed=true" >> "$GITHUB_OUTPUT"
          echo "target=$BRANCH" >> "$GITHUB_OUTPUT"

          # RED must explicitly fail the workflow after PR creation.
          if [[ "$GATE" == "RED" ]]; then
            echo "::error::Validation gate RED — workflow failed. Review PR created on branch $BRANCH."
            exit 1
          fi
```

### Step 4: Update the Post job summary step

Find the gate badge lines and update GREEN:

**Find:**
```bash
grep -n "GATE_BADGE\|GREEN_TARGET\|REVIEW_TARGET\|commit_green\|commit_review" \
  .github/workflows/generate-v6feature-docs.yml
```

**Replace** the badge and target references:

Old GREEN badge:
```bash
GREEN) GATE_BADGE="🟢 **GREEN** — passed all checks, committed to main" ;;
```
New:
```bash
GREEN) GATE_BADGE="🟢 **GREEN** — passed all checks, branch + PR created (safe to merge)" ;;
```

Old target logic (two variables):
```bash
GREEN_TARGET="${{ steps.commit_green.outputs.target }}"
REVIEW_TARGET="${{ steps.commit_review.outputs.target }}"
if [[ "$GREEN_TARGET" == "main" ]]; then
  ...
```
New (single variable):
```bash
PR_TARGET="${{ steps.commit_pr.outputs.target }}"
PR_COMMITTED="${{ steps.commit_pr.outputs.committed }}"
```
Update all downstream references from `commit_green`/`commit_review` → `commit_pr`.

### Step 5: Verify no remaining references to commit_green or commit_review

```bash
grep -n "commit_green\|commit_review\|Commit to main\|push.*main" \
  .github/workflows/generate-v6feature-docs.yml
```
Expected: zero matches (only `commit_pr` references remain).

### Step 6: Commit

```bash
git add .github/workflows/generate-v6feature-docs.yml
git commit -m "fix(workflow): GREEN gate now creates branch+PR — no direct-to-main

Enterprise policy: all gates (GREEN/AMBER/RED) create a branch + PR.
GREEN = ✅ safe to merge; AMBER = ⚠️ review; RED = 🔴 blocking.
Unified commit_pr step replaces separate commit_green + commit_review steps.
Branch naming: autofeature-featuredocs-6_1-DDMMYYYY-HHMMSS"
```

---

## Task 2: Fix repo-auditor.md — remove ECR/Kubernetes deployment references

**Files:**
- Modify: `.claude/commands/repo-auditor.md`

### Step 1: Confirm stale content

```bash
grep -n "ECR\|Kubernetes\|ci-cd\.yml" .claude/commands/repo-auditor.md
```
Expected: lines 262 and 277 referencing ECR/Kubernetes as production.

### Step 2: Read surrounding context

Read lines 255–285 of `.claude/commands/repo-auditor.md` to understand full context.

### Step 3: Replace stale deployment check

Line 262 — change from:
```
Verify `ci-cd.yml` pushes to AWS ECR and creates a PR in `faas-apps` repo (Helm/Kubernetes deployment). This is the production deployment path — NOT GitHub Pages. Flag if any workflow implies GitHub Pages as the deployment target.
```
To:
```
Verify `deploy-pages.yml` deploys to GitHub Pages via `actions/deploy-pages@v4`. This is the sole production deployment path. Flag if any workflow references ECR, Kubernetes, or `ci-cd.yml` as active production paths (these were retired).
```

Line 277 — change from:
```
| Deployment model | ECR/Kubernetes mentioned (not GitHub Pages) |
```
To:
```
| Deployment model | GitHub Pages via deploy-pages.yml (ECR/Kubernetes retired) |
```

### Step 4: Commit

```bash
git add .claude/commands/repo-auditor.md
git commit -m "fix(commands): update repo-auditor deployment check — GitHub Pages not ECR/K8s"
```

---

## Task 3: Fix repo-maintainer.md — update base path reference

**Files:**
- Modify: `.claude/commands/repo-maintainer.md`

### Step 1: Confirm stale content

```bash
grep -n "v6_feature_documentation.*base\|base.*path\|/v6_feature_documentation/" \
  .claude/commands/repo-maintainer.md
```
Expected: line 19 referencing `/v6_feature_documentation/` as the base path.

### Step 2: Read surrounding context

Read lines 15–25 of `.claude/commands/repo-maintainer.md`.

### Step 3: Update base path reference

Change from:
```
- `repo_contracts` — pnpm, TypeScript-only, dist/ output, /v6_feature_documentation/ base path
```
To:
```
- `repo_contracts` — pnpm, TypeScript-only, dist/ output, base: './' (relative, GitHub Pages root-served)
```

### Step 4: Commit

```bash
git add .claude/commands/repo-maintainer.md
git commit -m "fix(commands): update repo-maintainer base path reference — ./ not /v6_feature_documentation/"
```

---

## Task 4: Fix CLAUDE.md — three stale lines

**Files:**
- Modify: `CLAUDE.md`

### Step 1: Confirm all three stale lines

```bash
grep -n "commits to.*main\|auto-merging to main\|ECR/EKS retirement" CLAUDE.md
```
Expected: lines 320, 337 (or nearby), 345.

### Step 2: Fix line 320 — trigger table row

Change from:
```
| PRD change in `v6_prds` | `generate-v6feature-docs.yml` | Generates docs → commits to `main` → triggers deploy |
```
To:
```
| PRD change in `v6_prds` | `generate-v6feature-docs.yml` | Generates docs → creates branch + PR → deploy triggers after merge |
```

### Step 3: Fix ECR/EKS retirement section

Change from (lines ~336–337):
```markdown
### ECR/EKS retirement
The `ci-cd.yml` workflow (Docker → ECR → Kubernetes) has been removed. GitHub Pages is the sole production deployment target.
```
To:
```markdown
### Deployment history
The previous `ci-cd.yml` workflow (Docker → ECR → Kubernetes) was retired. GitHub Pages via `deploy-pages.yml` is the sole production deployment target.
```

### Step 4: Fix line 345 — validation gate rollback note

Change from:
```
The pipeline validation gate (GREEN/AMBER/RED) prevents bad generations from auto-merging to main.
```
To:
```
The pipeline validation gate (GREEN/AMBER/RED) gates all generated content behind branch + PR review before reaching main.
```

### Step 5: Commit

```bash
git add CLAUDE.md
git commit -m "fix(docs): update CLAUDE.md — GREEN gate is branch+PR, retire ECR/K8s note"
```

---

## Task 5: Fix repo-memory.json — gate_green and gate_amber entries

**Files:**
- Modify: `docs/memory/repo-memory.json`

### Step 1: Confirm stale entries

```bash
grep -n "gate_green\|gate_amber\|auto-merge" docs/memory/repo-memory.json
```
Expected: `gate_green: "All checks pass — auto-merge allowed"`, similar for gate_amber.

### Step 2: Read surrounding context

Read the section containing `gate_green`, `gate_amber`, `gate_red` in `docs/memory/repo-memory.json`.

### Step 3: Update gate behaviour entries

Change:
```json
"gate_green": "All checks pass — auto-merge allowed",
```
To:
```json
"gate_green": "All checks pass — branch + PR created, labelled safe to merge (human merges)",
```

Change any `gate_amber` entry that implies auto-merge to:
```json
"gate_amber": "Low-risk warnings — branch + PR created, reviewer judgment required before merge",
```

### Step 4: Add sender_workflow entry if missing

If no entry for `trigger-v6feature-docs.yml` exists in the `generation_pipeline` section, add:
```json
"sender_workflow": "v6_prds/.github/workflows/trigger-v6feature-docs.yml — detects changed PRDs on merge to main, fires repository_dispatch to v6_feature_documentation",
```

### Step 5: Bump memory version

```bash
pnpm memory:update
```
Expected output: `memory_version: 1.1.9 → 1.1.10` (or current+1).

### Step 6: Commit

```bash
git add docs/memory/repo-memory.json
git commit -m "fix(memory): update gate_green/amber to branch+PR model, document sender workflow (v1.1.10)"
```

---

## Task 6: Update v6_prds trigger-v6feature-docs.yml workflow_dispatch description

**Files:**
- Modify: `C:/github/v6_prds/.github/workflows/trigger-v6feature-docs.yml`

### Step 1: Confirm current description

```bash
grep -n "process_all_prds\|description\|Process ALL" \
  "C:/github/v6_prds/.github/workflows/trigger-v6feature-docs.yml"
```

### Step 2: Update description to match 💡 tip format

Change from:
```yaml
      process_all_prds:
        description: 'Process ALL valid PRDs (use for initial bootstrap or re-runs)'
```
To:
```yaml
      process_all_prds:
        description: |
          🔄 Process ALL PRDs
          💡 Use for first-time setup or after doc template changes. Leave unticked for normal runs — only PRDs changed in this merge will be processed.
```

### Step 3: Commit to v6_prds

```bash
cd C:/github/v6_prds
git add .github/workflows/trigger-v6feature-docs.yml
git commit -m "chore(workflow): align workflow_dispatch description with 💡 tip format

Consistent with generate-v6feature-docs.yml format standardised in v6_feature_documentation."
git push origin main
```

---

## Task 7: Final validation

### Step 1: TypeScript check

```bash
cd C:/github/v6_feature_documentation
pnpm typecheck
```
Expected: no errors.

### Step 2: Full validation suite

```bash
pnpm validate
```
Expected: all checks pass (path contract, security, setup).

### Step 3: Build

```bash
pnpm build
```
Expected: `✓ built in ~30s` with no errors.

### Step 4: Memory drift check

```bash
pnpm memory:check
```
Expected: exit 0 (GREEN — no drift).

### Step 5: Push all commits

```bash
git push origin main
```

### Step 6: Verify pipeline runs

Navigate to:
`https://github.com/virima-products/v6_feature_documentation/actions`

Confirm `Deploy to GitHub Pages` workflow triggered and passes.

---

## What is intentionally NOT changed

| File | Reason |
|------|--------|
| `scripts/generate-feature-doc.ts` | No changes without explicit human review |
| `scripts/validate-generation.ts` | No changes without explicit human review |
| `scripts/sync-toc-from-index.ts` | Already correct — derived artifact generation |
| `src/lib/content/` | Runtime content loading — untouched |
| `src/lib/imports/` | Static MDX import maps — untouched |
| `trigger-v6feature-docs.yml` logic | Already correct — only description updated |
| `.claude/commands/update-skill.md` lines 72, 130 | Grep patterns are correct (ECR/EKS as patterns to look for) |
| `.claude/commands/memory-maintainer.md:78` | Not stale — describes correct JSON editing procedure |
| `v6_prds/CLAUDE.md` | Already updated in previous session |
