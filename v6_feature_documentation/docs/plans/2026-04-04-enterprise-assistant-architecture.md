# V6 Feature Documentation — Enterprise Assistant Architecture Plan

## 1. Current Repo Reality

**Chat/Assistant:** ChatPanel.tsx exists with full UI (message history, Point & Ask, conversation management) but is **search-result-only** — no LLM. Responses are deterministic from the docs search index. No Claude API, no OpenAI, no external AI service.

**Search:** Build-time index (`search-index.json`, 17 indexed pages out of 62 .md files). Client-side scoring engine. Optional Serper API for web search. "This page" DOM search just wired.

**Content:** 62 .md files in `src/pages/content/6_1/admin/`. Auto-generated navigation from `index.md`. No front matter. Metadata from `navigationData.ts` + search index.

**Artifacts:** `search-index.json`, `sitemap.xml`, `llms.txt` all generated at build time.

**Security:** No BFF/proxy. All API keys exposed in bundle via `VITE_*`. Only `VITE_SERPER_API_KEY` defined. No CSP headers.

**Key gap:** The chat panel looks complete but has no intelligence — it returns search results formatted as chat messages. The entire LLM layer is missing.

---

## 2. Ideal Assistant Vision

The V6 assistant should be a **documentation-native intelligence layer** that:

- Answers questions from V6 docs with Claude as the reasoning engine
- Uses layered context (page → module → site → web) to ground responses
- Generates structured artifacts (checklists, SOPs, tables, diagrams) from doc content
- Treats Virima docs as the highest-priority source in all modes
- Supports speech-to-text as a professional input method
- Feels like a native part of the documentation, not a bolted-on chatbot

**What it is NOT:**
- A generic chatbot
- A separate RAG system with its own vector DB
- A multi-vendor AI stack
- An autonomous agent that takes actions in Virima

---

## 3. Recommended Architecture

### Simplest Enterprise-Grade Architecture

```
Browser (React SPA)
├── Search Docs → client-side index (existing)
├── Chat Panel → sends context + query to BFF
└── Speech Input → browser Web Speech API → text → chat/search

BFF (Backend-for-Frontend) — Cloudflare Worker or Vercel Edge Function
├── Receives: query + page context + conversation history
├── Retrieves: relevant chunks from docs index
├── Calls: Claude API (claude-sonnet-4-20250514)
├── Streams: response back to browser
└── Hides: API keys from bundle

Build Pipeline (existing + extended)
├── sync-toc → navigationData.ts
├── build-search-index → search-index.json (extended with chunks)
├── build-sitemap → sitemap.xml
├── build-llms-txt → llms.txt
└── NEW: build-context-chunks → context-chunks.json (section-level content for RAG)
```

### Why This Architecture

| Decision | Rationale |
|----------|-----------|
| **Claude as sole LLM** | User requirement. No custom model. Anthropic API only. |
| **BFF proxy** | Required — VITE_* keys are exposed in bundle. BFF hides ANTHROPIC_API_KEY. |
| **Edge function** | Cheapest, fastest, simplest BFF. No server to manage. |
| **Build-time chunks** | Static site → no runtime crawling. Chunks generated alongside search index. |
| **No vector DB** | Corpus is small (62 pages). BM25/keyword scoring + Claude reranking is sufficient. |
| **Client-side search preserved** | Instant docs search stays client-side (no latency). Claude only for chat/artifact mode. |

---

## 4. Retrieval, Ranking, and Context Strategy

### Context Layers (Priority Order)

| Layer | Source | When Used |
|-------|--------|-----------|
| 1. Current page | DOM article content, headings, metadata | Always when on a doc page |
| 2. Current module | Sibling pages in same module section | Module-level questions |
| 3. Full docs corpus | search-index.json + context-chunks.json | Cross-module questions |
| 4. Repo/source context | llms.txt, sitemap.xml, GitHub content | Rare, for meta-questions |
| 5. Broader web | Serper API results | Search Web mode only, lowest priority |

### Retrieval Flow

```
User query → Intent classification (Claude)
  ├── "This page" → inject current page content as primary context
  ├── "This module" → inject module pages as context
  ├── "All docs" → search index → top-5 chunks → Claude
  └── "Search Web" → docs search FIRST → Serper fallback → Claude synthesis
```

### Virima-First Search Web Rules

1. Always search internal docs index first
2. Return internal results if confidence > threshold
3. Only call Serper if internal results are insufficient or user explicitly wants web
4. Present internal results above web results
5. Label sources clearly: "From V6 Documentation" vs "From the Web"

