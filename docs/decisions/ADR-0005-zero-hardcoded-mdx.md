# ADR-0005: Zero Hardcoded — MDX Content Extraction

## Status

Accepted

## Context

The `scripts/upkf/generate-artifacts-v2.mjs` generator contained 6,400+ lines, including ~380 lines of hardcoded content metadata (`SLUG_TOPIC_OVERRIDES` with 18 publication profiles + `PUBLICATION_I18N` with multilingual translations). This created several problems:

1. **LLM Context Risk:** Any AI-assisted modification risked hallucinating or truncating content when the file exceeded token limits.
2. **Editorial Bottleneck:** Adding or editing content required modifying a complex JavaScript file instead of writing prose.
3. **Format Inflexibility:** Hardcoded JS strings cannot support rich formatting (headings, lists, code blocks, React components) needed for essays, whitepapers, and simulations.
4. **Anti-Separation of Concerns:** Content, metadata, and generation logic were tangled in a single file.

## Decision

Adopt the **Programa Zero Hardcoded** with physical `.mdx` files as the canonical content store.

### Architecture

```text
content/
├── publications/     # research articles (8 slugs)
│   └── {slug}/
│       ├── index.pt-br.mdx   # Source of truth (frontmatter + body)
│       ├── index.en.mdx       # English translation
│       ├── index.es.mdx       # Spanish translation
│       ├── index.it.mdx       # Italian translation
│       └── index.he.mdx       # Hebrew translation (RTL)
├── essays/           # theological/philosophical essays (5 slugs)
├── whitepapers/      # technical whitepapers (5 slugs)
└── simulations/      # interactive simulations
    └── ia-2027/
        └── index.pt-br.mdx   # References data/simulations/ia-2027.ts
```

### Migration Strategy: Programmatic Extraction (Anti-Hallucination)

Instead of manually copying content in an LLM chat window (risk of truncation/hallucination), we created `scripts/temp/migrate-hardcoded-to-mdx.mjs` that:

1. Reads `generate-artifacts-v2.mjs` source text and extracts `SLUG_TOPIC_OVERRIDES` and `PUBLICATION_I18N` objects programmatically
2. Reads article bodies from `data/research/articles/{slug}/article.md`
3. Reads metadata from `data/research/articles/{slug}/metadata.json`
4. Generates physical `.mdx` files with YAML frontmatter + markdown body

This approach guarantees byte-level fidelity: 18/18 publications verified with identical line counts.

### Generator Refactoring

`generate-artifacts-v2.mjs` was refactored to:
- Import `gray-matter` for YAML frontmatter parsing
- Load `SLUG_TOPIC_OVERRIDES` and `PUBLICATION_I18N` from `content/*/index.pt-br.mdx` at startup via `loadContentOverrides()`
- Remove 330 lines of hardcoded content (6,433 → 6,103 lines)

### ContentOps Pipeline: `npm run content:publish`

A new orchestration script (`scripts/content/publish.mjs`) provides the Director's single-command workflow:

1. **Quality Gate** — Validates YAML frontmatter (required fields: title, slug, category, date, language)
2. **Localization Inventory** — Reports missing locale translations
3. **Regeneration** — Runs `upkf:generate` → `i18n:artifacts` → `sota:check` in correct sequence
4. **Git Auto-Commit** — Commits only if all validations pass

### MDX Rendering Infrastructure

- `next-mdx-remote` (v6) for server-side MDX compilation
- `lib/content/mdx-loader.ts` — Content loader with locale-aware file resolution
- `lib/content/mdx-components.tsx` — Component map + RTL wrapper (Hebrew `dir="rtl"`)
- Custom React components (e.g., `SimulationRenderer`) available in MDX via component map

## Consequences

- Content authors write `.mdx` files with standard YAML frontmatter — no JavaScript knowledge required
- The generator reads content dynamically, reducing coupling between content and code
- MDX supports React components (charts, interactive elements) alongside prose
- RTL Hebrew layout is handled at the wrapper level, not per-component
- SSG build time is unaffected (MDX compilation happens server-side, content is loaded at generate time)
- The migration script is in `scripts/temp/` — disposable after verification

## Metrics

- **Content files created:** 91 MDX files (19 pt-br + 72 translations across 4 locales)
- **Lines removed from generator:** 330 (6,433 → 6,103)
- **Fidelity verification:** 18/18 publications, 100% line-count match
- **SOTA validation:** 1000/1000 post-migration
