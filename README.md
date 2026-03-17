# ulissesflores.com

Personal website treated as a long-lived digital product, focused on clarity, performance, and high engineering standards.

**Production:** <https://ulissesflores.com>

---

## Overview

This repository contains the source code for **ulissesflores.com** — a multilingual (PT-BR, EN, ES, IT, HE/RTL) digital identity hub. Although personal, the project is operated with professional-grade software engineering:

- Documentation-as-code
- Explicit decision-making (ADRs)
- Traceable changes (Keep a Changelog)
- SEO, performance, accessibility, and security as first-class concerns
- Automated i18n pipeline with Gemini API

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Deployment:** Vercel (Git-integrated, SSG)
- **i18n:** 5 locales (pt-br, en, es, it, he) with RTL support
- **Translation:** Automated via Gemini API (post-build pipeline)
- **Testing:** Vitest (270+ tests, 17+ suites)
- **Quality Gate:** `sota:check` (pre-commit), `sota:full` (pre-push)

---

## Automation Pipeline (SOTA)

```text
npm run build
  1. upkf:generate         → publications, knowledge, JSON-LD
  2. translate-artifacts    → Gemini API (4 locales × all fields)
  3. generate-llms-txt      → public/llms.txt (dynamic)
  4. next build             → SSG × 5 locales
```

### Quality Gates

```bash
npm run sota:check     # Pre-commit: tsc + i18n parity + 270+ tests + SEO + JSON-LD (~2s)
npm run sota:full      # Pre-push: same + full build (~60s)
```

---

## Documentation & Governance

- [`docs/decisions/`](./docs/decisions/) — Architecture Decision Records (ADRs)
- [`docs/`](./docs/) — Operational docs, i18n workflow, SEO runbook
- [`CHANGELOG.md`](./CHANGELOG.md) — Notable changes (Keep a Changelog)

---

## Local Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

---

## Deployment

Deployments are automated via Git → Vercel.

- Pushes to `main` trigger production deployments
- Preview deployments are created for pull requests
- Secrets are managed via Vercel environment variables
