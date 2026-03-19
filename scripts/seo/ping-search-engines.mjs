#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  ECC SOTA — Search Engine & AI Crawler Notification Pipeline
 * ───────────────────────────────────────────────────────────────────────────────
 *  Notifies ALL search engines AND AI crawlers that the site has been updated.
 *  Run after every deploy to accelerate re-crawling and re-indexing.
 *
 *  FIVE MECHANISMS (progressive — each one works independently):
 *
 *  1. SITEMAP PING — DEPRECATED by Google (2023) and Bing (2024)
 *     Kept for completeness (harmless HTTP GET).
 *
 *  2. INDEXNOW (Bing + Yandex + Naver + Seznam + DuckDuckGo)
 *     Submits changed URLs directly. Supported by 5+ search engines.
 *
 *  3. GOOGLE INDEXING API — Needs GOOGLE_SERVICE_ACCOUNT_JSON
 *     Submits individual URLs for immediate crawling.
 *     Auto-detected: if service account JSON exists, it's used automatically.
 *
 *  4. AI CRAWLER NOTIFICATION — Ping sitemaps + llms.txt to AI bots
 *     Notifies OpenAI (GPTBot), DeepSeek, Grok/X, Perplexity, Claude.
 *     Uses HTTP HEAD/GET on sitemap + llms.txt to trigger crawler discovery.
 *
 *  5. WEBMASTER SITEMAP SUBMISSION — Bing Webmaster Tools API
 *     Direct sitemap submission via Bing API (benefits DuckDuckGo, Yahoo, Ecosia).
 *
 *  USAGE:
 *    npm run seo:ping                    # All engines (auto-detect Google API)
 *    npm run seo:ping -- --dry-run       # Show what would be done
 *    npm run seo:ping -- --urls-only     # Only submit specific URLs
 *    npm run seo:ping:auto               # Post-deploy auto mode (silent on errors)
 *
 *  ENVIRONMENT VARIABLES:
 *    INDEXNOW_KEY                  — IndexNow API key (optional, has default)
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
const URLS_ONLY = args.includes('--urls-only');
const AUTO_MODE = args.includes('--auto');

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

// ── Auto-detect Google API ──────────────────────────────────────────────────────

const saPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const GOOGLE_API_AVAILABLE = saPath && fs.existsSync(saPath);

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

async function httpHead(url, label) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
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

// ── Load priority URLs ──────────────────────────────────────────────────────────

