# ADR-0006: Core Web Vitals Gate

## Status

Accepted

## Context

Until 2026-09-01 the site measured performance nowhere. `sota:check` and `sota:full`
covered typing, i18n parity, tests, SEO metadata and structured data — none of which
notice a performance regression. A slower Largest Contentful Paint breaks no test and
fails no build; it surfaces weeks later in Search Console, after Google has already
measured it. Lighthouse had been parked as `🧊 GELO` in `HANDOFF.md` since the Grupo A
audit because it required a new dependency.

Field monitoring (RUM) was already solved and had simply not been recorded as done:
`@vercel/analytics` and `@vercel/speed-insights` are installed and mounted in
`app/[locale]/layout.tsx`. Verified on 2026-09-01:
`https://ulissesflores.com/_vercel/speed-insights/script.js` serves 200 (12,567 bytes),
so the project toggle is on and the field collector is live. Adding a second reporter
built on the `web-vitals` package would duplicate that collection for no new consumer.

What was missing is the laboratory half: a gate that fails a regression *before* it ships.

## Decision

Add Lighthouse CI (`@lhci/cli`) as step 10 of `sota:full`, configured by
`lighthouserc.json` at the repository root.

### Scope of measurement

Three URLs, three runs each, against the SSG build served by `next start` on port 4173
(clear of `next dev` on 3000 and Playwright on 3100):

- `/pt-br` — home
- `/pt-br/artigos` — a collection index
- `/pt-br/artigos/quantas-pessoas-usam-ia` — an article carrying the heaviest cover

### Asserted metrics and thresholds

| audit | level | threshold | why this number |
|---|---|---|---|
| `largest-contentful-paint` | error | 4500 ms | regression ceiling over a measured baseline of 3510–4118 ms |
| `cumulative-layout-shift` | error | 0.1 | the 2026 target; baseline is 0.000 on all three URLs |
| `total-blocking-time` | error | 200 ms | the 2026 INP target applied to its lab proxy; baseline is 0–2 ms |

Aggregation is `median` across the three runs.

Note for whoever reads the reports: `/pt-br` redirects to the apex, so `finalDisplayedUrl`
in the stored LHRs reads `/` and `/artigos` rather than the `/pt-br/...` URLs written in
`lighthouserc.json`. Baseline and thresholds were both measured through that same redirect,
so the comparison is self-consistent.

### Two deliberate deviations from the playbook

**1. INP is not asserted.** `interaction-to-next-paint` does not exist as a Lighthouse
audit in navigation mode — it requires a real user interaction, so a lab run cannot
produce it. Verified empirically against the 2026-09-01 baseline reports: the audit id
is absent from all nine. Total Blocking Time is the accepted lab proxy and is asserted
in its place; true INP comes from Speed Insights in the field.

**2. The LCP threshold is 4500 ms, not the 2.5 s target.** The measured baseline
(mobile emulation, 4× CPU throttling, median of three runs) is:

| URL | LCP | CLS | TBT | Performance |
|---|---|---|---|---|
| `/pt-br` | 3589 ms | 0.000 | 2 ms | 90 |
| `/pt-br/artigos` | 4118 ms | 0.000 | 0 ms | 86 |
| `/pt-br/artigos/quantas-pessoas-usam-ia` | 3510 ms | 0.000 | 0 ms | 90 |

A gate asserting 2500 ms would be red on the day it was written, and a gate that is red
by default gets disabled rather than obeyed — which would violate the rule that
`sota:check` must be green before any new work. The threshold therefore holds the line
where the site actually stands, so the gate catches *regression* today. Closing the gap
to 2.5 s is tracked as its own item in
`.claude/skills/seo-geo-sota/references/gaps-e-roadmap.md`; when it lands, this number
comes down with it.

## Consequences

**Positive.** A performance regression now fails `sota:full` before push instead of
appearing in Search Console weeks later. The baseline is written down, so the next
reader argues with a number instead of a memory.

**Negative.** `sota:full` grows by roughly two to three minutes (nine Lighthouse runs),
which is why the step carries a 900 s timeout instead of the 300 s default and stays out
of `sota:check` — the pre-commit hook must remain fast. Lighthouse numbers also vary
between machines; the thresholds have headroom over the baseline for that reason, and a
failure on a loaded laptop should be re-run before being believed.

**Known and not fixed here.** The baseline exposed two causes worth their own work,
recorded so they are not rediscovered from scratch:

1. On `/pt-br` and on the article page the LCP element is a *paragraph of text*, and
   render delay accounts for 3.0–3.8 s of it while TTFB is only ~450 ms. Text arriving
   that late points at font loading or hydration, not at the network.
2. On `/pt-br/artigos` the LCP element is the first article cover, and it carries
   `loading="lazy"` — a lazily loaded LCP image, which cost 1258 ms of load delay.

Neither is fixed by this ADR. This ADR instruments; fixing is a separate decision.
