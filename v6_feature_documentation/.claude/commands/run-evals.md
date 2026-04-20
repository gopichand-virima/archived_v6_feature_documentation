# /run-evals

Execute documentation quality evals and report findings.

## Eval Suites
| Suite | Command | Checks |
|-------|---------|--------|
| `coverage` | `pnpm eval -- --suite=coverage` | PRD → doc parity |
| `structure` | `pnpm docs:structure` | Folder structure rules |
| `links` | `pnpm docs:links` | Internal link validity |
| `docs` | `pnpm docs:validate` | Content hygiene |
| `all` | `pnpm eval` | All suites |

## Severity
- RED: Must fix before release (pnpm eval exits non-zero)
- AMBER: Should fix (flagged but does not fail CI)
- GREEN: All clear

## Commands
```bash
pnpm eval                          # all suites
pnpm eval -- --suite=structure    # single suite
```

## Success Criteria
`pnpm eval` exits 0. Zero RED findings.
