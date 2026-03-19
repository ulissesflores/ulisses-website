#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ECC SOTA — Search Engine Notification Pipeline
 * ───────────────────────────────────────────────────────────────────────────────
 *  Notifies ALL search engines that the site has been updated.
 *  Run after every deploy to accelerate re-crawling and re-indexing.
 *
 *  THREE MECHANISMS (progressive — each one works independently):
 *
 *  1. SITEMAP PING — DEPRECATED by Google (2023) and Bing (2024)
 *     Both search engines now discover sitemaps via robots.txt and
 *     Search Console/Webmaster Tools submissions only.
 *     Step 1 is kept for documentation but marked as deprecated.
 *
 *  2. INDEXNOW (Bing + Yandex + others) — Needs INDEXNOW_KEY
 *     Submits changed URLs directly. Already implemented in ping-indexnow.mjs.
 *     Integrated here for a single command.
 *
 *  3. GOOGLE INDEXING API — Needs GOOGLE_SERVICE_ACCOUNT_JSON
 *     Submits individual URLs for immediate crawling.
 *     Most powerful but requires Google Cloud service account setup.
 *     Optional — works without it (falls back to sitemap ping).
 *
 *  USAGE:
 *    npm run seo:ping                    # Ping sitemaps + IndexNow
 *    npm run seo:ping -- --google-api    # Also use Google Indexing API
 *    npm run seo:ping -- --urls-only     # Only submit specific URLs
 *    npm run seo:ping -- --dry-run       # Show what would be done
 *
 *  ENVIRONMENT VARIABLES:
 *    INDEXNOW_KEY                  — IndexNow API key (optional)
 *    GOOGLE_SERVICE_ACCOUNT_JSON   — Path to Google service account JSON (optional)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TARGET_LOCALES } from '../config/i18n.config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const SITE = 'https://ulissesflores.com';
const SITEMAPS = [
  `${SITE}/sitemap.xml`,
  `${SITE}/sitemap-resources.xml`,
];

// ── CLI Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const USE_GOOGLE_API = args.includes('--google-api');
const URLS_ONLY = args.includes('--urls-only');

// ── Auto-load .env.local ────────────────────────────────────────────────────────

const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────────

const now = () => new Date().toLocaleTimeString('en-US', { hour12: false });

function log(emoji, msg) {
  console.log(`  [${now()}] ${emoji} ${msg}`);
}

async function httpGet(url, label) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      log('✅', `${label}: ${res.status} OK`);
      return true;
    }
    log('⚠️', `${label}: ${res.status} ${res.statusText}`);
    return false;
  } catch (err) {
    log('❌', `${label}: ${err.message}`);
    return false;
  }
}

async function httpPost(url, body, headers, label) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    if (res.ok || res.status === 200 || res.status === 202) {
      log('✅', `${label}: ${res.status} OK`);
      return true;
    }
    const text = await res.text().catch(() => '');
    log('⚠️', `${label}: ${res.status} ${text.slice(0, 200)}`);
    return false;
  } catch (err) {
    log('❌', `${label}: ${err.message}`);
    return false;
  }
}

// ── Load priority URLs ──────────────────────────────────────────────────────────