### Ranking Rules

- Current page context beats global docs when question is page-local
- Current module beats broader site when relevance is similar
- V6 docs beat web sources unless external content is truly needed
- Never let web results silently override internal docs

---

## 5. Artifact Generation Strategy

### Supported Artifact Types

| Type | Example | Source |
|------|---------|--------|
| Summary | "Summarize this page" | Current page content |
| Checklist | "Create an admin setup checklist" | Page steps/procedures |
| SOP | "Generate SOP for AD configuration" | Page + module content |
| Table | "Compare user roles" | Cross-page content |
| FAQ | "Generate FAQ from this guide" | Page headings + content |
| Troubleshooting flow | "Create troubleshooting steps" | Page content |
| Mermaid diagram | "Show the workflow" | Page procedures |
| Runbook | "Create admin runbook" | Module content |
| Training handout | "Create training material" | Page + module content |

### Grounding Rules

1. Every artifact must cite its source page(s)
2. Artifacts must not contain information absent from the docs
3. If Claude cannot ground a claim, it must say so
4. Artifacts render inline in the chat panel with copy/export buttons

### Rendering

- Markdown rendering for text artifacts (existing react-markdown)
- Mermaid.js for diagrams (add as dependency)
- Copy-to-clipboard for all artifacts
- "Export as Markdown" download button

---

## 6. Chat/Search Panel UX

### Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Search Docs | Search dialog (⌘K) | Client-side instant search, This page / All docs |
| Search Web | Search dialog → Web tab | Virima-first, then Serper fallback |
| Ask Virima | Chat panel (floating button) | Claude-powered Q&A + artifact generation |

### Chat Panel Flow

1. User opens chat (floating button or ⌘⇧C)
2. Welcome screen shows contextual suggestions based on current page
3. User types or dictates a question
4. System detects intent and scope (page/module/all/web)
5. Retrieves relevant context from appropriate layer
6. Sends to Claude via BFF with system prompt + context + conversation history
7. Streams response back, renders markdown + artifacts
8. Shows sources with clickable links to docs

### Session Behavior

- Conversation history persisted in localStorage (existing)
- Context refreshes when user navigates to new page
- Follow-up questions maintain conversation context
- "New conversation" clears context

---

## 7. Speech-to-Text / Dictation Strategy

### Architecture

Use **Web Speech API** (`SpeechRecognition`) — browser-native, no external service.

```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = 'en-US';
```

### UX

- Mic button in search bar and chat input
- Click to start → button pulses → click to stop
- Interim results shown in real-time (grayed text)
- Final transcript placed in input field for review before submit
- User can edit transcribed text before sending

### Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Safari | ✅ Partial (webkit prefix) |
| Firefox | ❌ Not supported → graceful fallback |

### Fallback

- If `SpeechRecognition` not available: hide mic button entirely
- No error, no broken state — progressive enhancement

### Privacy

- Chrome: sends audio to Google servers for transcription
- Safari: sends to Apple servers
- Display a one-time notice: "Voice input uses your browser's built-in speech service"
- No audio stored by the V6 site

### Where Dictation Works

- ✅ Search Docs input
- ✅ Search Web input
- ✅ Chat panel message input
- ❌ Not for artifact-generation actions (those are button-triggered)

---

## 8. Security, Safety, and Enterprise Controls

### API Key Protection

| Key | Current | Target |
|-----|---------|--------|
| ANTHROPIC_API_KEY | Not used | BFF-only (never in browser) |
| VITE_SERPER_API_KEY | In bundle | Move to BFF |

### Hallucination Mitigation

1. System prompt instructs Claude to cite sources
2. Context window populated with actual doc content
3. Confidence-based refusal: "I don't have enough information to answer that from the documentation."
4. No creative generation — only doc-grounded responses

### Prompt Injection Defense

1. User input separated from doc context in Claude messages
2. Doc content injected as `system` context, not `user` messages
3. Content sanitization before injection (strip scripts, HTML)

### Rate Limiting

- BFF enforces per-IP rate limits (e.g., 20 requests/minute)
- Client-side debounce on chat input

### Observability

- BFF logs: query, intent, context size, response time, model, token usage
- No PII in logs
- Cost tracking per request

---

## 9. Simplicity and Scalability Review

### Essential Components

| Component | Needed? |
|-----------|---------|
| Build-time search index | ✅ Already exists |
| Client-side docs search | ✅ Already exists |
| BFF proxy for Claude | ✅ Must add |
| Context chunks builder | ✅ Must add |
| Speech-to-text | ✅ Browser-native, minimal code |

