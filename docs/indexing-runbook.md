# Indexing Runbook (SEO + GEO)

Generated context date: 2026-02-21.

## Canonical files

- `https://ulissesflores.com/robots.txt`
- `https://ulissesflores.com/sitemap.xml`
- `https://ulissesflores.com/sitemap-resources.xml`
- `https://ulissesflores.com/feed.xml`
- `https://ulissesflores.com/llms.txt`
- `https://ulissesflores.com/llms-full.txt`
- `https://ulissesflores.com/public.jsonld`
- `https://ulissesflores.com/.well-known/did.json`

## Search Console (Google)

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select property `https://ulissesflores.com/`.
3. Submit both sitemaps:
   - `https://ulissesflores.com/sitemap.xml`
   - `https://ulissesflores.com/sitemap-resources.xml`
4. Use URL inspection for representative pages:
   - `/certifications`
   - `/mundo-politico`
   - `/sermons`
   - a sample item from each collection
5. Request indexing after successful live test.

## Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Select property `https://ulissesflores.com/`.
3. Submit:
   - `https://ulissesflores.com/sitemap.xml`
   - `https://ulissesflores.com/sitemap-resources.xml`
4. Run URL submission for sample canonical pages and monitor crawl report.

## External audits (free)

- Rich Results: <https://search.google.com/test/rich-results>
- Schema Validator: <https://validator.schema.org/>
- HTML validator: <https://validator.w3.org/nu/>
- OpenGraph preview: <https://www.opengraph.xyz/>
- DID resolver: <https://dev.uniresolver.io/>

## Acceptance checklist

- [ ] `robots.txt` includes both sitemap URLs.
- [ ] `sitemap.xml` includes canonical collections and items.
- [ ] `sitemap-resources.xml` includes JSON-LD, DID, feed, and llms files.
- [ ] hreflang alternates are present in page metadata.
- [ ] New canonical routes return HTTP 200.
- [ ] Search Console and Bing show sitemap processed without fatal errors.

