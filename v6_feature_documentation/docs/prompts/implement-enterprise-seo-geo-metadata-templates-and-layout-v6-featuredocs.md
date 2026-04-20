You are implementing an enterprise-grade discoverability, metadata, template-governance, and page-shell UX upgrade for the V6 Feature Documentation website.

This is a full-system implementation task.
This is not a superficial SEO tweak, not a cosmetic layout fix, and not a one-off metadata cleanup.

Your job is to design, implement, validate, and document a complete enterprise-grade solution for:

1. SEO
2. GEO (Generative Engine Optimization)
3. site discoverability artifacts
4. page-level metadata and front matter standardization
5. reusable documentation templates for all valid deliverable types
6. future-content readiness for generated docs
7. right-navigation and page-shell scrolling behavior
8. repo validations/evals where justified
9. durable repo reference and governance updates

Use the current V6 Feature Documentation repository as source of truth.

If the NG PRDs site or other internal benchmark implementations are accessible, inspect them first and use them as a maturity benchmark where appropriate. Reuse patterns only after verifying compatibility with this repository's actual architecture, generation flow, deploy model, and governance model.

Do not blindly copy.

--------------------------------------------------
IMPORTANT STANDARDS NOTE
--------------------------------------------------

Verify and implement standards-correct artifact names and formats.

Do not blindly implement incorrect filenames if the request used shorthand or incorrect terms.

For example:
- use `robots.txt` if that is the correct standard, not `robot.xml`
- use `sitemap.xml` where appropriate
- use `llms.txt` and related AI-discovery artifacts if appropriate, not a made-up `.llm` file
- document any filename standardization decisions clearly

If additional standards-compliant artifacts are justified for enterprise discoverability, implement them and explain why.

--------------------------------------------------
PRIMARY OBJECTIVE
--------------------------------------------------

Make the V6 Feature Documentation website enterprise-grade in discoverability, machine readability, content consistency, and page usability.

The final system must:

- improve visibility in traditional search engines
- improve discoverability and usability for generative engines / AI retrieval systems
- provide strong page-level metadata across all valid guide types
- ensure all future generated and published docs inherit correct metadata and structure
- enforce uniformity via durable templates
- avoid stale or contradictory metadata
- fit the repo's current Vite/static/GitHub Pages architecture
- fit the repo's generation workflows and governance model
- improve the desktop documentation layout so left navigation, main content, and right navigation scroll independently without visible scrollbars
- improve the right "On this page" nav presentation, including the requested menu-style icon before the heading

--------------------------------------------------
NON-NEGOTIABLE REQUIREMENTS
--------------------------------------------------

1. The implementation must be enterprise-grade, professional, and maintainable.
2. Discoverability must cover both search engines and generative engines where appropriate.
3. All valid feature-doc deliverable types must have standardized front matter metadata.
4. Templates must exist for all valid deliverable types and be easy for humans to read and maintain.
5. Prefer `.md` templates unless a small machine-readable companion schema is clearly justified.
6. Future generated docs must inherit the metadata/template system without manual per-page work.
7. The solution must remain correct after additions, updates, deletions, renames, and regenerations.
8. Generated artifacts must be clearly distinguished from source-of-truth files.
9. The page shell must support independent scrolling for:
   - left nav
   - main content
   - right nav
10. Visible scrollbars are not desired for left and right side panels.
11. The right-nav heading "On this page" must include a code-rendered icon matching the reference style:
   - three horizontal lines
   - top and bottom longer
   - middle shorter
   - implemented in code, not as a raster image
12. The final system must not introduce gimmicks, spammy SEO behavior, or fragile manual maintenance.
13. All user-facing wording must remain professional.
14. The solution must fit current repo architecture unless a different design is strongly justified by evidence.

--------------------------------------------------
SOURCE-OF-TRUTH FILES AND SYSTEMS TO INSPECT
--------------------------------------------------

Inspect all relevant files and systems, including but not limited to:

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
- any validation/eval workflows