### Optional / Later

| Component | When |
|-----------|------|
| Vector database | Only if corpus exceeds ~500 pages |
| Streaming responses | Phase 1 |
| Artifact export | Phase 3 |
| Multi-turn memory | Phase 2 |

### Over-Engineering to Avoid

- ❌ Custom embedding model
- ❌ Pinecone/Weaviate/ChromaDB (corpus too small)
- ❌ LangChain/LlamaIndex orchestration (unnecessary complexity)
- ❌ Custom speech recognition model
- ❌ Multiple LLM providers

### Scalability Path

| Scale | Architecture |
|-------|-------------|
| Today (62 pages) | Static index + Claude API |
| 500 pages | Same, larger index |
| 2000+ pages | Add vector search (Turbopuffer or similar) |
| Multi-product | Namespace indexes by product/version |

---

## 10. Evals and Quality Gates

### Retrieval Evals

| Check | Method |
|-------|--------|
| Page-local accuracy | Query about heading → must return correct section |
| Cross-page discovery | Query feature name → correct page in top 3 |
| Virima-first ranking | Search Web → internal docs above web results |
| Deleted doc safety | Remove page → rebuild → must not appear |
| Stale content | Update page → rebuild → new content in results |

### Answer Quality Evals

| Check | Method |
|-------|--------|
| Grounding | Every claim traceable to a doc page |
| Citation accuracy | Cited page actually contains the claimed info |
| Refusal behavior | Unknown topic → "I don't have documentation on that" |
| Artifact correctness | Generated checklist matches source page steps |

### Speech Input Evals

| Check | Method |
|-------|--------|
| Transcription accuracy | Dictate "SNMP discovery" → correct text in input |
| Browser fallback | Firefox → mic button hidden, no error |
| Edit before submit | Transcribed text editable before sending |

---

## 11. Implementation Roadmap

### Phase 0: Architecture Validation (1 week)
- Validate BFF approach (Cloudflare Worker or Vercel Edge)
- Prototype Claude API call with doc context
- Confirm streaming works in chat panel
- **Success:** Claude answers a question from injected doc content

### Phase 1: Current-Page Assistant MVP (2 weeks)
- Build BFF proxy (hide API key)
- System prompt with V6 documentation role
- Inject current page content as context
- Stream Claude responses in existing chat panel
- Basic citation (source page link)
- **Success:** "Explain AD Configuration" on the AD Config page → grounded answer

### Phase 2: Full-Docsite Retrieval (2 weeks)
- Build context-chunks.json at build time (section-level content)
- Implement retrieval: query → top-5 chunks → Claude
- This page / This module / All docs scope routing
- Multi-turn conversation with context
- **Success:** Cross-module questions answered accurately

### Phase 3: Artifact Generation (2 weeks)
- Define artifact templates (checklist, SOP, table, FAQ)
- Implement inline rendering with copy/export
- Mermaid diagram support
- Source provenance on every artifact
- **Success:** "Generate admin checklist from this page" → copyable checklist

### Phase 4: Virima-First Search Web (1 week)
- Move Serper API call to BFF
- Implement Virima-first ranking in BFF
- Claude synthesizes docs + web results
- Clear source labeling
- **Success:** "SNMP best practices" → V6 docs first, web second

### Phase 5: Speech Input (1 week)
- Implement Web Speech API integration
- Mic button in search bar + chat input
- Progressive enhancement (hide on unsupported browsers)
- Privacy notice
- **Success:** Dictate "configure SNMP" → appears in search bar

### Phase 6: Enterprise Hardening (2 weeks)
- Rate limiting, logging, cost controls in BFF
- Prompt injection testing
- Hallucination eval suite
- Retrieval accuracy eval suite
- Error handling and graceful degradation
- **Success:** All evals pass green

### Phase 7: Scale Optimization (ongoing)
- Monitor token usage and costs
- Index optimization as corpus grows
- Response caching for common queries
- Performance monitoring

---

## 12. Repo-Level Change Plan

### New Files

| Path | Purpose |
|------|---------|
| `bff/` or `api/` | BFF proxy (Cloudflare Worker / Vercel Edge Function) |
| `scripts/build-context-chunks.ts` | Build-time section-level content extraction |
| `public/context-chunks.json` | Section-level content for retrieval |
| `src/lib/chat/claude-service.ts` | Client-side Claude API wrapper (calls BFF) |
| `src/lib/chat/intent-classifier.ts` | Query intent detection |
| `src/lib/speech/speech-input.ts` | Web Speech API wrapper |
| `src/components/SpeechButton.tsx` | Mic button component |

