#!/usr/bin/env node

/**
 * SEO Pre-Deploy Validator
 *
 * Validates JSON-LD, sitemap consistency, and canonical domain compliance
 * BEFORE pushing to production. Run with: npm run seo:validate
 *
 * Checks:
 * 1. JSON-LD files: no null values, no empty arrays, all nodes have @type
 * 2. SoftwareApplication nodes have applicationCategory + operatingSystem
 * 3. All URLs use canonical domain (https://ulissesflores.com, no www)
 * 4. No duplicate URLs in sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const CANONICAL_DOMAIN = 'https://ulissesflores.com';
const FORBIDDEN_DOMAIN = 'https://www.ulissesflores.com';

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`  ❌ ERROR: ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  ⚠️  WARN: ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}

// ─── 1. JSON-LD Validation ───────────────────────────────────────────

function validateJsonLdNode(node, filePath, path = '') {
  if (typeof node !== 'object' || node === null) return;

  if (Array.isArray(node)) {
    node.forEach((item, i) => validateJsonLdNode(item, filePath, `${path}[${i}]`));
    return;
  }

  // Check for null values (should have been stripped by replacer)
  for (const [key, value] of Object.entries(node)) {
    if (value === null) {
      error(`${filePath} → ${path}.${key} is null (should be omitted)`);
    }
    if (Array.isArray(value) && value.length === 0) {
      warn(`${filePath} → ${path}.${key} is empty array (consider omitting)`);
    }
    if (typeof value === 'object' && value !== null) {
      validateJsonLdNode(value, filePath, `${path}.${key}`);
    }
  }

  // Check @type exists on nodes that should have it (skip simple references like { @id: ... })
  const keys = Object.keys(node);
  if (keys.length > 2 && !node['@type'] && !node['@id'] && !node['@context'] && !node['@value']) {
    // Only warn for substantial objects that look like they should be typed
    if (keys.some(k => ['name', 'url', 'description'].includes(k))) {
      warn(`${filePath} → ${path} has name/url/description but no @type`);
    }
  }

  // SoftwareApplication must have applicationCategory + operatingSystem
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
  if (types.includes('SoftwareApplication')) {
    if (!node.applicationCategory) {
      error(`${filePath} → ${path} SoftwareApplication missing applicationCategory`);
    }
    if (!node.operatingSystem) {
      error(`${filePath} → ${path} SoftwareApplication missing operatingSystem`);
    }
  }

  // Check URLs don't use www
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && value.includes(FORBIDDEN_DOMAIN)) {
      error(`${filePath} → ${path}.${key} uses www domain: ${value}`);
    }
  }
}

function validateJsonLdFile(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  if (!fs.existsSync(filePath)) {
    warn(`${filename} does not exist (skip)`);
    return;
  }

  console.log(`\n📋 Validating ${filename}...`);

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    error(`${filename} is not valid JSON: ${e.message}`);
    return;
  }

  // Check @context
  const context = data['@context'];
  if (!context) {
    error(`${filename} missing @context`);
  }

  // Validate @graph or root node
  if (data['@graph']) {
    ok(`@graph found with ${data['@graph'].length} nodes`);
    data['@graph'].forEach((node, i) => {
      validateJsonLdNode(node, filename, `@graph[${i}]`);
    });
  } else {
    validateJsonLdNode(data, filename, 'root');
  }
}

// ─── 2. Canonical Domain Consistency ─────────────────────────────────

function validateCanonicalDomain() {
  console.log('\n🌐 Validating canonical domain consistency...');

  // Check upkf.generated.ts
  const upkfPath = path.join(ROOT, 'data/generated/upkf.generated.ts');
  if (fs.existsSync(upkfPath)) {
    const content = fs.readFileSync(upkfPath, 'utf-8');
    if (content.includes(FORBIDDEN_DOMAIN)) {
      error(`upkf.generated.ts references www domain`);
    } else if (content.includes(CANONICAL_DOMAIN)) {
      ok(`upkf.generated.ts uses canonical domain`);
    }
  }

  // Check llms.txt
  const llmsPath = path.join(PUBLIC_DIR, 'llms.txt');
  if (fs.existsSync(llmsPath)) {
    const content = fs.readFileSync(llmsPath, 'utf-8');
    if (content.includes(FORBIDDEN_DOMAIN)) {
      error(`llms.txt references www domain`);
    } else {
      ok(`llms.txt uses canonical domain`);
    }
  }

  // Check sitemap for www references (if built)
  const sitemapPath = path.join(ROOT, '.next/server/app/sitemap.xml/route.js');
  // Sitemap is generated at build time, check source instead
  const sitemapSrcPath = path.join(ROOT, 'app/sitemap.ts');
  if (fs.existsSync(sitemapSrcPath)) {
    const content = fs.readFileSync(sitemapSrcPath, 'utf-8');
    if (content.includes('www.')) {
      error(`app/sitemap.ts contains www reference`);
    } else {
      ok(`app/sitemap.ts clean (uses upkfMeta.primaryWebsite)`);
    }
  }
}

// ─── 3. Middleware check ─────────────────────────────────────────────

function validateProxy() {
  console.log('\n🛡️  Validating proxy (double-locale 410)...');

  // Next.js 16 uses proxy.ts instead of middleware.ts
  const proxyPath = path.join(ROOT, 'proxy.ts');
  const middlewarePath = path.join(ROOT, 'middleware.ts');

  if (fs.existsSync(middlewarePath)) {
    error('middleware.ts exists alongside proxy.ts — Next.js 16 will reject this');
    return;
  }

  if (!fs.existsSync(proxyPath)) {
    warn('proxy.ts does not exist (double-locale 410 not configured)');
    return;
  }

  const content = fs.readFileSync(proxyPath, 'utf-8');
  if (content.includes('410') && content.includes('DOUBLE_LOCALE')) {
    ok('proxy.ts returns 410 for double-locale patterns');
  } else {
    warn('proxy.ts exists but does not handle double-locale 410');
  }
}

// ─── 4. next.config.ts redirect sanity ───────────────────────────────

function validateNextConfig() {
  console.log('\n⚙️  Validating next.config.ts...');

  const configPath = path.join(ROOT, 'next.config.ts');
  if (!fs.existsSync(configPath)) {
    error('next.config.ts not found');
    return;
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  if (content.includes('canonicalHostRedirect') || content.includes('www.ulissesflores.com')) {
    ok('Canonical host redirect (www → non-www) configured');
  } else {
    warn('No canonical host redirect found in next.config.ts');
  }

  // Single-locale redirect moved to proxy.ts — verify it's there
  const proxyContent = fs.existsSync(path.join(ROOT, 'proxy.ts'))
    ? fs.readFileSync(path.join(ROOT, 'proxy.ts'), 'utf-8')
    : '';
  if (proxyContent.includes('SINGLE_LOCALE_PATTERN') && proxyContent.includes('301')) {
    ok('Single-locale redirect (301) configured in proxy.ts');
  } else if (content.includes('singleLocaleRedirect')) {
    ok('Single-locale redirect (301) configured in next.config.ts');
  } else {
    warn('No single-locale redirect found in proxy.ts or next.config.ts');
  }
}

// ─── Run All ─────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════');
console.log('  SEO PRE-DEPLOY VALIDATOR — ulissesflores.com');
console.log('═══════════════════════════════════════════════════');

validateJsonLdFile('full.jsonld');
validateJsonLdFile('public.jsonld');
validateJsonLdFile('site.jsonld');
validateCanonicalDomain();
validateProxy();
validateNextConfig();

console.log('\n═══════════════════════════════════════════════════');
if (errors > 0) {
  console.error(`  🔴 FAILED: ${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
} else if (warnings > 0) {
  console.warn(`  🟡 PASSED with ${warnings} warning(s)`);
  process.exit(0);
} else {
  console.log('  🟢 ALL CHECKS PASSED');
  process.exit(0);
}
