# ADR-0004: IndexNow Search Engine Ping

## Status

Accepted

## Context

After each production deploy, search engines may take days or weeks to discover updated content via traditional crawling. The site serves 142+ URLs across 5 locales (pt-br, en, es, it, he) with frequently regenerated publication metadata, SEO canonical URLs, and JSON-LD structured data.

Manual submission via Google Search Console or Bing Webmaster Tools is slow and does not scale.

## Decision

Adopt the [IndexNow](https://www.indexnow.org/) protocol to proactively notify search engines of updated URLs immediately after a production push.

### Implementation

1. **`scripts/seo/ping-indexnow.mjs`** — Reads `docs/url-inventory.generated.json` plus a static core URL list, deduplicates, and POSTs to the IndexNow API endpoint.
2. **`app/indexnow-key.txt/route.ts`** — Next.js route that serves the verification key at `/.well-known`-style path, proving domain ownership.
3. **`npm run seo:indexnow`** — Convenience script that sets `INDEXNOW_ENABLED=1` and runs the ping. Safe to run multiple times (idempotent).

### Safeguards

- Disabled by default (`INDEXNOW_ENABLED` must be `1`).
- Only submits URLs matching the configured host — no accidental staging pings.
- Graceful skip when `url-inventory.generated.json` is missing.

## Consequences

- Post-deploy indexing latency drops from days to minutes for Bing, Yandex, and other IndexNow-supporting engines.
- Google does not yet support IndexNow but may in the future — no downside to submitting.
- The script should be run manually after each push (`npm run seo:indexnow`), not in CI, to avoid accidental triggers from preview deploys.
