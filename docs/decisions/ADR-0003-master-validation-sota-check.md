# ADR-0003: Master Validation Pipeline (sota:check)

## Status

Accepted

## Context

Across Lotes 14-19, validation was fragmented: TypeScript checks, i18n parity, SEO validation, rich results, and unit tests were run as separate, uncoordinated commands. The responsibility of remembering which checks to run — and in which order — fell on human memory or LLM context.

This created a reliability gap: it was possible to commit code that passed TypeScript but broke i18n parity, or passed tests but had invalid JSON-LD.

## Decision

We created a **single orchestrator script** (`scripts/sota-validate.mjs`) that runs all validation gates in strict sequence, aborting at the first failure (Lote 20):

### Gates (in order)

1. **TypeScript** (`tsc --noEmit`) — Type safety
2. **Markdown Lint** (`markdownlint`) — Source content quality (Lote 22)
3. **i18n Parity** (`validate-parity.mjs`) — 4420 keys × 4 locales, 0 errors, 0 warnings
4. **Test Suite** (`vitest run`) — 270+ tests (charset, anti-copy, SEO, i18n, RTL)
5. **SEO Validate** (`validate-pre-deploy.mjs`) — Canonicals, hreflang, meta tags
6. **Rich Results** (`validate-rich-results.mjs`) — JSON-LD, DID, Schema.org
7. **Build** (optional, `next build`) — Full SSG compilation

### Integration

- `npm run sota:check` — Gates 1-6 (~2s), called by `pre-commit` Husky hook
- `npm run sota:full` — Gates 1-7 (includes build), called by `pre-push` Husky hook

### Philosophy: "Code > LLM Memory"

The core principle is that **the machine is the judge, not human memory**. Instead of instructing developers (or LLMs) to "remember to check X", we encode the check in the pipeline. If `sota:check` passes, the code meets the standard. Period.

## Consequences

### Positive

- Single command validates everything — no forgotten checks
- Pre-commit (~2s) is fast enough to not disrupt workflow
- Pre-push includes build to catch SSG-specific issues
- Exit code 1 on first failure prevents cascading errors

### Negative

- Adding a new validation gate requires editing `sota-validate.mjs` (single point of maintenance)
- `--no-verify` can bypass all hooks (mitigated by future CI/CD server-side integration)

### Future

- GitHub Actions integration to run `sota:full` on PR (prevents `--no-verify` bypass)
- Historical tracking of test count trends via `.sota-report.json`

## References

- Lote 20: Initial implementation (5 gates)
- Lote 22: Added Markdown Lint as gate 2 (6 gates)
