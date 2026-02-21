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
- `https://ulissesflores.com/doi/manifest.json`
- `https://ulissesflores.com/deep-research/<slug>/deep-research.pdf`
- `https://ulissesflores.com/deep-research/<slug>/deep-research.md`
- `https://ulissesflores.com/deep-research/<slug>/deep-research.docx`

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
   - a sample deep-research asset URL (`/deep-research/<slug>/deep-research.pdf`)
5. Request indexing after successful live test.

## Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Select property `https://ulissesflores.com/`.
3. Submit:
   - `https://ulissesflores.com/sitemap.xml`
   - `https://ulissesflores.com/sitemap-resources.xml`
4. Run URL submission for sample canonical pages and monitor crawl report.
5. Submit at least one deep-research PDF per collection to accelerate discovery.

## External audits (free)

- Rich Results: <https://search.google.com/test/rich-results>
- Schema Validator: <https://validator.schema.org/>
- HTML validator: <https://validator.w3.org/nu/>
- OpenGraph preview: <https://www.opengraph.xyz/>
- DID resolver: <https://dev.uniresolver.io/>
- XML Sitemap validator: <https://www.xml-sitemaps.com/validate-xml-sitemap.html>

## Acceptance checklist

- [ ] `robots.txt` includes both sitemap URLs.
- [ ] `sitemap.xml` includes canonical collections and items.
- [ ] `sitemap-resources.xml` includes JSON-LD, DID, feed, and llms files.
- [ ] `sitemap.xml` includes article landing pages and deep-research assets.
- [ ] DOI resources (`/doi/manifest.json` and per-article `CITATION.cff`) are publicly reachable.
- [ ] DOI metadata uses `doi_target` (no fake minted DOI fields in public pre-registration artifacts).
- [ ] `CITATION.cff` files contain no `doi:` field while status is `target`.
- [ ] hreflang alternates are present in page metadata.
- [ ] New canonical routes return HTTP 200.
- [ ] Search Console and Bing show sitemap processed without fatal errors.
