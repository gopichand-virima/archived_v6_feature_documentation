# /security-review — Security Posture Review

**Invoke with:** `/security-review`

**Purpose:** Perform a targeted security posture review of the `v6_feature_documentation` static documentation platform. Verifies that all implemented security controls are in place and correctly configured. Classifies any gaps by severity. This is a *narrow* review scoped to the actual threat surface of a public, static, auth-free documentation site — it does NOT look for auth/RBAC/session issues that are intentionally absent.

**When to invoke:**
- Before any release or deployment
- After changes to `Dockerfile`, `nginx.conf`, `src/components/MDXRenderer.tsx`, or `scripts/checks/`
- After adding or updating `VITE_*` environment variables
- When onboarding a new contributor who needs the security model explained
- After any dependency upgrade that touches `rehype-*` or build pipeline packages

Do NOT invoke for routine feature work — use `/repo-maintainer` instead.

---

## Step 0 — Load security contract

Read the security baseline before any inspection:
```
docs/memory/repo-memory.json  →  security_contract section
CLAUDE.md  →  ## Security Model section
```

These are the authoritative contracts. Any discrepancy between them and actual code is a **Critical** finding.

---

## Step 1 — Deterministic gates

Run blocking validators first. A non-zero exit is a **Critical** finding.

```bash
pnpm check:security    # scan for hardcoded secrets
pnpm check:paths       # verify no legacy path violations
pnpm typecheck         # no type errors that could mask security bugs
pnpm build             # full production build must succeed
```

---

## Step 2 — Secret scanner coverage

Inspect `scripts/checks/verify-security.ts` and verify the following patterns are present:

| Pattern | Protects |
|---------|---------|
| `sk-[a-zA-Z0-9]{20,}` | OpenAI API keys |
| `sk-ant-[a-zA-Z0-9\-_]{20,}` | Anthropic API keys |
| `AKIA[0-9A-Z]{16}` | AWS access key IDs |
| `ghp_[A-Za-z0-9]{36}` | GitHub classic PATs |
| `github_pat_[A-Za-z0-9_]{22,}` | GitHub fine-grained PATs |