Scripts:
- `scripts/generate-feature-doc.ts`
- `scripts/rebuild-module-index.ts`
- any scripts related to:
  - navigation
  - index maps
  - manifests
  - validation
  - evals
  - memory
  - drift
  - publishing
  - governance
  - content generation

Repo nervous system:
- `docs/memory/repo-memory.json`
- `CLAUDE.md`
- `.claude/**`
- `docs/prompts/**`
- `docs/reference/**`
- hooks if present
- skills if present
- plans/runbooks if relevant

Content and generated artifacts:
- `src/pages/content/**`
- module `index.md` files
- `_GENERATION_SUMMARY.md`
- `.generation-manifest*.json`
- nav/index files such as:
  - `navigationData.ts`
  - `indexContentMap.ts`

Rendering/layout:
- header layout
- page shell layout
- sidebar/nav components
- right TOC / "On this page" component
- MDX/markdown renderer
- route discovery code
- theme/dark-mode variables
- component styling system

--------------------------------------------------
PHASE 1 — CURRENT-STATE AUDIT
--------------------------------------------------

Audit the current state of the V6 Feature Documentation site and repo.

Determine:

A. Discoverability baseline
- what SEO already exists
- what metadata already exists
- whether canonical URLs exist
- whether sitemap generation exists
- whether robots rules exist
- whether any AI / generative engine discovery artifact exists
- whether structured data exists
- whether Open Graph / social metadata exists
- whether pages have meaningful titles and descriptions
- whether doc pages have front matter
- whether metadata is consistent or fragmented

B. Content/template baseline
- what doc types currently exist
- what guide types are valid in the repo
- whether consistent templates already exist
- whether generated docs already follow a repeatable structure
- which docs are missing front matter
- which guide types lack standard sections

C. Layout/TOC baseline
- how left nav scrolls today
- how body scrolls today
- how right nav scrolls today
- whether all three areas scroll together
- whether right nav has a visible scrollbar
- whether right nav overflows awkwardly
- whether "On this page" has the desired heading/icon treatment

D. Future-content readiness baseline
- how new docs are generated
- how deleted docs are removed
- how manifests and indexes update
- where metadata could go stale
- where discoverability artifacts could go stale

E. Benchmarking
If NG PRDs or another internal benchmark is accessible:
- inspect its enterprise discoverability and metadata posture
- inspect any templates, structured data, or sitemap behavior
- reuse only what actually fits here

Produce a gap analysis:
- what exists
- what is missing
- what is broken
- what must be implemented
- what can be reused
- what must be adapted

--------------------------------------------------
PHASE 2 — ENTERPRISE DISCOVERABILITY ARCHITECTURE
--------------------------------------------------

Design the correct architecture for enterprise-grade discoverability for this repo.

This must cover both:
- traditional search engine optimization (SEO)
- generative engine optimization (GEO)

Define and implement the proper architecture for:

A. Site-level discoverability artifacts
As justified by standards and the repo architecture, implement and document items such as:
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `llms-full.txt` or equivalent extended AI-discovery artifact if justified
- canonical host/base URL handling
- page title templates
- meta description strategy
- Open Graph metadata
- social/share metadata if justified
- favicon/manifest-related discoverability if relevant
- other standards-compliant visibility artifacts if appropriate

B. Structured data / machine-readable metadata
Implement valid structured data where appropriate, such as:
- `WebSite`
- `BreadcrumbList`
- `TechArticle`
- `HowTo`
- `FAQPage`
- `SoftwareApplication`
- other schema types only when truly valid for the page type

Do not force invalid schema types onto pages that do not qualify.

C. GEO / AI-retrieval readiness
Design and implement practices that help generative engines understand the site cleanly, such as:
- concise page summaries
- stable page titles
- clear headings hierarchy
- canonical URLs
- high-quality descriptions
- structured breadcrumbs
- glossary/definitions if relevant
- meaningful summaries at module/guide level
- machine-readable discoverability artifacts
- consistent terminology, synonyms, and module naming where appropriate