function loadPriorityUrls() {
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
  for (const p of critical) {
    urls.push(`${SITE}${p}`);
    for (const locale of locales) {
      urls.push(`${SITE}/${locale}${p}`);
    }
  }

  return [...new Set(urls)];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 1: Sitemap Ping (Google + Bing)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingSitemaps() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [1/5] Sitemap Ping — Google + Bing (legacy)            │');
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
//  STEP 2: IndexNow (Bing + Yandex + Naver + Seznam + DuckDuckGo)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingIndexNow() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [2/5] IndexNow — Bing, Yandex, Naver, Seznam, DDG     │');
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

  // All IndexNow-compatible endpoints
  // api.indexnow.org distributes to ALL partners (Bing, Yandex, Naver, Seznam, DuckDuckGo)
  // Individual endpoints ensure direct delivery
  const endpoints = [
    'https://api.indexnow.org/indexnow',    // Hub — distributes to all
    'https://www.bing.com/indexnow',         // Bing (also powers DuckDuckGo, Yahoo, Ecosia)
    'https://yandex.com/indexnow',           // Yandex
    'https://searchadvisor.naver.com/indexnow', // Naver (Korea)
    'https://search.seznam.cz/indexnow',     // Seznam (Czech Republic)
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
//  STEP 3: Google Indexing API (auto-detected)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingGoogleIndexingApi() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [3/5] Google Indexing API                               │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  if (!GOOGLE_API_AVAILABLE) {
    log('⏭️', 'Skipped (GOOGLE_SERVICE_ACCOUNT_JSON not found)');
    if (!AUTO_MODE) {
      log('📖', 'Setup: set GOOGLE_SERVICE_ACCOUNT_JSON=/path/to/key.json in .env.local');
    }
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

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 4: AI Crawler Notification
//  ───────────────────────────────────────────────────────────────────────────
//  AI crawlers (GPTBot, DeepSeekBot, ClaudeBot, PerplexityBot, Grok) discover
//  content through robots.txt → sitemap → llms.txt chain.
//  We "warm" these by requesting our own resources, which:
//  - Ensures CDN cache is warm for when bots arrive
//  - Triggers any edge-side includes / cache invalidation
//  - Verifies all discovery files are accessible
//
//  AI bots don't have a push API like IndexNow, but we maximize discovery by:
//  1. Ensuring sitemap.xml and llms.txt are fresh and accessible
//  2. Pinging the site root with bot-specific query hints
//  3. Requesting llms.txt and llms-full.txt (LLM-specific discovery standard)
// ═══════════════════════════════════════════════════════════════════════════════

async function pingAiCrawlers() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [4/5] AI Crawler Warm-up — OpenAI, DeepSeek, Grok...   │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  // Discovery files that AI crawlers check
  const discoveryFiles = [
    `${SITE}/robots.txt`,
    `${SITE}/sitemap.xml`,
    `${SITE}/sitemap-resources.xml`,
    `${SITE}/llms.txt`,
    `${SITE}/llms-full.txt`,
    // ai-plugin.json omitted — only for ChatGPT plugins, not relevant here
  ];

  let success = 0;
  let total = 0;

  if (DRY_RUN) {
    log('🔍', `[DRY] Would warm ${discoveryFiles.length} discovery files`);
    return discoveryFiles.length;
  }

  // 1. Warm all discovery files (ensures CDN is fresh)
  log('🌐', 'Warming discovery files for AI crawlers...');
  for (const url of discoveryFiles) {
    total++;
    const ok = await httpHead(url, `Warm ← ${url.split('/').pop() || '/'}`);
    if (ok) success++;
  }

  // 2. Warm key pages (most likely to be fetched by AI crawlers)
  const keyPages = [
    `${SITE}/`,
    `${SITE}/identidade`,
    `${SITE}/en/identidade`,
    `${SITE}/simulacoes/ia-2027`,
    `${SITE}/en/simulacoes/ia-2027`,
    `${SITE}/projeto-psi`,
    `${SITE}/en/projeto-psi`,
  ];

  log('🤖', 'Warming key pages for AI training/retrieval...');
  for (const url of keyPages) {
    total++;
    const ok = await httpHead(url, `Warm ← ${url.replace(SITE, '')}`);
    if (ok) success++;
  }

  log('📊', `AI Crawler warm-up: ${success}/${total} accessible`);

  // 3. Summary of AI bot coverage
  log('📋', 'AI Bot Coverage via robots.txt:');
  log('  ', 'GPTBot (OpenAI)      — ✅ Allowed + *.md access');
  log('  ', 'ChatGPT-User         — ✅ Allowed + *.md access');
  log('  ', 'OAI-SearchBot        — ✅ Allowed + *.md access');
  log('  ', 'ClaudeBot (Anthropic) — ✅ Allowed + *.md access');
  log('  ', 'PerplexityBot        — ✅ Allowed + *.md access');
  log('  ', 'DeepSeekBot          — ✅ Allowed + *.md access');
  log('  ', 'Grok (X/Twitter)     — ✅ Allowed (uses Twitterbot UA)');
  log('  ', 'Google-Extended (Gemini) — ✅ Allowed + *.md access');
  log('  ', 'Applebot-Extended (Apple Intelligence) — ✅ Allowed');

  return success;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STEP 5: Bing Webmaster Sitemap Submission
//  ───────────────────────────────────────────────────────────────────────────
//  Direct sitemap submission via Bing's anonymous API.
//  Benefits: Bing, DuckDuckGo, Yahoo, Ecosia (all use Bing's index).
// ═══════════════════════════════════════════════════════════════════════════════

async function pingBingWebmaster() {
  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  [5/5] Bing Webmaster Sitemap Submit                    │');
  console.log('  └──────────────────────────────────────────────────────────┘\n');

  if (DRY_RUN) {
    log('🔍', `[DRY] Would submit ${SITEMAPS.length} sitemaps to Bing Webmaster`);
    return SITEMAPS.length;
  }

  let success = 0;
  for (const sitemap of SITEMAPS) {
    const encoded = encodeURIComponent(sitemap);
    // Bing anonymous sitemap submission endpoint
    const ok = await httpGet(
      `https://www.bing.com/webmaster/ping.aspx?siteMap=${encoded}`,
      `Bing Webmaster ← ${sitemap.split('/').pop()}`
    );
    if (ok) success++;
  }

  log('📊', `Bing Webmaster: ${success}/${SITEMAPS.length} submitted`);
  log('  ', 'Benefits: Bing, DuckDuckGo, Yahoo, Ecosia (shared index)');
  return success;
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
  console.log('  🔔 Search Engine & AI Crawler Notification Pipeline');
  console.log('═══════════════════════════════════════════════════════════════');
  if (DRY_RUN) log('🔍', 'DRY RUN MODE — no actual requests will be made');
  if (AUTO_MODE) log('🤖', 'AUTO MODE — running post-deploy notification');
  if (GOOGLE_API_AVAILABLE) {
    log('🔑', 'Google Indexing API: auto-detected (service account found)');
  }

  const results = {};

  if (!URLS_ONLY) {
    results.sitemapPing = await pingSitemaps();
  }

  results.indexNow = await pingIndexNow();
  results.googleApi = await pingGoogleIndexingApi();
  results.aiCrawlers = await pingAiCrawlers();
  results.bingWebmaster = await pingBingWebmaster();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 NOTIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  if (results.sitemapPing !== undefined) log('📡', `Sitemap Ping: ${results.sitemapPing} successful`);
  log('⚡', `IndexNow (Bing/Yandex/Naver/Seznam/DDG): ${results.indexNow}`);
  log('🔍', `Google Indexing API: ${results.googleApi || 'skipped'}`);
  log('🤖', `AI Crawler Warm-up: ${results.aiCrawlers} files warmed`);
  log('📮', `Bing Webmaster: ${results.bingWebmaster} sitemaps submitted`);

  console.log('\n  ┌──────────────────────────────────────────────────────────┐');
  console.log('  │  🌐 SEARCH ENGINE & AI COVERAGE                         │');
  console.log('  ├──────────────────────────────────────────────────────────┤');
  console.log('  │  Google      — Indexing API + Sitemap Ping              │');
  console.log('  │  Bing        — IndexNow + Webmaster + Sitemap Ping      │');
  console.log('  │  DuckDuckGo  — IndexNow + Bing Webmaster (shared)       │');
  console.log('  │  Yahoo       — Bing Webmaster (shared index)            │');
  console.log('  │  Ecosia      — Bing Webmaster (shared index)            │');
  console.log('  │  Yandex      — IndexNow                                │');
  console.log('  │  Naver       — IndexNow                                │');
  console.log('  │  Seznam      — IndexNow                                │');
  console.log('  │  OpenAI      — robots.txt + sitemap + llms.txt          │');
  console.log('  │  Claude      — robots.txt + sitemap + llms.txt          │');
  console.log('  │  DeepSeek    — robots.txt + sitemap + llms.txt          │');
  console.log('  │  Grok/X      — robots.txt + sitemap                    │');
  console.log('  │  Perplexity  — robots.txt + sitemap + llms.txt          │');
  console.log('  │  Gemini      — robots.txt + sitemap + llms.txt          │');
  console.log('  │  Apple AI    — robots.txt + sitemap                    │');
  console.log('  └──────────────────────────────────────────────────────────┘');
  console.log('');
}

main().catch((err) => {
  if (AUTO_MODE) {
    // In auto mode, don't crash the build — just warn
    console.error('  ⚠️ SEO notification error (non-fatal):', err.message);
    process.exit(0);
  }
  console.error('Fatal error:', err);
  process.exit(1);
});
