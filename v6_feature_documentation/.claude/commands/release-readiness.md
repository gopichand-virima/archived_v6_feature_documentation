# /release-readiness

Full release readiness check — run before any deployment or major merge.

## Checklist

### Validation gates (blocking)
- [ ] `pnpm install` — clean install, no lockfile drift
- [ ] `pnpm typecheck` — zero TypeScript errors
- [ ] `pnpm check:security` — no hardcoded secrets
- [ ] `pnpm check:setup` — repo structure complete
- [ ] `pnpm check:paths` — path contract: no legacy paths, correct build output, no npm lockfiles
- [ ] `pnpm eval` — zero RED eval findings (nav-integrity + coverage + folder-parity)
- [ ] `pnpm build` — production build succeeds

### Security posture
- [ ] Run `/security-review` — all 11 steps pass with no Critical or High findings
- [ ] `nginx.conf` has correct CSP, security headers, and `listen 8080`
- [ ] `Dockerfile` uses `nginxinc/nginx-unprivileged:alpine` (non-root, port 8080)
- [ ] `docker-compose.yml` maps `8080:8080`
- [ ] `rehype-sanitize` is in `MDXRenderer.tsx` rehypePlugins after `rehypeRaw`
- [ ] `.github/CODEOWNERS` present and covers Dockerfile, nginx.conf, workflows, memory

### Memory / governance
- [ ] `pnpm memory:check` — exits GREEN (0) or AMBER (1); RED (2) requires `/sync-repo-memory` first
- [ ] `repo-memory.json` `security_contract` section matches actual nginx.conf + Dockerfile

### Build artifacts
- [ ] `pnpm preview` — site loads correctly at `http://localhost:4173/FeatureDocsite/`
- [ ] No `package-lock.json` or `yarn.lock` present
- [ ] `pnpm-lock.yaml` is committed and not stale
- [ ] Git status clean — no uncommitted changes

## Commands (run in order, stop on first failure)
```bash
pnpm install
pnpm typecheck
pnpm check:security
pnpm check:setup
pnpm check:paths
pnpm memory:check
pnpm eval
pnpm build
pnpm preview
git status
```

## Success Criteria
All commands exit 0. `pnpm memory:check` exits 0 or 1. Git status shows clean working tree. `/security-review` produces no Critical or High findings.