### Modified Files

| Path | Change |
|------|--------|
| `src/components/ChatPanel.tsx` | Replace search-based responses with Claude streaming |
| `src/components/SearchDialog.tsx` | Add mic button, wire speech input |
| `src/components/GlobalChatProvider.tsx` | Add context assembly logic |
| `scripts/build-search-index.ts` | Already extended with headingIds |
| `package.json` | Add BFF scripts, mermaid dependency |
| `.env.local` | Add ANTHROPIC_API_KEY (BFF-only) |

---

## 13. Confidence Score

| Subsystem | Confidence | Notes |
|-----------|------------|-------|
| Client-side search | 95% | Already working, just wired scope toggle |
| BFF proxy | 90% | Standard pattern, well-documented |
| Claude integration | 90% | Anthropic SDK is mature |
| Context retrieval | 85% | Build-time chunks are simple; quality depends on chunk design |
| Artifact generation | 80% | Depends on prompt engineering quality |
| Speech input | 90% | Web Speech API is stable in Chrome/Edge |
| Virima-first ranking | 85% | Requires careful prompt + result merging |
| Enterprise controls | 85% | Rate limiting and logging are standard |

**Overall implementation confidence: 87%**

**What blocks 100%:**
- Claude answer quality depends on prompt engineering (iterative)
- Artifact correctness requires eval suite to validate
- Speech API browser coverage is not universal
- BFF hosting choice needs validation

**How to raise confidence:**
- Phase 0 prototype validates core Claude integration
- Eval suite in Phase 6 validates quality
- Browser testing validates speech support

---

## 14. Final Verdict

| Question | Answer |
|----------|--------|
| Is this the ideal direction? | **Yes** — Claude-powered, doc-grounded, layered context |
| Is it enterprise-grade? | **Yes** — BFF security, rate limiting, eval suite, observability |
| Is it simple enough? | **Yes** — no vector DB, no custom models, no LangChain |
| Is it scalable enough? | **Yes** — static index scales to 500+ pages; vector search upgrade path exists |
| Is it powerful enough? | **Yes** — artifact generation, multi-scope, speech input |
| Does it prioritize Virima content? | **Yes** — Virima-first in all modes, web is lowest-priority fallback |
| Can it generate artifacts? | **Yes** — checklist, SOP, table, FAQ, diagram, runbook |
| Can it support speech input? | **Yes** — browser Web Speech API, progressive enhancement |

---

## 15. Source-of-Truth Precedence

Runtime truth order — assistant must respect this hierarchy:

| Priority | Source | Role |
|----------|--------|------|
| 1 | Current rendered page (DOM) | Highest — what the user is looking at |
| 2 | Published V6 docsite corpus (search index + chunks) | Authoritative published docs |
| 3 | Build-time artifacts (search-index.json, context-chunks.json) | Structured retrieval layer |
| 4 | GitHub source repo content | Fallback/reference — may drift from published |
| 5 | External web | Lowest — only when internal docs insufficient |

**Rule:** Published docs are runtime truth. GitHub repo is a fallback. They can drift. Never let GitHub source override what the published site shows.

---

## 16. Published / Searchable / Source-Only Content Contract

**Current risk:** 62 .md files exist but only 17 are indexed. The 45 unindexed files are a silent retrieval gap.

### Content Classification

Every file in `src/pages/content/` must be classified as:

| Classification | Meaning | In Search Index? | In Chat Retrieval? |
|----------------|---------|-------------------|---------------------|
| **Published + Searchable** | In navigationData, routable, user-facing | ✅ Yes | ✅ Yes |
| **Published, Not Searchable** | Exists but intentionally excluded (e.g., index.md) | ❌ No | ❌ No |
| **Source-Only** | Template, draft, non-routable | ❌ No | ❌ No |

### Implementation

Add a build-time validation check:

```
pnpm check:search-coverage
```

Reports:
- Files in navigationData → must be in search index
- Files NOT in navigationData → flagged as source-only (expected or gap?)
- Stale index entries → file deleted but still indexed (should never happen with rebuild)

---

## 17. Unified Retrieval Contract

Search Docs, This Page DOM search, Ask Virima chat retrieval, and Search Web Virima-first retrieval must all share:

| Contract Element | Single Source |
|------------------|---------------|
| Canonical route model | `navigationData.ts` page IDs |
| Heading IDs | `generateSlug()` from `src/utils/extractHeadings.ts` |
| Exclusion rules | Only pages in `navigationData.ts` are retrievable |
| Metadata schema | `SearchIndexEntry` from `docs-search.ts` |
| Deleted-page handling | Full index rebuild on every build |

**Rule:** No system may find content that another system cannot. One retrieval contract for all surfaces.

---

## 18. Anchor / Deep-Link Contract

### Requirements

1. Heading IDs must be **deterministic** — same content always produces same ID
2. Heading IDs must be **build-stable** — regeneration does not change existing IDs
3. No duplicate heading IDs within a page
4. All citation anchors must resolve to real DOM elements

### Validation

Add to `pnpm check:setup` or standalone:

```
pnpm check:anchors
```

Checks:
- Every `headingId` in search-index.json has a corresponding heading in the rendered page
- No duplicate IDs per page
- No broken anchor links in citations
- IDs survive content regeneration without drift

---

## 19. Artifact Schema Registry

Each artifact type has a formal schema:

| Artifact | Required Fields | Citation | Export |
|----------|----------------|----------|--------|
| Summary | title, body, source_pages | ✅ | Markdown |
| Checklist | title, items[], source_page | ✅ | Markdown |
| SOP | title, steps[], prerequisites, source_pages | ✅ | Markdown |
| FAQ | title, qa_pairs[], source_pages | ✅ | Markdown |
| Comparison Table | title, headers[], rows[], source_pages | ✅ | Markdown, CSV |
| Runbook | title, sections[], source_module | ✅ | Markdown |
| Mermaid Diagram | title, diagram_code, source_page | ✅ | SVG, Markdown |
| Decision Tree | title, nodes[], source_page | ✅ | Markdown |

### Rendering Rules

- Text artifacts → react-markdown inline
- Diagrams → Mermaid.js with fallback to code block
- All artifacts → "Copy" and "Export as Markdown" buttons
- All artifacts → source provenance footer with page links

---

## 20. Unsupported Request / Refusal Policy

The assistant must explicitly refuse or partially answer when:

| Situation | Behavior |
|-----------|----------|
| Question not covered by docs | "I don't have documentation on that topic. Try searching the web or contact Virima support." |
| Operational claim without source | Refuse — never claim product behavior not in docs |
| UI steps absent from docs | "I can't confirm those exact steps from the current documentation." |
| External web treated as canonical | Always label: "This information is from external sources, not Virima documentation." |
| Confidential/security question | "Please contact Virima support for security-related inquiries." |

---

## 21. Feature Flags and Kill Switches

Before production rollout, implement flags:

| Flag | Default | Purpose |
|------|---------|---------|
| `ENABLE_ASK_VIRIMA` | `false` | Claude chat panel on/off |
| `ENABLE_ARTIFACT_GENERATION` | `false` | Artifact rendering on/off |
| `ENABLE_SEARCH_WEB` | `true` | Serper web search on/off |
| `ENABLE_SPEECH_INPUT` | `false` | Mic button on/off |
| `ENABLE_CLAUDE_RESPONSES` | `false` | Claude vs search-only fallback |

### Implementation

Environment variables checked at runtime. If Claude flag is off, chat panel degrades to existing search-result mode. No redeployment needed — just toggle the flag.

---

## 22. Search-Only Fallback Mode

When Claude API is down, rate-limited, or disabled:

1. Chat panel shows search results (existing behavior)
2. Citations still work (links to docs)
3. No synthesis, no artifact generation
4. Subtle banner: "AI assistant is temporarily unavailable. Showing search results."
5. Full search functionality remains (Search Docs, Search Web)

**Rule:** The site must never be broken by Claude API unavailability.

---

## 23. SLOs and Cost Budgets

| Metric | Target |
|--------|--------|
| Chat availability | 99.5% (when Claude API is up) |
| p95 response time | < 5 seconds for first token |
| p95 full response | < 15 seconds |
| Max failure rate | < 2% of chat requests |
| Max stale index age | < 24 hours after content change |
| Cost per 1,000 sessions | < $50 (Claude API + Serper) |
| Max conversation history | 50 messages per conversation |

---

## 24. Observability — Retrieval Quality Metrics

Beyond API metrics, log:

| Metric | Purpose |
|--------|---------|
| Retrieval hit rate | % of queries returning >= 1 relevant result |
| Zero-result rate | % of queries with no results |
| Citation click-through | Do users click cited sources? |
| Page-local vs site-wide ratio | How often is page context sufficient? |
| Artifact generation frequency | Which artifact types are most used? |
| Answer abandonment rate | User leaves without follow-up or action |
| Thumbs up/down by intent | Quality signal per use case |

