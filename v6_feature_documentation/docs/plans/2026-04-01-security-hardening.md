# Security Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden the v6_feature_documentation platform against real, architecture-appropriate threats without adding unnecessary SaaS-style auth complexity.

**Architecture:** Static SPA (Vite → dist/) deployed to GitHub Pages via `deploy-pages.yml`. No user accounts. No backend. All API calls are frontend-only (VITE_ env vars). TLS provided automatically by GitHub Pages CDN. nginx/Docker retained for local preview only.

**Tech Stack:** React 18, Vite, nginx:alpine (local preview only), TypeScript, pnpm 9, GitHub Actions, GitHub Pages

---

## Security Applicability Assessment

### What is NOT needed (and why)

| Area | Decision | Reason |
|---|---|---|
| **Authentication / login** | NOT REQUIRED | Public documentation site — no user accounts, no login, no session state |
| **Authorization / RBAC** | NOT REQUIRED | No user-owned resources, no admin actions exposed through the site |
| **IDOR protections** | NOT REQUIRED | No user-specific data returned from any API |
| **Session management** | NOT REQUIRED | No server-side sessions; SPA state is ephemeral |
| **Backend CORS** | NOT REQUIRED | No Node/Express backend exists; nginx serves static files only |
| **Rate limiting in-app** | NOT REQUIRED | Belongs at ingress/WAF/Cloudflare layer; not in the React SPA |
| **CSRF tokens** | NOT REQUIRED | No state-changing backend endpoints |
| **Input sanitization for forms** | NOT REQUIRED | FeedbackSection uses EmailJS with placeholder IDs (non-functional) |

### What IS required (and why)

| Area | Risk | Decision |
|---|---|---|
| **Content rendering safety** | HIGH — `rehype-raw` renders arbitrary HTML from PRD-generated markdown; supply-chain compromise of v6_prds could inject `<script>` tags | REQUIRED |
| **nginx security headers** | MEDIUM — Missing CSP, Permissions-Policy, `server_tokens off` | REQUIRED |
| **Dockerfile non-root user** | MEDIUM — nginx runs as root with chmod 777 dirs; violates least-privilege | REQUIRED |
| **Secret scanner coverage** | MEDIUM — `verify-security.ts` misses Anthropic (`sk-ant-`), GitHub tokens | REQUIRED |
| **CI workflow permissions** | MEDIUM — `ci.yml` has no explicit permissions block (defaults to read-only but undocumented) | REQUIRED |
| **Supply-chain governance** | MEDIUM — No CODEOWNERS; workflow and Dockerfile can be modified without review | REQUIRED |
| **Production build hygiene** | LOW — `public/validate-fix.js` (testing utility) included in Docker production image | REQUIRED |
| **HTTPS / TLS** | MANAGED BY GITHUB PAGES — TLS is provided automatically by GitHub Pages CDN. nginx (local preview only) listens on port 8080. HSTS not needed in nginx.conf. | DOCUMENTED ONLY |
| **API key proxy** | CRITICAL risk (future work) — All VITE_ API keys are compiled into JS bundle and visible in DevTools. Mitigation: CSP `connect-src` restricts HTTPS-only calls. Full fix requires a BFF/proxy service (out of scope for this plan, documented as required future work). | PARTIAL MITIGATION + DOCUMENTED |

---

## Risks Identified (Full List)

| # | Risk | Severity | Status After Plan |
|---|---|---|---|
| R1 | `rehype-raw` in MDXRenderer.tsx allows HTML injection from PRD content | HIGH | FIXED (Task 2) |
| R2 | Missing CSP header in nginx.conf | MEDIUM | FIXED (Task 1) |
| R3 | Missing `Permissions-Policy` header | MEDIUM | FIXED (Task 1) |
| R4 | `server_tokens` not disabled (nginx version disclosure) | LOW | FIXED (Task 1) |
| R5 | Dockerfile: nginx runs as root; chmod 777 on dirs | MEDIUM | FIXED (Task 6) |
| R6 | `verify-security.ts` misses Anthropic key pattern `sk-ant-` | MEDIUM | FIXED (Task 3) |
| R7 | `verify-security.ts` misses GitHub PAT pattern `ghp_` | MEDIUM | FIXED (Task 3) |
| R8 | `ci.yml` has no explicit permissions block | LOW | FIXED (Task 4) |
| R9 | No CODEOWNERS file — workflows and Dockerfile unprotected | MEDIUM | FIXED (Task 5) |
| R10 | `public/validate-fix.js` (dev tool) included in prod Docker image | LOW | FIXED (Task 7) |
| R11 | VITE_ API keys exposed in JS bundle (OpenAI, Anthropic, etc.) | CRITICAL | PARTIAL MITIGATION (CSP connect-src limits to HTTPS; full proxy = future work) |
| R12 | `github-backup.yml` calls `Virima-Infra/github-backup@main` (unpinned) | LOW | DOCUMENTED (cannot pin without access to that repo) |
| R13 | `FEATURE_DOCSITE_PAT` previously used in git clone URL in `ci-cd.yml` | LOW | RESOLVED — `ci-cd.yml` (Docker → ECR → Kubernetes) was retired; GitHub Pages via `deploy-pages.yml` is now the sole production deployment path |
| R14 | Hardcoded email `gopichand.y@virima.com` in FeedbackSection.tsx | INFO | DOCUMENTED (EmailJS not configured; non-functional) |

