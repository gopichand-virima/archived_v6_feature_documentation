# Reverse-Engineer Current Docsite — Blueprint Generation Prompt

**Purpose:** Run this prompt to reverse-engineer the current repository into a reusable,
enterprise-grade docsite blueprint. The outputs are written into three files under
`docs/reference/`. Run this whenever architecture, pipeline, governance, evals, or
deployment changes materially.

---

## Prompt

You are reverse-engineering this repository into a reusable, enterprise-grade docsite blueprint.

Your job is not to give a shallow repo summary.
Your job is to extract the full architecture, operating model, governance system, eval system,
and reuse blueprint of the current V6 Feature Docs website so that:

1. this repo can be understood as a complete production system,
2. a new docsite can later be built with the same technology and feature behavior,
3. Claude can use the resulting blueprint as the authoritative reference for future "new docsite" requests.

Treat this as a full architecture + operations + governance + quality-system extraction.

Write durable outputs for future reuse.

---

## Output files to produce

Write or update these files:

1. `docs/reference/current-docsite-blueprint.md`
   — full architectural and operational blueprint of the current website

2. `docs/reference/current-docsite-reference-pack.md`
   — ranked go-to files and reuse pack for building a similar site

3. `docs/reference/current-docsite-ops-evals-governance.md`
   — all operational controls, evals, gates, workflows, security, deployment, settings, and failure modes

If any of these files do not exist, create them.
If related files already exist, update them instead of duplicating content.

---

## Mission

Perform a zero-assumption extraction of the current V6 Feature Docs system.

You must identify and document:

- frontend architecture
- content architecture
- markdown/rendering pipeline
- routing/page-discovery model
- navigation/sidebar/index generation
- feature-doc generation pipeline
- manifest/index contracts
- generated artifacts and their producers
- evals and quality gates
- validation and drift checks
- memory/contracts
- prompts/hooks/skills
- workflows and trigger flows
- publish/deploy behavior
- GitHub Pages behavior and base path rules
- branch/PR governance
- security controls and open risks
- operational failure modes and recovery paths
- reusable blueprint for building a new equivalent docsite

---

## Non-negotiable analysis rules

1. Do not assume. Verify from actual code, config, workflows, generated artifacts, and repo docs.
2. Treat code/config/workflows as source of truth.
3. Treat memory/prompts/hooks/skills/docs as behavioral or governance contracts that must be
   checked against reality.
4. Distinguish clearly between:
   - source-of-truth files
   - generated files
   - operator/governance docs
   - architectural reference docs
5. If a file is generated, identify exactly which script/workflow generates it.
6. Identify stale or misleading docs/memory/prompts if they do not match current behavior.
7. Call out hidden couplings, sharp edges, and deletion/rename edge cases.
8. Keep machine-readable contract values literal; descriptions belong in separate note fields.
9. Do not simplify away enterprise behavior such as evals, branch+PR governance, drift checks,
   or deployment constraints.
10. Include both in-repo controls and required out-of-repo settings if those settings affect
    automation.

---

## Scope that must be covered

### A. Product/System Architecture
Explain the current website end to end:
- what stack it uses
- how it builds
- how the site renders content
- how routes/pages are discovered
- how content modules are organized
- how navigation and index maps are produced
- how the final site is published

### B. Content Model
Document:
- where feature docs live
- how modules are structured
- how module `index.md` files work
- how manifests work
- how generation summaries work
- how navigation depends on content/manifests/indexes
- what generated files must never be hand-edited

### C. Generation Pipeline
Document:
- upstream trigger source
- downstream generation flow
- workflow order of operations
- add/modify/delete handling
- post-processing steps
- module index rebuilding logic
- nav/index map regeneration
- manifest lifecycle
- cleanup behavior
- edge cases like:
  - add-only
  - modify-only
  - delete-only
  - add+delete same batch
  - add+delete different modules
  - zero-deliverable features
  - missing featureName or malformed frontmatter
  - stale index/nav after deletions

### D. Evals and Quality Gates
This section is mandatory and must be thorough.

