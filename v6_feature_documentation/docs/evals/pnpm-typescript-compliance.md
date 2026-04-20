# Eval: pnpm + TypeScript Compliance

**Suite:** `compliance`
**Severity:** RED for pnpm violations, AMBER for structural gaps

## RED checks (fail CI)
- `pnpm-lock.yaml` must exist
- `package-lock.json` must NOT exist at root
- `packageManager` in package.json must start with `pnpm`
- Root JS files (`check-env.js`, `verify-security.js`, `verify-setup.js`) must NOT exist

## AMBER checks
- `CLAUDE.md` must exist
- `.claude/commands/` directory must exist
- `scripts/checks/` directory must exist
