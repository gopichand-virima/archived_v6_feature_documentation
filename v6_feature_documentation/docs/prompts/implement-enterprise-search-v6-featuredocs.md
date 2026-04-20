You are implementing enterprise-grade full-site search for the V6 Feature Documentation website.

This is an end-to-end implementation, validation, and documentation task.
This is not a superficial UI adjustment.

Your job is to design, implement, validate, and document a professional search system for the V6 Feature Documentation site that matches the maturity, usefulness, and operational reliability of the NG PRDs site search, while fitting this repository's actual architecture, generation flow, deployment model, governance rules, and eval posture.

Use the current V6 Feature Documentation repository as source of truth.

If the NG PRDs site or its reference files are accessible, inspect that implementation first and use it as the functional benchmark. Reuse concepts only after verifying they are compatible with this repo's Vite, static-site, GitHub Pages, generated-content, and governance model.

Do not blindly copy implementation details.

--------------------------------------------------
UI REFERENCE AND BEHAVIORAL CONSTRAINTS
--------------------------------------------------

Use the existing search modal UI as a visual and interaction reference.

The search modal currently has:
- a search input
- a "Search Docs" tab
- a "Search Web" tab

Required behavior:
1. When "Search Docs" is active, entering a keyword must return relevant internal documentation results from the V6 Feature Documentation site.
2. "Search Docs" must search the published docsite content, not only a partial subset.
3. "Search Web" is separate from internal docs search. It must not share internal-doc query state or results.
4. When the user switches from "Search Docs" to "Search Web", the query used in "Search Docs" must be cleared. The user must type a new query for web search.
5. When the user switches back to "Search Docs", internal-doc search state should behave intentionally and predictably. Do not leak stale query or stale results across tabs unless there is a strong, explicit product reason.
6. Treat the attached UI as reference only. The final experience must be professional, clean, and consistent with the existing site.
7. Do not use emoji or emoticons anywhere in the search experience, including:
   - placeholders
   - empty states
   - result cards
   - filters
   - badges
   - tabs
   - labels
   - loading states
   - error states
   - helper text

--------------------------------------------------
PRIMARY OBJECTIVE
--------------------------------------------------

Implement enterprise-grade search for the entire V6 Feature Documentation site so users can search all current published documentation and all future documentation that becomes published through the normal generation, build, and deployment pipeline.

The final search system must:
- cover the full docsite, not a partial subset
- automatically include newly generated and newly published content
- remain accurate after additions, updates, deletions, renames, and regenerations
- avoid stale search artifacts
- fit static hosting and GitHub Pages deployment
- work with the current Vite-based architecture
- be maintainable within the repo's workflows, validations, memory, and governance model
- present results in a professional, enterprise-appropriate manner

--------------------------------------------------
NON-NEGOTIABLE REQUIREMENTS
--------------------------------------------------

1. No emoji or emoticons anywhere in the search UX.
2. Search must cover all relevant published V6 Feature Documentation content across the site.
3. Search must automatically pick up future content added by the normal feature-doc generation and publish pipeline.
4. Search must automatically remove deleted content from the searchable index after regeneration, build, and deploy.
5. Search must not require manual per-page registration when new documentation is generated.
6. Search must work correctly with the site's base-path and GitHub Pages runtime model.
7. Search must distinguish between user-searchable page content and non-searchable implementation artifacts.
8. Search must not expose raw manifest noise, null values, undefined values, raw markdown junk, or developer-only metadata to end users.
9. Search must be professional, deterministic, and suitable for an enterprise documentation site.
10. Search must integrate with current repo workflows, validations, and documentation where justified.
11. Search must remain correct for future content, not only current content.
12. Search must not introduce unnecessary complexity, runtime services, or operational fragility unless clearly justified by the repo architecture.

--------------------------------------------------
SOURCE-OF-TRUTH EXPECTATIONS
--------------------------------------------------

Use the repo as source of truth and inspect all relevant files, including but not limited to:

Core/build:
- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`
- `tsconfig*.json`
- `index.html`

Workflows:
- `.github/workflows/generate-v6feature-docs.yml`
- `.github/workflows/deploy-pages.yml`
- any trigger workflows
- any existing validation/eval workflows

Scripts:
- `scripts/generate-feature-doc.ts`
- `scripts/rebuild-module-index.ts`
- any scripts related to:
  - navigation
  - index maps
  - manifests
  - eval
  - validate
  - memory
  - drift
  - publishing
  - governance

Repo nervous system:
- `docs/memory/repo-memory.json`
- `CLAUDE.md`
- `.claude/**`
- `docs/prompts/**`
- `docs/reference/**`
- hooks if present
- skills if present

Content and generated artifacts:
- `src/pages/content/**`
- module `index.md` files
- `_GENERATION_SUMMARY.md`
- `.generation-manifest*.json`
- navigation/index files such as:
  - `navigationData.ts`
  - `indexContentMap.ts`

Rendering/search/layout:
- search UI components
- modal components
- layout/components/styles
- markdown/remark/rehype/sanitize configuration
- routing/page-discovery code
- any existing search-related dependency or utility

--------------------------------------------------
PHASE 1 — CURRENT-STATE AUDIT
--------------------------------------------------

Inspect and document the current V6 Feature Documentation search baseline.

Determine:
- whether search UI already exists
- whether any search logic already exists
- whether any search index already exists
- how pages/routes are currently discovered
- how published content is currently organized
- how generated docs, manifests, indexes, and nav maps are produced
- how current content becomes visible on the site
- what search-related gaps currently exist
- what would prevent the current site from having reliable enterprise-grade full-site search

If NG PRDs search is available as reference:
- inspect its architecture
- inspect its index generation model
- inspect its ranking behavior
- inspect its UX behavior
- inspect its operational model
- preserve only the patterns that are compatible here

Produce a clear gap analysis:
- what exists today
- what is missing
- what must be implemented
- what can be reused
- what must be adapted

--------------------------------------------------
PHASE 2 — TARGET SEARCH ARCHITECTURE
--------------------------------------------------

Design the correct enterprise-grade search architecture for this repo.

Prefer an architecture that is compatible with:
- Vite
- static hosting
- GitHub Pages
- deterministic builds
- generated content
- future published content
- maintainable repo workflows

Unless strong evidence argues otherwise, prefer a build-time generated search index with client-side querying over a normalized static index artifact.

Define and implement the correct search architecture, including:

A. Search scope
- full site coverage for all relevant published docs
- generated feature docs
- overview/admin/troubleshooting pages if user-visible and routable
- module index pages where appropriate
- exclusion of non-page artifacts and non-user-facing files

B. Indexable-content rules
Search should index only content that should actually be searchable by users.
Explicitly determine what to exclude, such as:
- raw manifests
- generation summaries
- implementation helper files
- internal maps not directly user-visible
- non-routable artifacts
- other non-user-facing files

C. Search data model
For every indexed page/document, define and populate fields such as:
- title
- canonical URL or route
- module
- section
- content type
- headings
- body text
- cleaned summary/snippet
- breadcrumbs
- keywords/tags if available
- manifest-derived metadata if appropriate
- weighting signals for relevance

D. Route normalization
Ensure route generation is correct for:
- current routing model
- deployed GitHub Pages behavior
- base-path rules
- current and future published pages

E. Freshness and lifecycle
The system must remain correct after:
- added docs
- modified docs
- deleted docs
- renamed docs
- regenerated docs
- rebuilt module indexes
- updated manifests
- regenerated nav/index maps

--------------------------------------------------
PHASE 3 — SEARCH RELEVANCE AND USER EXPERIENCE
--------------------------------------------------

Implement professional enterprise-grade search behavior.

Search relevance must prioritize:
1. exact title matches
2. close title matches
3. heading matches
4. feature-name matches
5. breadcrumb/module relevance
6. summary/snippet relevance
7. body relevance
8. phrase proximity and useful ranking normalization
9. de-duplication of overlapping results

Avoid noisy, low-value, duplicate, or misleading results.

The user experience must include:
- professional placeholder text
- clean result layout
- sensible result hierarchy
- title, breadcrumb/module context, and useful snippet
- keyboard navigation
- enter-to-open
- escape-to-close
- focus management
- loading state only if justified
- professional empty state wording
- professional error wording
- no decorative or casual language
- no emoji or emoticons
- no chat-like microcopy
- no toy behavior

Do not expose internal scoring jargon to users unless clearly justified.

--------------------------------------------------
PHASE 4 — SEARCH DOCS VS SEARCH WEB
--------------------------------------------------

Respect the existing two-tab model:

A. Search Docs
- internal V6 Feature Documentation search only
- powered by the internal search architecture you implement
- must return full-site documentation results

B. Search Web
- separate from internal docs search
- must not reuse internal-doc search state
- switching from Search Docs to Search Web must clear the query entered for docs search
- switching to Search Web must not show stale Search Docs results
- do not couple Search Web to the internal search index
- if Search Web is outside the scope of this implementation, preserve current behavior safely and document the boundary clearly

You must explicitly state:
- what was implemented for Search Docs
- what was preserved, changed, deferred, or isolated for Search Web
- why that decision is appropriate

--------------------------------------------------
PHASE 5 — IMPLEMENTATION
--------------------------------------------------

Implement all required pieces, which may include:

- search content extraction pipeline
- search index generation script or build integration
- route/canonical URL normalization
- relevance ranking logic
- search modal logic
- Search Docs tab behavior
- Search Web tab-state behavior
- result rendering
- snippet generation and cleanup
- professional empty/loading/error states
- search result navigation behavior
- stale-index prevention
- integration with build or generation workflows
- integration with current navigation/index lifecycle if required

If a search index artifact is generated, document:
- its exact path
- whether it is source-of-truth or generated
- how it is produced
- when it is regenerated
- what it includes
- what it excludes
- how stale artifacts are prevented

The final architecture must be robust for current and future content.

--------------------------------------------------
PHASE 6 — FUTURE-CONTENT READINESS
--------------------------------------------------

This is mandatory.

Verify explicitly that the search system will support future content published through the normal V6 feature-doc generation and deployment flow.

Demonstrate that:
- new feature docs become searchable without manual registration
- updated docs become searchable with fresh content
- deleted docs disappear from the index after regeneration/build/deploy
- renamed docs do not leave stale entries
- rebuilt module indexes do not break search routes or breadcrumbs
- navigation/index map regeneration does not leave search out of sync
- future content published through normal workflows becomes searchable automatically

Do not merely claim this. Verify it through actual repo behavior, scripts, or representative simulation.

--------------------------------------------------
PHASE 7 — SEARCH QUALITY CONTROLS, EVALS, AND VALIDATION
--------------------------------------------------

Search is not complete until quality controls are addressed.

Audit the current eval/validation posture and determine whether search-related checks should be added or refined for this project.

Assess whether the repo needs search-related checks for:
- empty or missing search index
- routes in search index that do not exist
- published pages missing from search index
- deleted pages lingering in search index
- duplicate canonical entries
- malformed titles/snippets
- broken base-path handling in result URLs
- stale search artifacts after deletion
- invalid inclusion/exclusion behavior
- search tab-state correctness
- professional-copy compliance in search UI

If safe and justified, implement minimal repo-consistent search validations now.
If not, document exact follow-up work.

You must explicitly state:
- whether search-specific evals or validations were added
- whether they are blocking or advisory
- where they live
- what they protect
- what remains as future work

--------------------------------------------------
PHASE 8 — PROFESSIONAL STANDARDS
--------------------------------------------------

All user-facing search content must be professional and enterprise-appropriate.

Explicit content rules:
- no emoji
- no emoticons
- no playful language
- no casual chat tone
- no vague result labels
- no undefined/null metadata leakage
- no raw markdown clutter if it can be cleaned
- no "Oops", "No worries", "Try this", or similar informal language
- no decorative copy that weakens enterprise professionalism

Use concise, business-appropriate wording.

--------------------------------------------------
PHASE 9 — PERFORMANCE, ACCESSIBILITY, AND MAINTAINABILITY
--------------------------------------------------

Ensure the search implementation is operationally sound.

Assess and address:
- search index size
- bundle-size impact
- lazy loading or on-demand loading where appropriate
- responsiveness for realistic docsite sizes
- keyboard accessibility
- focus handling
- semantic structure
- maintainability of search-related code
- determinism of generated search artifacts
- compatibility with static deployment

Do not introduce hidden operational debt unnecessarily.

--------------------------------------------------
PHASE 10 — DOCUMENTATION AND REPO NERVOUS-SYSTEM UPDATES
--------------------------------------------------

After implementation, update the repo's durable reference system where justified.

Update or create documentation covering:
- search architecture
- search indexing lifecycle
- files/scripts that own search behavior
- generated search artifacts
- how future content becomes searchable
- how deletions are handled
- any search-related validations/evals
- operational gotchas
- how this aligns with or differs from NG PRDs search

Update the repo nervous system where appropriate:
- `docs/reference/current-docsite-blueprint.md`
- `docs/reference/current-docsite-ops-evals-governance.md`
- `docs/reference/current-docsite-reference-pack.md`
- `CLAUDE.md`
- `.claude/commands/new-docsite.md`
- `docs/memory/repo-memory.json`

Keep machine-readable memory compact.
Do not bloat memory with narrative architecture text.

--------------------------------------------------
REQUIRED DELIVERABLES
--------------------------------------------------

Implement and document all applicable items:

1. Search architecture
2. Search index generation or search-data pipeline
3. Search UI and modal logic
4. Search Docs behavior
5. Search Web behavior decision and implementation status
6. Search ranking and relevance model
7. Professional result presentation
8. Future-content auto-inclusion behavior
9. Search-specific validation/eval status
10. Documentation updates
11. Repo nervous-system updates where justified

--------------------------------------------------
ACCEPTANCE CRITERIA
--------------------------------------------------

The task is complete only if all of the following are true:

1. A user can search across the full published V6 Feature Documentation site.
2. Search results cover relevant current documentation content across modules and generated docs.
3. Newly generated and newly published docs become searchable through the normal pipeline.
4. Deleted docs do not remain in the search index after regeneration/build/deploy.
5. Search result links resolve correctly in the deployed site.
6. Search works correctly with the site's current base-path/runtime deployment model.
7. Search results are presented in a professional, enterprise-appropriate way.
8. No emoji or emoticons appear anywhere in the search experience.
9. Search architecture is documented clearly for future maintenance and cloning.
10. Search does not require brittle manual upkeep for future content.
11. Any search-related validations/evals added are documented and justified.
12. The solution fits the current repo architecture and avoids unnecessary complexity.
13. Search tab behavior is correct, including separation between Search Docs and Search Web.
14. Search is suitable for both current site content and future published content.

--------------------------------------------------
VALIDATION AND TESTING
--------------------------------------------------

After implementation, run all relevant repo validations you can discover, plus search-specific verification.

At minimum verify:
- build succeeds
- existing validations pass
- search index is generated correctly, if applicable
- representative docs are searchable
- representative module index pages are handled correctly
- representative troubleshooting/admin/generated docs are searchable where appropriate
- representative newly added-doc scenario is handled correctly
- representative deleted-doc scenario is handled correctly
- result links open correctly
- no stale routes remain
- deployed-path correctness is preserved
- no professional-copy violations exist in search UI
- Search Docs and Search Web tab behavior works as specified

Use realistic test samples across:
- module index pages
- generated feature docs
- troubleshooting docs
- admin module docs
- newly added content
- deleted content simulation

--------------------------------------------------
FINAL RESPONSE FORMAT
--------------------------------------------------

Return your final report with exactly these sections:

## 1. Current Search Baseline
What existed before and what was missing.

## 2. Benchmark and Gap Analysis
What was learned from NG PRDs search if available, what can be reused, and what had to be adapted.

## 3. Target Enterprise Search Design
What architecture was chosen and why.

## 4. What Was Implemented
Exact files, scripts, components, workflows, and docs updated.

## 5. Search Coverage
What is searchable now, what is excluded, and how future content becomes searchable.

## 6. Search Quality and Professionalism
How enterprise-grade professional behavior is enforced, including no-emoji/no-emoticon compliance.

## 7. Search Evals and Validation Status
Whether search-specific checks were added, updated, or recommended for later.

## 8. Validation and Test Results
What was run and what passed or failed.

## 9. Documentation and Nervous-System Updates
What docs, memory, commands, or reference files were updated.

## 10. Search Maturity and Confidence
Give:
- a 0–5 maturity score for search capability
- a percentage maturity score
- a confidence score for your assessment
- what is still needed to reach the next maturity level

## 11. Remaining Risks or Follow-Ups
Anything still incomplete or requiring a future pass.

## 12. Final Verdict
State plainly whether V6 Feature Documentation now has enterprise-grade full-site search suitable for both current and future published content.