---

## 25. Human Feedback and Documentation-Gap Detection

### Feedback Loop

Add to chat panel:
- "Was this helpful?" (thumbs up/down)
- "Incorrect citation" flag
- "Missing documentation" flag
- "Needs improvement" flag

### Documentation-Gap Mining

Aggregate:
- Top unanswered topics (queries with zero or weak results)
- Weakly grounded answers (Claude confidence < threshold)
- Missing page candidates (repeated queries with no matching docs)
- Missing troubleshooting content
- Missing glossary/synonym coverage

Surface as a weekly report to content team.

---

## 26. Versioning and Namespace Strategy

Define namespace now for future expansion:

```
{product}/{version}/{module}/{guide_type}/{page_slug}#{heading_id}
```

Example: `virima/6.1/admin/user-guide/ad-configuration-administration#prerequisites`

| Dimension | Current | Future |
|-----------|---------|--------|
| Product | Virima (only) | Multi-product |
| Version | 6.1 (only) | 6.1, 6.1.1, NG, 5.13 |
| Module | admin (only) | admin, cmdb, itsm, etc. |
| Guide type | Implicit | user-guide, admin-guide, troubleshooting, api |

---

## 27. Synonym and Terminology Mapping

Small controlled synonym layer for search:

| Term | Synonyms |
|------|----------|
| AD | Active Directory |
| RBAC | Role-Based Access Control, role access |
| CMDB | Configuration Management Database, asset repository |
| SNMP | Simple Network Management Protocol |
| SLA | Service Level Agreement |
| import | sync, ingestion |
| user | account, profile |

Stored as `public/synonyms.json`, loaded by search engine to expand queries.

---

## 28. Chunk Lineage Metadata

Every chunk in `context-chunks.json` stores:

| Field | Purpose |
|-------|---------|
| `pageSlug` | Which page this chunk belongs to |
| `headingPath` | Full heading hierarchy (e.g., "Configuration > Connection Settings") |
| `chunkOrder` | Position within the page (for context assembly) |
| `contentHash` | SHA-256 of chunk content (for staleness detection) |
| `sourceFilePath` | Relative path to .md file |
| `buildTimestamp` | When this chunk was generated |

---

## 29. Shadow-Mode Rollout Phase

Insert between Phase 0 and Phase 1:

### Phase 0.5: Shadow Mode (1 week)

- Claude processes real user queries internally
- Responses are logged but NOT shown to users
- Retrieval quality evaluated against gold eval set
- Answer grounding validated
- Citation accuracy checked
- No user-facing AI output until shadow-mode evals pass

**Success criteria:** 90% retrieval accuracy, 95% grounding accuracy, 0% hallucination on gold set

---

## 30. Gold Eval Set

Permanent eval pack tied to real V6 docs:

| Category | Example Query | Expected Behavior |
|----------|---------------|-------------------|
| Page-local | "What are the prerequisites for AD Config?" | Answer from current page |
| Cross-module | "How do user roles affect discovery?" | Cross-page synthesis |
| Troubleshooting | "Why is my AD sync failing?" | Troubleshooting steps from docs |
| Artifact | "Generate admin checklist for user setup" | Grounded checklist |
| Virima-first web | "SNMP discovery best practices" | V6 docs above web results |
| Negative/no-answer | "How do I configure Salesforce integration?" | Refusal — not in docs |
| Speech input | Dictate "configure SNMP" | Correct transcription |

Gold eval set is part of CI release gating.

---

## 31. BFF Security Hardening

Beyond hiding API keys:

| Control | Implementation |
|---------|---------------|
| Allowed-origin check | BFF validates `Origin` header matches docsite domain |
| CSRF protection | SameSite cookie or token-based request validation |
| Abuse throttling | Per-IP rate limit (20 req/min), per-session limit (100 req/hr) |
| Request size limit | Max 50KB request body (prevents context flooding) |
| Max conversation history | 50 messages (prevents token budget explosion) |
| Bot protection | User-Agent validation, optional reCAPTCHA for high-volume |

---

## 32. Build-Time Content Sanitization

Validate at build time that chunked page content:

- ✅ Strips unsafe HTML/scripts
- ✅ Contains only headings and visible content
- ✅ Ignores shell/footer/nav noise
- ✅ Does not contain secret-looking strings (regex check)
- ✅ Does not contain internal-only URLs
- ✅ Does not contain authoring artifacts (TODO, FIXME, draft markers)

