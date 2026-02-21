# ulissesflores.com

Personal website treated as a long-lived digital product, focused on clarity, performance, and high engineering standards.

**Production:** https://ulissesflores.com

---

## Overview

This repository contains the source code for **ulissesflores.com**. Although personal in nature, the project is operated with professional software engineering practices:

- documentation-as-code
- explicit decision-making (ADRs)
- traceable changes (changelog + versioning)
- SEO, performance, accessibility, and security as first-class concerns

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Deployment:** Vercel (Git-integrated)
- **Domain:** `ulissesflores.com`

---

## Documentation & Governance

The repository is the single source of truth:

- [`decisions/`](./decisions/) — Architecture Decision Records (ADRs)
- [`docs/`](./docs/) — Operational and product documentation
- [`CHANGELOG.md`](./CHANGELOG.md) — Notable changes (Keep a Changelog)

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.



**Deployment**
--------------

Deployments are automated via Git → Vercel.

-   Pushes to main trigger production deployments

-   Preview deployments are created for pull requests



**Repository Notes**
--------------------

-   Public repository by default

-   Secrets are never committed

-   Environment variables are managed via Vercel