Also check that `verify-security.ts` is:
- Listed in `validate` script chain in `package.json`
- Listed in `.github/workflows/ci.yml` as a blocking step
- Excluded from its own scan (i.e., the patterns in the scanner source don't trigger false positives)

---

## Step 3 — nginx security headers

Read `nginx.conf` and verify all required headers are present and correct:

```bash
grep -n "add_header\|server_tokens\|listen" nginx.conf
```

**Required headers checklist:**
- [ ] `listen 8080` — NOT port 80 (unprivileged nginx requirement)
- [ ] `server_tokens off` — suppress nginx version disclosure
- [ ] `X-Content-Type-Options "nosniff"` — MIME type sniffing prevention
- [ ] `X-Frame-Options "SAMEORIGIN"` — clickjacking baseline (supplemented by CSP)
- [ ] `Referrer-Policy "strict-origin-when-cross-origin"` — referrer leakage control
- [ ] `Content-Security-Policy` — must include all of:
  - `script-src 'self'` (no 'unsafe-inline', no CDN scripts)
  - `style-src 'self' 'unsafe-inline'` (Tailwind/Radix inline styles permitted)
  - `connect-src 'self' https:` (HTTPS-only API calls)
  - `frame-ancestors 'none'` (clickjacking prevention — supersedes X-Frame-Options)
  - `object-src 'none'` (blocks legacy plugin attacks)
  - `base-uri 'self'` (prevents base injection attacks)
- [ ] `Permissions-Policy` — camera, microphone, geolocation, payment, usb, display-capture all `()`
- [ ] **ABSENT intentionally:** `Strict-Transport-Security` (HSTS is handled by GitHub Pages CDN automatically; nginx is local preview only — adding HSTS to a local HTTP server is incorrect)

Flag `add_header` directives that are missing the `always` qualifier — they won't apply to error responses without it.

---

## Step 4 — Container security

Read `Dockerfile` and `docker-compose.yml`:

```bash
grep -n "FROM\|EXPOSE\|USER\|chmod\|chown" Dockerfile
grep -n "ports:" docker-compose.yml
```

**Checklist:**
- [ ] Base image is `nginxinc/nginx-unprivileged:alpine` (NOT `nginx:alpine`)
- [ ] No `USER root` directive or `chmod 777` workarounds
- [ ] `EXPOSE 8080` (NOT 80)
- [ ] `docker-compose.yml` maps `8080:8080` (NOT `8080:80`)
- [ ] Build stage uses `node:20-alpine AS build` (pinned major version)
- [ ] `pnpm install --frozen-lockfile` (no lockfile drift in CI)

---

## Step 5 — Content rendering safety

Read `src/components/MDXRenderer.tsx`:

```bash
grep -n "rehype-sanitize\|rehypeRaw\|rehypeSanitize\|SANITIZE_SCHEMA" src/components/MDXRenderer.tsx
```

**Checklist:**
- [ ] `rehype-sanitize` is imported
- [ ] `rehypeSanitize` appears AFTER `rehypeRaw` in the `rehypePlugins` array
- [ ] A custom `SANITIZE_SCHEMA` is defined (extending `defaultSchema`) to allow Tailwind/Radix class/style attributes
- [ ] Schema allows: `className` and `style` on `*`, `code`, `span`, `div` — no arbitrary `on*` event handlers
- [ ] `rehype-sanitize` is listed in `package.json` dependencies (not devDependencies)

**Why order matters:** `rehype-raw` parses raw HTML from markdown. `rehype-sanitize` must run after to clean the parsed HTML tree. Reversed order would sanitize before HTML is parsed.

---

## Step 6 — Path contract validator

Read `scripts/checks/verify-paths.ts`:

```bash
grep -n "check\|FAIL\|thisScript\|pathMappingFile" scripts/checks/verify-paths.ts | head -20
```

**Checklist:**
- [ ] 8 checks are present: no `src/content/`, no `v6_1/` in non-exempted source, no git-tracked `build/`, `dist/` gitignored, no npm/yarn lockfiles, workflow output paths correct, doc-graph contract, search-index contract
- [ ] Script excludes itself from the `v6_1` scan (prevents false positive on its own error message strings)
- [ ] Build/ check uses `git ls-files` not `fs.existsSync` (only flags if git-tracked)
- [ ] `check:paths` appears in `package.json` scripts
- [ ] `check:paths` is a blocking step in `.github/workflows/ci.yml`

---

## Step 7 — Supply-chain governance

```bash
cat .github/CODEOWNERS
```

**Checklist:**
- [ ] Default owner requires docs-team review
- [ ] `Dockerfile`, `nginx.conf`, `docker-compose.yml` require `@virima-products/devops` review
- [ ] `.github/workflows/` requires devops review
- [ ] `CLAUDE.md`, `docs/memory/`, `scripts/memory/` require docs-team review
- [ ] `scripts/checks/verify-security.ts` has dedicated reviewer

---

## Step 8 — API key exposure documentation

Verify the known risk is documented and not suppressed:

```bash
grep -n "VITE_\|api_key_exposure\|BFF\|bundle" CLAUDE.md | head -10
grep -n "api_key_exposure_risk" docs/memory/repo-memory.json
```

**Checklist:**
- [ ] `CLAUDE.md` Security Model section documents the VITE_* bundle exposure risk
- [ ] `repo-memory.json` `security_contract.api_key_exposure_risk` documents the risk and BFF proxy as the full fix
- [ ] No `VITE_*` keys with real values are present in any committed file (enforced by `check:security`)
- [ ] Risk is classified as KNOWN and accepted until BFF proxy is implemented

---

## Step 9 — CI security pipeline

Read `.github/workflows/ci.yml`:

```bash
grep -n "check:security\|check:paths\|memory:check\|permissions:" .github/workflows/ci.yml
```

**Checklist:**
- [ ] `pnpm check:security` is a blocking CI step (no `continue-on-error: true`)
- [ ] `pnpm check:paths` is a blocking CI step
- [ ] `pnpm memory:check` is present (may be `continue-on-error: true`)
- [ ] `permissions: contents: read` is set on sensitive jobs to limit GITHUB_TOKEN blast radius

---

## Step 10 — Claude Code hooks

Read `.claude/settings.json`:

```bash
cat .claude/settings.json
```

**Checklist:**
- [ ] `PreToolUse` hook for `Bash` blocks `npm install`, `yarn`, `npx` with exit code 2 (blocking)
- [ ] `PreToolUse` hook for `Edit|Write|MultiEdit` warns on edits to `src/pages/content/` (pipeline-owned content)
- [ ] `PreToolUse` hook for `Edit|Write|MultiEdit` warns on `/v6_1/` legacy path usage
- [ ] `Stop` hook provides memory drift check reminder

---

## Step 11 — Synthesize and report

### Severity classification

| Severity | Definition |
|----------|-----------|
| **Critical** | Active vulnerability, wrong security facts in governance, broken validation, blocked deployment |
| **High** | Missing required security control, undocumented risk, supply-chain gap |
| **Medium** | Header misconfiguration, incomplete scanner coverage, governance gap |
| **Low** | Documentation improvement, optional hardening |

### Findings format

```
[SEVERITY] {Category} — {Short title}
Evidence: {exact file:line or command output}
Impact:   {what could go wrong if unaddressed}
Fix:      {exact action — file to edit, command to run}
```

### Final output structure

```
## Security Review — {date}

### Step 0–1 Gate Results
{command outputs and pass/fail status}

### Security Findings
{findings grouped by area, highest severity first}

### Priority-Ordered Remediation
1. Critical: ...
2. High: ...
3. Medium: ...
4. Low: ...

### Known Accepted Risks
- VITE_* API key bundle exposure — requires BFF proxy (future work)
- Rate limiting — enforced at WAF/ingress, not in-app

### Security Contract Status
{GREEN/AMBER/RED — whether all controls from security_contract are verified}
```

---

## What NOT to flag

Do not flag these — they are intentional design decisions for this architecture:

- No authentication or login system — public documentation site by design
- No RBAC, sessions, CSRF protection — no user-owned resources exist
- No IDOR protections — no user-specific data in any API response
- No backend CORS configuration — no backend exists
- No in-app rate limiting — handled at WAF/Cloudflare/ingress
- Absent HSTS header in nginx.conf — GitHub Pages CDN handles HSTS automatically; nginx is local preview only
- `style-src 'unsafe-inline'` in CSP — required by Tailwind and Radix UI inline styles; acceptable for a docs site
- `connect-src https:` is broad — intentional partial mitigation for API key exposure risk (full fix is BFF proxy)