---

## Task 1: Add missing security headers to nginx.conf

**Files:**
- Modify: `nginx.conf`

**Current state:** Has X-Content-Type-Options, X-Frame-Options, Referrer-Policy. Missing: CSP, Permissions-Policy, `server_tokens off`.

**Step 1: Read the current nginx.conf**

```bash
cat nginx.conf
```

**Step 2: Add the missing headers**

In the `server { }` block, after the existing `add_header` lines, add:

```nginx
# Disable nginx version disclosure
server_tokens off;

# Content-Security-Policy
# script-src 'self' — no inline scripts (Vite bundles everything to assets/)
# style-src 'self' 'unsafe-inline' — Tailwind + Radix use inline styles
# connect-src 'self' https: — API calls must be HTTPS only (partial API key mitigation)
# img-src 'self' data: https: — allows external images and data URIs
# frame-ancestors 'none' — prevents clickjacking (stronger than X-Frame-Options)
# object-src 'none' — blocks Flash/plugins
# base-uri 'self' — prevents base tag injection
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'self';" always;

# Permissions-Policy: restrict browser APIs not needed by a docs site
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()" always;
```

**Step 3: Verify build still passes**

```bash
pnpm build
```

Expected: `✓ built in Xs` — no errors.

**Step 4: Verify nginx.conf syntax (if Docker available)**

```bash
docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t
```

Expected: `nginx: configuration file /etc/nginx/nginx.conf test is successful`

**Step 5: Commit**

```bash
git add nginx.conf
git commit -m "security: add CSP, Permissions-Policy, server_tokens off to nginx"
```

---

## Task 2: Add rehype-sanitize to MDXRenderer.tsx

**Files:**
- Modify: `src/components/MDXRenderer.tsx`
- Run: `pnpm add rehype-sanitize`

**Why:** `rehype-raw` parses arbitrary HTML embedded in markdown. If a PRD is ever compromised (supply-chain attack on v6_prds), injected `<script>` tags would render and execute. `rehype-sanitize` sits after `rehype-raw` and strips dangerous elements/attributes while preserving safe HTML (tables, code blocks, divs).

**Step 1: Install rehype-sanitize**

```bash
pnpm add rehype-sanitize
```

Expected: Package added to dependencies, pnpm-lock.yaml updated.

**Step 2: Add type declaration check**

```bash
pnpm typecheck
```

Expected: Pass (rehype-sanitize ships types).

**Step 3: Modify MDXRenderer.tsx**

At the top of the file, add the import:

```typescript
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
```

Add the sanitize schema constant before the component (reuse `defaultSchema` and extend it to allow classNames and inline styles needed for syntax highlighting):

```typescript
// Sanitization schema: extends default to allow className and style attributes
// needed for Tailwind and react-syntax-highlighter. Blocks all script/event attributes.
const SANITIZE_SCHEMA = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] ?? []),
      'className',
      'style',
    ],
    code: [
      ...(defaultSchema.attributes?.['code'] ?? []),
      'className',
    ],
    span: [
      ...(defaultSchema.attributes?.['span'] ?? []),
      'className',
      'style',
    ],
    div: [
      ...(defaultSchema.attributes?.['div'] ?? []),
      'className',
      'style',
    ],
  },
}
```

In the `<ReactMarkdown>` component, add `rehypeSanitize` AFTER `rehypeRaw`:

```typescript
// BEFORE:
rehypePlugins={[rehypeRaw]}

// AFTER:
rehypePlugins={[rehypeRaw, [rehypeSanitize, SANITIZE_SCHEMA]]}
```

**Step 4: Run typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors.

**Step 5: Run build**

```bash
pnpm build
```

Expected: `✓ built in Xs` — no errors.

**Step 6: Commit**

```bash
git add src/components/MDXRenderer.tsx pnpm-lock.yaml package.json
git commit -m "security: add rehype-sanitize after rehype-raw to prevent XSS from HTML in markdown"
```

---

## Task 3: Expand verify-security.ts with additional secret patterns

**Files:**
- Modify: `scripts/checks/verify-security.ts`

**What to add:** Anthropic API key pattern (`sk-ant-`), GitHub personal access token patterns (`ghp_`, `github_pat_`).

**Step 1: Read the current SENSITIVE_PATTERNS array in verify-security.ts**

Look at lines 20-23.

**Step 2: Add new patterns**

Replace the existing `SENSITIVE_PATTERNS` array with:

```typescript
const SENSITIVE_PATTERNS: RegExp[] = [
  /sk-[a-zA-Z0-9]{20,}/,       // OpenAI API key (sk-...)
  /sk-ant-[a-zA-Z0-9\-_]{20,}/, // Anthropic API key (sk-ant-...)
  /AKIA[0-9A-Z]{16}/,           // AWS Access Key ID
  /ghp_[A-Za-z0-9]{36}/,        // GitHub Personal Access Token (classic)
  /github_pat_[A-Za-z0-9_]{22,}/, // GitHub Fine-grained PAT
]
```

**Step 3: Run the security check**

```bash
pnpm check:security
```

Expected: `PASS: No hardcoded secrets found in source files.`

**Step 4: Run validate**

```bash
pnpm validate
```

Expected: All checks pass.

**Step 5: Commit**

```bash
git add scripts/checks/verify-security.ts
git commit -m "security: expand secret scanner to cover Anthropic and GitHub token patterns"
```

---

## Task 4: Add explicit permissions blocks to GitHub Actions workflows

**Files:**
- Modify: `.github/workflows/ci.yml`

> **Note:** `ci-cd.yml` (Docker → ECR → Kubernetes) has been retired. The sole production deployment path is `deploy-pages.yml` (GitHub Pages). Only `ci.yml` needs updating.

**Why:** `ci.yml` has no `permissions` block. GitHub defaults to the repo-level permission setting (often `read-all`). Making it explicit documents intent and defends against policy drift.

### ci.yml

**Step 1: Read the current ci.yml validate job**

Lines 1-62.

**Step 2: Add permissions to the validate job**

Add directly under `jobs:` → `validate:` → `runs-on:`:

```yaml
    permissions:
      contents: read        # read source code only
      # No write permissions needed for validation
```

Add to the build job as well:

```yaml
    permissions:
      contents: read        # read source code only
```

### deploy-pages.yml

**Step 3: Verify existing permissions block**

Current: `permissions: contents: read, pages: write, id-token: write`

This is correct for GitHub Pages deployment. No change needed.

**Step 4: Run validate**

```bash
pnpm validate
```

Expected: All checks pass.

**Step 5: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "security: add explicit read-only permissions to CI validate/build jobs"
```

---

## Task 5: Create .github/CODEOWNERS

**Files:**
- Create: `.github/CODEOWNERS`

**Why:** Without CODEOWNERS, anyone with write access can modify security-sensitive files (Dockerfile, nginx.conf, workflows) without triggering a mandatory review. CODEOWNERS enforces review requirements when branch protection is enabled.

**Step 1: Create the file**

```
# CODEOWNERS — defines required reviewers for sensitive paths.
# When branch protection is enabled on main, changes to these paths
# require approval from the listed team/user before merging.
#
# Syntax: <pattern>  <owner1> [<owner2> ...]
# GitHub teams: @org/team-slug
# Individuals:  @username

# Default: all files require docs-team review
*  @virima-products/docs-team

# Infrastructure / deployment security
Dockerfile                    @virima-products/devops
nginx.conf                    @virima-products/devops
docker-compose.yml            @virima-products/devops
.github/workflows/            @virima-products/devops

# AI governance files — require docs lead review
CLAUDE.md                     @virima-products/docs-team
docs/memory/                  @virima-products/docs-team
scripts/memory/               @virima-products/docs-team