D. Indexing / exclusion rules
Decide what should be indexable and what should not.
Prevent indexing of non-user-facing or noisy artifacts such as:
- raw manifests
- generation helper files
- internal maps
- non-routable files
- duplicate or derived artifacts
- placeholder/template files
- any page that should not be search-engine-visible

E. Environment correctness
Ensure the solution works for:
- local development
- build output
- GitHub Pages deployment
- correct production domain/canonical handling
- future content deployed through the normal pipeline

--------------------------------------------------
PHASE 3 — FRONT MATTER AND METADATA STANDARDIZATION
--------------------------------------------------

This phase is mandatory.

Define and implement an enterprise-grade front matter standard for all valid documentation deliverables, including but not limited to:
- user guides
- admin guides
- troubleshooting guides
- API guides
- module landing pages
- overview pages
- setup/configuration/reference guides
- any other valid doc type actually used in this repo

You must:

1. Inventory all valid deliverable types actually present or intended in this repo.
2. Define a standard front matter schema.
3. Distinguish required fields from optional fields.
4. Ensure the schema is practical, human-readable, and enforceable.

The schema should consider fields such as:
- title
- description
- summary
- slug or canonical path
- module
- feature
- guide type
- product
- version
- audience/persona
- tags/keywords
- synonyms/alternate terms if useful
- status
- owners
- created/updated/reviewed dates if appropriate
- robots/indexing directives if needed
- schema/article type if needed
- search/discoverability hints if justified

Do not add fields with no practical value.
Keep the schema enterprise-grade but disciplined.

Then:
- backfill or normalize front matter across existing valid docs where safe and justified
- ensure current and future generated docs can satisfy the schema automatically or semi-automatically
- document what fields are source-of-truth vs derived

--------------------------------------------------
PHASE 4 — TEMPLATE SYSTEM FOR ALL DELIVERABLES
--------------------------------------------------

Create a durable, professional template system so all V6 product-functionality guides maintain consistent structure and quality.

The user prefers `.md` templates because humans are comfortable reading them.
Default to `.md` templates unless there is a strong reason to add a small companion machine-readable schema or validation file.

You must decide the best final format and structure, but optimize for:
- human readability
- AI usability
- repeatability
- maintainability
- compatibility with the repo's generation system

Implement templates for all valid deliverable types, such as:
- module overview / landing page
- user guide
- admin guide
- troubleshooting guide
- API guide
- configuration / setup guide
- reference guide
- FAQ or similar valid type if actually used

For each template:
- include standardized front matter
- include section scaffolding
- include guidance comments only if they will not leak into published output
- ensure structure is consistent and professional
- ensure the template supports enterprise-quality content

You may create:
- a `docs/templates/` directory
- or another clearly justified location

If needed, also create:
- a template index/reference doc
- AI instructions/prompts/skills that tell generators and maintainers to follow these templates
- a small machine-readable schema for validation, but keep `.md` as the primary human-friendly layer if possible

You must explicitly decide:
- what format templates live in
- how AI should follow them
- how future doc generation should use them
- how humans should use them
- what is source-of-truth in the template system

--------------------------------------------------
PHASE 5 — GENERATION PIPELINE AND FUTURE-CONTENT READINESS
--------------------------------------------------

This phase is critical.

Ensure the metadata/template/discoverability system automatically supports future content published through the normal V6 feature-doc generation flow.

That means:
- new docs inherit valid front matter and structure
- new module pages inherit correct discoverability metadata
- deleted docs disappear from sitemaps and AI-discovery artifacts
- renamed docs do not leave stale canonicals or stale discoverability entries
- rebuilt module indexes stay aligned with metadata and templates
- generated nav/index maps remain consistent
- future docs do not require manual SEO/GEO registration

Explicitly verify:
- additions
- updates
- deletions
- renames
- regenerations
- deploy output correctness

