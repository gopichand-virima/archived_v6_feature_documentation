# Enterprise Assistant Architecture — Plan Tracker

## Status: ACTIVE — In Planning (Pre-Implementation)

**Plan file:** `docs/plans/2026-04-04-enterprise-assistant-architecture.md`
**Created:** 2026-04-04
**Last updated:** 2026-04-04
**Owner:** Gopichand Y
**Confidence:** 91%

---

## What This Plan Covers

A comprehensive enterprise-grade assistant for the V6 Feature Documentation website:

- **Claude-powered Q&A** grounded in V6 documentation
- **Layered context:** This page → This module → All docs → Search Web (Virima-first)
- **Artifact generation:** Checklists, SOPs, FAQs, tables, diagrams from doc content
- **Speech-to-text:** Browser Web Speech API, progressive enhancement
- **Search Web → Continue Chat:** Seamless handoff from search results to Claude chat
- **BFF proxy:** Cloudflare Workers to hide API keys
- **Enterprise controls:** Feature flags, fallback mode, SLOs, observability

---

## Plan Sections (35 total)

| # | Section | Status |
|---|---------|--------|
| 1 | Current Repo Reality | Complete |
| 2 | Ideal Assistant Vision | Complete |
| 3 | Recommended Architecture | Complete |
| 4 | Retrieval, Ranking, Context Strategy | Complete |
| 5 | Artifact Generation Strategy | Complete |
| 6 | Chat/Search Panel UX | Complete |
| 7 | Speech-to-Text Strategy | Complete |
| 8 | Security & Enterprise Controls | Complete |
| 9 | Simplicity & Scalability | Complete |
| 10 | Evals & Quality Gates | Complete |
| 11 | Implementation Roadmap (8 phases) | Complete |
| 12 | Repo-Level Change Plan | Complete |
| 13 | Confidence Score | Complete |
| 14 | Final Verdict | Complete |
| 15 | Source-of-Truth Precedence | Complete |
| 16 | Published/Searchable/Source-Only Contract | Complete |
| 17 | Unified Retrieval Contract | Complete |
| 18 | Anchor/Deep-Link Contract | Complete |
| 19 | Artifact Schema Registry | Complete |
| 20 | Unsupported Request/Refusal Policy | Complete |
| 21 | Feature Flags & Kill Switches | Complete |
| 22 | Search-Only Fallback Mode | Complete |
| 23 | SLOs & Cost Budgets | Complete |
| 24 | Observability — Retrieval Quality | Complete |
| 25 | Human Feedback & Gap Detection | Complete |
| 26 | Versioning & Namespace Strategy | Complete |
| 27 | Synonym & Terminology Mapping | Complete |
| 28 | Chunk Lineage Metadata | Complete |
| 29 | Shadow-Mode Rollout Phase | Complete |
| 30 | Gold Eval Set | Complete |
| 31 | BFF Security Hardening | Complete |
| 32 | Build-Time Content Sanitization | Complete |
| 33 | Backend Topology (Cloudflare Workers) | Complete |
| 34 | Search Web → Continue Chat Handoff | Complete |
| 35 | Human-Side Pending Actions Checklist | Complete |

---

## Implementation Phases

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 0 | Architecture Validation | 1 week | Not started |
| 0.5 | Shadow Mode | 1 week | Not started |
| 1 | Current-Page Assistant MVP | 2 weeks | Not started |
| 2 | Full-Docsite Retrieval | 2 weeks | Not started |
| 3 | Artifact Generation | 2 weeks | Not started |
| 4 | Virima-First Search Web | 1 week | Not started |
| 5 | Speech Input | 1 week | Not started |
| 6 | Enterprise Hardening | 2 weeks | Not started |
| 7 | Scale Optimization | Ongoing | Not started |

---

## Human-Side Actions Before Phase 0

- [ ] Create Cloudflare account for Workers
- [ ] Obtain Anthropic API key (console.anthropic.com)
- [ ] Choose domain strategy (subdomain vs path-based)
- [ ] Set DNS records if using subdomain
- [ ] Decision on Serper API (keep or replace)

See §35 in the plan for full phase-by-phase checklist.

---

## Plan Evolution Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-04-04 | Initial plan (§1–14) | Core architecture, retrieval, artifacts, speech, rollout |
| 2026-04-04 | Added §15–32 | Enterprise additions: contracts, flags, SLOs, evals, security |
| 2026-04-04 | Added §33–35 | Backend topology, Search Web → Chat handoff, human checklist |

---

## How to Resume This Plan

When starting a new Claude session to continue this work:

1. Read `docs/plans/2026-04-04-enterprise-assistant-architecture.md` for the full plan
2. Read this file (`docs/memory/assistant-plan-tracker.md`) for current status
3. Check the implementation phase table above for where to start
4. Check the human-side actions checklist for prerequisites
5. The plan is iterative — improvements are expected before implementation begins