Add to `pnpm check:security` scope.

---

## Updated Confidence Score

| Subsystem | Before | After Additions |
|-----------|--------|-----------------|
| Client-side search | 95% | 95% |
| BFF proxy | 90% | 92% (hardening spec added) |
| Claude integration | 90% | 90% |
| Context retrieval | 85% | 88% (unified contract + chunks) |
| Artifact generation | 80% | 83% (schema registry) |
| Speech input | 90% | 92% (browser policy defined) |
| Virima-first ranking | 85% | 87% (precedence + synonyms) |
| Enterprise controls | 85% | 90% (feature flags, fallback, SLOs) |
| Retrieval quality | N/A | 88% (gold eval set + shadow mode) |
| Content contract | N/A | 90% (published/searchable/source-only) |

**Updated overall confidence: 90%**

**What still blocks 100%:**
- Claude answer quality requires iterative prompt tuning (only provable through shadow mode)
- Artifact correctness requires the gold eval set to validate
- BFF hosting provider decision needs real-world latency testing
- Content team adoption of feedback loop is organizational, not technical

---

## 33. Backend Topology — Locked Down

### Chosen Runtime: Cloudflare Workers

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Cloudflare Workers | Edge-native, zero cold start, 30s CPU time, free tier generous |
| Domain | `api.docs.virima.com` or `docs.virima.com/api/*` | Subdomain or path-based — same CORS origin avoids preflight |
| Secret storage | Cloudflare Workers Secrets (encrypted, not in code) | Industry-standard, never in bundle |
| Deployment | Wrangler CLI from GitHub Actions | Matches existing CI/CD pattern |
| Caching | Cloudflare KV for common query results (TTL: 1 hour) | Reduces Claude API costs |
| Health check | `GET /api/assistant/health` → `{ status: "ok", model: "claude-sonnet-4-20250514" }` | Standard probe for monitoring |
| Timeout | 25s max per request (Cloudflare limit: 30s) | Streaming starts within 2s |
| Retry | 1 retry on 5xx from Claude API, exponential backoff | Resilience without cascading |

### API Contract

```
POST /api/assistant/chat/stream
  Body: { query, threadId, turnId, pageContext?, moduleContext?, conversationHistory[], sourceBundleId? }
  Response: SSE stream (text/event-stream)

POST /api/assistant/search-web
  Body: { query, pageContext?, moduleContext?, internalResults[] }
  Response: { internalResults[], externalResults[], sourceBundleId }

POST /api/assistant/feedback
  Body: { threadId, turnId, rating: "helpful"|"not-helpful", flags?: ["incorrect-citation"|"missing-docs"|"hallucination"] }
  Response: { ok: true }

GET /api/assistant/health
  Response: { status: "ok", model, uptime, version }

GET /api/assistant/config
  Response: { features: { askVirima, artifactGeneration, searchWeb, speechInput } }
```

### Observability Identifiers

| ID | Format | Purpose |
|----|--------|---------|
| `sessionId` | `sess_<uuid>` | Browser session (persists across conversations) |
| `threadId` | `thread_<uuid>` | One conversation thread |
| `turnId` | `turn_<timestamp>_<seq>` | One request-response pair |
| `requestId` | `req_<uuid>` | BFF-level trace ID |
| `sourceBundleId` | `bundle_<hash>` | Links Search Web results to Continue Chat context |

---

## 34. Search Web → Continue Chat Handoff

### Flow

```
1. User opens Search dialog → clicks "Search Web" tab
2. Types query → sees grouped results:
   ├── "From V6 Documentation" (internal, highest priority)
   └── "From the Web" (external, lower priority)
3. User clicks "Continue in Chat →" button on result set
4. Right-side chat panel opens
5. Conversation is seeded with:
   ├── original query
   ├── current page context (if on a doc page)
   ├── internal results shown
   ├── external results shown
   └── sourceBundleId (links search state to chat)
6. Claude synthesizes an answer using the full source bundle
7. User can ask follow-ups grounded in the same context
```

### Source Bundle Contract

```typescript
interface SearchWebSourceBundle {
  sourceBundleId: string;
  query: string;
  timestamp: string;
  currentPageContext?: {
    pageId: string;
    title: string;
    module: string;
    url: string;
    headings: string[];
  };
  internalResults: Array<{
    title: string;
    url: string;
    snippet: string;
    module: string;
    pageId: string;
    matchedHeading?: string;
    matchedHeadingId?: string;
    score: number;
  }>;
  externalResults: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
  }>;
}
```

