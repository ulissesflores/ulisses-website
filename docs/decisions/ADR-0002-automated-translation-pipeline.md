# ADR-0002: Automated Translation Pipeline (Gemini API Post-Build)

## Status

Accepted

## Context

The project ulissesflores.com serves content in 5 locales (pt-br, en, es, it, he). Initially (Lotes 1-17), translations were managed through manual overlay patterns — separate files duplicating the base dictionaries with translated strings. This approach had critical flaws:

1. **Overlay Drift:** Translated files diverged structurally from the source (pt-br), causing missing keys and type errors.
2. **Manual Labor:** Every new key required editing 5 files manually.
3. **No Verification:** No automated way to detect stubs (untranslated strings copied from pt-br).

The Lote 17 attempt to solve this with an "overlay architecture" pattern introduced more complexity without solving the root cause.

## Decision

We adopted **automated translation via Google Gemini API in a post-build pipeline** (Lotes 18/18-B):

1. All content is authored **exclusively in pt-br** (Single Source of Truth).
2. The `prebuild` script runs `upkf:generate` → `translate-generated-artifacts.mjs` → `generate-llms-txt.mjs` before `next build`.
3. `translate-generated-artifacts.mjs` calls the Gemini API (`gemini-2.5-flash`, temperature 0.3) to translate missing fields in generated TypeScript files.
4. Translated content is written directly into the `.generated.ts` files as locale-specific fields.
5. The pipeline is **non-destructive** — it only translates missing fields, never overwrites existing translations.
6. In production (VERCEL=1, CI=true), missing `GEMINI_API_KEY` causes **Hard Fail** (exit 1).

### Overlay Elimination

All overlay files were removed. The translation lives inside the generated TypeScript objects, co-located with the source data. This means:

- Type safety is guaranteed by TypeScript (the generated type includes all locale fields).
- Structural parity is enforced by `validate-parity.mjs` (4420 keys × 4 locales).
- No file can "drift" because there's only one file per data domain.

## Consequences

### Positive

- Zero manual translation work for existing and new content
- Structural parity guaranteed by automated validation (0 errors, 0 warnings)
- Single Source of Truth eliminates drift
- Anti-hallucination: charset validators reject translations without target-language characters (e.g., Hebrew must contain ≥20% Hebrew Unicode)

### Negative

- **Network dependency:** Translation requires API access. Mitigated by graceful fallback in dev and hard fail in production.
- **Translation quality:** LLM translations may sound "robotic" for literary/theological content. Mitigated by `--force` flag for re-translation and manual override capability.
- **Cost:** API calls per build. Mitigated by skip logic (only translates missing fields).

### Risks

- If Gemini API changes response format, translations may fail silently. Mitigated by charset validators.
- Cultural localization (idioms, tone) is not perfect. Accepted trade-off for a personal portfolio site.

## References

- Lote 18: Initial overlay elimination
- Lote 18-B: Full pipeline automation with anti-hallucination
- Lote 19: Zero-trust resilience (hard fail in production)
