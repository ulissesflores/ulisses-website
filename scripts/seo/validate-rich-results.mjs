#!/usr/bin/env node
/**
 * 🔒 Rich Results & DID Integrity Validator
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Validates JSON-LD structural integrity, persona/DID references,
 * locale-aware inLanguage fields, and Person node completeness.
 *
 * Exit 0 = PASS, Exit 1 = FAIL (blocks commit via Husky).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE_ORIGIN = 'https://ulissesflores.com';
const SUPPORTED_LOCALES = ['pt-br', 'en', 'es', 'it', 'he'];

let errors = 0;
let warnings = 0;
let checks = 0;

function fail(message) {
  errors++;
  console.error(`  ❌ FAIL: ${message}`);
}

function warn(message) {
  warnings++;
  console.warn(`  ⚠️  WARN: ${message}`);
}

function pass(message) {
  checks++;
  console.log(`  ✅ ${message}`);
}

// ══════════════════════════════════════════════════════════════════
//  1. Validate siteJsonLd from upkf.generated.ts
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log('  🔍 Phase 1: Person / DID / Sovereign Identity');
console.log('══════════════════════════════════════════════════\n');

const upkfPath = path.join(ROOT, 'data/generated/upkf.generated.ts');
const upkfContent = fs.readFileSync(upkfPath, 'utf-8');

// Extract siteJsonLd object
const siteJsonLdMatch = upkfContent.match(/export const siteJsonLd\s*=\s*(\{[\s\S]*?\n\}\s*as\s*const)/);
if (!siteJsonLdMatch) {
  fail('Could not extract siteJsonLd from upkf.generated.ts');
} else {
  // Parse the JSON-LD (strip `as const`)
  const jsonLdStr = siteJsonLdMatch[1].replace(/\s*as\s*const\s*$/, '');
  try {
    const siteJsonLd = eval(`(${jsonLdStr})`);

    // Check @graph exists
    if (!siteJsonLd['@graph'] || !Array.isArray(siteJsonLd['@graph'])) {
      fail('siteJsonLd missing @graph array');
    } else {
      const graph = siteJsonLd['@graph'];

      // Check Person node
      const person = graph.find(n => n['@type'] === 'Person');
      if (!person) {
        fail('No Person node in siteJsonLd @graph');
      } else {
        pass('Person node exists');

        // Check @id
        if (person['@id'] !== `${SITE_ORIGIN}/#person`) {
          fail(`Person @id should be "${SITE_ORIGIN}/#person", got "${person['@id']}"`);
        } else {
          pass(`Person @id = ${person['@id']}`);
        }

        // Check sameAs
        if (!person.sameAs || !Array.isArray(person.sameAs) || person.sameAs.length < 5) {
          fail(`Person sameAs missing or too few entries (${person.sameAs?.length ?? 0})`);
        } else {
          pass(`Person sameAs has ${person.sameAs.length} entries`);
        }

        // Check DID identifier
        const identifiers = person.identifier || [];
        const did = identifiers.find(id => id.propertyID === 'DID');
        if (!did) {
          fail('No DID identifier in Person node');
        } else {
          if (!did.value.startsWith('did:web:')) {
            fail(`DID value should start with "did:web:", got "${did.value}"`);
          } else {
            pass(`DID found: ${did.value}`);
          }
        }

        // Check ORCID
        const orcid = identifiers.find(id => id.propertyID === 'ORCID');
        if (!orcid) {
          fail('No ORCID identifier in Person node');
        } else {
          pass(`ORCID found: ${orcid.value}`);
        }

        // Check Keybase
        const keybase = identifiers.find(id => id.propertyID === 'Keybase');
        if (!keybase) {
          fail('No Keybase identifier in Person node');
        } else {
          pass(`Keybase found: ${keybase.value}`);
        }

        // Check Gitcoin Passport
        const gitcoin = identifiers.find(id => id.propertyID === 'Gitcoin Passport');
        if (!gitcoin) {
          fail('No Gitcoin Passport identifier in Person node');
        } else {
          pass(`Gitcoin Passport score: ${gitcoin.value}`);
        }

        // Check hasCredential
        if (!person.hasCredential || person.hasCredential.length < 3) {
          fail(`Person hasCredential missing or too few (${person.hasCredential?.length ?? 0})`);
        } else {
          pass(`Person hasCredential: ${person.hasCredential.length} credentials`);
        }

        // Check disambiguatingDescription
        if (!person.disambiguatingDescription) {
          fail('Person missing disambiguatingDescription');
        } else {
          pass('disambiguatingDescription present');
        }
      }

      // Check WebSite node
      const website = graph.find(n => n['@type'] === 'WebSite');
      if (!website) {
        fail('No WebSite node in siteJsonLd @graph');
      } else {
        pass('WebSite node exists');
        if (!website.inLanguage || !Array.isArray(website.inLanguage) || website.inLanguage.length < 5) {
          fail(`WebSite inLanguage should have 5+ entries, got ${website.inLanguage?.length ?? 0}`);
        } else {
          pass(`WebSite inLanguage: ${website.inLanguage.join(', ')}`);
        }
      }
    }
  } catch (e) {
    fail(`Could not parse siteJsonLd: ${e.message}`);
  }
}

// ══════════════════════════════════════════════════════════════════
//  2. Validate inLanguage in page JSON-LDs
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log('  🌍 Phase 2: inLanguage Consistency');
console.log('══════════════════════════════════════════════════\n');

// Find all page.tsx files that have JSON-LD
const pagesDir = path.join(ROOT, 'app/[locale]');

function walkDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (item.name === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const pageFiles = walkDir(pagesDir);
let pagesWithJsonLd = 0;
let pagesWithDynamicInLanguage = 0;
const HARDCODED_INLANGUAGE = /inLanguage:\s*['"`](pt-BR|pt-br|en|es|it|he)['"`]/;
const DYNAMIC_INLANGUAGE = /inLanguage:\s*(locale|rawLocale|knowledgeData\.)/;
const ARRAY_INLANGUAGE = /inLanguage:\s*\[/;

for (const pagePath of pageFiles) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  const relPath = path.relative(ROOT, pagePath);

  if (!content.includes('application/ld+json')) continue;
  pagesWithJsonLd++;

  // Check if inLanguage exists and is dynamic
  if (HARDCODED_INLANGUAGE.test(content)) {
    // Check context — some hardcoded inLanguage are in knowledgeData references, which is OK
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (HARDCODED_INLANGUAGE.test(lines[i])) {
        // Check if it's in a JSON-LD block
        if (lines[i].includes('knowledgeData.')) continue; // OK — data-driven
        // translationOfWork.inLanguage refers to the ORIGINAL work's language, not the page
        if (i > 0 && /translationOfWork|isTranslationOf/.test(lines.slice(Math.max(0, i - 5), i + 1).join('\n'))) continue;
        fail(`${relPath}:${i + 1} — Hardcoded inLanguage in JSON-LD: "${lines[i].trim()}"`);
      }
    }
  }

  if (DYNAMIC_INLANGUAGE.test(content) || ARRAY_INLANGUAGE.test(content)) {
    pagesWithDynamicInLanguage++;
  }
}

if (pagesWithJsonLd > 0) {
  pass(`${pagesWithJsonLd} pages with JSON-LD found`);
  pass(`${pagesWithDynamicInLanguage} pages with dynamic/data-driven inLanguage`);
}

// ══════════════════════════════════════════════════════════════════
//  3. Validate Person @id references across pages
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log('  🔗 Phase 3: Person @id Cross-References');
console.log('══════════════════════════════════════════════════\n');

let pagesRefPerson = 0;
const PERSON_REF = /#person/;

for (const pagePath of pageFiles) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  if (content.includes('application/ld+json') && PERSON_REF.test(content)) {
    pagesRefPerson++;
  }
}

if (pagesRefPerson < 3) {
  warn(`Only ${pagesRefPerson} pages reference the Person @id. Consider adding author references.`);
} else {
  pass(`${pagesRefPerson} pages reference /#person`);
}

// ══════════════════════════════════════════════════════════════════
//  4. Validate localePath usage (no bare hrefs left)
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log("  🚦 Phase 4: Internal Link Integrity");
console.log('══════════════════════════════════════════════════\n');

const BARE_HREF = /href=['"]\/[^'"]*['"]/g;
const SAFE_PATTERNS = [/canonicalPath/, /sermon\./, /post\./, /item\./, /cert\./, /publication\./];
let bareHrefCount = 0;

for (const pagePath of pageFiles) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  const relPath = path.relative(ROOT, pagePath);
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.matchAll(BARE_HREF);
    for (const match of matches) {
      if (match[0].includes('localePath')) continue;
      if (SAFE_PATTERNS.some(p => p.test(line))) continue;
      if (match[0].includes('http') || match[0].includes('mailto')) continue;
      bareHrefCount++;
      fail(`${relPath}:${i + 1} — Bare href without localePath: ${match[0]}`);
    }
  }
}

if (bareHrefCount === 0) {
  pass('All internal hrefs use localePath()');
}

// ══════════════════════════════════════════════════════════════════
//  5. Validate OG locale tags
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log('  📊 Phase 5: OpenGraph Locale Tags');
console.log('══════════════════════════════════════════════════\n');

const HARDCODED_OG = /locale:\s*['"]pt_BR['"]/;
let hardcodedOgCount = 0;

for (const pagePath of pageFiles) {
  const content = fs.readFileSync(pagePath, 'utf-8');
  const relPath = path.relative(ROOT, pagePath);

  if (HARDCODED_OG.test(content)) {
    hardcodedOgCount++;
    fail(`${relPath} — Hardcoded og:locale "pt_BR" found`);
  }
}

if (hardcodedOgCount === 0) {
  pass('No hardcoded og:locale found');
}

// ══════════════════════════════════════════════════════════════════
//  SUMMARY
// ══════════════════════════════════════════════════════════════════
console.log('\n══════════════════════════════════════════════════');
console.log('  📋 RICH RESULTS VALIDATION SUMMARY');
console.log('══════════════════════════════════════════════════');
console.log(`  ✅ Checks passed: ${checks}`);
console.log(`  ⚠️  Warnings:     ${warnings}`);
console.log(`  ❌ Errors:        ${errors}`);
console.log('══════════════════════════════════════════════════\n');

if (errors > 0) {
  console.error('🚨 VALIDATION FAILED — Fix errors above before committing.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('🟡 PASSED with warnings.\n');
  process.exit(0);
} else {
  console.log('🟢 ALL CHECKS PASSED — Rich Results & DID integrity confirmed.\n');
  process.exit(0);
}