### Continue Chat Button

- Appears at the bottom of Search Web results: **"Continue in Chat →"**
- Only shown when results exist (not on empty state)
- Click: closes search dialog, opens chat panel, seeds conversation
- Chat panel shows: "Continuing from your search for: *{query}*" as context indicator

### Chat Receives Bundle

The BFF `/api/assistant/chat/stream` endpoint accepts `sourceBundleId`:
- Fetches the bundle from Cloudflare KV (cached for 30 minutes)
- Injects internal results as primary context
- Injects external results as secondary context
- Claude's system prompt instructs: prioritize V6 documentation over external sources

---

## 35. Human-Side Pending Actions Checklist

These actions require human decisions or setup that Claude Code cannot perform:

### Before Phase 0 (Architecture Validation)

- [ ] **Create Cloudflare account** (or confirm existing) for Workers deployment
- [ ] **Obtain Anthropic API key** — create at console.anthropic.com, set usage limits
- [ ] **Choose domain strategy** — subdomain (`api.docs.virima.com`) or path (`docs.virima.com/api/*`)
- [ ] **Set DNS records** if using subdomain
- [ ] **Decision: Serper API** — keep current key or replace with alternative web search provider

### Before Phase 1 (Current-Page MVP)

- [ ] **Store ANTHROPIC_API_KEY** in Cloudflare Workers Secrets (not in code)
- [ ] **Store SERPER_API_KEY** in Cloudflare Workers Secrets (move out of VITE_ bundle)
- [ ] **Set Claude API usage budget** — recommend $50/month initial cap
- [ ] **Review and approve system prompt** for Claude (defines assistant persona and guardrails)
- [ ] **Approve feature flag defaults** (all flags `false` initially)

### Before Phase 2 (Full Retrieval)

- [ ] **Review content classification manifest** — confirm which 45 unindexed files are intentionally source-only vs missing from navigation
- [ ] **Approve synonym mapping** — review `synonyms.json` for terminology accuracy
- [ ] **Confirm chunk strategy** — review `context-chunks.json` sample for quality

### Before Phase 3 (Artifact Generation)

- [ ] **Review artifact schema registry** — approve artifact types and their citation requirements
- [ ] **Approve export formats** — Markdown, CSV, SVG — any restrictions?

### Before Phase 4 (Search Web)

- [ ] **Confirm Serper API budget** — web search adds per-query cost
- [ ] **Review Virima-first ranking rules** — approve precedence policy
- [ ] **Approve Continue Chat UX** — review mockup/prototype

### Before Phase 5 (Speech Input)

- [ ] **Approve privacy notice copy** — "Voice input uses your browser's built-in speech service"
- [ ] **Confirm browser support policy** — Chrome/Edge supported, Firefox graceful fallback

### Before Phase 6 (Enterprise Hardening)

- [ ] **Review gold eval set** — approve test questions and expected answers
- [ ] **Approve SLOs** — p95 latency, availability target, cost budget
- [ ] **Set up monitoring dashboard** — Cloudflare Analytics or external (Grafana, Datadog)
- [ ] **Approve rate limiting thresholds** — 20 req/min per IP, 100 req/hr per session

### Before Production Launch

- [ ] **Complete shadow-mode evaluation** — internal team reviews grounded answers
- [ ] **Sign off on retrieval accuracy** — 90% hit rate target
- [ ] **Sign off on grounding accuracy** — 95% target
- [ ] **Enable feature flags** — progressive rollout to users
- [ ] **Communicate launch** — internal announcement to content/support teams

### Ongoing Operations

- [ ] **Weekly:** Review documentation-gap mining report
- [ ] **Monthly:** Review Claude API cost report
- [ ] **Monthly:** Review feedback signals (thumbs up/down, incorrect citations)
- [ ] **Quarterly:** Review and update gold eval set
- [ ] **As needed:** Update synonym mapping when new terminology emerges

---

## Final Updated Confidence: 91%

| Addition | Confidence Impact |
|----------|-------------------|
| Backend topology locked down | +1% (removed "Cloudflare or Vercel" ambiguity) |
| Search Web → Continue Chat contract | +1% (biggest UX gap closed) |
| Human-side checklist | +0.5% (reduces implementation surprises) |
| Source bundle handoff | +0.5% (seamless search-to-chat continuity) |

**Previous: 90% → Updated: 91%**

Remaining 9% gap: Claude prompt engineering quality (only provable through shadow mode), content team organizational adoption, and real-world latency validation under load.