Identify and document all eval and quality systems, including:
- `pnpm eval`
- eval inputs, outputs, and interpretation
- GREEN / AMBER / RED behavior
- deletion thresholds or safety thresholds
- any doc-type exemptions
- expected warnings vs blocking failures
- how evals differ from:
  - typecheck
  - validate
  - build
  - memory:check
  - drift checks
  - content checks
- what "production-safe" means in this repo
- what a passing state looks like
- known false positives / tolerated warnings
- how eval results influence PR/governance behavior

Also answer:
- Which files define the eval contract?
- Which scripts implement it?
- Which workflows consume the result?
- Which cases should be exempted vs fixed?

### E. Validation / Drift / Memory Controls
Document:
- all validation commands
- all drift checks
- all memory checks
- repo-contract checks
- what files are compared against what source of truth
- how base path, workflow behavior, or deployment settings are validated
- how drift is detected and remediated
- what belongs in memory vs what should remain in code/config/docs

### F. Governance / Branch / PR Model
Document:
- branch strategy
- child branch usage
- whether AI commits can go directly to `main`
- branch+PR workflow behavior
- naming conventions
- gate-dependent workflow behavior
- merge path and review path
- manual recovery path if automation fails
- repo settings required for automation to succeed
- any permissions required in GitHub Actions
- any settings outside the repo that are critical

Explicitly include:
- PR creation permissions for GitHub Actions
- branch protection assumptions
- what happens when the workflow can push a branch but cannot create a PR

### G. Cross-Repo Trigger Topology
Document the full trigger chain, including:
- source repo
- child branch flow
- merge to source `main`
- trigger into downstream generation workflow
- publish/deploy flow in target repo
- artifacts or outputs passed through the system
- where failures can occur across repo boundaries

### H. Deployment / Publish / Runtime
Document:
- build output path
- GitHub Pages deployment model
- required workflow files
- base path behavior
- site root assumptions
- runtime asset path behavior
- how publish success is validated
- what "published successfully" means
- known deployment failure modes
- post-deploy verification steps

### I. Security / Dependency / Sanitization / Risk
Document:
- Dependabot alerts
- code scanning findings
- runtime vs dev-only dependency risk
- markdown/rendering sanitization pipeline
- rehype/remark/sanitize dependencies
- security posture of the static site
- what open vulnerabilities matter now vs later
- which dependency classes are critical for a cloned implementation
- update strategy for security-sensitive packages

### J. Performance / UX / Accessibility / Search
Document any relevant controls or known facts for:
- bundle size
- code splitting
- search
- sidebar performance
- page-load assumptions
- markdown rendering cost
- accessibility assumptions
- broken-link prevention
- navigation integrity

If a system does not exist, say so clearly.

### K. Repo Nervous System
Inventory and explain all repo layers that shape behavior:
- `CLAUDE.md`
- `.claude/**`
- `docs/memory/**`
- prompts
- hooks
- skills
- workflow files
- plans/runbooks
- validators
- drift checks
- generation scripts
- reference docs

For each:
- path
- purpose
- source-of-truth vs pointer vs generated vs operator guidance
- how it should be kept in sync
- whether it should be consulted when building a new docsite

### L. Reuse Blueprint for a New Docsite
This must be practical and implementation-ready.

Explain how to build a new docsite with the same functionality, preserving:
- same frontend/build stack
- same content rendering approach
- same generation model
- same manifest/index design
- same navigation/index generation behavior
- same deployment pattern
- same governance pattern
- same eval/validation philosophy

Specify:
- recommended new folder structure
- required scripts
- required workflows
- required manifests/contracts
- required generated artifacts
- required memory/prompts/hooks/skills
- what to copy verbatim
- what to adapt
- what to regenerate
- what repo-specific assumptions must be removed
- what settings outside the repo must be configured

---

## Required sections in `docs/reference/current-docsite-blueprint.md`

Use this exact structure:

```
# 1. Executive Architecture Summary
# 2. Current Site Capabilities
# 3. Frontend / Build / Rendering Architecture
# 4. Content Model and Information Architecture
# 5. Generation Pipeline and Artifact Lifecycle
# 6. Navigation / Index / Manifest Architecture
# 7. Evals, Quality Gates, and Acceptance Criteria
# 8. Validation, Drift Checks, Memory Contracts, and Repo Contracts
# 9. Governance, Branching, PR Flow, and GitHub Settings Dependencies
# 10. Cross-Repo Trigger and Publish Topology
# 11. Deployment, Runtime Behavior, and GitHub Pages Model
# 12. Security, Dependency Risk, and Sanitization Model
# 13. Performance, UX, Accessibility, and Search Notes
# 14. Repo Nervous System
# 15. Ranked Go-To Files (P0 / P1 / P2)
# 16. Minimal Reference Pack
# 17. Copy vs Adapt vs Regenerate Matrix
# 18. Failure Modes, Recovery Paths, and Known Sharp Edges
# 19. Risks, Technical Debt, and Open Follow-Ups
# 20. New Docsite Blueprint
# 21. Recommended Next Step
```

---

## Required sections in `docs/reference/current-docsite-reference-pack.md`

Use this exact structure:

```
# 1. Purpose of This Reference Pack
# 2. P0 Files to Hand Claude First
# 3. P1 Files for Higher-Fidelity Reproduction
# 4. Full Nervous-System Files
# 5. Files That Must Not Be Hand-Edited
# 6. Copy vs Adapt vs Regenerate List
# 7. Repo-Specific Assumptions to Remove in a New Site
# 8. External Settings and Permissions Required
# 9. Suggested File Bundle for "Build Me a Similar Site"
# 10. Suggested File Bundle for "Audit This Site Before Cloning"
```

---

## Required sections in `docs/reference/current-docsite-ops-evals-governance.md`

Use this exact structure:

```
# 1. Operational Overview
# 2. All Validation Commands
# 3. Eval System
# 4. Drift and Memory Enforcement
# 5. Workflow and Governance Controls
# 6. Deployment Controls
# 7. Security Controls
# 8. Failure Modes and Recovery Runbooks
# 9. Manual Settings Outside the Repo
# 10. Enterprise Readiness Checklist
```

---

## Explicit extra-focus files and systems

Pay special attention to:

- `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `tsconfig*.json`, `index.html`
- `.github/workflows/generate-v6feature-docs.yml`
- `.github/workflows/deploy-pages.yml`
- any trigger workflows or validation/eval workflows
- `scripts/generate-feature-doc.ts`
- `scripts/rebuild-module-index.ts`
- any scripts related to eval, validate, memory, drift, navigation, index maps, manifests, publishing, repo governance
- `docs/memory/repo-memory.json`
- `CLAUDE.md`
- `.claude/**` (commands, settings, hooks)
- prompts, hooks, skills
- `docs/plans`, `docs/reference`
- `src/pages/content/**` (module index.md files, generation manifests)
- navigation/index map files: `navigationData.ts`, `indexContentMap.ts`
- markdown/MDX/remark/rehype/sanitize config
- layout/components/styles/search config

---

## Extra questions you must answer explicitly

1. What exactly makes this V6 Feature Docs site "enterprise-grade" today?
2. Which behaviors are essential and must survive in any cloned site?
3. Which parts are implementation detail vs hard requirement?
4. Which generated artifacts are fragile if edited by hand?
5. What are the critical failure modes in generation, navigation, evals, governance, and deploy?
6. Which repo settings outside version control are required for the system to work?
7. Which parts of the current site are technical debt rather than intended architecture?
8. What is the minimum accurate reference bundle for Claude to create a new similar docsite?
9. Which parts of the repo are reusable as a template and which are V6-specific?
10. What is still missing from "fully evolved enterprise-grade" status, if anything?

---

## Output quality bar

Your answer must be:
- evidence-based
- implementation-aware
- explicit about generated vs source-of-truth files
- explicit about evals and governance
- explicit about external GitHub settings dependencies
- explicit about operational failure modes
- useful both as an audit and as a blueprint for cloning the site

Do not produce a thin summary.
Produce a durable architectural reference for future reuse.