# Security scripts — require security-aware review
scripts/checks/               @virima-products/docs-team
scripts/validate-generation.ts @virima-products/docs-team
```

**Step 2: Commit**

```bash
git add .github/CODEOWNERS
git commit -m "security: add CODEOWNERS for supply-chain governance on sensitive paths"
```

---

## Task 6: Fix Dockerfile — run nginx as non-root user

**Files:**
- Modify: `Dockerfile`
- Modify: `nginx.conf` (listen port for non-root)
- Modify: `docker-compose.yml` (port mapping update)

**Why:** nginx runs as root (`user nginx;` is commented out, `chmod 777` applied to cache dirs). This violates least-privilege. A compromise of nginx in the container would have root access.

**Strategy:** Switch runtime image to `nginxinc/nginx-unprivileged:alpine`. This image:
- Runs nginx as user 101 (non-root) by default
- Listens on port 8080 (not 80, since binding <1024 requires root)
- No permission hacks needed

**Note:** Docker/nginx is used for **local preview only** — not production. Production is GitHub Pages. No K8s coordination needed.

**Step 1: Read the current Dockerfile**

Lines 1-32.

**Step 2: Rewrite the runtime stage**

Replace the runtime stage (lines 13-32) with:

```dockerfile
# ─── Runtime: unprivileged nginx ────────────────────────────────────────────
# Uses nginxinc/nginx-unprivileged which runs as non-root user (uid 101)
# and listens on port 8080.
FROM nginxinc/nginx-unprivileged:alpine

# Copy static build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html/FeatureDocsite

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 8080 is used by unprivileged nginx (non-root cannot bind <1024)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

**Step 3: Update nginx.conf listen port**

Change `listen 80;` to `listen 8080;`.

**Step 4: Update docker-compose.yml**

Change port mapping:
```yaml
ports:
  - "8080:8080"  # was 8080:80
```

**Step 5: Verify build**

```bash
pnpm build
docker build -t v6-feature-doc-site-test .
docker run --rm -p 8080:8080 v6-feature-doc-site-test
```

Expected: Site accessible at http://localhost:8080/FeatureDocsite/

**Step 6: Commit**

```bash
git add Dockerfile nginx.conf docker-compose.yml
git commit -m "security: run nginx as non-root user via nginxinc/nginx-unprivileged:alpine (port 8080)"
```

---

## Task 7: Exclude validate-fix.js from Docker production build

**Files:**
- Create/Modify: `.dockerignore`

**Why:** `public/validate-fix.js` is a testing/debugging utility. It should not be served in production. Adding it to `.dockerignore` prevents it from being `COPY`-ed into the build stage. Since the file is in `public/`, Vite copies it to `dist/` during build — the cleanest fix is to exclude it before the build runs.

**Step 1: Check if .dockerignore exists**

```bash
ls -la .dockerignore 2>/dev/null || echo "not found"
```

**Step 2: Create or update .dockerignore**

If `.dockerignore` does not exist, create it. If it does, append:

```
# Development/testing utilities — exclude from production build
public/validate-fix.js

# Local development artifacts
.env.local
.env.*.local
Full_Audit_Report.txt
*.tmp
*.temp

# Git and CI metadata
.git
.github
```

**Step 3: Rebuild Docker image and verify**

```bash
docker build -t v6-feature-doc-site-test .
docker run --rm -p 8080:80 v6-feature-doc-site-test sh -c "ls /usr/share/nginx/html/FeatureDocsite/ | grep validate"
```

Expected: No output (validate-fix.js excluded).

**Step 4: Commit**

```bash
git add .dockerignore
git commit -m "security: exclude public/validate-fix.js and dev artifacts from Docker production build"
```

---

## Task 8: Update CLAUDE.md with security model

**Files:**
- Modify: `CLAUDE.md`

**Why:** The security contract should be documented in the authoritative operating guide so future maintainers understand what is intentional and what is not.

**Step 1: Add a new section to CLAUDE.md after the "Quality Gates" section**

Add:

```markdown
---

## Security Model

### Architecture

This is a **public-facing static documentation site**. It has no user accounts, no backend, and no server-side state. The security model is:

| Layer | Owner | Mechanism |
|---|---|---|
| TLS / HTTPS | GitHub Pages CDN | TLS provided automatically; no nginx config needed |
| DDoS / rate limiting | WAF / Cloudflare | Edge-level; not in-app |
| Authentication | None required | Public documentation |
| Content rendering | `rehype-sanitize` | Sanitizes HTML from generated markdown |
| HTTP security headers | nginx.conf | CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| Secret scanning | `pnpm check:security` | Runs in CI; catches OpenAI, Anthropic, AWS, GitHub token patterns |
| Supply-chain | CODEOWNERS + CI gates | Requires review for Dockerfile, nginx.conf, workflows |

### API Key Exposure (Known Limitation)

All `VITE_*` environment variables are compiled into the JavaScript bundle and visible in the browser. This includes API keys for search (OpenAI, Anthropic, etc.).

**Current mitigation:** CSP `connect-src https:` restricts calls to HTTPS endpoints only.

**Required future work:** API calls must be proxied through a backend-for-frontend (BFF) service before this platform is exposed to untrusted networks. Until then, keys should be scoped/restricted at the API provider level (domain restrictions, usage limits).

### What Claude agents MUST NOT do
- Add login/auth systems to this app — not the right architecture
- Expose `ANTHROPIC_API_KEY` or any secret in VITE_ env vars for CI generation (use server-side env only)
- Disable `rehype-sanitize` without adding an equivalent protection
- Change nginx.conf without passing `pnpm validate`
```

**Step 2: Run validate**

```bash
pnpm validate
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(security): add security model section to CLAUDE.md"
```

---

## Task 9: Update repo-memory.json with security contract

**Files:**
- Modify: `docs/memory/repo-memory.json`

**Step 1: Add `security_contract` section to repo-memory.json**

After the last section in the JSON (before the closing `}`), add:

```json
"security_contract": {
  "_note": "Security model for this static documentation platform",
  "auth_model": "none — public documentation site, no user accounts",
  "rbac": "not applicable",
  "tls_termination": "GitHub Pages CDN — TLS provided automatically; nginx is local preview only",
  "content_rendering": "rehype-sanitize after rehype-raw blocks XSS from PRD-generated markdown",
  "http_security_headers": "CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy in nginx.conf",
  "secret_scanner": "scripts/checks/verify-security.ts — patterns: sk- (OpenAI), sk-ant- (Anthropic), AKIA (AWS), ghp_/github_pat_ (GitHub)",
  "api_key_exposure": "KNOWN RISK — VITE_ keys compiled into JS bundle. Partial mitigation: CSP connect-src https:. Full fix: BFF proxy (future work)",
  "supply_chain": "CODEOWNERS on .github/workflows/, Dockerfile, nginx.conf, CLAUDE.md",
  "docker_security": "nginxinc/nginx-unprivileged:alpine — non-root user, port 8080"
}
```

**Step 2: Bump memory version**

Increment `memory_version` by one patch (e.g., `1.1.4` → `1.1.5`) and update `generated_at` to today.

**Step 3: Run memory check**

```bash
pnpm memory:check
```

**Step 4: Commit**

```bash
git add docs/memory/repo-memory.json
git commit -m "chore(memory): add security_contract section — v1.1.5"
```

---

## Task 10: Final validation and merge

**Step 1: Run full validation suite**

```bash
pnpm validate
```

Expected:
- TypeScript check: PASS
- Security check: PASS
- Setup check: 38+ OK, 0 errors
- Path contract: 10 OK, 0 errors

**Step 2: Run evals**

```bash
pnpm eval
```

Expected: GREEN (AMBER warnings only, no RED)

**Step 3: Run build**

```bash
pnpm build
```

Expected: `✓ built in Xs`

**Step 4: Run memory check**

```bash
pnpm memory:check
```

Expected: GREEN or AMBER (AMBER is advisory after changes)

**Step 5: Push to main**

```bash
git push
```

---

## Implementation Notes

### Decisions deferred (not in scope)

1. **API proxy / BFF service** — Moving VITE_ API keys to a backend proxy is the correct long-term fix for R11. Out of scope for this hardening pass. Tracked in CLAUDE.md as required future work.

2. **HSTS** — Not applicable to nginx.conf (nginx is local preview only). GitHub Pages CDN handles HTTPS/HSTS automatically for the production deployment.

3. **FeedbackSection email address** — `gopichand.y@virima.com` is hardcoded. EmailJS is not configured (placeholder service IDs). Low severity; non-functional. No change needed.

4. **github-backup @main pin** — Cannot pin without access to Virima-Infra/github-backup. Flagged as low-severity supply-chain risk.

5. **Task 6 Docker port** — The Dockerfile port change (80 → 8080) is for local preview only. No K8s coordination required; production runs on GitHub Pages.
