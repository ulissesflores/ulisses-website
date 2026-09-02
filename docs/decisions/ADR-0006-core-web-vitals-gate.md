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

- `/` — home
- `/artigos` — a collection index
- `/artigos/quantas-pessoas-usam-ia` — an article carrying the heaviest cover

These are the canonical, prefix-less forms — the ones the sitemap emits and the ones a
real visitor lands on. They were `/pt-br/...` until the amendment below; see it for why
that cost 602 ms of phantom latency in every measurement.

### Asserted metrics and thresholds

| audit | level | threshold | why this number |
|---|---|---|---|
| `largest-contentful-paint` | error | 3800 ms | regression ceiling over the current measured baseline of 2859–3438 ms (was 4500 ms over a baseline inflated by a redirect; see the amendment) |
| `cumulative-layout-shift` | error | 0.1 | the 2026 target; baseline is 0.000 on all three URLs |
| `total-blocking-time` | error | 200 ms | the 2026 INP target applied to its lab proxy; baseline is 0–2 ms |

Aggregation is `median` across the three runs.

Note for whoever reads the reports: `finalDisplayedUrl` now matches the requested URL.
The earlier version of this note called the `/pt-br` redirect harmless because baseline and
threshold were measured through it alike — self-consistent, but 602 ms above what any user
experiences. The amendment below corrects it.

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

## Amendment — 2026-09-02: two fixes, one refuted hypothesis

The two causes left open above were attacked. Both known-and-not-fixed items are now
resolved or reclassified, and the thresholds moved with the baseline.

**Fix 1 — the lazily loaded LCP image.** `app/[locale]/artigos/page.tsx` now passes
`priority` to the *first* cover only (`index === 0`); the rest keep the `next/image`
lazy default. `/artigos` went from 4118 ms to 3513 ms (−605 ms) and both
`lcp-lazy-loaded` and `prioritize-lcp-image` turned green.

**Fix 2 — the gate was measuring a redirect.** Every URL in `lighthouserc.json` was
written with the `/pt-br` prefix, which 301s to the prefix-less canonical. Lighthouse's
own `redirects` audit priced it: **602 ms, scored 0, on all nine runs**. No visitor pays
it — the sitemap, the canonical tag and every internal link use the prefix-less form.
Pointing the config at the canonical URLs removed it.

| URL | baseline (2026-09-01) | now | delta |
|---|---|---|---|
| `/` | 3589 ms | **3438 ms** | −151 ms |
| `/artigos` | 4118 ms | **2859 ms** | −1259 ms (−31 %) |
| `/artigos/quantas-pessoas-usam-ia` | 3510 ms | **3359 ms** | −151 ms |

Performance scores rose to 91 / 95 / 92. CLS stays 0.000 and TBT 0–2 ms.

**Refuted — the font-swap hypothesis.** The text-LCP delay on `/` and on the article page
was attributed above to "font loading or hydration". Font loading is out: rebuilding with
`display: 'optional'` on all four `next/font` families — which removes the swap repaint
entirely — measured 3449 ms against 3438 ms with `swap`. No effect; the change was
reverted. A second candidate, the `animate-fade-in-up` class on the home hero, is a dead
class: no `@keyframes` of that name exists in the built CSS.

**Resolved by the field, same day.** `/` and the article page remain text-LCP with ~3 s of
render delay in the lab while FCP is 1.4 s, Speed Index 1.5 s, TBT 1 ms and main-thread work
0.3 s — a page that looks finished long before Lighthouse credits the LCP. Neither fonts nor
CPU explain it, so the tie was broken by the field rather than by another lab guess. Speed
Insights, p75, production, last 7 days:

| device | RES | FCP | LCP | INP | CLS | sample |
|---|---|---|---|---|---|---|
| mobile | 96 | 2.22 s | **2.22 s** | 104 ms | 0 | ~24 events — thin, treat as indicative |
| desktop | 90 | 2.40 s | **2.60 s** | **256 ms** | 0 | ~450 events — the solid series |

Real mobile users are already under the 2.5 s LCP target; the 3.4 s the lab reports is
Lantern's simulated slow-4G-plus-4×-CPU, which is harsher than this audience. The lab
threshold therefore stays what this ADR always called it — a regression ceiling, not a user
target — and chasing the lab number further would optimise for a simulation.

The one metric that is amber in the field is desktop **INP at 256 ms**, above the 200 ms
target. That is exactly the metric deviation 1 above says the lab cannot produce: it needs
real interaction. Whatever comes next on performance should start there, and it cannot be
driven by this gate.
