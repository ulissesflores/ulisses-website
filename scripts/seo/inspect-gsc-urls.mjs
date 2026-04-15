#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// inspect-gsc-urls.mjs
//
// Queries Google Search Console URL Inspection API for representative URLs
// from each of the 5 patterns identified in the GSC export
// (xl/sharedStrings.xml — "Alternate page with proper canonical tag" issue).
//
// Auth: service account JWT (RS256) → OAuth2 token exchange (no googleapis dep).
// Scope: webmasters.readonly (read-only is sufficient for URL Inspection).
//
// Prerequisites:
//   - GOOGLE_SERVICE_ACCOUNT_JSON env points to a valid service-account JSON.
//   - The service account is a verified owner of the GSC property.
//
// Usage:
//   node scripts/seo/inspect-gsc-urls.mjs
//   node scripts/seo/inspect-gsc-urls.mjs --json > docs/gsc-reports/inspect-2026-04-15.json
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import crypto from 'node:crypto';

// Domain property — cobre www + non-www + subdomínios automaticamente.
// Se quiser usar URL-prefix property, trocar para 'https://ulissesflores.com/'.
const SITE_URL = 'sc-domain:ulissesflores.com';
const JSON_OUT = process.argv.includes('--json');

// 5 representative URLs — one per pattern (A–E) identified in the XLSX
const URLS_TO_INSPECT = [
  // Pattern A — www subdomain (should 301 to non-www)
  { pattern: 'A — www subdomain',         url: 'https://www.ulissesflores.com/whitepapers/2023-digital-legacy' },
  // Pattern B — explicit /pt-br/ prefix (should 301 to root)
  { pattern: 'B — /pt-br/ prefix',         url: 'https://ulissesflores.com/pt-br/whitepapers/2023-digital-legacy' },
  // Pattern C — /sermons/ legacy path (should 301 to /acervo-teologico/)
  { pattern: 'C — /sermons/ legacy',       url: 'https://ulissesflores.com/sermons/jejum-da-vitoria-2023-21-devotionals/12-dia-12-alinhamento-profetico' },
  // Pattern D — non-default locale (en) — should serve 200 with self-canonical + hreflang
  { pattern: 'D — non-default locale (en)', url: 'https://ulissesflores.com/en/acervo-teologico/jejum-da-vitoria-2023-21-devotionals' },
  // Pattern E — truncated slug (should 404 or 410)
  { pattern: 'E — truncated slug',         url: 'https://ulissesflores.com/en/mundo-politico/15-fala-bolsonaro-reacende-debat' },
  // Bonus: canonical homepage (control)
  { pattern: '✓ Control — homepage',       url: 'https://ulissesflores.com/' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Auth helpers (replicates ping-search-engines.mjs pattern with read scope)
// ─────────────────────────────────────────────────────────────────────────────

function loadServiceAccount() {
  const path = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!path) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var is not set.');
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (err) {
    throw new Error(`Failed to read service account from ${path}: ${err.message}`);
  }
}

async function getAccessToken(sa, scope) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const nowSec = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  })).toString('base64url');

  const signInput = `${header}.${claims}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signInput);
  const signature = signer.sign(sa.private_key, 'base64url');

  const jwt = `${signInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    throw new Error(`OAuth token exchange failed: ${res.status} ${await res.text()}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Console URL Inspection API
// https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
// ─────────────────────────────────────────────────────────────────────────────

async function inspectUrl(token, inspectionUrl) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: SITE_URL,
      languageCode: 'en-US',
    }),
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  return { ok: res.ok, status: res.status, data };
}

// ─────────────────────────────────────────────────────────────────────────────
// Output formatting
// ─────────────────────────────────────────────────────────────────────────────

function summarize(report) {
  const idx = report?.data?.inspectionResult?.indexStatusResult ?? {};
  return {
    verdict: idx.verdict ?? '—',
    coverageState: idx.coverageState ?? '—',
    indexingState: idx.indexingState ?? '—',
    googleCanonical: idx.googleCanonical ?? '—',
    userCanonical: idx.userCanonical ?? '—',
    crawledAs: idx.crawledAs ?? '—',
    lastCrawlTime: idx.lastCrawlTime ?? '—',
    pageFetchState: idx.pageFetchState ?? '—',
    robotsTxtState: idx.robotsTxtState ?? '—',
    referringUrls: (idx.referringUrls ?? []).slice(0, 3),
  };
}

function printHuman(label, url, summary) {
  console.log(`\n${'─'.repeat(78)}`);
  console.log(`▸ ${label}`);
  console.log(`  URL:                  ${url}`);
  console.log(`  Verdict:              ${summary.verdict}`);
  console.log(`  Coverage state:       ${summary.coverageState}`);
  console.log(`  Indexing state:       ${summary.indexingState}`);
  console.log(`  User canonical:       ${summary.userCanonical}`);
  console.log(`  Google canonical:     ${summary.googleCanonical}`);
  console.log(`  Crawled as:           ${summary.crawledAs}`);
  console.log(`  Last crawl:           ${summary.lastCrawlTime}`);
  console.log(`  Page fetch state:     ${summary.pageFetchState}`);
  console.log(`  Robots.txt state:     ${summary.robotsTxtState}`);
  if (summary.referringUrls.length > 0) {
    console.log(`  Referring URLs:`);
    summary.referringUrls.forEach((u) => console.log(`    - ${u}`));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const sa = loadServiceAccount();
  const token = await getAccessToken(sa, 'https://www.googleapis.com/auth/webmasters.readonly');

  if (!JSON_OUT) {
    console.log('═══════════════════════════════════════════════════════════════════════════');
    console.log('  🔎 GSC URL Inspection — patterns A–E from "Alternate canonical" issue');
    console.log('═══════════════════════════════════════════════════════════════════════════');
    console.log(`  Site:           ${SITE_URL}`);
    console.log(`  Service acct:   ${sa.client_email}`);
    console.log(`  URLs to inspect: ${URLS_TO_INSPECT.length}`);
  }

  const results = [];

  for (const { pattern, url } of URLS_TO_INSPECT) {
    try {
      const report = await inspectUrl(token, url);
      const summary = report.ok ? summarize(report) : null;
      results.push({ pattern, url, ok: report.ok, status: report.status, summary, raw: report.data });
      if (!JSON_OUT) {
        if (report.ok) {
          printHuman(pattern, url, summary);
        } else {
          console.log(`\n${'─'.repeat(78)}`);
          console.log(`▸ ${pattern}`);
          console.log(`  URL:    ${url}`);
          console.log(`  ❌ ERROR ${report.status}: ${JSON.stringify(report.data).slice(0, 300)}`);
        }
      }
      // Throttle to be nice to the API (URL Inspection has a quota)
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      results.push({ pattern, url, ok: false, error: err.message });
      if (!JSON_OUT) {
        console.error(`\n❌ ${pattern}: ${err.message}`);
      }
    }
  }

  if (JSON_OUT) {
    console.log(JSON.stringify({
      generatedAt: new Date().toISOString(),
      siteUrl: SITE_URL,
      serviceAccount: sa.client_email,
      results,
    }, null, 2));
  } else {
    console.log(`\n${'═'.repeat(78)}`);
    console.log('  ✅ Done. Pass --json to emit machine-readable output.');
    console.log('═══════════════════════════════════════════════════════════════════════════\n');
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