Do not merely claim future readiness.
Verify it through actual repo logic, implementation, or realistic simulation.

--------------------------------------------------
PHASE 6 — RIGHT NAV / PAGE-SHELL UX IMPROVEMENTS
--------------------------------------------------

Implement the requested enterprise-grade layout behavior for sub landing pages and documentation pages.

Required desktop behavior:
- left nav scrolls independently
- body content scrolls independently
- right nav scrolls independently
- scrolling the body must not scroll the left or right nav
- scrolling the left nav should only affect the left nav
- scrolling the right nav should only affect the right nav
- left and right panels should not show visible scrollbars
- the page shell must remain professional and stable

The intended experience is:
- three-pane documentation layout
- independent scroll containers
- no ugly right-nav scrollbar
- no shared/common page scroll coupling between panes
- cleaner, more controlled documentation reading experience

Implement this using code, not hacks.

Address:
- full-height page shell behavior
- sticky/fixed header offsets if relevant
- hidden scrollbar treatment that still preserves accessibility and mouse/trackpad/keyboard scrolling
- right-nav sizing and overflow
- cross-browser behavior
- dark/light theme compatibility
- desktop vs smaller-screen behavior

If mobile/tablet requires a different behavior, handle that gracefully and document it.

Also implement the requested right-nav heading enhancement:
- before "On this page", add a code-rendered icon matching the reference style
- three horizontal lines
- top and bottom longer
- middle shorter
- use inline SVG or equivalent code-based icon
- do not use a white-background image
- ensure theme compatibility

--------------------------------------------------
PHASE 7 — VALIDATIONS, EVALS, AND QUALITY CONTROLS
--------------------------------------------------

Enterprise-grade implementation is not complete until it has quality controls.

Audit the current validation/eval posture and determine what discoverability/template/layout checks should be added or refined.

Assess whether the repo needs checks for:
- required front matter presence
- required metadata completeness by guide type
- invalid or duplicate canonical paths
- missing descriptions/titles
- malformed structured data inputs
- sitemap coverage mismatches
- stale sitemap entries after deletions
- stale llms/AI-discovery entries after deletions
- non-routable pages included in discoverability artifacts
- generated docs missing required metadata
- template compliance for supported deliverable types
- right-nav layout regressions if practical to test
- hidden-scrollbar implementation not breaking usability
- "On this page" heading/icon correctness if practical
- professional metadata wording and no junk values
- no undefined/null metadata leakage
- robots/index directives consistency
- base URL / canonical host correctness

If safe and justified, implement minimal repo-consistent validations now.
If not, document exact follow-up work.

You must explicitly state:
- what checks were added
- what checks were updated
- what remains future work
- which checks are blocking vs advisory

--------------------------------------------------
PHASE 8 — DOCUMENTATION AND REPO NERVOUS-SYSTEM UPDATES
--------------------------------------------------

After implementation, update the repo's durable reference system where justified.

Update or create documentation covering:
- site discoverability architecture
- SEO/GEO strategy
- front matter schema
- template system
- generated discoverability artifacts
- future-content discoverability lifecycle
- layout/page-shell scroll model
- right-nav behavior
- validation/eval coverage
- operational gotchas
- source-of-truth vs generated boundaries

Update the repo nervous system where appropriate:
- `docs/reference/current-docsite-blueprint.md`
- `docs/reference/current-docsite-reference-pack.md`
- `docs/reference/current-docsite-ops-evals-governance.md`
- `CLAUDE.md`
- `.claude/**`
- `docs/prompts/**`
- `docs/memory/repo-memory.json`

Keep machine-readable memory compact.
Do not dump large narrative architecture into memory.

--------------------------------------------------
REQUIRED DELIVERABLES
--------------------------------------------------

Implement and document all applicable items:

1. Enterprise discoverability architecture
2. Standards-correct discoverability artifacts
3. Structured data strategy and implementation where valid
4. Front matter schema for all valid guide types
5. Front matter backfill/normalization where justified
6. Human-readable template system for all valid deliverables
7. Generator/future-content integration
8. Sitemap/robots/AI-discovery lifecycle
9. Independent-scroll page-shell behavior
10. Right-nav icon before "On this page"
11. Search-engine and generative-engine readiness improvements
12. Validation/eval updates if justified
13. Documentation/reference/memory updates where justified

--------------------------------------------------
ACCEPTANCE CRITERIA
--------------------------------------------------

The task is only complete if all of the following are true:

1. The site has enterprise-grade discoverability artifacts implemented using standards-correct names and formats.
2. The site has a clear and correct SEO strategy compatible with its static deployment model.
3. The site has a clear and correct GEO / AI-discovery strategy compatible with its architecture.
4. All valid guide/deliverable types have standardized front matter metadata.
5. A durable template system exists for all valid deliverable types.
6. The template system is human-readable and maintainable.
7. Future generated docs can inherit metadata/template standards without brittle manual work.
8. Deleted or renamed docs do not linger in discoverability artifacts after regeneration/build/deploy.
9. Source-of-truth files and generated discoverability artifacts are clearly distinguished.
10. Left nav, body content, and right nav scroll independently on desktop.
11. Left and right panels do not show visible scrollbars.
12. The right-nav heading includes the requested code-rendered menu-style icon.
13. The final UI remains professional and theme-compatible.
14. Any added validations/evals are documented and justified.
15. The implementation fits current repo architecture and avoids unnecessary complexity.

--------------------------------------------------
VALIDATION AND TESTING
--------------------------------------------------

After implementation, run all relevant repo validations you can discover, plus new checks related to this work.

At minimum verify:
- build succeeds
- existing validations pass
- sitemap/discoverability artifacts generate correctly
- canonical URLs resolve correctly
- robots rules are correct
- llms/AI-discovery artifacts are correct if implemented
- representative docs across guide types have valid metadata
- representative future-content scenario is handled correctly
- representative deletion scenario is handled correctly
- generated docs remain aligned with templates/front matter
- page shell behaves correctly with independent scroll containers
- left/right scrollbars are hidden but scrolling still works
- "On this page" icon renders correctly
- dark/light theme compatibility is preserved
- no stale discoverability references remain
- no undefined/null metadata leaks into output

Use realistic examples across:
- module landing pages
- user guides
- admin guides
- troubleshooting guides
- API or reference docs if present
- newly added content
- deleted content simulation

--------------------------------------------------
FINAL RESPONSE FORMAT
--------------------------------------------------

Return your final report with exactly these sections:

## 1. Current-State Audit
What existed before and what was missing.

## 2. Standards and Architecture Decisions
What standards-correct artifacts and architecture choices were used, and why.

## 3. What Was Implemented
Exact files, scripts, components, layouts, workflows, docs, and metadata systems updated.

## 4. Front Matter and Template System
What schema was chosen, what templates were created, and how future docs will stay uniform.

## 5. SEO and GEO Coverage
What traditional search-engine and generative-engine discoverability is now supported.

## 6. Layout and Right-Nav Improvements
How independent scrolling, hidden scrollbars, and the right-nav icon were implemented.

## 7. Validation and Test Results
What was run and what passed or failed.

## 8. Evals and Quality-Control Status
What discoverability/template/layout checks were added, updated, or recommended for later.

## 9. Documentation and Nervous-System Updates
What docs, prompts, commands, memory entries, or reference files were updated.

## 10. Maturity and Confidence
Give:
- a 0–5 maturity score
- a percentage maturity score
- a confidence score for your assessment
- what is still needed to reach the next maturity level

## 11. Remaining Risks or Follow-Ups
Anything still incomplete or requiring a future pass.

## 12. Final Verdict
State plainly whether the V6 Feature Documentation site now has enterprise-grade discoverability, metadata discipline, template governance, and page-shell navigation behavior suitable for current and future published content.
