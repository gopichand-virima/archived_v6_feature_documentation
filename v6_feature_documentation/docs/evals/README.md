# Documentation Evals

Automated quality gates for feature documentation. Run via `pnpm eval`.

## Suites

| Suite | Command | What it checks |
|-------|---------|----------------|
| `structure` | `pnpm docs:structure` | PRD folder mirroring parity |
| `coverage` | `pnpm eval -- --suite=coverage` | Add/edit/delete section coverage |
| `compliance` | `pnpm eval -- --suite=compliance` | pnpm + TypeScript policy |
| `all` | `pnpm eval` | All suites |

## Severity
- **RED** — Must fix before release. `pnpm eval` exits non-zero.
- **AMBER** — Should fix. Flagged but CI continues.
- **GREEN** — All clear.

## Adding new evals
1. Add a new `eval*()` function in `scripts/evals/run-evals.ts`
2. Wire it into the suite runner
3. Document it in this README