function loadPriorityUrls() {
  // Pages that were just fixed — submit these first
  const critical = [
    '/',
    '/identidade',
    '/certifications',
    '/simulacoes',
    '/simulacoes/ia-2027',
    '/simulacoes/goldenleaf',
    '/simulacoes/mumm-ra',
    '/simulacoes/projeto-psi',
    '/simulacoes/ia-2027/corrida-estrategica',
    '/simulacoes/ia-2027/desaceleracao-coordenada',
    '/whitepapers/projeto-psi',
    '/acervo-teologico',
    '/mundo-politico',
    '/clube-santo',
    '/projeto-psi',
  ];

  // Add locale variants (from central config — Anti-DRY Lote 22)
  const locales = TARGET_LOCALES;
  const urls = [];
  for (const path of critical) {
    urls.push(`${SITE}${path}`);
    for (const locale of locales) {
      urls.push(`${SITE}/${locale}${path}`);
    }
  }

  return [...new Set(urls)];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 1: Sitemap Ping (Google + Bing)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingSitemaps() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [1/3] Sitemap Ping — Google + Bing                     │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  let success = 0;
  let total = 0;

  for (const sitemap of SITEMAPS) {
    const encoded = encodeURIComponent(sitemap);

    // Google (deprecated but harmless)
    total++;
    if (DRY_RUN) {
      log('🔍', `[DRY] Would ping Google: ${sitemap}`);
      success++;
    } else {
      const ok = await httpGet(
        `https://www.google.com/ping?sitemap=${encoded}`,
        `Google ← ${sitemap.split('/').pop()}`
      );
      if (ok) success++;
    }

    // Bing
    total++;
    if (DRY_RUN) {
      log('🔍', `[DRY] Would ping Bing: ${sitemap}`);
      success++;
    } else {
      const ok = await httpGet(
        `https://www.bing.com/ping?sitemap=${encoded}`,
        `Bing ← ${sitemap.split('/').pop()}`
      );
      if (ok) success++;
    }
  }

  log('📊', `Sitemap ping: ${success}/${total} successful`);
  return success;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 2: IndexNow (Bing + Yandex + Lista)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingIndexNow() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [2/3] IndexNow — Bing + Yandex                         │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  const key = process.env.INDEXNOW_KEY || 'ulissesflores-indexnow-2026-key';
  const urls = loadPriorityUrls();

  log('📦', `${urls.length} URLs to submit (key: ${key.slice(0, 20)}...)`);

  if (DRY_RUN) {
    log('🔍', `[DRY] Would submit ${urls.length} URLs to IndexNow`);
    urls.slice(0, 5).forEach(u => log('  ', u));
    log('  ', `... and ${urls.length - 5} more`);
    return urls.length;
  }

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  const body = {
    host: 'ulissesflores.com',
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urls.slice(0, 100), // IndexNow limit: 100 per request
  };

  let success = 0;
  for (const endpoint of endpoints) {
    const name = new URL(endpoint).hostname;
    const ok = await httpPost(endpoint, body, {}, `IndexNow → ${name}`);
    if (ok) success++;
  }

  log('📊', `IndexNow: ${success}/${endpoints.length} endpoints accepted`);
  return success;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 3: Google Indexing API (optional — needs service account)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingGoogleIndexingApi() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [3/3] Google Indexing API                               │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  const saPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!USE_GOOGLE_API) {
    log('⏭️', 'Skipped (use --google-api to enable)');
    return 0;
  }

  if (!saPath || !fs.existsSync(saPath)) {
    log('⚠️', 'GOOGLE_SERVICE_ACCOUNT_JSON not set or file not found');
    log('📖', 'Setup guide:');
    log('  ', '1. Go to https://console.cloud.google.com/');
    log('  ', '2. Create a project → Enable "Web Search Indexing API"');
    log('  ', '3. Create Service Account → Download JSON key');
    log('  ', '4. In GSC, add the service account email as owner');
    log('  ', '5. Set GOOGLE_SERVICE_ACCOUNT_JSON=/path/to/key.json in .env.local');
    return 0;
  }

  try {
    const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    const token = await getGoogleAccessToken(sa);
    const urls = loadPriorityUrls().slice(0, 200); // API quota: ~200/day

    log('🔑', `Service account: ${sa.client_email}`);
    log('📦', `Submitting ${urls.length} URLs...`);

    if (DRY_RUN) {
      log('🔍', `[DRY] Would submit ${urls.length} URLs via Indexing API`);
      return urls.length;
    }

    let success = 0;
    let errors = 0;

    // Batch in groups of 10 with 1s delay
    for (let i = 0; i < urls.length; i += 10) {
      const batch = urls.slice(i, i + 10);
      const results = await Promise.all(
        batch.map(url =>
          httpPost(
            'https://indexing.googleapis.com/v3/urlNotifications:publish',
            { url, type: 'URL_UPDATED' },
            { Authorization: `Bearer ${token}` },
            url.replace(SITE, '')
          )
        )
      );
      success += results.filter(Boolean).length;
      errors += results.filter(r => !r).length;

      if (i + 10 < urls.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    log('📊', `Google Indexing API: ${success} submitted, ${errors} errors`);
    return success;
  } catch (err) {
    log('❌', `Google Indexing API error: ${err.message}`);
    return 0;
  }
}

/**
 * Generate OAuth2 access token from service account (JWT → token exchange).
 * Avoids googleapis dependency — pure Node.js implementation.
 */
async function getGoogleAccessToken(sa) {
  const crypto = await import('node:crypto');

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now_sec = Math.floor(Date.now() / 1000);
  const claims = Buffer.from(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now_sec,
    exp: now_sec + 3600,
  })).toString('base64url');

  const signInput = `${header}.${claims}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(sa.private_key, 'base64url');

  const jwt = `${signInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🔔 Search Engine Notification Pipeline');
  console.log('═══════════════════════════════════════════════════════════════');
  if (DRY_RUN) log('🔍', 'DRY RUN MODE — no actual requests will be made');

  const results = {};

  if (!URLS_ONLY) {
    results.sitemapPing = await pingSitemaps();
  }

  results.indexNow = await pingIndexNow();
  results.googleApi = await pingGoogleIndexingApi();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 NOTIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  if (results.sitemapPing !== undefined) log('📡', `Sitemap Ping: ${results.sitemapPing} successful`);
  log('⚡', `IndexNow: ${results.indexNow} endpoints accepted`);
  log('🔍', `Google API: ${results.googleApi || 'skipped'}`);
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
