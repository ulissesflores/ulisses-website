# ADR-0001: Vision and Engineering Principles for ulissesflores.com

## Status
Accepted

## Context
ulissesflores.com is a personal website treated as a long-lived digital product. The project must evolve with high engineering standards while preserving agility and low operational overhead.

The website is developed in a public GitHub repository and deployed via Git-to-Vercel with a custom domain. The codebase uses Next.js (App Router) and TypeScript.

Key requirements:
- Maintain a single source of truth for technical and operational knowledge.
- Keep the project easy to change, safe to deploy, and simple to operate.
- Ensure SEO, performance, accessibility, and maintainability are first-class concerns.
- Avoid unnecessary complexity while remaining “engineering-grade”.

## Decision
We will operate ulissesflores.com under the following vision and engineering principles:

### Product Vision
1. **Professional presence**: The site is the canonical public presence for Ulisses and should represent high-quality engineering and communication.
2. **Content clarity**: The site should present content with minimal friction (fast, readable, accessible).
3. **Incremental evolution**: Prefer continuous improvement over large rewrites; changes should be delivered frequently and safely.

### Scope and Non-Goals
1. **In scope**: pages, content, projects, writing, SEO, performance, accessibility, analytics, and maintainable UI.
2. **Non-goals (unless explicitly revisited)**:
   - Complex backend services not essential to the site.
   - Premature microservices or heavy infrastructure.
   - CMS adoption without a clear need and documented decision.

### Engineering Principles
1. **Docs-as-code is mandatory**
   - The repository is the single source of truth for documentation.
   - Documentation must be updated alongside code changes when applicable.

2. **Explicit decision-making**
   - Significant decisions require ADRs under `/decisions`.
   - ADRs follow the Michael Nygard structure: Context, Decision, Consequences.
   - ADRs are short, pragmatic, and written to prevent future re-litigation.

3. **Traceable change management**
   - Maintain `CHANGELOG.md` following “Keep a Changelog”.
   - Use Semantic Versioning (SemVer) to communicate change impact.
   - Prefer small, reviewable changes with clear intent.

4. **Operational excellence with minimal overhead**
   - Deployment is automated via Git → Vercel.
   - The site must remain easy to run locally and easy to deploy.
   - Maintain a lightweight runbook for incidents and routine operations.

5. **Quality attributes are first-class**
   - SEO, performance, accessibility, and security are engineering concerns, not afterthoughts.
   - Regressions in these areas are treated as defects.

6. **Public repository discipline**
   - The repository remains public by default.
   - Secrets must never be committed (no exceptions).
   - Environment variables are managed via Vercel and documented via safe examples.

### Communication and Workflow
1. **Working language**
   - Human collaboration: Portuguese (pt-BR).
   - Artifacts (docs/ADRs/changelog): English.

2. **Conversation vs repository**
   - ChatGPT project: planning, reasoning, backlog, trade-offs, and guidance.
   - Git repository: source of truth (code + documentation + decisions).

## Consequences
### Positive
- Clear, durable governance for future changes without centralizing knowledge in a single person or conversation.
- Reduced rework by capturing rationale and avoiding repeated debates.
- Higher confidence in shipping changes quickly due to structured change management.
- Better long-term maintainability and easier onboarding for “future-you”.

### Negative / Trade-offs
- Small added discipline: meaningful changes require documentation/ADR updates.
- Slight overhead to keep changelog/versions consistent.
- Requires proactive secret hygiene due to the public repository.

### Follow-ups
- Create repository structure for governance artifacts:
  - `/decisions/`
  - `/docs/`
  - `CHANGELOG.md`
- Add a runbook document under `/docs` for deployment, domain/DNS, environment variables, and troubleshooting.
- Create subsequent ADRs for:
  - deployment strategy (Vercel environments, branch policy)
  - SEO strategy (metadata, sitemap/robots, canonical policy, structured data)
