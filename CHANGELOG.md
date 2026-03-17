# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — Lote 22: Higiene SOTA e Erradicação DRY

- `scripts/config/i18n.config.mjs` — Single Source of Truth for locale configuration (Anti-DRY)
- `scripts/config/cognates.json` — Cognates and allowlists extracted from validator logic
- `scripts/config/anti-dry.test.ts` — 7 testes: anti-DRY grep, bundle safety, llms.txt integrity
- `markdownlint-cli` devDependency and `.markdownlint.json` config
- `lint:md` script for markdown quality gate
- Markdown Lint as step 2/6 in `sota-validate.mjs` (SPOF Prevention)
- `ADR-0002-automated-translation-pipeline.md` — Translation pipeline architecture
- `ADR-0003-master-validation-sota-check.md` — Master validation pipeline philosophy

### Changed — Lote 22

- Refactored 8 scripts to import locales from central config
- `sota-validate.mjs` now has 6 gates (was 5): TypeScript, Markdown Lint, i18n Parity, Tests, SEO, Rich Results
- `README.md` rewritten to expose I18n pipeline and SOTA quality gates
- `CHANGELOG.md` updated with all lotes (14-22)

### Added — Lote 21: QA Absoluto e RTL Rendering

- 3 RTL direction tests in `data/i18n.test.ts` (he=rtl, ltr for others, he is only RTL)
- Turbopack warning in `docs/i18n-workflow.md`
- STUB_COPY audit (zero real stubs found — 13 PT-ES cognates are legitimate)

### Added — Lote 20: Master Validation Pipeline (A Lei do Código)

- `scripts/sota-validate.mjs` — Single orchestrator for all validation gates
- `sota:check` and `sota:full` npm scripts
- Husky `pre-commit` → `sota:check`, `pre-push` → `sota:full`

### Added — Lote 19: Zero-Trust Pipeline Resilience

- Hard Fail in production (VERCEL=1/CI=true) if `GEMINI_API_KEY` missing
- Charset validators: Hebrew ≥20% Unicode, anti-copy detection
- 4 new anti-hallucination tests

### Added — Lote 18-B: Full Build Pipeline Automation

- `translate-generated-artifacts.mjs` — Gemini API translation of generated TypeScript
- `generate-llms-txt.mjs` — Dynamic `public/llms.txt` from publications data
- `prebuild` script: generate → translate → llms.txt → build
- 26 new i18n tests (charset validation, completeness)

### Changed — Lote 18: Overlay Elimination

- Eliminated overlay pattern entirely — translations live inside generated TypeScript
- `generate-artifacts-v2.mjs` produces fully-typed publications and knowledge data
- Structural parity enforced by `validate-parity.mjs` (4420 keys × 4 locales)

### Fixed — Lote 16: Menu Alignment and IT/HE Translations

- Fixed i18n menu alignment across 5 locales
- Completed Italian and Hebrew translations for navigation

### Fixed — Lotes 14+15: Self-Referencing Canonical URLs

- `buildCanonical()` now injects locale prefix into canonical URLs
- Fixed "Alternate page with proper canonical tag" Google Search Console error
- HTTP 308 redirects for SEO juice preservation
- 9 canonical URL tests in `data/seo.test.ts`

## [0.1.0] — Initial Release

### Added

- Initial governance baseline for the project
- Architecture Decision Records (ADR) structure
- ADR-0001 defining vision and engineering principles
- Changelog following Keep a Changelog standard
- Robots metadata route to generate /robots.txt
- Initial /docs structure (index, runbook, SEO plan)

### Changed

- Replaced the default Next.js template README with project-specific documentation and governance references
